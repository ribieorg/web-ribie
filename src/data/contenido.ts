import externo from './contenido.json';

/**
 * CONTENIDO DEL SITIO.
 *
 * Un solo origen real: `contenido.json`, que escribe `scripts/sync-contenido.mjs`
 * desde las once hojas del Drive (D39 + D54 + D60). Lo que hay en este archivo son los
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
  /** Opcionales: sin ellos el evento se publica igual, solo que la franja de
   *  convocatoria pierde su primera fase, sus enlaces secundarios o su contexto. */
  cierreConvocatoria?: string; enlaceAgenda?: string; correoPonencias?: string;
  rotulo?: string; subtitulo?: string; ilustracion?: string;
};
/** Un encuentro de los que se celebran juntos bajo el mismo título. */
type ForoPrograma = { numeral: string; nombre: string; entidad: string };
type Nodo = { nombre: string; pais: string; sitio: string; logo: string; porConfirmar: boolean };

type Seccion = { mostrar: boolean; rotuloMenu: string };

type Externo = {
  /** Configuración, no contenido: qué secciones se publican (hoja `estructura`). */
  estructura?: Record<string, Seccion>;
  textos?: Record<string, string>;
  cifras?: Cifra[];
  hitos?: Hito[];
  lineas?: Linea[];
  memoria?: Pieza[];
  eventos?: Evento[];
  foroPrograma?: ForoPrograma[];
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
 * ¿Se publica esta sección? Lo dice la hoja `estructura` (D60).
 *
 * **Sin dato, se muestra.** Es deliberado y va en la misma dirección que el
 * sync: una hoja caída, una fila borrada o un `contenido.json` de antes de que
 * la hoja existiera dejan el sitio como estaba, nunca en blanco. Apagar una
 * sección solo puede ser el resultado de que alguien escriba «no».
 */
export const visible = (seccion: string): boolean => ext.estructura?.[seccion]?.mostrar ?? true;

/** Rótulo de la sección en el menú. Vacío —o «-» en la hoja— = no va al menú. */
const rotuloMenu = (seccion: string): string => ext.estructura?.[seccion]?.rotuloMenu ?? '';

/**
 * QUIÉN LLEVA EL `<h1>` DE LA PORTADA.
 *
 * Hasta D60 la respuesta era fija —el hero— y la franja del encuentro declaraba
 * por eso que no lleva encabezado (§17). Ese supuesto caduca en cuanto el hero se
 * puede apagar desde una hoja: la portada quedaría **sin `h1` y abriendo en
 * `h2`**, que rompe la navegación por encabezados de un lector de pantalla.
 *
 * Así que el `h1` viaja al primer bloque publicado, en el orden en que aparecen.
 * No es una preferencia de estilo: el `h1` es «de qué trata esta página», y de
 * qué trata la página cambia cuando cambia lo que la página contiene.
 */
const ORDEN_H1 = ['hero', 'convocatoria', 'historia', 'red', 'lineas', 'foro', 'memoria', 'nodos', 'contacto'];

/** ¿Este bloque es el primero publicado y, por tanto, el que lleva el `h1`? */
export const llevaH1 = (bloque: string): boolean =>
  ORDEN_H1.find((b) => visible(b)) === bloque;

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

/* ───────────────────────────────────────────────────────────────────────────
 * CONVOCATORIA — la franja que corona la portada mientras el encuentro vive.
 *
 * Se arma aquí, en el build, y NO en el navegador. Dos razones:
 *
 *  1. **No hay salto ni parpadeo.** El HTML sale ya con los números puestos, de
 *     modo que nadie ve un hueco, un «--» ni un ancho que cambia cuando el
 *     script despierta. Lo único que hace el cliente es corregir el desfase
 *     acumulado desde que se construyó la página.
 *  2. **Sin JavaScript se ve completo**, que es la regla de D53: el visitante
 *     lee las fechas, el plazo y los enlaces; lo que se pierde es el conteo,
 *     no la información.
 *
 * ⚠️ Todo se ancla a la hora de Colombia. Un plazo no es un momento distinto
 * para cada quien: si se calculara contra la medianoche local, alguien en
 * Madrid vería un día menos que alguien en Pasto para el mismo cierre, y el
 * público de la red está repartido en 21 países.
 * ─────────────────────────────────────────────────────────────────────────── */

const ZONA_EVENTO = '-05:00';

/** Fecha suelta (`2026-09-17`) o instante completo con zona. Sin zona explícita
 *  se asume la del evento, nunca la del navegador que abra la página. */
function momento(valor: string | undefined, finDeDia = false): number | null {
  const v = valor?.trim();
  if (!v) return null;
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(v)
    ? `${v}T${finDeDia ? '23:59:59' : '00:00:00'}${ZONA_EVENTO}`
    : v;
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? null : t;
}

/** Cuatro casillas, siempre a dos dígitos: `09`, no `9`. El ancho de la casilla
 *  deja de depender del número que le toque, que es lo que hace que una cuenta
 *  atrás no tiemble mientras corre. */
function cuenta(desde: number, hasta: number) {
  const ms = Math.max(0, hasta - desde);
  const dd = (n: number) => String(n).padStart(2, '0');
  return [
    { clave: 'dias', rotulo: 'días', valor: dd(Math.floor(ms / 86_400_000)) },
    { clave: 'horas', rotulo: 'horas', valor: dd(Math.floor(ms / 3_600_000) % 24) },
    { clave: 'minutos', rotulo: 'minutos', valor: dd(Math.floor(ms / 60_000) % 60) },
    { clave: 'segundos', rotulo: 'segundos', valor: dd(Math.floor(ms / 1_000) % 60) },
  ];
}

export const convocatoria = (() => {
  /** La hoja puede retirar la franja antes de que el encuentro pase; la fecha,
   *  más abajo, la retira sola cuando pasa. Lo primero es una decisión, lo
   *  segundo una caducidad, y no se estorban. */
  if (!visible('convocatoria')) return null;
  if (!destacado) return null;

  const inicio = momento(destacado.fechaInicio);
  const fin = momento(destacado.fechaFin || destacado.fechaInicio, true);
  if (inicio === null || fin === null) return null;

  const ahora = Date.now();
  if (ahora > fin) return null;          // ya pasó: la franja no se arma siquiera

  /**
   * El reloj cuenta SIEMPRE al encuentro, nunca al cierre de convocatoria.
   *
   * Contó al plazo de ponencias hasta el 7 de septiembre, con el argumento de
   * que era lo accionable. El argumento que lo tumba es mejor: el sitio de la
   * Licenciatura anuncia el mismo encuentro con su propio reloj, y quien abra
   * los dos vería dos números distintos sin manera de saber que cuentan cosas
   * distintas — concluiría que uno está mal. Dos relojes del mismo evento tienen
   * que decir lo mismo.
   *
   * El plazo no se pierde: baja a una línea de texto, y desaparece sola cuando
   * vence.
   */
  const cierre = momento(destacado.cierreConvocatoria, true);
  const plazoVivo = cierre !== null && cierre <= inicio && ahora < cierre;

  const objetivo = ahora < inicio ? inicio : null;
  /**
   * Los segundos del HTML estático nacen viejos: entre que se construye la
   * página y alguien la abre pasan horas o días. No importa —el script los
   * corrige en el primer frame—, y sirven para lo que están: reservar el sitio
   * exacto para que nada se mueva cuando lleguen los valores buenos.
   */
  const unidades = objetivo === null ? [] : cuenta(ahora, objetivo);

  return {
    fase: objetivo === null ? 'encurso' : 'evento',
    /** Ojo con el nombre: `rotuloEvento` es la categoría del encuentro y
     *  `rotulo`, más abajo, el del reloj. Se llamaban igual y el segundo pisaba
     *  al primero en silencio, que es lo que hacen dos claves iguales en un
     *  objeto literal. */
    rotuloEvento: destacado.rotulo ?? '',
    ilustracion: destacado.ilustracion ?? '',
    subtitulo: destacado.subtitulo ?? '',
    /** Sin hoja publicada no hay fila: las listas no tienen respaldo en el
     *  código (§8.5), y tres encuentros inventados serían peor que ninguno. */
    programa: ext.foroPrograma ?? [],
    titulo: destacado.titulo,
    fecha: rangoDeFechas(destacado.fechaInicio, destacado.fechaFin),
    fechaISO: destacado.fechaInicio,
    fechasPorConfirmar: !destacado.fechasConfirmadas,
    lugar: destacado.lugar,
    modalidad: destacado.modalidad,
    rotulo: T('convocatoria_rotulo_evento', 'Faltan para el encuentro'),
    enCurso: T('convocatoria_en_curso', 'El encuentro se está realizando'),
    unidades,
    /** Lo que el cliente necesita para corregirse y para apagarse solo. */
    objetivoISO: objetivo === null ? '' : new Date(objetivo).toISOString(),
    finISO: new Date(fin).toISOString(),
    /** El plazo de ponencias, como dato y no como cuenta atrás. Cae solo el día
     *  que vence: no hay que acordarse de retirarlo. */
    plazo: plazoVivo && destacado.cierreConvocatoria
      ? `${T('convocatoria_plazo', 'Ponencias y talleres, hasta el')} ${rangoDeFechas(destacado.cierreConvocatoria.slice(0, 10))}`
      : '',
    inscripcion: destacado.enlace
      ? { texto: T('convocatoria_boton', 'Inscribirse al encuentro'), url: destacado.enlace }
      : null,
    agenda: destacado.enlaceAgenda
      ? { texto: T('convocatoria_boton_agenda', 'Ver la agenda'), url: destacado.enlaceAgenda }
      : null,
  };
})();

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

/**
 * Navegación — anclas de la portada. El XV Foro tendrá página propia (D52).
 *
 * Se DERIVA de lo que está publicado (D60): una sección apagada en la hoja
 * `estructura` desaparece del menú sin que nadie tenga que acordarse de
 * quitarla, que es la forma en que un menú termina apuntando al vacío. Como el
 * pie repite esta misma lista, se corrige con ella.
 *
 * El rótulo sale de `rotulo_menu` en la hoja; el de aquí es el respaldo. Por eso
 * el menú puede decir «Sobre nosotros» sobre la sección de Historia sin tocar
 * código: es una decisión de cómo se presenta la red, no del programa.
 */
const ANCLAS = [
  { id: 'red', ancla: '#red', base: 'La red' },
  { id: 'historia', ancla: '#historia', base: 'Historia' },
  { id: 'lineas', ancla: '#lineas', base: 'Líneas de trabajo' },
  /** «Eventos» y no «XV Foro»: el rótulo de la navegación nombra la sección, no
   *  la edición que hay en cartel. Con el XV Foro pasado habría que editar el
   *  menú; con «Eventos», no. */
  { id: 'foro', ancla: '#foro', base: 'Eventos' },
  { id: 'nodos', ancla: '#nodos', base: 'Nodos' },
  { id: 'contacto', ancla: '#contacto', base: 'Contacto' },
];

export const navegacion = ANCLAS
  .filter((n) => visible(n.id))
  .map((n) => ({ texto: rotuloMenu(n.id) || n.base, ancla: n.ancla }));
