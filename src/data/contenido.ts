import externo from './contenido.json';

/**
 * CONTENIDO DEL SITIO.
 *
 * Un solo origen real: `contenido.json`, que escribe `scripts/sync-contenido.mjs`
 * desde las ocho hojas del Drive (D39 + D54). Lo que hay en este archivo son los
 * **textos estructurales de respaldo** —titulares y rótulos— para que una hoja
 * caída no deje la página muda.
 *
 * Dos reglas que gobiernan todo lo de abajo:
 *
 *  1. **Las listas no tienen respaldo.** Cifras, hitos, líneas, memoria y nodos
 *     salen de su hoja o no salen: sin filas, la sección no se renderiza. Es la
 *     regla §8.5 del DESIGN.md —si no hay contenido real, la sección no existe—
 *     y es lo que impide que el sitio vuelva a llenarse de material inventado.
 *
 *  2. **Tres estados por dato, no dos** (D52). `confirmado` · `por confirmar`
 *     (visible, con chip junto al dato) · `sin dato` (la casilla no se rellena).
 *     El estado viaja **por dato** desde la hoja, no por sección desde el código:
 *     antes el «21 países — por confirmar» estaba escrito a mano aquí.
 *
 * ⚠️ El modo demostración (`demo.json`, D49) se retira aquí. Existía para ver la
 * maqueta llena mientras el Drive estaba vacío, y su contenido eran noticias y
 * nodos plausibles pero inventados. Hoy las hojas traen el contenido real y lo
 * que falta se declara con el chip: rellenar con invención volvería a crear el
 * problema que el chip resuelve. El criterio de D49 —nada inventado puede
 * llegar a producción— se conserva; lo que sobra es el relleno.
 */

type Cifra = { id: string; valor: string; unidad: string; etiqueta: string; porConfirmar: boolean };
type Hito = {
  periodo: string; texto: string; imagen: string; pieImagen: string;
  anioImagen: string; anioPorConfirmar: boolean; porConfirmar: boolean;
};
type Linea = {
  numero: string; titulo: string; descripcion: string;
  color: string; ancho: number; porConfirmar: boolean;
};
type Pieza = {
  imagen: string; descripcion: string; anio: string;
  anioPorConfirmar: boolean; tamano: 'grande' | 'medio' | 'pequena';
};
type Evento = {
  id: string; titulo: string; fechaInicio: string; fechaFin: string; lugar: string;
  modalidad: string; descripcion: string; enlace: string; imagen: string;
  destacado: boolean; fechasConfirmadas: boolean;
};
type Nodo = { nombre: string; pais: string; sitio: string; logo: string; porConfirmar: boolean };

type Externo = {
  textos?: Record<string, string>;
  cifras?: Cifra[];
  hitos?: Hito[];
  lineas?: Linea[];
  memoria?: Pieza[];
  eventos?: Evento[];
  nodos?: Nodo[];
  colaboradores?: { nombre: string; cargo: string; institucion: string; grupo: string; foto: string }[];
  redes?: { nombre: string; url: string }[];
};

const ext = externo as Externo;

/** Texto de la hoja si existe y no está vacío; si no, el respaldo de aquí. */
const T = (clave: string, base = ''): string => {
  const v = ext.textos?.[clave];
  return v && v.trim() ? v.trim() : base;
};

const esSi = (v?: string) => ['sí', 'si', 'yes', 'true', '1'].includes((v ?? '').trim().toLowerCase());

/**
 * FRANJA «SITIO EN PREPARACIÓN».
 *
 * La controla la celda `mostrar_franja_preparacion` de la hoja `textos`, y no un
 * booleano del código: quien puede darla por terminada es RIBIE, y tiene que
 * poder hacerlo sin pedirnos un despliegue.
 *
 * Sustituye a `MOSTRAR_MARCAS`, que era global. Ya no hace falta que sea global
 * porque cada dato trae su propio estado: la franja explica el sistema, los chips
 * señalan qué dato concreto está pendiente.
 */
export const MOSTRAR_FRANJA = esSi(T('mostrar_franja_preparacion', 'sí'));

export const franja = T(
  'franja_texto',
  'Sitio en preparación — los contenidos marcados «por confirmar» están pendientes de validación por la red.'
);

