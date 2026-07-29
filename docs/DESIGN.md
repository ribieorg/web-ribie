# DESIGN.md — Landing institucional de RIBIE

_Sistema de diseño canónico de `ribie.org`. Decidido el **24 de julio de 2026** con el protocolo
`design-protocol`. Toda decisión visual del sitio se justifica contra este documento._

**Proyecto:** landing informativa de la Red Iberoamericana de Informática Educativa
**Entrega:** 28 de julio de 2026 · sitio estático en GitHub Pages · una sola página con anclas
**Fuente de marca:** `../../material-grafico/OneDrive_1_23-7-2026/Manual de uso.pdf` (5 páginas)
**Referencias:** `../../../99_referencias/imagen_1.jpeg` e `imagen_2.jpeg` (mockups aportados por RIBIE)

---

## 1. Atmósfera

> ⚠️ **Superado por SDD-ADDENDUM D43 (28 jul 2026) — ver §11.** El preset pasa a
> **`institucional filoso`**. Lo que sigue en esta sección se conserva porque su diagnóstico del mockup
> sigue vigente y porque la tipografía y la marca **no cambian**; lo que cambian son la **estructura** y
> la **paleta** (§11).

**Preset: `editorial-premium` con temple institucional.** Landing con narrativa, tipografía generosa,
imágenes grandes, restraint cromático. No es un dashboard ni un sitio comercial: es la carta de presentación
de una red académica con 36 años de trayectoria, y debe leerse **seria, contemporánea y con autoridad** —
nunca corporativa genérica ni "startup".

**Decisión de partida (24 jul):** los mockups de RIBIE definen la **arquitectura de secciones y los patrones
de marca**; la **ejecución se eleva**. Se conservan de ellos:

- **Título bicolor** — la última palabra del titular en teal o verde (`Investigadores *destacados*`). Es el
  patrón más reconocible del mockup y funciona: da jerarquía sin recurrir a más tamaño.
- **Bandas teal a sangre completa** para separar bloques narrativos.
- **Textura de red de nodos** en fondos, que rima con el isotipo.

Y se corrigen:

| Del mockup | En la landing |
|---|---|
| 4 carruseles en una página | **Máximo 1**, y solo si el contenido lo justifica |
| Todo dentro de card con sombra (*cardocalypse*) | Bandas, grids y separación por espacio |
| Stats `+25 / 18 / 150+` (template de métricas) | Cifras **reales**, tipografía grande, sin caja |
| Avatares stock en testimonios | Fotografía real o **la sección no existe** |
| "Iniciar sesión" / "Regístrate" | ❌ **Fuera de alcance** — enlaces al formulario que opera RIBIE |

## 2. Paleta

> ⚠️ **Superado por SDD-ADDENDUM D43 (28 jul 2026) — ver §11, "Paleta VIVA de bloques".** Se añaden
> siete colores saturados y la **regla de tinta sobre negro**. Los valores de esta sección siguen siendo
> los de la marca y **no se tocan**; lo que cambia es que dejan de ser los únicos. ⚠️ Y una inversión
> importante: sobre negro los secundarios **sí** sirven como texto, pero `--brand` **no** (3.53:1).

Base tomada del manual de marca. Valores en **OKLCH** (medidos, no estimados) y contraste verificado.

### Marca

| Token | Hex | OKLCH | Contraste s/ blanco | Uso |
|---|---|---|---|---|
| `--brand` | `#096D84` | `oklch(49.5% 0.088 219.7)` | **5.95:1** ✅ | Color institucional. Titulares, bandas, footer |
| `--brand-deep` | `#065163` | `oklch(40.3% 0.071 220.1)` | **8.88:1** ✅ | Texto sobre claro que necesita más peso; footer profundo |
| `--ink` | `#111827` | `oklch(21% 0.03 265)` | 16.9:1 ✅ | Texto principal |
| `--ink-soft` | `#4B5563` | `oklch(45% 0.02 265)` | 7.5:1 ✅ | Texto secundario |
| `--surface` | `#FFFFFF` | — | — | Fondo base |
| `--surface-alt` | `#F6F8F9` | — | — | Fondo de sección alterna (frío, no gris neutro) |

### Acento funcional — **ámbar**

| Token | Hex | OKLCH | Regla |
|---|---|---|---|
| `--accent` | `#E8901A` | `oklch(72.8% 0.156 65.9)` | **Solo fondo de botón y foco.** Nunca texto sobre blanco |
| `--accent-ink` | `#111827` | — | Texto **oscuro** sobre el ámbar → **7.59:1** ✅ |

> ⚠️ **Regla dura:** ámbar sobre blanco da **2.49:1** — reprueba WCAG para texto. El botón ámbar lleva
> **texto casi negro, nunca blanco** (el blanco sobre ámbar da 2.6:1 y es el error más común).
>
> **Por qué existe este color:** la paleta del manual es enteramente análoga (cian → verde) y **no contiene
> ningún color de acción**. El ámbar es el complementario del teal, ya aparece en los mockups que RIBIE vio,
> y se documenta como **extensión funcional del manual, no como cambio de marca**. Ocupa **≤5%** de la
> superficie.

### Secundarios del manual — decorativos

`#15A7B3` `#00AEEF` `#20A395` `#0BAAD1` `#2A9F78` `#4A941E` `#359B5A` `#3F983C`

