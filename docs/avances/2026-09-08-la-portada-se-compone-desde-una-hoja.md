# La portada se compone desde una hoja

_8 de septiembre de 2026 · decisión **D60**_

## Lo que pidió RIBIE

Dejar publicado **solo el banner del encuentro** y una entrada de menú, «Sobre nosotros», con una
presentación breve de la red. Todo lo demás, oculto. El pie se queda.

## Lo que se construyó

Una hoja nueva, **`estructura`**, con una fila por sección de la portada:

| seccion | nombre | mostrar | rotulo_menu |
|---|---|---|---|
| `convocatoria` | Franja del encuentro | sí | — |
| `hero` | Presentación de la portada | no | — |
| `red` | Quiénes somos | **sí** | **Sobre Nosotros** |
| `historia` | Historia | no | — |
| `lineas` · `foro` · `memoria` · `nodos` · `contacto` | | no | |

- `scripts/hojas.config.mjs` — la hoja, su esquema (`seccion`, `mostrar`) y `SECCIONES`
- `scripts/sync-contenido.mjs` — transformación, validación y avisos
- `src/data/contenido.ts` — `visible()`, `llevaH1()` y la navegación derivada
- `src/pages/index.astro` — cada sección tras su condición
- `src/components/Convocatoria.astro`, `Encabezado.astro`, `LineaTiempo.astro`, `QuienesSomos.astro` — el `h1`
- `scripts/hojas-locales/estructura.csv` — para `pnpm sync:local`

### Por qué hoja propia y no una columna `oculto`

La propuesta inicial fueron filas `mostrar_*` en `textos`. La descartó el propio contrato de datos: **la
sección no es una fila en ninguna hoja**. `textos` son 25 pares clave/valor, y en las otras nueve la fila es
un hito, una línea, un nodo —ocultar esos de a uno ya lo hace la columna `estado` con `borrador`—. Una
columna `oculto` no tendría a qué aplicarse. Mismo argumento que llevó `foro_programa` a hoja propia (D58):
si la entidad es una lista, es una hoja.

Ventaja añadida: no se toca ninguna de las nueve hojas existentes, y por tanto **no hay que republicar
ninguna pestaña** — que es lo que el 14 de agosto cambió los `gid` y tumbó cinco URLs a la vez.

### La regla de fallo va al revés que en el resto, y es deliberado

La §8.5 del `DESIGN.md` dice que sin contenido la sección no existe. Aquí, **sin hoja todas las secciones
existen**. `estructura` es configuración, no contenido: aplicarle la regla general convertiría un `HTTP 400`
en un sitio en blanco. Apagar solo puede ser el resultado de que alguien escriba `no`; ni la red, ni una
errata, ni una fila borrada apagan nada. Una celda `mostrar` con un valor que no es sí/no **publica** la
sección y avisa.

### El menú se deriva, no se mantiene

`navegacion` se calcula desde las secciones visibles y su `rotulo_menu`. Una sección apagada desaparece del
menú —y del pie, que repetía la misma lista— sin que nadie tenga que acordarse. Por eso el rótulo «Sobre
nosotros» sobre la sección «Quiénes somos» es un dato de la hoja y no un cambio de código.

## 🔴 El defecto que introducía el apagado: la portada se quedaba sin `<h1>`

El único `<h1>` del sitio vivía en el hero, y la franja del encuentro declara en su cabecera que no lleva
encabezado **porque el hero va justo debajo**. Ese supuesto caducó en cuanto el hero se pudo apagar desde
una hoja: la portada abría en `h2`, que rompe la navegación por encabezados de un lector de pantalla.

Resuelto con `llevaH1()`: el `h1` viaja al primer bloque publicado —hero, luego franja, luego la primera
sección—. La etiqueta cambia; el estilo va por clase, así que **no cambia nada de lo que se ve**.

Es la tercera vez en este proyecto que muerde un supuesto correcto en su día: Pages en modo *legacy* (D56),
el push con `GITHUB_TOKEN` (D59) y ahora el `h1` del hero. Los tres estaban escritos y los tres eran
ciertos cuando se escribieron.

## Un defecto preexistente que salió de paso

El sync imprimía en cada corrida `✕ "foroPrograma" ya no está en el contrato de hojas`. La limpieza compara
la clave del contenido (`foroPrograma`) contra el nombre de la hoja (`foro_programa`), y son las únicas dos
que no coinciden. Hoy no se notaba porque la salida la repone acto seguido; **el día que esa hoja fallara,
se habría borrado el contenido de ayer** — justo lo que el merge existe para impedir. Corregido con un mapa
`HOJA_DE`.

## Medido

- `dist/index.html`: **60 570 → 15 795 bytes** (−74 %)
- Encabezados: `h1` (título del encuentro) → `h2` (Quiénes somos). Jerarquía correcta, un solo `h1`
- Menú de escritorio, móvil y pie: **una entrada**, derivada
- **Cero anclas muertas** (`a[href^="#"]` comprobados contra el DOM)
- Sin desbordamiento horizontal en **1756 px** ni en **390 px**
- JS de terceros: **0**

## Lo que queda abierto

1. ⏰ **El 8 de octubre.** La franja se apaga sola cuando el encuentro pasa (D58) y el resto está en `no`:
   ese día la portada se queda con «Quiénes somos» y el pie. Se resuelve con una celda, pero **hay que
   acordarse**. La caducidad automática y el apagado manual se suman, y nadie los pensó juntos.
2. **Las cuatro cifras de la red** (`1990` · `21 países` · `+15` · `36 años`) no se ven: su hoja está
   cargada, pero la cinta que las pinta vive dentro del hero, que está apagado. Medido: 15 líneas de
   marcado y 35 de CSS, autocontenidas — sacarlas a un `Cifras.astro` reutilizable es cuestión de minutos.
3. **Sin constancia escrita de RIBIE** para este cambio, que retira contenido ya público. Se suma a la
   autorización verbal del rediseño de agosto, pendiente de archivar desde el 13 de agosto.
4. La franja gris de «sitio en preparación» sigue encendida desde `textos.mostrar_franja_preparacion`. Con
   la portada reducida, conviene revisar si sigue diciendo algo cierto.