export const sitio = {
  nombre: 'RIBIE',
  nombreLargo: 'Red Iberoamericana de Informática Educativa',
  dominio: 'ribie.org',
  tagline: T('tagline', 'Conectamos conocimiento, transformamos educación'),
};

/** Barra superior institucional: qué es la red, en dos datos y sin adornos. */
export const barra = {
  izquierda: T('barra_izquierda', 'Red Iberoamericana de Informática Educativa · Programa CYTED'),
  derecha: T('barra_derecha', '21 países · desde 1990'),
};

export const hero = {
  eyebrow: T('hero_eyebrow', 'Red Iberoamericana de Informática Educativa'),
  titulo: T('hero_titulo', 'Conectamos conocimiento,'),
  tituloDestacado: T('hero_destacado', 'transformamos educación'),
  entrada: T('hero_entrada'),
  botonPrimario: { texto: T('boton_primario', 'Conocer la red'), ancla: '#red' },
  botonSecundario: { texto: T('boton_secundario', 'XV Foro 2026'), ancla: '#foro' },
  /** Fotografía de apertura. Nombre de archivo del archivo de la red, o enlace de Drive. */
  imagen: T('hero_imagen', 'foro-auditorio-plenaria.webp'),
  pieImagen: T('hero_imagen_pie', 'Sesión plenaria del foro de investigadores'),
  anioPorConfirmar: !esSi(T('hero_imagen_anio_confirmado')),
};

/** Cinta de datos del hero. Sin hoja `cifras`, no hay cinta. */
export const cifras: Cifra[] = ext.cifras ?? [];

export const quienesSomos = {
  eyebrow: T('quienes_eyebrow', 'Quiénes somos'),
  titulo: T('quienes_titulo', 'Una comunidad de investigación, no un catálogo de tecnología'),
  parrafos: [T('quienes_p1'), T('quienes_p2')].filter(Boolean),
  /**
   * Los tres frentes de trabajo. Viven en `textos` como pares numerados y no en
   * una hoja propia porque son tres y no cambian: una hoja de tres filas fijas es
   * ceremonia, no mantenimiento.
   */
  frentes: [1, 2, 3]
    .map((n) => ({ titulo: T(`frente_${n}_titulo`), texto: T(`frente_${n}_texto`) }))
    .filter((f) => f.titulo),
};

export const historia = {
  eyebrow: T('historia_eyebrow', 'Historia'),
  titulo: T('historia_titulo', 'Treinta y seis años, recorridos en cuatro hitos'),
  hitos: ext.hitos ?? [],
};

export const lineas = {
  eyebrow: T('lineas_eyebrow', 'Retos y oportunidades'),
  titulo: T('lineas_titulo', 'Construimos juntos el futuro de la educación'),
  items: ext.lineas ?? [],
};

export const memoria = {
  eyebrow: T('memoria_eyebrow', 'Memoria'),
  titulo: T('memoria_titulo', 'Quince foros de encuentro, leídos como archivo'),
  piezas: ext.memoria ?? [],
};

/**
 * La hoja guarda las fechas en ISO —`2026-10-05`— porque es como Sheets las
 * ordena y como se leen sin ambigüedad. El sitio compone el rango en lenguaje
 * natural: si las dos caen en el mismo mes, el mes se dice una sola vez.
 */
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function rangoDeFechas(inicio?: string, fin?: string): string {
  const parte = (v?: string) => v?.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const i = parte(inicio);
  if (!i) return inicio?.trim() ?? '';          // texto libre: se respeta tal cual
  const [, ai, mi, di] = i;
  const largo = (d: string, m: string, a: string) => `${Number(d)} de ${MESES[Number(m) - 1]} de ${a}`;

  const f = parte(fin);
  if (!f) return largo(di, mi, ai);
  const [, af, mf, df] = f;
  if (ai === af && mi === mf) return `${Number(di)} al ${Number(df)} de ${MESES[Number(mi) - 1]} de ${ai}`;
  if (ai === af) return `${Number(di)} de ${MESES[Number(mi) - 1]} al ${largo(df, mf, af)}`;
  return `${largo(di, mi, ai)} al ${largo(df, mf, af)}`;
}

