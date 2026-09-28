/**
 * INSCRIPCIONES — los dos mensajes que la red pidió publicar tal cual (D62).
 *
 * ⚠️ **Texto literal.** El 28 de septiembre de 2026 RIBIE mandó por WhatsApp el
 * PDF `Mensajes para_queMaivyLoPubliqueEnlaPaginaWeb.pdf` con la instrucción
 * «hay que copiarlos, textualmente en cada botón». Lo de abajo es ese PDF
 * palabra por palabra, con sus negritas y sus hipervínculos —los de la lista de
 * medios también venían enlazados—. No se corrige nada aquí: si algo del
 * mensaje está mal, se le avisa a la red y es ella quien manda la versión nueva.
 *
 * Por qué vive en el repositorio y no en una hoja, contra la regla general del
 * sitio: dura una semana (el plazo cierra el 5 de octubre), trae listas con
 * enlaces que en una celda serían frágiles, y lo mantiene Renovatio. Se registra
 * como decisión y no como costumbre.
 *
 * Los fragmentos son HTML porque llevan negrita y enlaces en medio de la frase.
 * Los escribimos nosotros, no llegan de la hoja: por eso `set:html` es seguro.
 */

export interface Medio {
  texto: string;
  url?: string;
}

/** La lista es idéntica en los dos mensajes, y así lo trae el PDF. Tres medios
 *  van sin enlace porque el PDF no los enlaza. */
const MEDIOS: Medio[] = [
  { texto: 'www.telepasto.tv', url: 'https://telepasto.tv/' },
  { texto: 'Facebook Telepasto Online', url: 'https://www.facebook.com/TelepastoOnline/?locale=es_LA' },
  { texto: 'Aplicación oficial de Telepasto', url: 'https://play.google.com/store/apps/details?id=appinventor.ai_temis67.telepasto&hl=es_CO' },
  { texto: 'Facebook Universidad de Nariño', url: 'https://www.facebook.com/p/Universidad-De-Nari%C3%B1o-100064390643371/?locale=es_LA' },
  { texto: 'Facebook Pasto Noticias', url: 'https://www.facebook.com/Pastonoticias/?locale=es_LA' },
  { texto: 'Facebook Viva la U', url: 'https://www.facebook.com/p/Viva-La-U-100076029725103/?locale=es_LA' },
  { texto: 'Facebook Udenar Periódico', url: 'https://www.facebook.com/udenarperiodico/?locale=es_LA' },
  { texto: 'YouTube Telepasto', url: 'https://www.youtube.com/user/TELEPASTO' },
  { texto: 'Sistemas palacios' },
  { texto: 'Intercom de Nariño S.A.S.' },
  { texto: 'Cable operadores como Claro - Canal 930.' },
];

const YOUTUBE_MAESTRIA = 'https://www.youtube.com/channel/UCdj8fnlLfPDbcT5uDfn1bOw';
const YOUTUBE_GRUPO = 'https://www.youtube.com/@GrupoAEV-Inform%C3%A1tica';

const ASIMISMO =
  `Asimismo, el evento será transmitido a través del canal oficial de YouTube de la ` +
  `<a href="${YOUTUBE_MAESTRIA}">Maestría en TIC Aplicadas a la Educación</a> y del canal de YouTube del ` +
  `<a href="${YOUTUBE_GRUPO}">Grupo de investigación Ambientes Educativos Virtuales</a> de la Universidad de Nariño.`;

const PLAZO = 'Puedes registrarte a través del siguiente enlace (Hasta el día lunes 5 de octubre de 2026):';

export interface Mensaje {
  /** Ancla del panel: `ribie.org/#inscripcion-ribie` abre el mensaje directo,
   *  que es lo que se comparte por WhatsApp. */
  id: string;
  boton: string;
  antetitulo?: string;
  titulo: string;
  /** Lo que va antes del enlace al formulario. */
  antes: string[];
  formulario: string;
  /** Frase que introduce la lista de medios; cambia de un mensaje al otro. */
  introMedios: string;
  medios: Medio[];
  despues: string[];
  /** Bloque final con su propio encabezado (solo el segundo mensaje). */
  anexo?: { titulo: string; texto: string };
}

