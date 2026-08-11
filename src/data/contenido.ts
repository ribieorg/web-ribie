import externo from './contenido.json';
import demostracion from './demo.json';

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
  noticias?: Entrada[];
  proyectos?: (Entrada & { destacado: boolean })[];
};

/** Lo que comparten una noticia y un proyecto: texto, procedencia y una foto. */
type Entrada = {
  titulo: string; entradilla: string; origen: string; seccion: string;
  etiquetas: string; imagen: string; pieImagen: string;
};
const ext = externo as Externo;

/**
 * MODO DEMOSTRACIÓN — solo para ver la maqueta llena mientras el Drive se carga.
 *
 * Activo en `pnpm dev` y en cualquier build lanzado con `PUBLIC_DEMO=1`. El build
 * de producción NO lo activa, así que **nada de `demo.json` llega a `ribie.org`**.
 *
 * Por qué existe esta puerta y no se pegó el contenido directamente: los datos de
 * `demo.json` son plausibles pero inventados —"Chile → Universidad de Chile" no lo
 * ha confirmado nadie—, y el aprendizaje del proyecto es explícito en que *el dato
 * de un mockup termina dándose por cierto*. Separarlo por entorno es lo que permite
 * enseñar la maqueta completa sin que exista ninguna forma de publicarla por
 * descuido.
 *
 * ⚠️ El modo demo NO apaga las marcas de "contenido provisional" ni convierte una
 * cifra inventada en verificada: solo rellena huecos visuales.
 */
export const MODO_DEMO =
  import.meta.env.DEV || import.meta.env.PUBLIC_DEMO === '1';

const D = MODO_DEMO ? (demostracion as typeof demostracion) : null;

/** Claves de la hoja que son configuración, no contenido publicable. */
const CONTROL = new Set(['mostrar_marcas']);

/**
 * Texto de la hoja `textos` si existe y no está vacío. Si no, el de demostración
 * (solo en modo demo). Si tampoco, el valor base de este archivo.
 *
 * El orden importa: la hoja SIEMPRE manda sobre la demostración, de modo que en
 * cuanto RIBIE escriba una celda, lo suyo desplaza al relleno sin tocar código.
 */