> ⚠️ **Ninguno alcanza 4.5:1 sobre blanco** (van de 2.53 a 3.79). **Prohibido usarlos como color de texto
> sobre fondo claro.** Su lugar: el degradado del isotipo, la textura de nodos, iconografía decorativa,
> y fondos oscuros con texto claro encima. El verde `#4A941E` sí sirve para la **palabra destacada** de un
> título en tamaño ≥24px (texto grande: umbral 3:1 → 3.79 ✅).

### Reparto 60-30-10

60% superficies claras · 30% teal de marca · 10% verde del manual + ámbar de acción.

## 3. Tipografía

| Rol | Fuente | Pesos | Por qué |
|---|---|---|---|
| **Display / titulares** | **Oswald** | 400, 500, 600 | Sustituto libre de `Haettenschweiler` del manual (**D28**): condensada, misma voz, con familia de pesos completa — a diferencia de Anton o Fjalla One, que tienen uno solo |
| **Texto / interfaz** | **Onest** | 400, 500, 600 | Sans humanista de excelente legibilidad, ya adoptada por el estudio en SICAD e InspectFire. El contraste de ancho con Oswald (condensada vs normal) evita el error de parear dos sans casi idénticas |

**Ambas se auto-hospedan** (`woff2` en el repo). Nada de CDN de Google Fonts: es un sitio institucional
público y no hay razón para filtrar la IP de cada visitante a un tercero.

### Escala — fluida (`clamp()`), porque es landing y no app

```css
--text-hero:    clamp(2.75rem, 1.6rem + 5.2vw, 5.5rem);   /* Oswald 600, leading .95, tracking -.02em */
--text-h2:      clamp(2rem,   1.4rem + 2.6vw, 3.25rem);   /* Oswald 500, leading 1.05 */
--text-h3:      clamp(1.375rem, 1.2rem + .8vw, 1.75rem);  /* Oswald 500 */
--text-lead:    clamp(1.125rem, 1.05rem + .4vw, 1.375rem);/* Onest 400, leading 1.6 */
--text-body:    1.0625rem;                                 /* Onest 400, leading 1.7 — 17px */
--text-small:   0.9375rem;
--text-eyebrow: 0.8125rem;                                 /* Onest 600, tracking .12em, MAYÚSCULAS */
```

- **Body nunca baja de 16px** (aquí 17px: es un sitio de lectura, no una app densa).
- **All-caps solo en `eyebrow`**, jamás en párrafos.
- Oswald es condensada: en móvil **no** bajar de `leading 1.0` en titulares o se apelmaza.
- Medida de línea: **65–75 caracteres**. En pantallas grandes el párrafo no cruza la pantalla completa.

## 4. Espacio, radios y profundidad

