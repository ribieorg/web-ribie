#!/usr/bin/env node
/**
 * Sincroniza el contenido del sitio desde las hojas de Google publicadas como CSV.
 *
 *   node scripts/sync-contenido.mjs            # descarga y escribe src/data/contenido.json
 *   node scripts/sync-contenido.mjs --check    # solo valida, no escribe (para revisar antes)
 *   node scripts/sync-contenido.mjs --sin-enlaces  # sin comprobar los enlaces externos
 *
 * Principio de diseño: **el sitio nunca se rompe por un error en la hoja.**
 * Si una descarga falla, si faltan columnas o si una hoja viene vacía, esa sección
 * conserva lo que ya había y el proceso termina con aviso — no con la página caída.
 * Solo se aborta del todo si NINGUNA hoja se pudo leer, porque entonces el problema
 * es de conectividad y publicar sería peor que no hacer nada.
 *
 * Sin dependencias externas: el parser de CSV va incluido (evita sumar superficie
 * de supply-chain a un repositorio público por algo de cuarenta líneas).
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { request as pedirHTTPS } from 'node:https';
import { fileURLToPath } from 'node:url';
import { HOJAS, ESQUEMA, LOCAL, SECUNDARIOS_MANUAL, SECCIONES } from './hojas.config.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = resolve(RAIZ, 'src/data/contenido.json');
const IMAGENES = resolve(RAIZ, 'src/assets/remoto');
/** Fotografías del archivo de la red, ya en el repositorio. Las hojas las citan por
 *  nombre de archivo —«acto-mesa-principal.webp»—, no por enlace. */
const FOTOS = resolve(RAIZ, 'src/assets/fotos');
const SOLO_VALIDAR = process.argv.includes('--check');

/* ------------------------------------------------------------------ CSV --- */

/** Parser de CSV con soporte de comillas, comas y saltos de línea dentro de campo. */
function parseCSV(texto) {
  const filas = [];
  let campo = '';
  let fila = [];
  let enComillas = false;

  const limpio = texto.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < limpio.length; i++) {
    const c = limpio[i];
    if (enComillas) {
      if (c === '"') {
        if (limpio[i + 1] === '"') { campo += '"'; i++; }  // comilla escapada
        else enComillas = false;
      } else campo += c;
    } else if (c === '"') enComillas = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n') { fila.push(campo); filas.push(fila); fila = []; campo = ''; }
    else campo += c;
  }
  if (campo !== '' || fila.length) { fila.push(campo); filas.push(fila); }

  return filas.filter((f) => f.some((v) => v.trim() !== ''));
}

function aObjetos(filas) {
  if (!filas.length) return { cabeceras: [], datos: [] };
  const cabeceras = filas[0].map((h) => h.trim().toLowerCase());
  const datos = filas.slice(1).map((f) =>
    Object.fromEntries(cabeceras.map((h, i) => [h, (f[i] ?? '').trim()]))
  );
  return { cabeceras, datos };
}

/* -------------------------------------------------------------- imágenes --- */

/**
 * Las imágenes de Drive se **descargan al repositorio**, no se enlazan.
 *
 * Enlazar tendría dos problemas: cada visita al sitio pediría el archivo a Google
 * (dependencia externa en tiempo de ejecución) y Astro no podría optimizarlo. Al
 * traerlas al repo, se sirven desde el propio dominio, optimizadas y versionadas.
 */
const ID_DRIVE = /(?:\/file\/d\/|[?&]id=)([A-Za-z0-9_-]{20,})/;
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg' };

const usadas = new Set();

/**
 * Una celda de imagen admite dos formas, y hay que distinguirlas:
 *
 *   - **Enlace de Drive** → se descarga al repositorio (ver abajo).
 *   - **Nombre de archivo** —«acto-mesa-principal.webp»— → es una fotografía del
 *     archivo de la red que ya vive en `src/assets/fotos/`. No hay nada que
 *     descargar; lo que hay que hacer es **comprobar que existe**.
 *
 * Esa comprobación es el punto entero de la función. Un nombre mal escrito en la
 * hoja no puede convertirse en una etiqueta `<img>` rota en producción: se avisa
 * en el sync y la pieza se publica sin imagen, que es la regla de «celda vacía =
 * la pieza no se renderiza» aplicada al caso en que la celda miente.
 */