export const inscripciones: Mensaje[] = [
  {
    id: 'inscripcion-ribie',
    boton: 'Inscripción para los integrantes de Ribie y comunidad académica en general',
    titulo: 'INSCRIPCIONES PARA LA PARTICIPACIÓN VIRTUAL EN EL SEMINARIO Y FORO INTERNACIONAL APRENDIZAJE HUMANO, PEDAGOGÍA E INTELIGENCIA ARTIFICIAL (IA).',
    antes: [
      'Querida comunidad:',
      '¡Bienvenidos al Seminario y Foro Internacional “Aprendizaje Humano, Pedagogía e Inteligencia Artificial”!',
      'Nuestro evento se realizará los días 6 y 7 de octubre de 2026 y es organizado por la Maestría en TIC Aplicadas a la Educación, el Programa de Licenciatura en Informática, el Grupo de Investigación Ambientes Educativos Virtuales y la Red Iberoamericana de Informática Educativa (RIBIE).',
      'La INSCRIPCIÓN VIRTUAL a las jornadas del martes 6 y miércoles 7 de octubre es gratuita y permitirá gestionar adecuadamente tu certificado.',
      `<strong>${PLAZO}</strong>`,
    ],
    formulario: 'https://forms.gle/Q5nodsGrxSrTfDgG9',
    introMedios: 'La realización de estas actividades podrán seguirse a través del canal de televisión Telepasto y sus diferentes medios de comunicación:',
    medios: MEDIOS,
    despues: [ASIMISMO],
  },
  {
    id: 'inscripcion-udenar',
    /* El PDF cierra este rótulo con punto y el del primero no; en un botón el
       punto final sobra, y se quita para que los dos se lean igual. */
    boton: 'Inscripción para los estudiantes y profesores del programa de Licenciatura en Informática y la comunidad universitaria de la Universidad de Nariño',
    antetitulo: 'Martes 6 de octubre (Jornadas mañana y tarde)',
    titulo: 'INSCRIPCIONES PARA LA PARTICIPACIÓN VIRTUAL EN EL SEMINARIO Y FORO INTERNACIONAL APRENDIZAJE HUMANO, PEDAGOGÍA E INTELIGENCIA ARTIFICIAL (IA)',
    antes: [
      'Querida comunidad universitaria de la Universidad de Nariño:',
      'Agradecemos profundamente el interés por participar en el Seminario y Foro Internacional Aprendizaje Humano, Pedagogía e Inteligencia Artificial, que se realizará los días 6 y 7 de octubre de 2026, en Pasto, Nariño, Colombia.',
      'Les informamos que, debido a la capacidad máxima del Auditorio del Hotel Don Saúl, se han completado los 200 cupos disponibles para la asistencia presencial del martes 6 de octubre de 2026, tanto en la jornada de la mañana como en la de la tarde.',
      'Por esta razón, quienes no hayan alcanzado un cupo presencial <strong>podrán participar de manera virtual,</strong> sin ningún costo en las actividades programadas en las jornadas de la mañana y tarde para el día martes 6 de octubre y del día miércoles 7 de octubre de 2026.',
      `<strong>${PLAZO}</strong>`,
    ],
    formulario: 'https://forms.gle/pGcj3LixsGg2LQFaA',
    introMedios: 'Estas actividades podrán seguirse a través de Telepasto y sus diferentes medios de comunicación:',
    medios: MEDIOS,
    despues: [ASIMISMO],
    anexo: {
      titulo: 'INSCRIPCIONES PARA PARTICIPAR EN ACTIVIDADES PRESENCIALES - MIÉRCOLES 7 DE OCTUBRE DE 2026',
      texto: 'El enlace para realizar las inscripciones a las actividades programadas para las jornadas de la mañana y de la tarde del miércoles 7 de octubre será habilitado próximamente a través de esta página.',
    },
  },
];
