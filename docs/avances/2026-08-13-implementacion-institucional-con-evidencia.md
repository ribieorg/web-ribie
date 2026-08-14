# 13 ago 2026 — La dirección `institucional con evidencia`, implementada

_Decisión **D55** del `00_SDD-ADDENDUM`. Ejecuta **D51, D52, D53 y D54**, propuestas el 12 de agosto._
_Sistema de diseño: `docs/DESIGN.md` §14 (que deja de ser propuesta)._

---

## 1. Bajo qué autorización se implementó

El tablero del 12 de agosto decía *"no se toca código hasta que respondan"*. **RIBIE dio libertad de
proceder**, así que la implementación arrancó al día siguiente sin esperar una aprobación formal del
brief.

⚠️ **Esa autorización no está archivada.** El último documento en `01_convenio/correos/` es del 28 de
julio. Mientras no exista la constancia —correo, captura del WhatsApp o acta—, la regla
`[[administracion-contratos-po]]` la trata como **acuerdo verbal no documentado**: el trabajo está hecho
y validado técnicamente, pero no hay papel que lo respalde si mañana se discute. Es el mismo tipo de cabo
suelto que la visibilidad del Anexo C (**D47**), y se cierra igual: pidiéndolo por escrito.

**Nada de esto está publicado.** `origin/main` sigue en el commit del 11 de agosto: **producción muestra
la dirección vieja**, la del azul del Alan Turing Institute. El trabajo vive en la rama `rediseno`, tres
commits por delante de `main` local, que a su vez va dos por delante del remoto.

---

## 2. Qué se implementó

La maqueta del paquete de diseño se portó al sitio, y con ella **el contenido que vivía escrito en el
código**: cifras, hitos, líneas de trabajo y archivo fotográfico pasaron a hojas. El recuento del cambio:

```
59 archivos · +2 602 / −4 015 líneas
```

Es un rediseño que **quita más de lo que pone**, que era el diagnóstico: sale la paleta ajena al manual
—incluido `#2B2BF5`, el azul corporativo del Turing—, salen el corte diagonal y el negro como
estructura, y vuelve el turquesa `#096D84` de la casa. Los ocho secundarios del manual se usan **como
bloque con tinta oscura**, que es el uso en el que sí pasan: **4,68–7,01:1**.

**Componentes retirados:** `Actualidad`, `Proyectos` (D52), `EventCard`, `FeatureGrid`, `LogoWall`,
`MuroColaboradores`, `Seccion`, `StatRow`, `AvisoContenido`, `ListaPendiente`, `Marca`, `Rayado`,
`NodeTexture`, `RetroDither` y la librería `canvasui` completa (**−748 líneas**, el Canvas UI de **D46**
que llevaba sin uso desde D48).

**Componentes nuevos:** `Encabezado`, `QuienesSomos`, `LineaTiempo`, `LineasTrabajo`, `MapaNodos`,
`ArchivoMemoria`, `Foro`, `Contacto`, `Duo`, `Chip`.

**Diez fotografías reales** de RIBIE entran al repositorio en `src/assets/fotos/`, con nombre descriptivo
y rótulo por dato — no como fondo decorativo.

---

## 3. El contrato de contenido: son **nueve** hojas, no ocho

**D54 contó mal.** Dijo *"de 5 a 8 hojas"*, y la implementación arroja **nueve**:

| Vigentes (5) | Nuevas (4) |
|---|---|
| `textos` · `eventos` · `nodos` · `colaboradores` · `redes` | `cifras` · `hitos` · `lineas` · `memoria` |

El origen del error es aritmético: el contrato anterior declaraba **siete** claves (las cinco publicadas
más `noticias` y `proyectos`, que nunca se llenaron). Retirar dos y añadir cuatro sobre las cinco reales
da nueve, no ocho. Lo demás de D54 se sostiene: `cifra_*` sale de `textos`, `eventos` gana
`fechas_confirmadas` y el estado del dato pasa a la celda.

🔴 **Las cuatro hojas nuevas no existen todavía en el cuaderno del Drive.** Sus URLs están vacías en
`scripts/hojas.config.mjs`, y mientras lo estén esas secciones **caen al contenido por defecto de
`contenido.ts`** en vez de romper. Para poder desarrollar contra el contrato antes de que RIBIE publique
las pestañas se añadió un **modo local**:

```
HOJAS_LOCALES=1 pnpm sync    # lee scripts/hojas-locales/*.csv en vez de la red
```

No es un segundo origen de verdad: **en cuanto la URL esté puesta, manda la hoja**. Los nueve CSV de
partida están en `scripts/hojas-locales/` y son exactamente lo que hay que subir.

**Guardas que añade el sync:** `ESQUEMA` declara las columnas obligatorias por hoja y, si falta alguna,
avisa y **no publica esa hoja** en vez de emitir un sitio a medias. `fechas_confirmadas` es obligatoria a
propósito — sin esa columna, un rango sin validar se publicaría como firme, que es justo el riesgo vivo
del XV Foro. Y `lineas.color_manual` solo acepta uno de los ocho secundarios del manual: cualquier otro
valor se descarta y el bloque cae al turquesa. **Así fue como el sitio terminó usando el azul del
Turing**, y ahora el dato no puede volver a hacerlo.

---

## 4. Tres defectos que solo aparecieron al medir el DOM renderizado

Ninguno se ve en desarrollo. Los tres se cazaron inspeccionando el build, no mirando la pantalla.

