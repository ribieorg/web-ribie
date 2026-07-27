import externo from './contenido.json';

/**
 * CONTENIDO DEL SITIO.
 *
 * Dos orígenes, con prioridad:
 *   1. `contenido.json` — lo que sincroniza `scripts/sync-contenido.mjs` desde las
 *      hojas de Google (ver `Spec - Mantenimiento del contenido…`). Manda si existe.
 *   2. Los valores de este archivo — la base, y el respaldo si una hoja falla o
 *      todavía no está configurada.
 *
 * Esa prioridad es lo que hace que el sitio **no pueda romperse** por un error en
 * una hoja: si algo no llega, se sirve lo de aquí.
 *
 * CONTENIDO DEL SITIO — fuente única de verdad.
 *
 * Todo el texto de la landing vive aquí. Cuando llegue el material definitivo del
 * grupo de investigación de la UdeNar (carpeta `Web/Contenido` del Drive), se
 * reemplaza en este archivo y NO hay que tocar ni un componente.
 *
 * Cada bloque lleva `provisional: true|false`:
 *   - true  → se pinta con una marca visible de "contenido provisional"
 *   - false → dato verificado, se publica tal cual
 *
 * Al terminar de cargar el contenido real, poner MOSTRAR_MARCAS = false.
 */

type Externo = {
  textos?: Record<string, string>;
  eventos?: { id: string; titulo: string; fechaInicio: string; fechaFin: string; lugar: string;
              modalidad: string; descripcion: string; enlace: string; imagen: string; destacado: boolean }[];
  nodos?: { nombre: string; pais: string; sitio: string; logo: string }[];
  colaboradores?: { nombre: string; cargo: string; institucion: string; grupo: string; foto: string }[];
  redes?: { nombre: string; url: string }[];
};
const ext = externo as Externo;

/** Claves de la hoja que son configuración, no contenido publicable. */
const CONTROL = new Set(['mostrar_marcas']);

/** Texto de la hoja `textos` si existe y no está vacío; si no, el valor base. */
const T = (clave: string, base: string): string => {
  if (CONTROL.has(clave)) return base;
  const v = ext.textos?.[clave];
  return v && v.trim() ? v.trim() : base;
};
/**
 * ¿Este texto puede darse por definitivo?
 *
 * Que venga de la hoja NO basta: mientras `mostrar_marcas` esté en `sí`, el contenido
 * sigue siendo redacción de Renovatio pendiente del visto bueno de RIBIE, y debe
 * seguir señalado. La clave manda sobre el origen del dato.
 */
const propio = (clave: string): boolean => {
  if (forzarMarcas) return false;
  return !!ext.textos?.[clave]?.trim();
};

/**
 * Marca global: se apaga sola cuando llega contenido REAL.
 *
 * ⚠️ Mira si hay **filas con datos**, no si la clave existe. Una hoja conectada pero
 * todavía vacía devuelve `{}` y `[]`, que en JavaScript son *truthy*: comprobar la
 * mera existencia apagaría las marcas con el sitio aún lleno de material provisional
 * — justo lo contrario de lo que deben avisar.
 */
const marcaExplicita = ext.textos?.mostrar_marcas?.trim().toLowerCase();

/** `sí` en la hoja = "hay texto, pero RIBIE aún no lo validó" → todo sigue marcado. */
const forzarMarcas = ['sí', 'si', 'yes', 'true', '1'].includes(marcaExplicita ?? '');

export const MOSTRAR_MARCAS =
  marcaExplicita
    ? ['sí', 'si', 'yes', 'true', '1'].includes(marcaExplicita)
    : Object.keys(ext.textos ?? {}).length === 0 && !(ext.eventos?.length);

/** Datos verificados contra los documentos de RIBIE (ver 99_referencias/_README.md) */
export const sitio = {
  nombre: 'RIBIE',
  nombreLargo: 'Red Iberoamericana de Informática Educativa',
  dominio: 'ribie.org',
  // Propuesto en el mockup de RIBIE — pendiente de confirmación del Director
  tagline: T('tagline', 'Conectamos conocimiento, transformamos educación'),
  taglineProvisional: !propio('tagline'),
};

export const hero = {
  eyebrow: 'Red Iberoamericana de Informática Educativa',
  titulo: T('hero_titulo', 'Conectamos conocimiento,'),
  tituloDestacado: T('hero_destacado', 'transformamos educación'),
  entrada: T('hero_entrada',
    'Una red académica que desde 1990 reúne a investigadores, docentes e instituciones de Iberoamérica en torno a la informática aplicada a la educación.'),
  provisional: !propio('hero_entrada'),
  cta: { texto: 'Conoce el XV Foro', ancla: '#foro' },
};

export const quienesSomos = {
  eyebrow: 'Quiénes somos',
  titulo: 'Una red de',
  tituloDestacado: 'investigadores',
  parrafos: [
    T('quienes_p1', 'RIBIE reúne a instituciones y grupos que desarrollan o aplican tecnologías de la información a la solución de problemas educativos, y a equipos dedicados a la investigación, el desarrollo y la innovación de tecnologías en la educación y la cultura.'),
    T('quienes_p2', 'La red propicia la comunicación y la colaboración entre sus miembros alrededor de la gestión de proyectos, la formulación de políticas y el desarrollo de estrategias para el mejoramiento de la educación desde su perspectiva científica y tecnológica.'),
  ].filter(Boolean),
  // Base redactada a partir de `99_referencias/ribiecol.pdf`; la hoja la reemplaza
  provisional: !propio('quienes_p1'),
};