**Grid 4pt:** `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.
Ritmo vertical entre secciones: `clamp(4rem, 8vw, 8rem)`. **El espacio es el separador principal**, no las
líneas ni las cajas.

**Radios:** `sm 6px` (chips) · `md 10px` (botones, inputs) · `lg 16px` (tarjetas) · `full` (píldoras).
Nada de `rounded-3xl`: infla y lee a plantilla.

**Profundidad — *whisper borders*, no sombras:**

```css
--ring:     0 0 0 1px oklch(49.5% 0.088 219.7 / 0.12);   /* borde teal casi invisible */
--lift:     0 1px 2px oklch(21% 0.03 265 / .04), 0 8px 24px oklch(21% 0.03 265 / .06);
```

`--lift` **solo** en elementos que se elevan de verdad (menú móvil abierto, tarjeta del evento destacado).
El resto se apoya en `--ring`. Esta es la corrección directa del *cardocalypse* del mockup.

## 5. Motion

Las cuatro preguntas de Emil antes de animar algo: ¿debería animarse? ¿qué propósito cumple? ¿el easing
corresponde al origen del movimiento? ¿la duración es la mínima que se percibe?

- **Duraciones:** `120ms` micro (hover, focus) · `220ms` estándar (entrada de sección) · `320ms` máximo.
- **Easing:** `cubic-bezier(.22,.61,.36,1)` (ease-out real). Sin springs: no hay gestos aquí.
- **Solo `transform` y `opacity`.** Nada de animar `height`, `top` o `box-shadow`.
- **Reveal al hacer scroll:** un único patrón — `opacity 0→1` + `translateY(12px→0)`, **una vez**, escalonado
  máximo 60ms entre hermanos. Nunca en cascada larga ni en cada elemento de una lista.
- `@media (prefers-reduced-motion: reduce)` → todo a `0.01ms`. Obligatorio, no opcional.

## 6. Componentes a construir

`Header` (fijo, compacta al scroll) · `Hero` (imagen + logo + tagline) · `SectionBand` (teal a sangre) ·
`StatRow` (cifras reales, sin caja) · `FeatureGrid` (objetivos, iconografía de línea) · `EventCard`
(XV Foro, destacado) · `LogoWall` (nodos y
organizaciones, escala de grises → color en hover) · `PeopleGrid` (colaboradores) · `SocialRow` ·
`Footer` (teal profundo) · `NodeTexture` (SVG de la red de nodos, decorativo, `aria-hidden`).

> ⚠️ **Fuera de esta versión (D37, 24 jul 2026):** el componente `MembershipTiers` y su sección. La membresía
> se aplaza hasta que RIBIE defina el formulario de vinculación, si tiene costo y qué obtiene el miembro.
> Cuando se retome, la sección encaja entre `EventCard` y `LogoWall` sin alterar el resto del sistema.

## 7. Do's

> ⚠️ **Ampliado por SDD-ADDENDUM D43 (28 jul 2026) — ver §11, "Do's y Don'ts que añade esta revisión".**
> Los seis puntos siguen vigentes; D43 añade tres más (el verde del manual como palabra destacada sobre
> negro, el bloque de color plano por encima de la tarjeta con borde, y romper la retícula cuando se pueda
> sin perder legibilidad). El punto **2** —*"donde va una foto, va una foto"*— quedó además matizado por
> **D48** (§12): donde no hay foto, va un **hueco declarado**, nunca una prestada.

1. **Una idea por banda.** Cada sección dice una cosa y da aire alrededor.
2. **Fotografía real y grande.** Donde va una foto, va una foto — nunca un bloque de color con un icono.
3. **Título bicolor** como recurso de jerarquía antes que subir el tamaño.
4. **Cifras reales o ninguna cifra.** Si no está verificado, no se publica.
5. **Contraste verificado**, no estimado: cualquier par nuevo se mide antes de usarse.
6. **El logo respira**: margen mínimo alrededor igual a la altura del isotipo (manual de marca).

## 8. Don'ts

> ⚠️ **Ampliado por SDD-ADDENDUM D43 (28 jul 2026) — ver §11.** D43 añade cuatro prohibiciones a esta
> lista: ni un `box-shadow` nuevo, nada de `--brand` como texto sobre negro (3,53:1), sin diagonales sobre
> texto o fotografía, y sin más de un ángulo de corte en todo el sitio.
>
> ⚠️ **El punto 5 estuvo superado por D44 durante unas horas del 28 jul 2026 y VUELVE A REGIR
> ÍNTEGRO desde SDD-ADDENDUM D48 (28 jul 2026) — ver §12.** La excepción de fotografía de stock
> cumplió su fecha de retiro el mismo día en que se abrió: las cinco imágenes de Pexels se borraron y
> cada hueco se declara ahora con `Rayado.astro`. El punto **7.2** (*"donde va una foto, va una foto"*)
> también recupera su vigencia, con un matiz que D48 añade: **donde no hay foto, hay un hueco declarado,
> no una foto prestada.**

1. ❌ **Nada dentro de una tarjeta "por si acaso"** — la caja se gana, no se asume.
2. ❌ **Ni un secundario del manual como color de texto sobre blanco** (§2).
3. ❌ **Texto blanco sobre el botón ámbar** (2.6:1). Siempre `--accent-ink`.
4. ❌ **Sin gradient text, sin glassmorphism, sin bordes con franja lateral de color.**
5. ❌ **Sin testimonios ni personas con fotos de stock.** Si no hay foto real, se cae la sección.
6. ❌ **Sin promesas fuera de alcance:** ni "Iniciar sesión", ni "Crea tu cuenta", ni descarga de
   certificados. Todo servicio se enlaza al que opera RIBIE.
7. ❌ **Sin emojis** en la interfaz.

## 9. Accesibilidad

- Contraste: **4.5:1** en texto, **3:1** en texto grande y componentes. Ya verificado en §2.
- Objetivos táctiles ≥ **44×44px**.
- Foco visible siempre: `outline: 2px solid var(--accent); outline-offset: 2px` — el ámbar tiene contraste
  suficiente **contra el blanco como no-texto** (3:1 no aplica a outline decorativo, pero se refuerza con
  `box-shadow` teal en fondos claros).
- Un solo `<h1>`; jerarquía de encabezados sin saltos.
- Idioma `lang="es"`. Toda imagen con `alt` descriptivo real; la textura de nodos `aria-hidden="true"`.
- El sitio debe ser legible y navegable **sin JavaScript**.

## 10. Stack y rendimiento

**Astro 7.1.3** (verificado el 24 jul 2026, no asumido de memoria) con **pnpm 11**, compilando a **HTML
estático** y publicado en **GitHub Pages** mediante la acción oficial. Decisión **D36**.

- **Cero JavaScript al cliente por defecto.** Astro aporta componentes reutilizables sin enviar framework al
  navegador. El único JS del sitio es el menú móvil y el reveal de scroll, escritos a mano.
  > ⚠️ **Estuvo superado por D45 y VUELVE A REGIR desde SDD-ADDENDUM D48 (28 jul 2026) — ver §12.**
  > `border-beam` y las tres dependencias de React se desinstalaron: el sitio vuelve a servir **0 KB de
  > JavaScript de terceros** y `dist/` baja de 1,2 MB a **396 KB**, muy por debajo del objetivo de esta
  > sección. La frase de arriba vuelve a describir el sitio tal como es, no solo su criterio.
- **`astro:assets`** convierte a WebP y emite `width`/`height` automáticamente → previene CLS sin trabajo
  manual. `loading="lazy"` en todo salvo el hero.
- **Configuración con dominio propio:** `site: 'https://ribie.org'` y **sin `base`** (el `base` solo aplica a
  sitios en `usuario.github.io/repo`; ponerlo rompe todas las rutas). `public/CNAME` con `ribie.org` y
  `public/.nojekyll`, porque Astro emite sus assets en `_astro/` y Jekyll ignora lo que empieza con `_`.
- **Repo:** `ribieorg/web-ribie`, **público y sin `LICENSE`** → todos los derechos reservados (**D38**).
  El `README` declara **contenido © RIBIE · código © Renovatio Software**.
- **En Cloudflare el registro va en gris (DNS only).** Proxeado en naranja rompe el certificado de GitHub
  Pages — ver `~/.claude/vault/100-Buenas-Practicas/modelo-dominio-paraguas.md`.
- Peso objetivo de la página inicial: **< 900 KB** con el hero incluido.
- El sitio debe seguir siendo legible y navegable **sin JavaScript**.

---

## 11. Revisión del 28 jul 2026 — dirección `institucional filoso`

Decidida con `design-protocol` tras el diagnóstico del cliente: *"le falta dinamismo, se siente generado
por IA"*. **Supera §1** en atmósfera y estructura. **No toca** marca, paleta base ni tipografía.

> 📐 **La ejecuta §12** (28 jul, tarde), sobre la maqueta de referencia. Esta sección define la dirección;
> §12 documenta cómo quedó implementada, qué de ella no se había cumplido todavía —la retícula seguía
> centrada, los objetivos seguían siendo tarjetas— y qué decisiones de esta misma jornada revierte.

### Por qué

El sistema de §1–§10 era correcto y aun así el resultado leía a plantilla, porque el problema no estaba
en los tokens sino en el **esqueleto**: hero centrado + bandas apiladas del mismo alto + grid simétrico de
seis objetivos + tarjetas con anillo. Esa combinación es exactamente lo que produce cualquier generador,
y ningún ajuste de color la corrige.

La causa de origen quedó identificada: **las únicas referencias que entraron al diseño fueron los mockups
del propio cliente**. Nunca hubo referencias de calidad estética — el hueco que el protocolo marca como
crítico.

### Referencias adoptadas (revisadas en vivo el 28 jul 2026)

| Sitio | Qué se toma |
|---|---|
| **The Alan Turing Institute** (`turing.ac.uk`) | **Referencia principal.** Corte diagonal como firma, bloques de color plano saturado, hero partido y pegado al margen, negro como estructura |
| **CCCB** (`cccb.org`) | Tipografía descomunal sin caja, navegación al margen, ausencia total de sombras |
| **MIT Media Lab** (`media.mit.edu`) | Retícula a sangre, elementos de anchos desiguales |
| **Santa Fe Institute** (`santafe.edu`) | La red de nodos como lenguaje visual, no como fondo decorativo |

**Anti-referencias declaradas por el cliente:** el mockup que envió RIBIE (carruseles, stats de plantilla,
testimonios con avatares) y **la universidad tradicional** (azul institucional, escudo, fotos de estudiantes
en el césped, carrusel de noticias).

> ⚠️ **Fundación Ceibal** (`fundacionceibal.edu.uy`) se revisó como referencia de nicho —investigación en
> tecnología educativa en Latinoamérica— y quedó como **anti-referencia**: teal + tarjetas con sombra +
> iconografía de línea + grid de features. Es el default del sector, y es donde estaba parada esta landing.

### El negro entra como estructura

| Token | Valor | Uso |
|---|---|---|
| `--void` | `#000000` | Fondo de bloques estructurales: hero, banda del Foro, firma de autoría |

