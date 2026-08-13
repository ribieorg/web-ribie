/**
 * Fuentes de contenido — URLs de las pestañas publicadas como CSV.
 *
 * Cómo se obtiene cada URL, por pestaña:
 *   Google Sheets → Archivo → Compartir → Publicar en la web
 *   → seleccionar LA PESTAÑA (no "documento completo") → formato CSV → Publicar
 *
 * Esa URL es de SOLO LECTURA: aunque alguien la encuentre, no puede modificar nada.
 * Editar sigue exigiendo permiso de Editor en el Drive.
 *
 * Mientras una URL esté vacía, esa sección conserva el contenido por defecto de
 * `src/data/contenido.ts`. Se pueden ir activando de a una.
 *
 * ── Contrato de 8 hojas (D54) ──────────────────────────────────────────────
 * `cifras`, `hitos`, `lineas` y `memoria` son las hojas NUEVAS: ese contenido
 * vivía incrustado en el código, de modo que ni RIBIE ni el grupo podían
 * corregirlo sin pedírnoslo — justo lo que D39 quería evitar. `noticias` y
 * `proyectos` salen del contrato (D52): sus secciones se retiran hasta que haya
 * material real.
 *
 * ── Modo local ─────────────────────────────────────────────────────────────
 * Con `HOJAS_LOCALES=1` el sync lee los CSV de `scripts/hojas-locales/` en vez
 * de la red. Son la exportación de los `.xlsx` que hay que subir al Drive, y
 * existen para poder desarrollar contra el contrato **antes** de que las
 * pestañas estén publicadas. No son un segundo origen de verdad: en cuanto la
 * URL de arriba esté puesta, manda la hoja.
 */

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));

/** ¿Se lee del disco en vez de la red? Lo decide quien lanza el comando. */
export const LOCAL = process.env.HOJAS_LOCALES === '1';

const local = (nombre) => resolve(AQUI, 'hojas-locales', `${nombre}.csv`);

const REMOTAS = {
  textos:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTHjjUEZ51z-Mjo328z28t4ffWGVUXWNBBk5wcB13o5S-Tsf5PLk8VflAqjLEeLElcdW5j4-1XvFRZW/pub?gid=790584523&single=true&output=csv',
  eventos:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRRagZiM9VoBhXbpFkRQ4c911WKvhli2wl4HG6JMzSqHd0D-yRi-UoRXgs5Zz90FsIfQwsFRNPrc4sR/pub?gid=1567752043&single=true&output=csv',
  nodos:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQFtDnTmfeWM3DcyAp1-WmBeLSoT0pcMiwQ0MDONQbQaZfrjWk6MoHS2gO9u9TRgZdAxbE4ioZMknBp/pub?gid=1392215937&single=true&output=csv',
  colaboradores:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQy0P9-Phay3ZXUeNUeK77fomOhEgDEqeVQZT3iZOVZP6rkakG-7zEM4vVNgyPo6esKBalElusuHlI0/pub?gid=656455943&single=true&output=csv',
  redes:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vS5bY1dV86VLuvsOclT-OXtLSlev-OwFy-Vii6OBMrm7_fIqyf6tfVBOgmuxi-7f5I-Ropqt1Is6J-h/pub?gid=1383537062&single=true&output=csv',

  // ⚠️ Pestañas que hay que CREAR en el cuaderno del Drive y publicar como CSV.
  // Los archivos de partida están en `scripts/hojas-locales/*.csv` (y como .xlsx
  // en el paquete de diseño). Mientras la URL esté vacía y no se use el modo
  // local, esas secciones conservan lo que hubiera: no tener hoja no rompe nada.
  cifras: '',
  hitos: '',
  lineas: '',
  memoria: '',
};

export const HOJAS = LOCAL
  ? Object.fromEntries(Object.keys(REMOTAS).map((n) => [n, local(n)]))
  : REMOTAS;

/** Columnas obligatorias por hoja: si falta alguna, el sync avisa y no publica esa hoja. */
export const ESQUEMA = {
  textos: ['clave', 'valor'],
  // `fechas_confirmadas` no es opcional: sin esa columna, un rango sin validar se
  // publicaría como firme, que es exactamente el riesgo que D52 vino a cerrar.
  eventos: ['id', 'titulo', 'fecha_inicio', 'fechas_confirmadas', 'lugar', 'modalidad', 'descripcion', 'enlace_inscripcion', 'destacado', 'estado'],
  nodos: ['nombre_oficial', 'pais', 'sitio_web', 'logo', 'orden'],
  colaboradores: ['nombre', 'cargo', 'institucion', 'grupo', 'foto', 'orden'],
  redes: ['red', 'url', 'activo'],
  cifras: ['id', 'valor', 'etiqueta', 'confirmado', 'orden', 'estado'],
  hitos: ['orden', 'periodo', 'texto', 'estado'],
  lineas: ['orden', 'numero', 'titulo', 'descripcion', 'color_manual', 'ancho', 'estado'],
  memoria: ['orden', 'imagen', 'descripcion', 'tamano', 'estado'],
  // `unidad`, `pie_imagen`, `anio`, `anio_confirmado` y `que_es` quedan fuera a
  // propósito: son opcionales, y exigirlas haría que borrar una columna accesoria
  // tumbase la hoja entera. Aquí solo van las que el diseño consume sí o sí.
};

/**
 * Los ocho secundarios del manual de marca. `lineas.color_manual` solo puede
 * traer uno de estos: cualquier otro valor se descarta y el bloque cae al
 * turquesa de la casa.
 *
 * No es purismo. Medidos como bloque con tinta `#111827` encima dan 4,68–7,01:1
 * y pasan; un color inventado no está medido, y así fue como el sitio terminó
 * usando el azul corporativo del Alan Turing Institute (D51).
 */
export const SECUNDARIOS_MANUAL = [
  '#00AEEF', '#0BAAD1', '#15A7B3', '#20A395',
  '#2A9F78', '#359B5A', '#3F983C', '#4A941E',
];
