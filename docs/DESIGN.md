# DESIGN.md — Landing institucional de RIBIE

_Sistema de diseño canónico de `ribie.org`. Decidido el **24 de julio de 2026** con el protocolo
`design-protocol`. Toda decisión visual del sitio se justifica contra este documento._

**Proyecto:** landing informativa de la Red Iberoamericana de Informática Educativa
**Entrega:** 28 de julio de 2026 · sitio estático en GitHub Pages · una sola página con anclas
**Fuente de marca:** `../../material-grafico/OneDrive_1_23-7-2026/Manual de uso.pdf` (5 páginas)
**Referencias:** `../../../99_referencias/imagen_1.jpeg` e `imagen_2.jpeg` (mockups aportados por RIBIE)

---

## 1. Atmósfera

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

1. **Una idea por banda.** Cada sección dice una cosa y da aire alrededor.
2. **Fotografía real y grande.** Donde va una foto, va una foto — nunca un bloque de color con un icono.
3. **Título bicolor** como recurso de jerarquía antes que subir el tamaño.
4. **Cifras reales o ninguna cifra.** Si no está verificado, no se publica.
5. **Contraste verificado**, no estimado: cualquier par nuevo se mide antes de usarse.
6. **El logo respira**: margen mínimo alrededor igual a la altura del isotipo (manual de marca).

## 8. Don'ts

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

## Anexos

- **Sustitución de fuente:** `Haettenschweiler` → **Oswald** — decisión **D28** del
  `00_SDD-ADDENDUM`. Debe consultarse con RIBIE por respeto al manual.
- **Extensión de paleta:** el ámbar `--accent` **no está en el manual de marca**; se adopta como color
  funcional de acción (decisión del 24 jul 2026, este documento §2).
- **Brief para terceros:** `../../BRIEF - Contenido e imagenes para la landing (grupo UdeNar).md` deriva de
  este documento. Si cambia el sistema, **el brief se actualiza**.
- Reglas disciplinares aplicadas: `~/.claude/vault/100-Buenas-Practicas/diseño/` (typography, color,
  motion, spatial, anti-patrones-ui, presets-esteticos).