**Contrastes medidos sobre `--void`** (calculados, no estimados):

| Color | Sobre negro | Veredicto |
|---|---|---|
| Blanco | **21.0:1** | Texto principal de los bloques oscuros |
| `#15A7B3` teal claro | **7.21:1** ✅ | **Texto normal** |
| `#00AEEF` cian | **8.30:1** ✅ | **Texto normal** |
| `#4A941E` verde manual | **5.55:1** ✅ | **Texto normal** — palabra destacada del titular |
| `#359B5A` verde claro | **5.99:1** ✅ | **Texto normal** |
| `--accent` ámbar | **8.44:1** ✅ | Texto y botón |
| `--brand` `#096D84` | **3.53:1** ⚠️ | **Solo bloque de color o texto ≥24px.** Nunca body |

> 🔓 **Consecuencia que justifica la decisión por sí sola:** los ocho secundarios del manual estaban
> **prohibidos como texto** (§2, 2.53–3.79:1 sobre blanco) y sobre negro llegan a 5.5–8.3:1. La dirección
> no solo cambia el aspecto: **le devuelve a RIBIE su paleta**, que hasta ahora solo podía decorar.

### La diagonal como firma

Un **único ángulo constante en todo el sitio** — se declara una vez y no se improvisa por sección:

```css
--corte: 4.5deg;   /* inclinación única de todos los cortes del sitio */
```

Reglas: la diagonal **separa bloques de color**, nunca corta texto ni imágenes. Máximo **un corte por
transición** entre bloques. En móvil (`< 40rem`) los cortes se **aplanan a horizontal**: en pantalla
estrecha la diagonal se come el alto útil y descoloca la lectura.

### Estructura

1. **Nada centrado.** El titular y los párrafos de entrada se alinean al margen izquierdo del contenedor.
   El centrado queda reservado a la firma de autoría.
2. **Hero partido**, columnas desiguales (≈ 62/38): a la izquierda el titular sobre negro; a la derecha
   bloques planos de color con el XV Foro y las cifras.
3. **Anchos desiguales entre secciones.** Prohibido que todas las bandas tengan el mismo alto y el mismo
   contenedor centrado: es la firma más reconocible del contenido generado.
4. **Cero sombras.** `--lift` sale de las tarjetas de nodos; quedan bloques planos separados por espacio y
   por línea. Se conserva solo en el menú móvil abierto, que sí se eleva de verdad.
5. **El grid de objetivos deja de ser 3×2 simétrico**: escalonado, con un ítem que ocupa doble.

### Do's y Don'ts que añade esta revisión

**Do**
1. El **verde del manual sobre negro** es la palabra destacada del titular — no el teal.
2. Un bloque de color plano vale más que una tarjeta con borde.
3. Si una sección puede romper la retícula sin perder legibilidad, que la rompa.

**Don't**
1. ❌ **Ni un `box-shadow` nuevo.** Si algo necesita separarse, se separa con color, espacio o corte.
2. ❌ **Nada de `--brand` como color de texto sobre negro** (3.53:1) — ese es el error que este sistema
   invita a cometer.