export const historia = {
  eyebrow: 'Nuestra historia',
  titulo: 'Más de tres décadas',
  tituloDestacado: 'de trayectoria',
  parrafos: [
    T('historia_p1', 'RIBIE nació en 1990 en el marco del subprograma VII de Electrónica e Informática Aplicadas del CYTED, el Programa Iberoamericano de Cooperación en Ciencia y Tecnología para el Desarrollo, creado en 1984 por acuerdo de diecinueve países de América Latina, España y Portugal.'),
    T('historia_p2', 'Desde entonces ha impulsado actividades científicas, cursos, talleres y proyectos de investigación y desarrollo que involucran a grupos de toda la región iberoamericana.'),
  ].filter(Boolean),
  provisional: !propio('historia_p1'),
};

/** ⚠️ Cifras SIN confirmar por RIBIE. No publicar hasta validación (§8 del brief). */
export const cifras = {
  provisional: !propio('cifra_paises'),
  items: [
    { valor: T('cifra_anios', '36'), etiqueta: 'años de trayectoria', verificado: true },
    { valor: T('cifra_paises', '—'), etiqueta: 'países miembros', verificado: propio('cifra_paises') },
    { valor: T('cifra_grupos', '—'), etiqueta: 'grupos de investigación', verificado: propio('cifra_grupos') },
    { valor: T('cifra_instituciones', '—'), etiqueta: 'instituciones asociadas', verificado: propio('cifra_instituciones') },
  ],
};

export const objetivos = {
  eyebrow: 'Retos y oportunidades',
  titulo: 'Construimos juntos el futuro',
  tituloDestacado: 'de la educación',
  provisional: true,
  items: [
    {
      titulo: 'Innovación tecnológica',
      texto: 'Integrar tecnologías emergentes para transformar los procesos de enseñanza y aprendizaje.',
    },
    {
      titulo: 'Colaboración regional',
      texto: 'Fortalecer redes de cooperación entre investigadores e instituciones iberoamericanas.',
    },
    {
      titulo: 'Formación continua',
      texto: 'Promover el desarrollo de competencias digitales en docentes y estudiantes.',
    },
    {
      titulo: 'Impacto social',
      texto: 'Generar soluciones educativas inclusivas que respondan a los desafíos de la región.',
    },
    {
      titulo: 'Investigación aplicada',
      texto: 'Impulsar proyectos que trasladen los hallazgos científicos a la práctica pedagógica.',
    },
    {
      titulo: 'Divulgación académica',
      texto: 'Difundir experiencias, memorias y publicaciones de la comunidad de la red.',
    },
  ],
};

/** Evento destacado. Base verificada en los requerimientos oficiales del 13 jul 2026;
 *  si la hoja `eventos` trae uno marcado como destacado, ese manda. */
const destacado = ext.eventos?.find((e) => e.destacado) ?? ext.eventos?.[0];

export const foro = {
  eyebrow: 'Evento destacado',
  nombre: destacado?.titulo ?? 'XV Foro de Investigadores de Informática Educativa',
  fecha: destacado?.fechaInicio ?? 'Primera semana de octubre de 2026',
  fechaProvisional: forzarMarcas || !destacado, // sin hoja, faltan los días exactos
  lugar: destacado?.lugar ?? 'Universidad de Nariño · Pasto, Colombia',
  modalidad: destacado?.modalidad ?? 'Modalidad híbrida — presencial y virtual',
  descripcion: destacado?.descripcion ??
    'El encuentro de la comunidad académica iberoamericana en informática educativa: un espacio para compartir conocimientos, impulsar colaboraciones y construir soluciones que transformen la educación.',
  descripcionProvisional: forzarMarcas || !destacado,
  cta: { texto: 'Información e inscripción', url: destacado?.enlace ?? '' },
};

export const organizaciones = {
  eyebrow: 'Nodos y organizaciones',
  titulo: 'Instituciones que',
  tituloDestacado: 'integran la red',
  nota: 'Listado pendiente de confirmación por RIBIE.',
  provisional: forzarMarcas || !ext.nodos?.length,
  items: (ext.nodos ?? []) as { nombre: string; pais: string; sitio?: string; logo?: string }[],
};

export const colaboradores = {
  eyebrow: 'Colaboradores',
  titulo: 'Quienes hacen',
  tituloDestacado: 'posible la red',
  provisional: forzarMarcas || !ext.colaboradores?.length,
  items: (ext.colaboradores ?? []) as { nombre: string; cargo: string; institucion: string; grupo?: string; foto?: string }[],
};

export const redes = {
  titulo: 'Síguenos',
  provisional: forzarMarcas || !ext.redes?.length,
  items: (ext.redes ?? []) as { nombre: string; url: string }[],
};

export const contacto = {
  // Se define en la sesión del 25 jul, al crear las direcciones @ribie.org (D32)
  correo: T('contacto_correo', ''),
  ciudad: T('contacto_ciudad', 'Pasto, Colombia'),
  provisional: !propio('contacto_correo'),
};

export const aliado = {
  texto: 'Aliado Tecnológico',
  nombre: 'Renovatio Software',
  url: 'https://renovatiosoftware.net',
};

/** Navegación del encabezado — anclas de la página única */
export const navegacion = [
  { texto: 'La red', ancla: '#quienes-somos' },
  { texto: 'Historia', ancla: '#historia' },
  { texto: 'Objetivos', ancla: '#objetivos' },
  { texto: 'XV Foro', ancla: '#foro' },
  { texto: 'Nodos', ancla: '#nodos' },
  { texto: 'Contacto', ancla: '#contacto' },
];
