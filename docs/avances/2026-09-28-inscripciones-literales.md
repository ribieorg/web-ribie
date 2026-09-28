# 28 sep 2026 — Dos botones de inscripción con el texto literal de la red (D62)

**Origen:** WhatsApp de RIBIE del 28 sep (12:37–12:39), con el PDF
`Mensajes para_queMaivyLoPubliqueEnlaPaginaWeb.pdf`: *«hay que copiarlos, textualmente en cada boton»*.
Registro en el repo documental: `00_BITACORA` (entrada del 28 sep) y `00_SDD-ADDENDUM` **D62**.

## Qué cambia

- La franja (`Convocatoria.astro`) pierde el botón «Inscribirse al encuentro», que llevaba a
  `eventos.enlace`: el formulario **presencial** del martes 6, **lleno** (200 cupos).
- Entra `Inscripciones.astro` en la tercera fila de la retícula de la franja: dos botones ámbar, cada uno
  con el rótulo que dio la red, que abren un `<dialog>` con el mensaje completo.
- El texto vive en `src/data/inscripciones.ts`, copiado del PDF con sus negritas y sus hipervínculos.
- `contenido.ts` deja de armar `convocatoria.inscripcion`.

## Cómo se llega al mensaje

| Camino | Mecanismo |
|---|---|
| Pulsar el botón | `showModal()`; Esc, clic fuera (`closedby="any"` + respaldo en JS) y la ✕ cierran; el foco vuelve al botón |
| Enlace compartido | `ribie.org/#inscripcion-ribie` · `ribie.org/#inscripcion-udenar` abren el panel al cargar |
| Sin JavaScript | el botón es `<a href="#…">` y el panel se pinta en línea por `:target` |

## Defectos encontrados en la verificación

1. **El panel se pegaba a la esquina.** El reset de `global.css` pone `margin: 0` y le quita al `<dialog>`
   el `margin: auto` que lo centra. Se declara en `.panel`.
2. **La lista de medios salía sin viñetas** (el reset quita `list-style`); el PDF sí las trae.
3. **Al cerrar, el panel reaparecía en línea.** `history.replaceState` limpia el ancla de la URL, pero
   **no actualiza `:target`**, así que la regla sin script seguía aplicando. La regla queda condicionada a
   `.inscripciones:not(.con-script)`, y el script pone la clase al arrancar.
4. **Anillo de foco turquesa sobre turquesa** en los botones: la regla `.convocatoria :focus-visible`
   tiene ámbito de `Convocatoria.astro` y no alcanza al componente hijo.

## Verificación

- Cotejo automático del HTML construido contra `pdftotext` del PDF (espacios normalizados): **cuerpo
  idéntico en los dos mensajes**. El rótulo del botón 2 difiere solo por el punto final, quitado a propósito.
- Enlaces: los 11 de cada panel están en las anotaciones `/URI` del PDF, sin que sobre ni falte ninguno.
- 1440 px y 390 px: sin desbordamiento horizontal; en móvil los botones van apilados bajo el reloj.

## Abierto

- 🔴 Sede: el PDF dice **Hotel Don Saúl** para el martes 6; `eventos.lugar` dice Hotel Cuellar. Se le
  pregunta a la red; no se corrige solo.
- ⏰ Tercer enlace: la inscripción presencial del miércoles 7 llegará después. Se añade como tercer mensaje
  en `inscripciones.ts`, o dentro del anexo del segundo, según lo que mande la red.
- La franja entera caduca el 7 de octubre (D58); los botones se van con ella. No caducan el 5, que es el
  cierre del plazo, porque el mensaje lo dice y nadie pidió retirarlos antes.