3. ❌ **Sin diagonales sobre texto ni sobre fotografías.**
4. ❌ **Sin más de un ángulo de corte.** Dos inclinaciones distintas leen a descuido, no a diseño.

### ⚠️ Excepción temporal: fotografía de stock en el mockup (28 jul 2026) — RETIRADA

> ⚠️ **Superada por SDD-ADDENDUM D48 (28 jul 2026) — ver §12, "Los huecos se declaran".** La excepción
> duró unas horas: las cinco imágenes se borraron esa misma jornada y §8.5 volvió a regir. Lo que sigue
> se conserva porque documenta la decisión que se tomó y las cuatro condiciones que la acotaron — y
> porque la condición **(4)**, dejar inventariado lo provisional, es lo que permitió retirarlo sin
> depender de la memoria de nadie.

**Decisión del cliente, tomada con la contradicción a la vista.** §8.5 prohíbe el stock y el
`BRIEF` del grupo UdeNar prohíbe *"fotos que aparenten registro real de la red"*. Para la presentación
del 28 jul se autoriza **stock real (Unsplash/Pexels)** con estas condiciones, que no son negociables
por ser lo único que separa un mockup de una falsificación institucional:

1. **Marcadas** con el sistema de `MOSTRAR_MARCAS`: ninguna imagen provisional se publica sin su etiqueta.
2. **Descargadas al repositorio**, nunca enlazadas en caliente. El mismo argumento por el que las fuentes
   se auto-hospedan (§10): un sitio institucional no filtra la IP de cada visitante a un tercero.
3. **Ninguna imagen que insinúe un acto de la red** — nada que pueda leerse como "este es un foro de RIBIE",
   con su logo, sus personas o sus sedes. Paisaje académico genérico, sí; registro documental, no.
4. **Se retiran** cuando llegue el material de RIBIE. Quedan inventariadas en
   `plantillas-hojas/demostracion/LEEME.md` para que retirarlas no dependa de la memoria de nadie.

> El riesgo asumido está documentado en `[[../300-Aprendizajes/ribie]]`: *"los mockups traen datos
> inventados que el cliente termina creyendo suyos"*. Vale igual para las imágenes.

### ⚠️ React entra al sitio: `border-beam` (28 jul 2026) — REVERTIDO

> ⚠️ **Superada por SDD-ADDENDUM D48 (28 jul 2026) — ver §12, "Vuelve el cero-JS".** El paquete y las
> tres dependencias de React se desinstalaron el mismo día: **68 KB → 0 KB**. Lo que sigue se conserva
> como el registro de un costo que se midió antes de asumirlo y se recuperó entero al revertir — que es
> exactamente lo que la nota final de esta sección anticipaba.

**Decisión del cliente con el costo medido delante.** Rompió **§10** y la decisión **D36**
(*"cero JavaScript al cliente por defecto"*, *"el único JS del sitio es el menú móvil y el reveal"*).

Se instaló `border-beam@1.3.0` (MIT), que declara `peerDependencies: react >=18, react-dom >=18`.
Para usarlo hubo que añadir `@astrojs/react`, `react` y `react-dom`.

**Costo medido, no estimado:**

| | Antes | Después |
|---|---|---|
| JS al cliente (gzip) | **0 KB** | **68 KB** (React DOM 55 + beam 10 + runtime 2) |
| `dist/` total | 864 KB | **1,2 MB** |

⚠️ **El presupuesto de §10 (< 900 KB) queda superado.** Se deja constancia: no es un descuido,
es el precio del efecto.

**Mitigaciones aplicadas:**

1. **`client:visible`** — React no entra en la carga inicial; hidrata cuando el bloque se ve.
2. **`colorVariant="mono"`**, no el `colorful` por defecto: el arcoíris del preset choca con una
   paleta análoga cian→verde. `borderRadius={0}` para no introducir esquinas redondeadas donde el
   sistema pide bloques rectos.
3. **`BeamAccesible.tsx`** — envoltorio propio que implementa `prefers-reduced-motion`. Su README lo
   dice explícitamente: los tipos *rotate* **solo lo respetan si lo implementa quien los consume**.
   Sin ese envoltorio, quien pidió menos movimiento vería un haz girando sin fin.

> **Si algún día se quiere revertir:** el efecto es un gradiente cónico animado sobre el borde, unas
> 30 líneas de CSS. Quitar el paquete y las tres dependencias de React devuelve los 68 KB.

### Paleta VIVA de bloques (28 jul 2026)

Petición del cliente —*"colores más vivos"*— con las capturas del Alan Turing Institute como
referencia: bloques planos de color muy saturado (magenta, verde neón, púrpura, amarillo).

> ⚠️ **Es una extensión grande de marca, no un ajuste.** De estos siete colores **solo el cian
> `#00AEEF` figura en el manual de RIBIE**. El manual es análogo cian→verde y apagado; magenta,
> púrpura, azul eléctrico, turquesa y verde neón **no existen en él**. Precedente: el ámbar (§2), que
> se adoptó como extensión funcional documentada. **Debe consultarse con RIBIE**, igual que la
> sustitución tipográfica de D28.

