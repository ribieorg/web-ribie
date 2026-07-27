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
 */

export const HOJAS = {
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
};

/** Columnas obligatorias por hoja: si falta alguna, el sync avisa y no publica esa hoja. */
export const ESQUEMA = {
  textos: ['clave', 'valor'],
  eventos: ['id', 'titulo', 'fecha_inicio', 'lugar', 'modalidad', 'descripcion', 'enlace_inscripcion', 'destacado', 'estado'],
  nodos: ['nombre_oficial', 'pais', 'sitio_web', 'logo', 'orden'],
  colaboradores: ['nombre', 'cargo', 'institucion', 'grupo', 'foto', 'orden'],
  redes: ['red', 'url', 'activo'],
};