const T = (clave: string, base: string): string => {
  if (CONTROL.has(clave)) return base;
  const v = ext.textos?.[clave];
  if (v && v.trim()) return v.trim();
  const d = (D?.textos as Record<string, string> | undefined)?.[clave];
  if (d && d.trim()) return d.trim();
  return base;
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
  /** Frase de entrada, en la tipografía de titular: dice qué es la red antes de
   *  explicarla. Se redactó a partir de los dos párrafos que siguen. */
  entradilla: T('quienes_entradilla', 'Una comunidad de investigación, no un catálogo de tecnología'),
  parrafos: [
    T('quienes_p1', 'RIBIE reúne a instituciones y grupos que desarrollan o aplican tecnologías de la información a la solución de problemas educativos, y a equipos dedicados a la investigación, el desarrollo y la innovación de tecnologías en la educación y la cultura.'),
    T('quienes_p2', 'La red propicia la comunicación y la colaboración entre sus miembros alrededor de la gestión de proyectos, la formulación de políticas y el desarrollo de estrategias para el mejoramiento de la educación desde su perspectiva científica y tecnológica.'),
  ].filter(Boolean),
  // Base redactada a partir de `99_referencias/ribiecol.pdf`; la hoja la reemplaza
  provisional: !propio('quienes_p1'),
  /**
   * Ejes de trabajo — bloques claros con un filete de color arriba.
   *
   * Aquí el color es un FILETE y no el fondo entero, a diferencia de los
   * objetivos. Es deliberado: si las dos secciones usaran el mismo recurso, el
   * bloque de color dejaría de significar nada. Al ser filete y no fondo, el
   * color no lleva texto encima y la regla de tinta no lo alcanza — por eso
   * pueden usarse los tres saturados sin medir contraste de lectura.
   */
  ejes: [
    {
      titulo: T('eje1_titulo', 'Investigación'),
      texto: T('eje1_texto', 'Proyectos conjuntos entre grupos de la red y publicación arbitrada.'),
      filete: 'var(--viv-cian)',
    },
    {
      titulo: T('eje2_titulo', 'Formación'),
      texto: T('eje2_texto', 'Encuentros, tutorías y movilidad entre instituciones asociadas.'),
      filete: 'var(--viv-magenta)',
    },
    {
      titulo: T('eje3_titulo', 'Divulgación'),
      texto: T('eje3_texto', 'Memorias, publicaciones y foros abiertos a la comunidad académica.'),
      filete: 'var(--viv-purpura)',
    },
  ],
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

/**
 * ⚠️ Cifras SIN confirmar por RIBIE. No publicar hasta validación (§8 del brief).
 *
 * Tres estados y no dos, porque "no hay número" y "hay número sin confirmar" no
 * son lo mismo y no deben verse igual:
 *   - `verificado`  → se pinta a todo color, sin nota.
 *   - hay valor pero sin verificar → color normal y nota "por confirmar" (es el
 *     caso del modo demo: la maqueta se ve completa y el aviso sigue puesto).
 *   - sin valor (`—`) → se apaga a gris, para que el hueco se note.
 */
const cifra = (clave: string, etiqueta: string, base = '—') => {
  const valor = T(clave, base);
  return { valor, etiqueta, verificado: propio(clave), hayDato: valor !== base };
};

export const cifras = {
  provisional: !propio('cifra_paises'),
  items: [
    { valor: T('cifra_anios', '36'), etiqueta: 'años de trayectoria', verificado: true, hayDato: true },
    cifra('cifra_paises', 'países miembros'),
    cifra('cifra_grupos', 'grupos de investigación'),
    cifra('cifra_instituciones', 'instituciones asociadas'),
  ],
};

/**
 * Objetivos — cada uno ES un bloque de color plano, no una tarjeta con un icono.
 *
 * La maqueta va en el dato y no en el CSS porque el escalonado es irregular a
 * propósito: `inicio`/`ancho` son la columna de arranque y el tramo dentro de una
 * retícula de doce, y `desfase` baja el bloque en píxeles. Un 3×2 simétrico es la
 * firma de layout más reconocible del contenido generado (§11.3), y esos números
 * son lo único que lo evita. Reordenar los ítems obliga a revisarlos.
 *
 * `variante` decide el par fondo/tinta según la regla medida en `tokens.css`:
 * los luminosos (amarillo) llevan tinta oscura; los profundos (púrpura, azul),
 * blanca. No se invierte ninguna.
 */
export const objetivos = {
  eyebrow: 'Retos y oportunidades',
  titulo: 'Construimos juntos el futuro',
  tituloDestacado: 'de la educación',
  provisional: true,
  items: [
    {
      titulo: 'Innovación tecnológica',
      texto: 'Integrar tecnologías emergentes para transformar los procesos de enseñanza y aprendizaje.',
      variante: 'blanco', inicio: 1, ancho: 5, desfase: 0,
    },
    {
      titulo: 'Colaboración regional',
      texto: 'Fortalecer redes de cooperación entre investigadores e instituciones iberoamericanas.',
      variante: 'negro', inicio: 7, ancho: 4, desfase: 64,
    },
    {
      titulo: 'Formación continua',
      texto: 'Promover el desarrollo de competencias digitales en docentes y estudiantes.',
      variante: 'purpura', inicio: 2, ancho: 4, desfase: 48,
    },
    {
      titulo: 'Impacto social',
      texto: 'Generar soluciones educativas inclusivas que respondan a los desafíos de la región.',
      variante: 'amarillo', inicio: 7, ancho: 5, desfase: 20,
    },
    {
      titulo: 'Investigación aplicada',
      texto: 'Impulsar proyectos que trasladen los hallazgos científicos a la práctica pedagógica.',
      variante: 'blanco', inicio: 1, ancho: 4, desfase: 48,
    },
    {
      titulo: 'Divulgación académica',
      texto: 'Difundir experiencias, memorias y publicaciones de la comunidad de la red.',
      variante: 'azul', inicio: 6, ancho: 5, desfase: 0,
    },
  ] as const satisfies readonly {
    titulo: string;
    texto: string;
    variante: 'blanco' | 'negro' | 'purpura' | 'amarillo' | 'azul';
    inicio: number;
    ancho: number;
    desfase: number;
  }[],
};

/**
 * ACTUALIDAD DE LA RED — mosaico de noticias.
 *
 * `items` está vacío a propósito: RIBIE no ha entregado ni una noticia, y no hay
 * todavía una hoja `noticias` en el cuaderno del Drive. Mientras siga vacío, el
 * mosaico se pinta con **huecos declarados** —cada celda dice qué va en ella y en
 * qué formato— en vez de con titulares inventados.
 *
 * `plantilla` es lo que se muestra en esos huecos, y describe el mosaico celda a
 * celda: cuáles son de texto, cuáles de foto, cuáles sangran hasta el borde y de
 * qué color es el filete. La maqueta no cambia cuando lleguen las noticias: solo
 * se sustituye el hueco por su contenido.
 */
export const actualidad = {
  eyebrow: 'Actualidad',
  titulo: 'Actualidad',
  tituloDestacado: 'de la red',
  enlaceArchivo: 'Ver todo el archivo →',
  provisional: !(ext.noticias?.length),
  /** La hoja manda; la demostración solo rellena mientras no exista. */
  items: (ext.noticias ?? D?.actualidad ?? []) as Entrada[],
  /**
   * Las fotos reales de la hoja se van sirviendo, en orden, a las celdas de foto
   * de la plantilla. Cada celda que no alcance foto conserva su hueco declarado:
   * así la sección se llena de forma progresiva, sin quedar a medias ni exigir
   * que RIBIE cargue las cuatro de golpe.
   */
  fotos: (ext.noticias ?? []).filter((n) => n.imagen)
    .map((n) => ({ archivo: n.imagen, pie: n.pieImagen })),
  /** Ocho celdas, en el orden en que se leen. Texto y foto se alternan sin simetría. */
  plantilla: [
    { tipo: 'texto', sangra: 'izquierda' },
    { tipo: 'foto', filete: 'var(--viv-cian)', pie: '[ foto: taller de formación docente — 1200 × 1200 ]', inclinacion: 4.5 },
    { tipo: 'foto', filete: 'var(--viv-magenta)', pie: '[ foto: sesión plenaria del XIV Foro — 1200 × 1200 ]', inclinacion: -4.5 },
    { tipo: 'texto', sangra: 'derecha' },
    { tipo: 'foto', filete: 'var(--viv-amarillo)', pie: '[ foto: firma de convenio interinstitucional — 1200 × 1200 ]', inclinacion: 4.5 },
    { tipo: 'texto' },
    { tipo: 'texto', acento: true },
    { tipo: 'foto', filete: 'var(--viv-purpura)', pie: '[ foto: laboratorio de informática educativa — 1200 × 1200 ]', inclinacion: -4.5 },
  ] as const,
};

/**
 * PROYECTOS Y GOBERNANZA — bloque apaisado + dos columnas.
 *
 * Mismo criterio que `actualidad`: sin material propio, se declara el hueco.
 */
export const proyectos = {
  provisional: !(ext.proyectos?.length),
  /** La fila marcada `destacado` va al bloque apaisado; el resto, a las columnas. */
  items: ((ext.proyectos?.filter((p) => !p.destacado) ?? D?.proyectos) ?? []) as Entrada[],
  fotos: (ext.proyectos?.filter((p) => !p.destacado && p.imagen) ?? [])
    .map((p) => ({ archivo: p.imagen, pie: p.pieImagen })),
  destacado: {
    pie: '[ vídeo o foto apaisada: mesa redonda de coordinadores de nodo — 2400 × 1400 ]',
    formato: 'Titular de hasta 80 caracteres sobre la imagen',
    titulo: ext.proyectos?.find((p) => p.destacado)?.titulo ?? D?.proyectoDestacado?.titulo ?? '',
    imagen: ext.proyectos?.find((p) => p.destacado)?.imagen ?? '',
    pieImagen: ext.proyectos?.find((p) => p.destacado)?.pieImagen ?? '',
  },
  columnas: [
    { pie: '[ foto: investigador con prototipo de aula — 1200 × 1200 ]', inclinacion: -4.5, filete: 'var(--viv-cian)' },
    { pie: '[ retratos: nuevas coordinaciones de nodo — 1200 × 1200 ]', inclinacion: 4.5, filete: 'var(--viv-magenta)' },
  ] as const,
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

type Nodo = { nombre: string; pais: string; sitio?: string; logo?: string };

/**
 * Nodos de la red.
 *
 * En modo demo la lista base es la de demostración, pero **cada entrada que exista
 * en el Drive pisa a la suya**: así el nodo de Colombia conserva su sitio web y su
 * logotipo reales —y con ellos la demostración de que las imágenes se descargan
 * solas de las carpetas— mientras el resto se rellena para ver el muro completo.
 */
const nodosDelDrive = (ext.nodos ?? []) as Nodo[];
const nodosDemo = (D?.nodos ?? []) as Nodo[];
const nodosCombinados: Nodo[] = MODO_DEMO
  ? nodosDemo.map((d) => nodosDelDrive.find((r) => r.pais === d.pais) ?? d)
      .concat(nodosDelDrive.filter((r) => !nodosDemo.some((d) => d.pais === r.pais)))
  : nodosDelDrive;

export const organizaciones = {
  eyebrow: 'Nodos y organizaciones',
  titulo: 'Instituciones que',
  tituloDestacado: 'integran la red',
  nota: 'Listado provisional, tomado de la memoria institucional de la red. Pendiente de confirmación por RIBIE: las instituciones que integran hoy la red se cargan desde la hoja «nodos» del Drive.',
  provisional: forzarMarcas || !ext.nodos?.length,
  items: nodosCombinados,
};

export const colaboradores = {
  eyebrow: 'Colaboradores',
  titulo: 'Quienes hacen',
  tituloDestacado: 'posible la red',
  intro: 'Organismos y programas que acompañan el trabajo de la red, sus foros y sus publicaciones.',
  provisional: forzarMarcas || !ext.colaboradores?.length,
  items: (ext.colaboradores?.length
    ? ext.colaboradores
    : (D?.colaboradores ?? [])) as {
      nombre: string; cargo?: string; institucion?: string; grupo?: string; foto?: string; pendiente?: boolean;
    }[],
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
  { texto: 'Actualidad', ancla: '#actualidad' },
  { texto: 'Objetivos', ancla: '#objetivos' },
  { texto: 'XV Foro', ancla: '#foro' },
  { texto: 'Nodos', ancla: '#nodos' },
  { texto: 'Contacto', ancla: '#contacto' },
];