| Token | Hex | s/ negro | Tinta encima |
|---|---|---|---|
| `--viv-cian` (del manual) | `#00AEEF` | 8.30:1 | **oscura** 7.01:1 |
| `--viv-turquesa` | `#2EE6D6` | 13.41:1 | **oscura** 11.32:1 |
| `--viv-verde` | `#00E87A` | 12.82:1 | **oscura** 10.83:1 |
| `--viv-amarillo` | `#FFE500` | 16.46:1 | **oscura** 13.90:1 |
| `--viv-magenta` | `#FF2D9B` | 6.10:1 | **oscura** 5.15:1 |
| `--viv-purpura` | `#7B2FF7` | 3.59:1 | **BLANCA** 5.85:1 |
| `--viv-azul` | `#2B2BF5` | 2.77:1 | **BLANCA** 7.59:1 |

**Regla de tinta, deducida de la luminancia y no del gusto:** los luminosos (cian → magenta) llevan
tinta oscura; los profundos (púrpura, azul) llevan blanca. **Invertirla reprueba WCAG en los dos
sentidos** — y es el error natural, porque sobre negro uno tiende a poner texto claro en todo.

### Canvas UI — Retro Dither (28 jul 2026)

Instalado **a mano** en `src/lib/canvasui/retro-dither.ts` (MIT + Commons Clause): el CLI de `shadcn`
exige `components.json` y una configuración de Tailwind que este proyecto no tiene. Es TypeScript
vanilla: **cero dependencias nuevas**.

⚠️ **Requiere la API `html-in-canvas`** — hoy detrás de `chrome://flags/#canvas-draw-element`. Verificado
en navegador el 28 jul: sin el flag, `supportsHtmlInCanvas()` devuelve `false`, **el efecto no se monta y
la imagen se ve normal**.

> 🕳️ **La trampa que resuelve `RetroDither.astro`:** la API exige que el contenido viva DENTRO de un
> `<canvas>`, pero el contenido hijo de un `<canvas>` es *fallback* y los navegadores que soportan canvas
> —todos— **no lo pintan**. Servir esa estructura en el HTML dejaría el bloque **vacío** en Firefox, Safari
> y Chrome sin flag. Por eso el marcado servido es HTML normal y los canvas se construyen desde JS **solo
> si hay soporte**, con vuelta atrás si WebGL2 falla.

### Restricción vigente al ejecutar

**RIBIE no ha entregado una sola fotografía.** Esta dirección se eligió, entre otras razones, porque es la
única de las cuatro evaluadas que **no depende de material fotográfico**: el peso visual lo cargan la
geometría, el color plano y la tipografía. Cuando llegue el material real, la fotografía entra en los
bloques oscuros sin alterar el sistema.

---

## 12. Implementación de la maqueta de referencia (28 jul 2026, tarde)

_Corresponde a la decisión **D48** del `00_SDD-ADDENDUM`. Avance técnico:
`docs/avances/2026-07-28b-maqueta-de-referencia.md`._

Decidida sobre la maqueta de referencia de
`02_PROYECTOS/ribie/02_portal_web/claude-references/astro reference/`, que **materializa la dirección
`institucional filoso` de §11** en un proyecto Astro completo. **No cambia la dirección estética** — la
ejecuta. Lo que cambia es el esqueleto, que era donde §11 decía que estaba el problema y donde la
implementación de la mañana se había quedado a medias.

### La retícula deja de estar centrada

El cambio que más pesa, y el que explicaba la distancia entre el sitio y su referencia:

```css
/* antes */  .contenedor { width: min(100% - 10vw, 80rem); margin-inline: auto; }
/* ahora */  .contenedor { padding-inline: var(--margen); }   /* --margen: 5vw */
```

§11.3 ya prohibía *"que todas las bandas tengan el mismo alto y el mismo contenedor centrado"*, y aun así
el `max-width: 80rem` centrado seguía metiendo cada banda en la misma columna. **Un tope de ancho es una
decisión de layout disfrazada de higiene tipográfica.** Quien debe limitar la medida de lectura es cada
bloque de texto con su propio `ch` —y ya lo hacía—, no el contenedor de todas las secciones a la vez.

Con la retícula a sangre, `--margen` es el único margen lateral del sitio: `5vw` en escritorio, `1.5rem`
por debajo de 47,5rem, donde la proporción deja de servir (5vw de 360px son 18px y el texto se pega al
borde). Para los bloques que deben tocar el borde existe `.a-sangre`.

### Los objetivos son bloques de color, no tarjetas con una regla

La versión de la mañana ponía un filete de color sobre cada objetivo y dejaba el resto sobre el fondo de
la banda: **eso es una tarjeta disimulada.** Ahora cada objetivo es un bloque de color entero —blanco,
negro, púrpura, amarillo, azul— escalonado sobre doce columnas, y el escalonado vive **en el dato**
(`inicio`/`ancho`/`desfase` en `contenido.ts`), no en reglas `nth-child` del componente: el orden de los
objetivos lo decide RIBIE y la maqueta tiene que sobrevivir a que lo cambien.

El filete de color no desaparece del sistema, se especializa: es el recurso de los **ejes** de "Quiénes
somos". Si las dos secciones usaran el bloque de color pleno, el bloque de color dejaría de significar
nada.

### Los huecos se declaran

`Rayado.astro` ocupa el lugar de cada fotografía que falta con un rayado plano inclinado en el ángulo de
la marca y un pie que dice qué imagen va ahí y en qué tamaño. Sustituye a la fotografía de stock de D44.
Dos huecos: el flanco del **hero** y el fondo de la banda del **XV Foro**.

Un hueco declarado comunica el estado real del sitio mejor que una imagen prestada, no puede leerse como
un registro de la red —lo que el `BRIEF` del grupo UdeNar prohíbe— y no arrastra 400 KB que habrá que
borrar. Cuando llegue el material, cada `<Rayado>` se cambia por un `<Image>` en la misma caja.

