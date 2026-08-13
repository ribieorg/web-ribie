#!/usr/bin/env node
/**
 * Sincroniza el contenido del sitio desde las hojas de Google publicadas como CSV.
 *
 *   node scripts/sync-contenido.mjs            # descarga y escribe src/data/contenido.json
 *   node scripts/sync-contenido.mjs --check    # solo valida, no escribe (para revisar antes)
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
import { fileURLToPath } from 'node:url';
import { HOJAS, ESQUEMA, LOCAL, SECUNDARIOS_MANUAL } from './hojas.config.mjs';

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

/* ------------------------------------------------------ escribir y cerrar -- */

// Imágenes que ya nadie referencia: se borran para que el repo no acumule basura.
if (existsSync(IMAGENES) && usadas.size > 0) {
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
for (const clave of Object.keys(previo)) {
  if (!(clave in HOJAS)) {
    delete previo[clave];
    console.log(`  ✕ "${clave}" ya no está en el contrato de hojas — retirada del contenido`);
  }
}

const final = { ...previo, ...salida };
const cambio = JSON.stringify(final) !== JSON.stringify(previo);

mkdirSync(dirname(DESTINO), { recursive: true });
writeFileSync(DESTINO, JSON.stringify(final, null, 2) + '\n', 'utf8');

console.log(cambio ? '\n✅ contenido.json actualizado' : '\nSin cambios respecto a la última sincronización.');
