# 2026-07-28 · Rediseño `institucional filoso` y contenido de demostración

_Avance técnico de las decisiones **D43–D47** del `00_SDD-ADDENDUM` (repo documental)._
_Primer archivo de `docs/avances/`: la carpeta no existía y se crea con este._

---

## Contexto

El 28 de julio era el hito comprometido con RIBIE: la landing publicada en `ribie.org`. Dos hechos
condicionaron toda la jornada:

1. **RIBIE no cargó contenido** en el Drive dentro del plazo (tope: lunes 27 jul).
2. Al revisar el sitio construido, el cliente reportó que *"se siente generado por IA"* y le
   *"falta dinamismo"*.

## Qué se hizo

### 1. Diagnóstico del "parece hecho por IA" (D43)

El sistema de diseño era correcto —tokens OKLCH con contrastes medidos, escala fluida, motion con las
preguntas de Emil, *don'ts* que ya prohibían el *cardocalypse*— y aun así el resultado leía a plantilla.

**El problema estaba en el esqueleto, no en los tokens:** hero centrado + bandas apiladas del mismo alto
+ grid 3×2 de features + tarjetas con anillo. Se identificó también la **causa de origen**: las únicas
referencias que entraron al diseño del 24 jul fueron los mockups del propio cliente, que el `DESIGN.md`
listaba como el objeto *a corregir*.

Se revisaron en vivo cuatro referencias (`turing.ac.uk`, `cccb.org`, `media.mit.edu`, `santafe.edu`) y
una **anti-referencia de nicho** (`fundacionceibal.edu.uy`, investigación en tecnología educativa: teal
+ tarjetas con sombra + iconitos, casi idéntica a lo que teníamos).

### 2. Cambios de código

| Archivo | Cambio |
|---|---|
| `styles/tokens.css` | `--void` (negro), `--corte`, paleta viva de 7 colores, neutros cálidos, `--surface` a hueso `#F4F4F2`, `--text-hero` a 86 px |
| `styles/global.css` | contenedor a `min(100% - 10vw, 80rem)`; marca provisional legible sobre fotografía |
| `components/Hero.astro` | reescrito: foto al flanco, plano azul en diagonal, titular anclado al margen, fichas |
| `components/Seccion.astro` | tonos `oscuro` / `carbon` / `turquesa` / `purpura` y encabezado partido |
| `components/StatRow.astro` | cifras hasta 104 px, una por color, escalonadas |
| `components/FeatureGrid.astro` | grid escalonado sobre 12 columnas |
| `components/LogoWall.astro` | bloques planos con regla de color; sin sombras |
| `components/EventCard.astro` | banda negra con foto y diagonal superior |
| `components/Footer.astro` | bloque de firma negro con el logotipo de Renovatio (**D47**) |
| `components/AvisoContenido.astro` | **nuevo** — declara el estado provisional y explica el circuito de Sheets |
| `components/BeamAccesible.tsx` | **nuevo** — envoltorio de `border-beam` con `prefers-reduced-motion` (**D45**) |
| `components/RetroDither.astro` + `lib/canvasui/` | **nuevos** — Canvas UI con montaje condicional (**D46**) |

### 3. Contenido de demostración (D44)

CSV listos para pegar en las hojas del Drive (`plantillas-hojas/demostracion/`) y cinco fotografías de
Pexels descargadas a `src/assets/mockup/`, todas marcadas e inventariadas.

## Verificación

- `pnpm build` ✅ en cada paso.
- **Contrastes medidos, no estimados**, en dos rondas: la paleta viva sobre negro (5,5–8,3:1, con
  `--brand` en 3,53:1 → prohibido como texto) y toda la tinta sobre el hueso `#F4F4F2` tras el cambio
  de fondo (`--ink` 16,11:1 · `--ink-soft` 6,86:1 · `--brand` 5,40:1).
- **Sin desbordamiento horizontal** (`scrollWidth === clientWidth`).
- **Peso:** `dist/` 1,2 MB · JS al cliente **68 KB gzip** (antes 0). ⚠️ Presupuesto de §10 superado.
- **Retro Dither verificado en navegador:** sin el flag de Chrome, `supportsHtmlInCanvas()` devuelve
  `false`, el efecto **no se monta** y la imagen se ve normal.
- **Alineación del bloque del Foro** con el hero: ambos en 295 px (era una regresión introducida y
  corregida el mismo día).

## Bugs encontrados y corregidos

1. **`--space-5` no existe** en la escala del proyecto (salta de 4 a 6). Se usó en tres componentes y el
   navegador resolvía `gap: normal` — era la causa del logotipo pegado al texto en el pie. Ni el build ni
   `astro check` lo reportan.
2. **`max-width` sobre un elemento que ya lleva `margin-inline: auto`** recentraba el bloque del Foro en
   el viewport en vez de anclarlo al margen, violando en silencio la regla "nada centrado".
3. **Marca provisional ilegible sobre fotografía**: el ámbar translúcido no contrasta contra una imagen.
   Corregido en el sistema (`global.css`), no en el componente.

## Pendientes

- 🔴 **El hito NO se cumplió:** `ribie.org` sigue respondiendo con el certificado equivocado. El repo
  `ribieorg/web-ribie` no existe y `gh` está autenticado como `camilomeneses`, que **no tiene acceso a
  `ribieorg`**. Crear el repo bajo la cuenta personal contradiría **D29** y **D41**.
- 🔴 **Consultar con RIBIE la paleta viva** (D43): 6 de 7 colores no están en el manual.
- 🔴 **Constancia escrita del Anexo C** (D47).
- Retirar `src/assets/mockup/` cuando llegue material propio (D44).