### Vuelve el cero-JS

`border-beam`, `@astrojs/react`, `react` y `react-dom` desinstalados; `BeamAccesible.tsx` borrado.

| | 28 jul, mañana | 28 jul, tarde |
|---|---|---|
| JS de terceros al cliente | 68 KB gzip | **0 KB** |
| `dist/` total | 1,2 MB | **396 KB** |

El presupuesto de §10 (< 900 KB) vuelve a cumplirse con holgura. El único JS que queda es el
menú móvil y el reveal, escritos a mano y verificados funcionando tras la desinstalación.

> `src/lib/canvasui/` y `RetroDither.astro` (**D46**) **siguen en el repositorio pero ya no se usan**: el
> efecto operaba sobre la fotografía del hero, y el hero ya no lleva fotografía. No pesan —sin `import`
> no entran al `bundle`— y se conservan para cuando llegue material real. **Si el material no llega o el
> efecto se descarta, esos dos archivos se borran.**

### La diagonal cierra en espejo

La banda del Foro corta por arriba hacia la izquierda (`polygon(0 6.5vw, 100% 0, …)`) y el pie corta hacia
la derecha (`polygon(0 0, 100% 6.5vw, …)`). **Mismo ángulo, sentido invertido:** §11 admite una sola
inclinación en todo el sitio, y el espejo cierra la página con la figura con la que se abrió. Ambos cortes
se aplanan por debajo de 47,5rem y al imprimir.

### Qué NO se portó de la referencia, y por qué

| Pieza de la referencia | Decisión |
|---|---|
| Secciones **Actualidad** (mosaico de 8 celdas) y **Proyectos** | ⚠️ **Superado el 29 jul — ver §13.** Se implementaron con huecos declarados |
| **Cabecera estática** con siete enlaces en fila | ❌ Se conserva el header fijo con menú móvil. La referencia es estática porque nunca resolvió el móvil; esta es una página larga de anclas y el header fijo es lo que la hace navegable |
| **Google Fonts por CDN** | ❌ Las fuentes siguen auto-hospedadas (§3). Un sitio institucional público no filtra la IP de cada visitante a un tercero |
| Cifras de Historia **sobre blanco** | ❌ Se quedan sobre negro con la paleta viva: la alternancia de tono entre bandas es lo que impide que todas se lean iguales |

### Contrastes medidos en esta revisión

Todos calculados, no estimados. Cuatro pares no llegaban al umbral y se corrigieron:

| Par | Antes | Ahora | Umbral |
|---|---|---|---|
| Pie del hueco sobre la **raya clara** del rayado | `#7A7A75` → 4,08:1 | `#82827D` → **4,55:1** | 4,5 (texto de 11px) |
| Número del objetivo púrpura | `#E4D4FF` → 4,22:1 | `#EADDFF` → **4,53:1** | 4,5 (texto de 13px) |
| Tinta secundaria de las fichas del hero | `#D6D6FF` → 4,06:1 | `#E4E4FF` → **4,58:1** | 4,5 |
| Cifra sin confirmar sobre negro | `#3A3A38` → 2,04:1 | `#5A5A55` → **3,03:1** | 3,0 (pieza de 104px) |

> 🕳️ **El error que hay que recordar de aquí:** el gris del pie se había medido contra el **fondo** del
> rayado y no contra su **raya clara**, que es el peor caso — sobre las rayas el texto desaparecía. Y el
> hover de las fichas **aclaraba el fondo sin aclarar la tinta**, de modo que el contraste solo reprobaba
> en el único estado que nadie revisa. Ambos son fallos de *dónde* se mide, no de qué color se eligió.

### Defectos corregidos de paso

1. **`:global(p)` en las bandas de color teñía los bloques claros que viven dentro.** El aviso de
   contenido pendiente, sobre fondo hueso dentro de la banda púrpura, recibía texto casi blanco. Las
   bandas pasan a dar su tinta por **herencia** (`color` en la sección), de modo que cualquier bloque que
   declare su propio fondo declara también su tinta y queda a salvo.
2. **El muro de nodos era invisible sobre su propia sección:** las celdas usaban `--surface-alt` y la
   sección iba con `alterna`, que es el mismo color. La sección deja de alternar.
3. **El menú móvil se abría a 72rem centrados**, desalineado respecto a la marca que tiene encima. Pasa
   al `--margen` del sitio.
4. Radios y anillos que quedaban en `ListaPendiente` y en la nota del listado de nodos: fuera. §11 pide
   cero sombras y bloques planos, y esos dos eran los últimos supervivientes.

---

## 13. Las dos secciones que faltaban y el modo demostración (29 jul 2026)

_Corresponde a la decisión **D49** del `00_SDD-ADDENDUM`. Avance técnico:
`docs/avances/2026-07-29-secciones-a-sangre-y-modo-demo.md`._

Completa **§12**. Al comparar el sitio con la referencia **renderizada** —no con el código que había en
`claude-references/`— quedó claro que faltaban dos secciones enteras y que el muro de nodos tenía la
jerarquía equivocada.

### Actualidad y Proyectos, con huecos declarados

Entran las dos secciones a sangre de la referencia: el mosaico de ocho celdas y el bloque apaisado con
sus dos columnas. **Ninguna trae una noticia inventada.** Mientras no haya contenido, cada celda de texto
declara qué va en ella y en qué formato, en monoespaciada tenue — el mismo lenguaje de `Rayado.astro`
aplicado al texto.