const destacado = ext.eventos?.find((e) => e.destacado) ?? ext.eventos?.[0];

/**
 * XV FORO — la banda destacada.
 *
 * `fechasPorConfirmar` es el dato más delicado del sitio: mientras la hoja diga
 * que nadie validó el rango, sale con chip. Con fechas de congreso la gente
 * compra pasajes, y el 29 de julio quedó escrito que la red no las había
 * confirmado aunque la celda ya las trajera.
 */
export const foro = destacado && {
  eyebrow: T('foro_eyebrow', 'Evento destacado'),
  nombre: destacado.titulo,
  fecha: rangoDeFechas(destacado.fechaInicio, destacado.fechaFin),
  fechasPorConfirmar: !destacado.fechasConfirmadas,
  lugar: destacado.lugar,
  modalidad: destacado.modalidad,
  descripcion: destacado.descripcion,
  /** Sin enlace de convocatoria no hay botón: un botón sin destino genera
   *  consultas que después tiene que atender la red. */
  cta: destacado.enlace ? { texto: T('foro_boton', 'Ver la convocatoria'), url: destacado.enlace } : null,
  imagen: destacado.imagen,
  pieImagen: T('foro_imagen_pie', 'Conferencia central del foro de investigadores'),
};

export const nodos = {
  eyebrow: T('nodos_eyebrow', 'Nodos y organizaciones'),
  titulo: T('nodos_titulo', 'Una red de 21 países, nodo a nodo'),
  intro: T('nodos_intro'),
  /**
   * Varias filas con el mismo país son varias instituciones sede: se agrupan.
   * El país cuenta como confirmado si al menos una de sus filas lo está — que es
   * lo que hace que el mapa pueda pintarse con 1 nodo o con 21 sin cambiar nada.
   */
  paises: Object.values(
    (ext.nodos ?? []).reduce<Record<string, { pais: string; instituciones: Nodo[]; confirmado: boolean }>>(
      (acc, n) => {
        const grupo = (acc[n.pais] ??= { pais: n.pais, instituciones: [], confirmado: false });
        if (n.nombre) grupo.instituciones.push(n);
        grupo.confirmado ||= !n.porConfirmar;
        return acc;
      }, {})
  ).sort((a, b) => a.pais.localeCompare(b.pais, 'es')),
};

export const contacto = {
  eyebrow: T('contacto_eyebrow', 'Contacto'),
  titulo: T('contacto_titulo', 'Escribir a la red'),
  correo: T('contacto_correo'),
  ciudad: T('contacto_ciudad'),
};

export const redes = ext.redes ?? [];

/**
 * Crédito del Aliado Tecnológico — Anexo C del convenio.
 *
 * ⚠️ La forma concreta de esta visibilidad **sigue sin constancia escrita** de
 * RIBIE: el convenio firmado dice «2. Visibilidad (a definir con RIBIE)».
 * Implementarla no equivale a acordarla.
 */
export const aliado = {
  texto: T('credito_texto', 'Aliado tecnológico — Creado por Renovatio Software'),
  url: T('credito_url', 'https://renovatiosoftware.net'),
};

export const pie = {
  descripcion: T('pie_descripcion',
    'Red Iberoamericana de Informática Educativa. Área estratégica del programa CYTED desde 1990.'),
  derechos: T('pie_derechos',
    '© 1990–2026 Red Iberoamericana de Informática Educativa. Todos los derechos reservados.'),
};

/** Navegación — anclas de la portada. El XV Foro tendrá página propia (D52). */
export const navegacion = [
  { texto: 'La red', ancla: '#red' },
  { texto: 'Historia', ancla: '#historia' },
  { texto: 'Líneas de trabajo', ancla: '#lineas' },
  /** «Eventos» y no «XV Foro»: el rótulo de la navegación nombra la sección, no
   *  la edición que hay en cartel. Con el XV Foro pasado habría que editar el
   *  menú; con «Eventos», no. */
  { texto: 'Eventos', ancla: '#foro' },
  { texto: 'Nodos', ancla: '#nodos' },
  { texto: 'Contacto', ancla: '#contacto' },
];