**El minificador se comía la animación del recorrido histórico.** Escritas `animation:` y
`animation-timeline` como atajo, el minificador las fusionó y dejó una sola declaración
`animation-range` en el build: la tira no se movía. En `pnpm dev` funcionaba perfectamente. Reescrito con
*longhands*.

**El reveal dejaba media portada en blanco.** Apagaba la opacidad esperando que el rango `entry` la
encendiera, y ese rango **no llega a ejecutarse** cuando el viewport es más alto que el documento, al
imprimir o en una captura de página completa. Ahora la animación **solo mueve `transform`**: si nada se
ejecuta, el contenido se ve igual, quieto.

**La ficha del mapa se pintaba dos veces.** La regla que la apaga en reposo se escribió con `:global()`
dentro de `:has()`, y el compilador **la descartó sin emitir aviso**: al pasar el cursor aparecían dos
fichas superpuestas. El CSS del mapa se genera ahora calificado por `id`, sin depender del *scoping*.

El patrón es el mismo de las tres jornadas anteriores, movido de sitio: antes el color se elegía mirando
en vez de calculando; ahora **el CSS se daba por bueno en desarrollo en vez de verificarse en el build**.

---

## 5. Móvil: dos correcciones sobre la maqueta portada

**El recorrido histórico avanza con el scroll también en móvil.** La media query desactivaba la animación
y dejaba en su lugar una tira con barra de desplazamiento propia: obliga a un gesto lateral que nadie
hace en una página que se lee hacia abajo, y rompe la única idea de la sección —que el tiempo avanza
mientras uno avanza—. El mecanismo pasa a ser el mismo en todos los tamaños; lo que cambia es el tamaño
de las piezas.

- **`100svh` en vez de `100vh`** en el bloque fijo: en móvil la barra del navegador aparece y desaparece
  al desplazarse, y con `vh` el último renglón del hito queda siempre cortado.
- Hitos al 82vw, texto menor y fotografía a 2/1 para que el hito entero quepa. Medido: el más alto ocupa
  **509 px de 845**.
- Sin escalonado vertical donde solo cabe un hito por pantalla; sin fotografía por debajo de 640 px de
  alto (móvil apaisado).
- La indicación *«desliza»* queda solo para los dos casos en que de verdad hay que deslizar a mano: sin
  soporte de `animation-timeline` y con movimiento reducido.

**Vuelve el menú hamburguesa, resuelto con `<details>/<summary>`.** La maqueta lo había sustituido por un
enlace al índice del pie. El elemento nativo trae el botón accesible, el estado expandido y el manejo de
teclado sin código, y **abre y cierra aunque el JavaScript no llegue a ejecutarse**. El script propio son
**218 bytes** que Astro inlinea en el HTML —sin petición extra— y solo hacen lo que el nativo no: cerrar
el panel al elegir destino (si no, tapa la sección a la que se acaba de saltar) y al pasar a escritorio.

> ⚠️ El panel hay que ocultarlo explícitamente con `:not([open])`. El ocultado nativo de `<details>` actúa
> sobre el flujo normal, y este panel va en `absolute` para no empujar la página al abrirse: se le
> escapaba y quedaba visible con el menú cerrado.

Las tres rayas y la X son un `<span>` con dos pseudoelementos —sin SVG ni fuente de iconos— y el estado
sale de `[open]`, no de una clase que haya que sincronizar.

---

## 6. Verificación

Medido en el navegador sobre el DOM renderizado, no a ojo:

| Qué | Resultado |
|---|---|
| Contraste de **cada nodo de texto** contra su fondo efectivo | **0 fallos** en escritorio y en 390 px |
| Anillo de foco | **5,95:1** en claro · **3,57:1** sobre las bandas oscuras |
| Menú móvil abierto | enlaces **10,31:1** · rótulo **8,88:1** · objetivo táctil **44 px** |
| JavaScript de terceros | **0 KB** · 0 peticiones a terceros |
| Peso por visita | **682 KB** |
| Recorrido histórico | verificado a 390×845 y 1440×901; la pista recorre de 0 a −1121 y −1066 |

Los **cuatro defectos de contraste que `DESIGN.md` §14 exigía corregir antes de implementar** quedan
corregidos: la tinta de los bloques de color pasa a `#111827`, el anillo de foco ámbar sube de 2,49:1 a
5,95:1, y `--turquesa-claro` y `--state-info` dejan de usarse como texto normal.

**Build de hoy (14 ago), reproducido para este avance:** compila sin errores, **1 página**, `dist/` sin
un solo archivo `.js` — el único `<script>` del HTML es el módulo inline del menú.

---

## 7. Lo que NO quedó hecho

1. 🔴 **El sitio no está publicado.** Producción sigue en la versión del 11 de agosto. Nada de esto se ve
   en `ribie.org`.
2. 🔴 **Las cuatro hojas nuevas no están en el Drive**, así que el contenido nuevo hoy solo existe en los
   CSV locales del repositorio.
3. 🔴 **La página propia del XV Foro (D52) no existe**: el build emite **una sola página**. El Foro está
   como sección, no como ruta. D52 queda **implementada a medias**.
4. ⚠️ **La constancia escrita de la autorización de RIBIE** (§1).
5. ⚠️ **Las fechas del XV Foro (5–7 oct 2026)** siguen publicadas en vivo sin validación de la red. El
   sistema para marcarlas ya existe —la columna `fechas_confirmadas`—, pero mientras la hoja no se
   actualice, **producción las sigue mostrando como firmes**.