> 🕳️ **El detalle que casi se pierde:** `.actualidad` llevaba `padding-block`, que también aplica abajo,
> y dejaba una franja de fondo entre los dos mosaicos. En la referencia **se tocan**, y ese contacto es
> justo lo que los hace leer como un bloque continuo en vez de como dos secciones apiladas. Ahora el
> padding es solo superior.

### El muro de nodos dice país, no institución

Antes encabezaba con el logotipo; ahora encabeza con **el país** y la institución va debajo, como sede de
coordinación. No es cosmético: RIBIE se organiza en nodos *nacionales*. Un muro de logotipos dice "estas
universidades nos apoyan"; un muro de países dice "la red cubre estos países, y en cada uno coordina esta
institución" — que es lo que la red es. El logotipo se conserva, discreto, al pie de la celda.

### Colaboradores pasa de púrpura a negro

Decisión del cliente el 29 jul, y resuelve de paso un defecto: sobre la banda púrpura, el título bicolor
heredaba `--brand` de `global.css` y daba **1,02:1** — el peor par de todo el sistema, literalmente
invisible. La entradilla, en `--ink-soft`, quedaba igual de ilegible.

> ⚠️ **La trampa del título bicolor, para no repetirla:** `.destacado` toma su color de `global.css` y
> **nadie lo revisa al teñir una banda nueva**. Cada tono de `Seccion.astro` debe declarar el suyo:
>
> | Banda | `.destacado` | Contraste |
> |---|---|---|
> | Oscura / carbón | `--viv-verde` | 12,82:1 |
> | Turquesa | `--brand-deep` | 5,67:1 (era 3,80 con `--brand`) |
> | Púrpura | `--viv-amarillo` | 4,58:1 (era **1,02** con `--brand`) |
>
> El blanco no sirve en púrpura: el resto del titular ya es blanco y se perdería el patrón bicolor.

### El pie: los blancos translúcidos no llegaban

Reportado en móvil (*"el texto casi no sale"*) y confirmado midiendo. El pie usaba `rgba(255,255,255,α)`
sobre el teal profundo, y dos de esos valores estaban por debajo del umbral:

| Elemento | Antes | Ahora |
|---|---|---|
| Rótulos «SECCIONES» / «CONTACTO» | `.55` → **3,87:1** ❌ | `.74` → **5,66:1** ✅ |
| Copyright | `.60` → **4,27:1** ❌ | `.74` → **5,66:1** ✅ |
| Línea separadora | `.16` → 1,52:1 | `.28` |
| Cuerpo y enlaces | `.82` → 6,56:1 ✅ | sin cambios |

> ⚠️ **Regla que sale de aquí:** un color translúcido **no tiene contraste propio** — lo tiene el color
> compuesto contra su fondo, y eso hay que calcularlo. Elegir un alfa "que se vea bien" es cómo se cuelan
> estos fallos, y el peor caso fue el rótulo: texto pequeño, en mayúsculas y con tracking abierto, que es
> justo donde menos margen hay.

### Modo demostración — `demo.json`, solo en desarrollo

Para poder ver la maqueta llena mientras el Drive se termina de cargar, `src/data/demo.json` aporta
noticias, proyectos, dieciocho nodos y cinco colaboradores. Se activa **solo** con `import.meta.env.DEV`
o `PUBLIC_DEMO=1`.

**Por qué una puerta de entorno y no pegar el contenido en las hojas:** esos datos son plausibles pero
inventados —"Chile → Universidad de Chile" no lo ha confirmado nadie—, y el aprendizaje del proyecto es
explícito en que *el dato de un mockup termina dándose por cierto*. Separarlo por entorno es lo único que
permite enseñar la maqueta completa **sin que exista ninguna forma de publicarla por descuido**.

Reglas que lo mantienen honesto:

1. El modo demo **no apaga las marcas** de contenido provisional.
2. **No convierte una cifra inventada en verificada.** Las cifras tienen tres estados y no dos: sin dato
   se apagan a gris; con dato sin verificar se pintan a color **y conservan la nota "por confirmar"**.
3. En los nodos, **lo que existe en el Drive pisa a la demostración**: el nodo de Colombia conserva su
   sitio y su logotipo reales.
4. Cada `pnpm build` se verifica con un `grep` sobre `dist/index.html`. Está comprobado en los dos
   sentidos: con `PUBLIC_DEMO=1` aparece, sin él no.

### El estado real del contenido

El diagnóstico completo de las hojas está en **`docs/CARGA-DE-HOJAS.md`**. En resumen: cuatro celdas
vacías en `textos`, el XV Foro en `borrador` (y **ya trae las fechas exactas, 5–7 oct 2026**, que el
sitio no muestra por eso), una fila vacía en `colaboradores` y cinco redes sin URL. **El sitio no está
incompleto: las hojas lo están**, y hace lo correcto al no publicar lo que no existe.

---

## Anexos

- **Sustitución de fuente:** `Haettenschweiler` → **Oswald** — decisión **D28** del
  `00_SDD-ADDENDUM`. Debe consultarse con RIBIE por respeto al manual.
- **Extensión de paleta:** el ámbar `--accent` **no está en el manual de marca**; se adopta como color
  funcional de acción (decisión del 24 jul 2026, este documento §2).
- **Brief para terceros:** `../../BRIEF - Contenido e imagenes para la landing (grupo UdeNar).md` deriva de
  este documento. Si cambia el sistema, **el brief se actualiza**.
- Reglas disciplinares aplicadas: `~/.claude/vault/100-Buenas-Practicas/diseño/` (typography, color,
  motion, spatial, anti-patrones-ui, presets-esteticos).
