# La franja del encuentro y el despliegue que llevaba tres semanas sin ocurrir

_7 de septiembre de 2026 · decisiones **D58** y **D59**_

## Lo que se construyó

Una franja que corona la portada mientras el encuentro está vivo, con cuenta atrás de dos fases, la
ilustración del evento y los tres seminarios que se celebran juntos. Sistema en `DESIGN.md` **§17**.

- `src/components/Convocatoria.astro` — nuevo
- `src/data/contenido.ts` — `export const convocatoria`, con las fases calculadas en el build
- `scripts/sync-contenido.mjs` — seis campos nuevos en `eventos` y la hoja `foro_programa`
- `scripts/hojas.config.mjs` — hoja `foro_programa` y su esquema
- `src/styles/global.css` — `.boton:active { transform: scale(.97) }`
- `src/pages/index.astro` — la franja va antes del hero

## 🔴 El hallazgo que apareció de paso: el sitio llevaba 22 días congelado

Al ir a publicar una corrección de fechas se descubrió que **`ribie.org` servía el build del 16 de
agosto**. No era un retraso del cron: el cron corría y commiteaba bien —cinco commits entre el 20 de
agosto y el 6 de septiembre—, pero **ninguno disparó el despliegue**.

**La causa:** `contenido.yml` hace `git push` autenticado con el `GITHUB_TOKEN` de Actions, y GitHub
**bloquea deliberadamente** que un push hecho con ese token active otros workflows. Es la protección
contra bucles recursivos. El comentario del propio archivo afirmaba lo contrario:

> *"Ese push dispara el despliegue (deploy.yml), así que el sitio se reconstruye sin pasos extra."*

Es el mismo patrón de **D56**: un pipeline que reporta `success` y no hace lo que dice. Allá Jekyll
fallaba y el sitio se sostenía por carambola; aquí el sync triunfa y el despliegue nunca ocurre.

**Alcance del daño, medido y no estimado:** comparado el `contenido.json` desplegado contra el actual,
de las nueve hojas **solo `eventos` difería**. Los commits de agosto no movieron datos visibles. No se
perdieron tres semanas de contenido; lo que estaba roto era el mecanismo, sin que nadie lo supiera.

**Lo que sí es serio:** el sistema de autonomía de contenido —**D39** y **D54**, la razón entera por la
que el contenido vive en hojas— existe para que el grupo de la UdeNar mantenga el sitio sin nosotros.
**Nunca funcionó de extremo a extremo.** El día que ellos hubieran empezado a cargar filas no se habría
publicado nada, y el síntoma habría sido *"el sistema no sirve"*.

**Arreglo pendiente:** una línea al final de `contenido.yml` que invoque `gh workflow run deploy.yml`
tras el commit. `deploy.yml` ya tiene `workflow_dispatch`, y disparar por API **sí** funciona con el
token por defecto — la restricción es solo para el evento `push`.

**Mientras tanto:** el 6 de septiembre se desplegó a mano (`gh workflow run deploy.yml`) y el sitio pasó
a servir las fechas corregidas del encuentro.

## Segundo hallazgo: el cron no corre cada hora

`contenido.yml` declara `cron: '0 * * * *'`. Sus corridas reales del 6 de septiembre (UTC): 00:33,
22:44, 20:58, 18:46, 16:36, 13:51 — **cada dos horas y con retrasos de hasta cuarenta minutos**. Los
workflows programados de GitHub son *best effort* y con carga alta se retrasan o se descartan.

**Consecuencia práctica:** cuando se carga algo con plazo encima, no se espera al cron. Se dispara a
mano desde Actions.

## Contenido: seis columnas y una hoja nueva

En `eventos`: `cierre_convocatoria`, `enlace_agenda`, `correo_ponencias`, `rotulo`, `subtitulo` e
`ilustracion`. Todas **opcionales** —no entran en el `ESQUEMA`—, así que un evento sin ellas se publica
igual y solo pierde esa parte de la franja.

`cierre_convocatoria` se escribe **con hora y zona**: `2026-09-17T23:59:00-05:00`. Sin la zona, cada
visitante contaría contra su propia medianoche y el plazo dejaría de ser uno solo.

Hoja nueva **`foro_programa`** (3 filas): los tres encuentros. Va como hoja y no como columnas porque es
una lista — añadir un cuarto encuentro no puede exigir tocar código.

## Medido

- `dist/index.html`: **53 464 → 60 570 bytes**
- Ilustración: cinco tamaños de **21 KB a 86 KB**, servidos por `widths` + `sizes`
- JS de terceros: **0** (el script del reloj es propio e `is:inline`, como el del menú)
- Seis pares de contraste sobre `--brand-deep`, **todos pasan** (el más justo, 3,09:1 sobre 3,0)
- Verificado en 1440 px y en 390 px, sin desbordamiento horizontal

## Lo que quedó abierto

1. **El arreglo de `contenido.yml`** — sin él, ningún cambio de las hojas llega solo a producción.
2. **Tres cifras equivocadas en `tokens.css`** — ninguna causa defecto, pero es la tabla que se consulta.
3. **`pnpm/action-setup@v4` apunta a Node 20**, ya deprecado en los runners. Material de
   `MATRIZ-CAMBIOS-FONDO.md`.
4. **La frase del plazo en `eventos.descripcion`** no caduca sola: hay que borrarla el 18 de septiembre.
