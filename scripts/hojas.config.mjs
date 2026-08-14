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
  // ⚠️ Republicadas el 14 ago 2026 SIN `gid` ni `single=true`. El documento es el
  // mismo de julio; lo que caducó fue el identificador de la pestaña al reemplazar
  // su contenido, y con él las URLs anteriores empezaron a dar HTTP 400. Con
  // `pub?output=csv` Google devuelve **la primera pestaña**, que es la de datos
  // (`guia` va segunda): si alguien las reordena, el sync leería la guía.
  textos:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTHjjUEZ51z-Mjo328z28t4ffWGVUXWNBBk5wcB13o5S-Tsf5PLk8VflAqjLEeLElcdW5j4-1XvFRZW/pub?output=csv',
  eventos:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRRagZiM9VoBhXbpFkRQ4c911WKvhli2wl4HG6JMzSqHd0D-yRi-UoRXgs5Zz90FsIfQwsFRNPrc4sR/pub?output=csv',
  nodos:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQFtDnTmfeWM3DcyAp1-WmBeLSoT0pcMiwQ0MDONQbQaZfrjWk6MoHS2gO9u9TRgZdAxbE4ioZMknBp/pub?output=csv',
  colaboradores:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQy0P9-Phay3ZXUeNUeK77fomOhEgDEqeVQZT3iZOVZP6rkakG-7zEM4vVNgyPo6esKBalElusuHlI0/pub?output=csv',
  redes:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vS5bY1dV86VLuvsOclT-OXtLSlev-OwFy-Vii6OBMrm7_fIqyf6tfVBOgmuxi-7f5I-Ropqt1Is6J-h/pub?output=csv',

  // Publicadas el 14 ago 2026. ⚠️ Estas cuatro se publicaron como **documento
  // completo** (`pub?output=csv`, sin `gid` ni `single=true`), de modo que Google
  // devuelve **la primera pestaña**. Funciona porque la pestaña de datos va
  // primera y la de `guia` segunda: si alguien las reordena, el sync empieza a
  // leer la guía. Al reordenar o añadir pestañas, republicar apuntando a la
  // pestaña concreta.
  cifras:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTDqjF4RhssyFjcE9kwqVDofBdgEuidHg-24GdCBdeVs6Ezgoh2U9V0UC84vknU6w/pub?output=csv',
  hitos:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vS8IKEgF78hbgNTssQmQvHWIwMOm8HKeliCfdZAEB1UBRn-aYZlolnmWXG4C46_ew/pub?output=csv',
  lineas:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSvmXZIf_wwI6AWn4QOjtYo71vtAxmyta8o-7ztiICDORnZn1Cu6f4UXs80klKHEw/pub?output=csv',
  memoria:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQgShuAnBxre5yu3b4N0CUGZA_qrzv2pMzcX-Hszbef1i_OZiv0Eclgs1Zp4zqiGA/pub?output=csv',
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