async function traerImagen(url, etiqueta) {
  if (!url) return '';
  const id = url.match(ID_DRIVE)?.[1];

  if (!id && !/^https?:/i.test(url)) {
    const archivo = url.trim();
    if (existsSync(resolve(FOTOS, archivo))) return archivo;
    avisos.push(`⚠️  ${etiqueta}: no existe la foto "${archivo}" en src/assets/fotos — la pieza se publica sin imagen`);
    return '';
  }

  if (!id) return url;   // enlace externo que no es de Drive: se deja como está

  try {
    const r = await fetch(`https://drive.usercontent.google.com/download?id=${id}&export=download`, { redirect: 'follow' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);

    const tipo = (r.headers.get('content-type') ?? '').split(';')[0].trim();
    const ext = EXT[tipo];
    if (!ext) throw new Error(`tipo no soportado: ${tipo || 'desconocido'}`);

    const nombre = `${id}.${ext}`;              // el ID es estable: mismo archivo → mismo nombre
    mkdirSync(IMAGENES, { recursive: true });
    writeFileSync(resolve(IMAGENES, nombre), Buffer.from(await r.arrayBuffer()));
    usadas.add(nombre);
    console.log(`  ↓ ${etiqueta}: ${nombre}`);
    return nombre;
  } catch (e) {
    avisos.push(`⚠️  imagen de "${etiqueta}": ${e.message} — la fila se publica sin ella`);
    return '';
  }
}

/* --------------------------------------------------------------- helpers --- */

const esSi = (v) => ['sí', 'si', 'yes', 'true', 'x', '1'].includes(String(v).toLowerCase().trim());

/**
 * TRES estados por fila, no dos (D52).
 *
 *   `borrador`     → no se publica. Es la única forma de tener un dato cargado y
 *                    fuera del sitio a la vez.
 *   `publicado`    → sale normal.
 *   `por confirmar`→ sale, con la marca «por confirmar» junto al dato.
 *
 * El tercero existe porque «no hay dato» y «hay dato que nadie validó» no son lo
 * mismo y no pueden verse igual. Con dos estados, la hoja del XV Foro pasó de
 * `borrador` a `publicado` y sus fechas quedaron en vivo como firmes sin que la
 * red las hubiera confirmado.
 */
const estadoDe = (fila) => (fila.estado ?? '').trim().toLowerCase();
const esBorrador = (fila) => estadoDe(fila) === 'borrador';
const publicado = (fila) => !('estado' in fila) || !esBorrador(fila);
const marcado = (fila) => ['por confirmar', 'porconfirmar', 'por-confirmar'].includes(estadoDe(fila));
/** Columna `confirmado`/`anio_confirmado`/`fechas_confirmadas`: cualquier cosa que
 *  no sea un «sí» explícito deja el dato marcado. El silencio no confirma nada. */
const sinConfirmar = (v) => !esSi(v);
const porOrden = (a, b) => (parseInt(a.orden || '999', 10) - parseInt(b.orden || '999', 10));

async function descargar(url, nombre) {
  // Modo local: la "URL" es una ruta del disco (ver `hojas.config.mjs`).
  if (LOCAL || !/^https?:/i.test(url)) {
    if (!existsSync(url)) throw new Error(`no existe el CSV local "${url}"`);
    return readFileSync(url, 'utf8');
  }

  const r = await fetch(url, { redirect: 'follow' });
  if (!r.ok) throw new Error(`HTTP ${r.status} al descargar "${nombre}"`);
  const texto = await r.text();
  if (texto.trimStart().startsWith('<')) {
    throw new Error(`"${nombre}" devolvió HTML, no CSV — probablemente la pestaña no está publicada`);
  }
  return texto;
}

/* ------------------------------------------------------------------ main --- */

const avisos = [];
const resultado = {};
let leidas = 0;
let configuradas = 0;

for (const [nombre, url] of Object.entries(HOJAS)) {
  if (!url) { avisos.push(`· "${nombre}": sin URL configurada — se conserva el contenido por defecto`); continue; }
  configuradas++;

  try {
    const { cabeceras, datos } = aObjetos(parseCSV(await descargar(url, nombre)));

    const faltan = (ESQUEMA[nombre] ?? []).filter((c) => !cabeceras.includes(c));
    if (faltan.length) {
      avisos.push(`⚠️  "${nombre}": faltan columnas [${faltan.join(', ')}] — hoja ignorada, se conserva lo anterior`);
      continue;
    }
    if (!datos.length) {
      avisos.push(`⚠️  "${nombre}": sin filas — se conserva el contenido por defecto`);
      continue;
    }

    resultado[nombre] = datos;
    leidas++;
    console.log(`✓ ${nombre}: ${datos.length} fila(s)`);
  } catch (e) {
    avisos.push(`⚠️  "${nombre}": ${e.message} — se conserva lo anterior`);
  }
}

if (configuradas > 0 && leidas === 0) {
  console.error('\n❌ Ninguna hoja pudo leerse. No se toca el contenido: publicar así sería peor que no hacer nada.');
  avisos.forEach((a) => console.error('   ' + a));
  process.exit(1);
}

/* ------ Transformar filas → estructura que consume el sitio ---------------- */

const salida = {};

/**
 * ⚙️ ESTRUCTURA — qué secciones se publican y cómo se llaman en el menú.
 *
 * Tres reglas, y las tres apuntan al mismo sitio: **apagar una sección exige
 * decirlo a propósito.** Nada la apaga por omisión, por errata ni por fallo.
 *
 *   - Sección sin fila en la hoja  → se muestra.
 *   - Celda `mostrar` vacía o con un valor que no es sí/no → se muestra, con aviso.
 *   - Hoja caída, vacía o sin columnas → no se escribe nada aquí, y el merge del
 *     final conserva la estructura de ayer (o, si nunca hubo, todo visible).
 *
 * `rotulo_menu` admite «-» además de la celda vacía: es como se escribe «esta
 * sección no va al menú» en una hoja de cálculo, donde el vacío no se ve.
 */
if (resultado.estructura) {
  const esNo = (v) => ['no', 'false', '0', 'n'].includes(String(v).toLowerCase().trim());
  const filas = new Map(resultado.estructura.map((f) => [(f.seccion ?? '').toLowerCase(), f]));

  for (const s of filas.keys()) {
    if (!SECCIONES.includes(s)) {
      avisos.push(`⚠️  estructura: "${s}" no es una sección del sitio — fila ignorada (¿errata?)`);
    }
  }

  salida.estructura = Object.fromEntries(SECCIONES.map((seccion) => {
    const f = filas.get(seccion);
    let mostrar = true;
    if (f) {
      if (esSi(f.mostrar)) mostrar = true;
      else if (esNo(f.mostrar)) mostrar = false;
      else avisos.push(`⚠️  estructura/${seccion}: "mostrar" dice "${f.mostrar}" y no sí/no — la sección se publica`);
    }
    const rotulo = (f?.rotulo_menu ?? '').trim();
    return [seccion, { mostrar, rotuloMenu: rotulo === '-' ? '' : rotulo }];
  }));

  const apagadas = SECCIONES.filter((s) => !salida.estructura[s].mostrar);
  console.log(`  ⚙️  estructura: ${SECCIONES.length - apagadas.length} visible(s)`
    + (apagadas.length ? ` · apagadas: ${apagadas.join(', ')}` : ''));
}

if (resultado.textos) {
  // Las claves terminadas en `_imagen` no son texto: son un enlace de Drive, y se
  // tratan como cualquier otra imagen —se descargan al repositorio para que Astro
  // las optimice—. Así el hero puede llevar fotografía sin inventar otra hoja para
  // un único dato. Si la descarga falla, la clave queda vacía y el sitio vuelve a su
  // hueco declarado en vez de romperse.
  const pares = await Promise.all(
    resultado.textos.filter((f) => f.clave && f.valor).map(async (f) => [
      f.clave,
      f.clave.endsWith('_imagen') ? await traerImagen(f.valor, `imagen «${f.clave}»`) : f.valor,
    ])
  );
  salida.textos = Object.fromEntries(pares.filter(([, v]) => v));
}

if (resultado.eventos) {
  salida.eventos = await Promise.all(resultado.eventos.filter(publicado).map(async (f) => ({
    id: f.id,
    titulo: f.titulo,
    fechaInicio: f.fecha_inicio,
    fechaFin: f.fecha_fin || '',
    lugar: f.lugar,
    modalidad: f.modalidad,
    descripcion: f.descripcion,
    enlace: f.enlace_inscripcion || '',
    /**
     * Los tres campos de la convocatoria. Son OPCIONALES a propósito —no entran
     * en el `ESQUEMA`—, así que un evento sin plazo de ponencias se publica
     * igual: lo único que ocurre es que la franja no muestra su primera fase.
     *
     * `cierre_convocatoria` se escribe con hora Y zona
     * (`2026-09-17T23:59:00-05:00`). Sin la zona, cada visitante contaría contra
     * su propia medianoche: el público de la red está repartido en 21 países y
     * el plazo es uno solo, el de Pasto.
     */
    cierreConvocatoria: f.cierre_convocatoria || '',
    enlaceAgenda: f.enlace_agenda || '',
    correoPonencias: f.correo_ponencias || '',
    /** `rotulo` es la categoría del encuentro («Foro y Seminario Internacional»)
     *  y `subtitulo` la frase que lo explica. Ambos opcionales: sin ellos la
     *  franja se arma igual, solo con menos contexto. */
    rotulo: f.rotulo || '',
    subtitulo: f.subtitulo || '',
    /** La ilustración de la franja —el oso del encuentro—, distinta de `imagen`,
     *  que es la fotografía de la banda del Foro. Sale de la hoja y no de un
     *  `import` del código para que cambiarla no exija tocar el repositorio:
     *  es material del evento y el evento cambia todos los años. */
    ilustracion: await traerImagen(f.ilustracion, `ilustración de ${f.id || f.titulo}`),
    imagen: await traerImagen(f.imagen, `evento ${f.id || f.titulo}`),
    destacado: esSi(f.destacado),
    /** Mientras esto sea `false`, el sitio pinta el chip «por confirmar» junto al
     *  rango de fechas. Con fechas de congreso, la gente compra pasajes. */
    fechasConfirmadas: esSi(f.fechas_confirmadas),
  })));
}

/**
 * CIFRAS — la cinta de datos del hero.
 *
 * `unidad` es lo que acompaña al número («países», «+15»); si está vacía, el
 * número va solo. `confirmado` es por dato y no por sección: el «21 países» puede
 * salir marcado mientras el «1990» sale limpio, que es justo lo que antes no se
 * podía expresar porque el estado vivía escrito a mano en el código.
 */
if (resultado.cifras) {
  salida.cifras = resultado.cifras.filter(publicado).sort(porOrden)
    .filter((f) => String(f.valor ?? '').trim())     // celda vacía = la casilla no existe
    .map((f) => ({
      id: f.id,
      valor: f.valor.trim(),
      unidad: (f.unidad ?? '').trim(),
      etiqueta: f.etiqueta,
      porConfirmar: sinConfirmar(f.confirmado) || marcado(f),
    }));
}

/**
 * HITOS — el recorrido histórico.
 *
 * `anio_imagen` es el año de la FOTOGRAFÍA, que no tiene por qué ser el del hito:
 * una imagen de un foro de 2018 ilustrando el tramo «1992–2018» es correcta, y la
 * misma imagen sin año declarado se lee como registro del año que encabeza el
 * bloque. Por eso el año de la foto viaja aparte y con su propia confirmación.
 */
if (resultado.hitos) {
  salida.hitos = await Promise.all(
    resultado.hitos.filter(publicado).sort(porOrden).map(async (f) => ({
      periodo: f.periodo,
      texto: f.texto,
      imagen: await traerImagen(f.imagen, `hito ${f.periodo}`),
      pieImagen: f.pie_imagen || '',
      anioImagen: (f.anio_imagen ?? '').trim(),
      anioPorConfirmar: sinConfirmar(f.anio_confirmado),
      porConfirmar: marcado(f),
    }))
  );
}

/**
 * LÍNEAS DE TRABAJO — los bloques de color.
 *
 * `ancho` son columnas de una retícula de 12 y `color_manual` uno de los ocho
 * secundarios. Ambos se validan aquí y no en el componente: un color ajeno al
 * manual o un ancho fuera de rango es un error de la hoja, y el sitio tiene que
 * seguir en pie con el valor de la casa en vez de pintar lo que le pongan.
 */
if (resultado.lineas) {
  const ANCHO_MIN = 3, ANCHO_MAX = 5;
  salida.lineas = resultado.lineas.filter(publicado).sort(porOrden).map((f) => {
    const color = (f.color_manual ?? '').trim().toUpperCase();
    const delManual = SECUNDARIOS_MANUAL.includes(color);
    if (color && !delManual) {
      avisos.push(`⚠️  línea "${f.titulo}": el color ${color} no está en el manual de marca — se usa el turquesa de la casa`);
    }
    const ancho = parseInt(f.ancho, 10);
    return {
      numero: f.numero,
      titulo: f.titulo,
      descripcion: f.descripcion,
      color: delManual ? color : '',
      ancho: Number.isInteger(ancho) ? Math.min(Math.max(ancho, ANCHO_MIN), ANCHO_MAX) : 4,
      porConfirmar: marcado(f),
    };
  });
}

/**
 * MEMORIA — el archivo fotográfico de los foros.
 *
 * `tamano` decide el peso de la pieza en el mosaico. Una fotografía sin año
 * declarado sale con la marca: son imágenes de foros anteriores y el año es
 * precisamente el dato que nadie ha confirmado todavía.
 */
if (resultado.memoria) {
  const TAMANOS = ['grande', 'medio', 'pequena'];
  salida.memoria = (await Promise.all(
    resultado.memoria.filter(publicado).sort(porOrden).map(async (f) => {
      const tamano = (f.tamano ?? '').trim().toLowerCase();
      return {
        imagen: await traerImagen(f.imagen, `memoria «${f.descripcion || f.imagen}»`),
        descripcion: f.descripcion,
        anio: (f.anio ?? '').trim(),
        anioPorConfirmar: sinConfirmar(f.anio_confirmado),
        tamano: TAMANOS.includes(tamano) ? tamano : 'pequena',
      };
    })
  )).filter((f) => f.imagen);           // sin fotografía no hay pieza de archivo
}

/**
 * FORO_PROGRAMA — los encuentros que se celebran juntos.
 *
 * `numeral` es el ordinal en romanos (XV, V, VIII) y se muestra grande: es lo
 * que dice de un vistazo que esto no es un evento nuevo sino la decimoquinta
 * edición de algo. Sin numeral la fila igual se publica, solo que sin cifra.
 */
if (resultado.foro_programa) {
  salida.foroPrograma = resultado.foro_programa.filter(publicado).sort(porOrden).map((f) => ({
    numeral: (f.numeral ?? '').trim(),
    nombre: (f.nombre ?? '').trim(),
    entidad: (f.entidad ?? '').trim(),
  })).filter((f) => f.nombre);          // sin nombre no hay nada que anunciar
}

if (resultado.nodos) {
  salida.nodos = await Promise.all(resultado.nodos.filter(publicado).sort(porOrden).map(async (f) => ({
    nombre: f.nombre_oficial, pais: f.pais, sitio: f.sitio_web || '',
    logo: await traerImagen(f.logo, `nodo ${f.nombre_oficial || f.pais}`),
    // Un país de la red sin institución sede declarada no es un error de carga:
    // es el estado real de veinte de los veintiún nodos. Sale marcado, no vacío.
    porConfirmar: marcado(f) || !f.nombre_oficial.trim(),
  })));
}

if (resultado.colaboradores) {
  salida.colaboradores = await Promise.all(resultado.colaboradores.filter(publicado).sort(porOrden).map(async (f) => ({
    nombre: f.nombre, cargo: f.cargo, institucion: f.institucion,
    grupo: f.grupo || 'Colaboradores',
    foto: await traerImagen(f.foto, `colaborador ${f.nombre}`),
  })));
}

if (resultado.redes) {
  salida.redes = resultado.redes.filter((f) => esSi(f.activo) && f.url).map((f) => ({
    nombre: f.red, url: f.url,
  }));
}

/* --------------------------------------------------------- enlaces vivos -- */

/**
 * Los enlaces de las hojas apuntan a sitios de terceros, y los terceros mueven
 * sus archivos sin avisar a nadie.
 *
 * El botón del encuentro estuvo llevando a un PDF que la Licenciatura había
 * renombrado —un 404 en la portada— y se descubrió porque alguien lo pulsó. El
 * sync ya comprueba que las fotos citadas por nombre existan en el repositorio
 * (`traerImagen`); esto es lo mismo, aplicado a lo que vive fuera.
 *
 * Comprueba, **no corrige**. Un enlace que responde mal no se retira del
 * contenido: la comprobación puede equivocarse —un WAF que rechaza al runner,
 * un timeout, una cadena de certificados incompleta— y quitar un botón bueno
 * por sospecha sería peor que dejar uno roto. La decisión es de quien lee el
 * aviso.
 */
const SIN_ENLACES = process.argv.includes('--sin-enlaces');

/** Saca del contenido ya armado las URLs que el sitio va a pintar. Recorre el
 *  objeto entero en vez de listar campos: una clave nueva en las hojas queda
 *  cubierta sin que haya que acordarse de añadirla aquí. */
function urlsDe(valor, vistas = new Set()) {
  if (typeof valor === 'string') {
    if (/^https?:\/\//i.test(valor.trim())) vistas.add(valor.trim());
  } else if (Array.isArray(valor)) valor.forEach((v) => urlsDe(v, vistas));
  else if (valor && typeof valor === 'object') Object.values(valor).forEach((v) => urlsDe(v, vistas));
  return vistas;
}

/**
 * CINCO desenlaces, no dos — y la diferencia es el punto entero.
 *
 * `roto` es el servidor diciendo que el recurso no está (404/410): eso se
 * arregla en la hoja. `incomprobable` es no haber podido preguntar, y no dice
 * nada sobre el enlace. El sitio de la Licenciatura, sin ir más lejos, sirve su
 * certificado sin la cadena intermedia: Node no lo verifica **aunque la página
 * esté viva** —los navegadores lo disimulan buscando el intermedio por su
 * cuenta—. Si los dos casos gritaran igual, el aviso se volvería ruido y el
 * próximo 404 real pasaría inadvertido entre falsos positivos.
 */
const UA = 'Mozilla/5.0 (compatible; sync-ribie/1.0; +https://ribie.org)';

/**
 * Segundo intento para un caso concreto: el certificado no se puede verificar
 * porque el servidor sirve la hoja SIN la cadena intermedia.
 *
 * Es justo lo que hace `licinfor.udenar.edu.co`, y sin esto el chequeo entero
 * sería inútil para el único sitio que lo motivó: el TLS falla antes de que se
 * llegue a ver el 404, así que el PDF renombrado seguiría pasando por «no se
 * pudo comprobar». Los navegadores salvan esa cadena por su cuenta —por eso la
 * página se ve bien— y aquí se hace lo análogo.
 *
 * La verificación se relaja SOLO para leer el código de estado de un recurso
 * público, nunca para traer contenido: la respuesta se descarta (`res.resume()`)
 * y lo único que sale de aquí es un número. Acotado a este error y a ningún
 * otro — un certificado vencido o de otro dominio sí bloquea a los visitantes y
 * tiene que seguir avisando.
 */
function estadoSinVerificar(url, saltos = 0) {
  return new Promise((listo) => {
    const req = pedirHTTPS(url, {
      method: 'HEAD', rejectUnauthorized: false, timeout: 15000, headers: { 'user-agent': UA },
    }, (res) => {
      res.resume();
      const destino = res.headers.location;
      if (destino && [301, 302, 303, 307, 308].includes(res.statusCode) && saltos < 5) {
        // Un `Location` malformado tira `new URL`, y esto corre dentro de un
        // callback: la excepción no la recogería nadie y se llevaría el sync.
        try { listo(estadoSinVerificar(new URL(destino, url).href, saltos + 1)); }
        catch { listo(res.statusCode); }
      } else listo(res.statusCode);
    });
    req.on('timeout', () => { req.destroy(); listo(null); });
    req.on('error', () => listo(null));
    req.end();
  });
}

function clasificar(status) {
  if (status < 400) return { estado: 'ok', detalle: `HTTP ${status}` };
  if ([404, 410].includes(status)) return { estado: 'roto', detalle: `HTTP ${status}` };
  return { estado: 'dudoso', detalle: `HTTP ${status}` };
}

async function comprobarEnlace(url) {
  const opciones = {
    redirect: 'follow',
    signal: AbortSignal.timeout(15000),
    // Sin `user-agent`, más de un servidor contesta 403 a un cliente anónimo.
    headers: { 'user-agent': UA },
  };
  try {
    let r = await fetch(url, { ...opciones, method: 'HEAD' });
    // HEAD es opcional en HTTP y hay servidores que lo rechazan de plano; antes
    // de dar por malo el enlace se pregunta como preguntaría un navegador.
    if ([403, 405, 501].includes(r.status)) {
      r = await fetch(url, { ...opciones, method: 'GET' });
      await r.body?.cancel();          // solo interesa el estado, no el cuerpo
    }
    return clasificar(r.status);
  } catch (e) {
    const codigo = e.cause?.code ?? e.message;
    if (codigo !== 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') return { estado: 'incomprobable', detalle: codigo };

    const status = await estadoSinVerificar(url);
    if (status === null) return { estado: 'incomprobable', detalle: codigo };
    const veredicto = clasificar(status);
    // El enlace sirve, pero el servidor de enfrente tiene un problema que a
    // algún visitante le va a estallar. Se dice, sin confundirlo con un roto.
    return veredicto.estado === 'ok'
      ? { estado: 'cadena', detalle: `HTTP ${status}` }
      : veredicto;
  }
}

/**
 * Bajo `try`, como todo lo de este archivo: la regla es que el sitio no se rompe
 * por lo que pase aquí, y esto es lo ÚLTIMO que debería impedir una publicación
 * — su trabajo es avisar, no decidir.
 */
if (!SIN_ENLACES) try {
  const cola = [...urlsDe(salida)];
  const total = cola.length;
  const rotos = [];
  console.log(`\nComprobando ${total} enlace(s) externo(s)…`);

  // De a cinco: son sitios ajenos y no hay prisa que justifique aparecer en sus
  // registros como una ráfaga.
  await Promise.all(Array.from({ length: Math.min(5, total) }, async () => {
    for (let url = cola.shift(); url; url = cola.shift()) {
      const { estado, detalle } = await comprobarEnlace(url);
      if (estado === 'ok') continue;
      if (estado === 'roto') {
        rotos.push(url);
        avisos.push(`⚠️  enlace ROTO (${detalle}) — hay que corregirlo en la hoja: ${url}`);
      } else if (estado === 'cadena') {
        avisos.push(`·  ${url} responde ${detalle}, pero su servidor sirve el certificado sin la cadena intermedia — se ve bien en navegadores y falla en clientes estrictos`);
      } else if (estado === 'dudoso') {
        avisos.push(`·  enlace que responde ${detalle}: ${url} — puede ser el servidor rechazando al robot`);
      } else {
        avisos.push(`·  no se pudo comprobar ${url} (${detalle}) — no significa que esté roto`);
      }
    }
  }));

  /**
   * Anotación de Actions: un aviso dentro de un log que corre cada hora no lo
   * lee nadie; así aparece en la portada de la corrida.
   *
   * No se falla el job. Lo que está mal es un destino ajeno, no el contenido de
   * las hojas, y bloquear la publicación por eso dejaría el sitio sin las demás
   * correcciones del día.
   */
  if (rotos.length && process.env.GITHUB_ACTIONS) {
    console.log(`::warning title=Enlaces rotos en las hojas::${rotos.length} de ${total} enlace(s) devuelven 404 — ${rotos.join(' · ')}`);
  }
} catch (e) {
  avisos.push(`·  la comprobación de enlaces falló entera (${e.message}) — el contenido se publica igual`);
}

/* ------------------------------------------------------ escribir y cerrar -- */

/**
 * Imágenes que ya nadie referencia: se borran para que el repo no acumule basura.
 *
 * Con `--check` NO se borra nada. La opción promete «solo valida, no escribe» y
 * esta limpieza la desmentía: bastaba correrla con las hojas locales desfasadas
 * —que citan menos fotos que las de Google— para que una validación de prueba
 * se llevara por delante diez imágenes en uso.
 */
if (!SOLO_VALIDAR && existsSync(IMAGENES) && usadas.size > 0) {
  for (const f of readdirSync(IMAGENES)) {
    if (!usadas.has(f)) { unlinkSync(resolve(IMAGENES, f)); console.log(`  ✕ retirada ${f} (ya no se usa)`); }
  }
}

if (avisos.length) {
  console.log('\nAvisos:');
  avisos.forEach((a) => console.log('  ' + a));
}

if (SOLO_VALIDAR) {
  console.log('\n(--check) Validación terminada, no se escribió nada.');
  process.exit(0);
}

// Se fusiona con lo ya sincronizado: una hoja que falla hoy no borra lo de ayer.
let previo = {};
if (existsSync(DESTINO)) {
  try { previo = JSON.parse(readFileSync(DESTINO, 'utf8')); } catch { /* archivo corrupto: se regenera */ }
}
delete previo.sincronizado;

/**
 * Claves que ya no están en el contrato (D52: `noticias` y `proyectos`).
 *
 * El merge de abajo conserva lo de ayer para que una hoja caída no borre nada,
 * pero esa misma virtud dejaría vivo para siempre el contenido de una sección
 * retirada. Lo que sale del contrato sale también del archivo.
 */
/**
 * Clave del contenido → hoja que la alimenta, para las que no se llaman igual.
 *
 * Sin esto, `foroPrograma` no encontraba su hoja `foro_programa` y la limpieza de
 * abajo la daba por retirada del contrato en cada corrida. Hoy no se nota porque
 * `salida` la repone acto seguido; el día que esa hoja falle, se borraría el
 * contenido de ayer — que es exactamente lo que el merge existe para impedir.
 */
const HOJA_DE = { foroPrograma: 'foro_programa' };

for (const clave of Object.keys(previo)) {
  if (!((HOJA_DE[clave] ?? clave) in HOJAS)) {
    delete previo[clave];
    console.log(`  ✕ "${clave}" ya no está en el contrato de hojas — retirada del contenido`);
  }
}

const final = { ...previo, ...salida };
const cambio = JSON.stringify(final) !== JSON.stringify(previo);

mkdirSync(dirname(DESTINO), { recursive: true });
writeFileSync(DESTINO, JSON.stringify(final, null, 2) + '\n', 'utf8');

console.log(cambio ? '\n✅ contenido.json actualizado' : '\nSin cambios respecto a la última sincronización.');
