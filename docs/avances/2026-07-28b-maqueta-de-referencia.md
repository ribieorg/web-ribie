# 2026-07-28 (tarde) · Implementación de la maqueta de referencia

_Avance técnico de la decisión **D48** del `00_SDD-ADDENDUM` (repo documental)._
_Continúa `2026-07-28-rediseno-institucional-filoso.md`, del mismo día por la mañana._

---

## Contexto

Por la mañana se decidió la dirección `institucional filoso` (**D43**) y se implementó a medias. Por la
tarde entró la **maqueta de referencia** de
`02_PROYECTOS/ribie/02_portal_web/claude-references/astro reference/`: un proyecto Astro completo
(2.319 líneas) que ejecuta esa misma dirección de principio a fin.

Comparadas las dos, la distancia no estaba en los tokens —eran los mismos colores y la misma
tipografía— sino en tres cosas concretas, y una de ellas explicaba casi todo el resto.

## Qué se hizo

### 1. La retícula deja de estar centrada

```css
/* antes */  .contenedor { width: min(100% - 10vw, 80rem); margin-inline: auto; }
/* ahora */  .contenedor { padding-inline: var(--margen); }   /* 5vw · 1.5rem en móvil */
```

`DESIGN.md` §11.3 ya prohibía el contenedor centrado desde la mañana, y el `max-width: 80rem` seguía ahí
metiendo todas las bandas en la misma columna. Es el cambio que más acerca el sitio a su referencia, y el
más barato: dos líneas de CSS. La medida de lectura la limita cada bloque con su `ch`, como ya hacía.

### 2. Cambios de código

| Archivo | Cambio |
|---|---|
| `styles/tokens.css` | `--margen` (5vw · 1,5rem bajo 47,5rem) |
| `styles/global.css` | `.contenedor` a sangre; utilidad `.a-sangre` |
| `components/Rayado.astro` | **nuevo** — hueco declarado de fotografía, con pie `[ foto: … ]` |
| `components/Hero.astro` | sin React ni fotografía: rayado al flanco, cuña azul, 62/38 al margen |
| `components/FeatureGrid.astro` | objetivos como **bloques de color enteros**, escalonado desde el dato |
| `components/EventCard.astro` | dos columnas apoyadas en su base: cuerpo + ficha `dl` + botón ámbar |
| `components/Footer.astro` | diagonal **en espejo** de la del Foro; conserva la firma de Renovatio (D47) |
| `components/Seccion.astro` | la tinta de banda pasa a herencia (ver "defectos") |
| `components/LogoWall.astro` | muro más denso; filete de 4px; nota sin caja |
| `components/ListaPendiente.astro` | bloque plano: fuera radio y anillo |
| `components/StatRow.astro` | el guión de cifra sin confirmar sube a un gris visible |
| `data/contenido.ts` | `quienes.entradilla`; ejes con `filete`; objetivos con `variante/inicio/ancho/desfase` |
| `pages/index.astro` | entradilla grande en Quiénes; Historia sin fotografía; nodos sin `alterna` |
| `components/BeamAccesible.tsx` | **borrado** |
| `assets/mockup/` | **borrado** (5 fotografías de Pexels) |

### 3. Vuelve el cero-JS y se retira el stock

Desinstalados `border-beam`, `@astrojs/react`, `react` y `react-dom` (revierte **D45**). Borradas las
cinco fotografías de Pexels (retira **D44**), sustituidas por dos huecos declarados con `Rayado.astro`.

## Verificación

- `pnpm build` ✅ limpio.
- **JS de terceros al cliente: 68 KB → 0 KB.** `find dist -name "*.js"` devuelve **cero archivos**; los
  scripts propios (menú móvil y reveal) quedan en línea en el HTML.
- **`dist/`: 1,2 MB → 396 KB.** El presupuesto de `DESIGN.md` §10 (< 900 KB) vuelve a cumplirse.
- **Menú móvil verificado funcionando** tras quitar React: `aria-expanded` alterna y el panel abre y
  cierra (era el riesgo real de la desinstalación).
- **Sin desbordamiento horizontal** (`scrollWidth === clientWidth`) en **390**, **768** y **1440 px**.
- **Contrastes medidos, no estimados.** Cuatro pares no llegaban al umbral y se corrigieron; la tabla
  completa está en `DESIGN.md` §12.
- Consola del navegador sin errores ni advertencias.

## Bugs encontrados y corregidos

1. **`:global(p)` en las bandas de color alcanzaba a los bloques claros de dentro.** El aviso de
   contenido pendiente, sobre fondo hueso dentro de la banda púrpura, recibía texto casi blanco:
   ilegible. La especificidad del selector de sección (0,2,1) le ganaba a la clase propia del componente
   (0,1,0). **Las bandas pasan a dar su tinta por herencia**, de modo que todo bloque que declara fondo
   declara tinta. Venía de la mañana y no se había visto porque la sección aún no tenía ese bloque.
2. **El muro de nodos era invisible sobre su propia sección:** las celdas iban en `--surface-alt` y la
   sección llevaba `alterna`, que pinta exactamente ese color.
3. **El gris del pie de los huecos estaba medido contra el fondo del rayado y no contra su raya clara**,
   que es el peor caso: sobre las rayas el texto desaparecía (4,08:1).
4. **El hover de las fichas del hero aclaraba el fondo sin aclarar la tinta**, así que el contraste solo
   reprobaba en el estado que nadie revisa (3,86:1). Ahora la tinta pasa a blanco en hover.
5. **El menú móvil se abría a 72rem centrados**, desalineado respecto a la marca de encima.

## Decisiones de alcance

Lo que la referencia trae y **no** se portó, con su razón, está en `DESIGN.md` §12: las secciones
**Actualidad** y **Proyectos** (exigirían inventar ocho noticias y dos proyectos), la **cabecera
estática**, las **fuentes por CDN** y las cifras de Historia sobre blanco.

## Pendientes

- 🔴 **El hito del 28 jul sigue sin cumplirse:** el repo `ribieorg/web-ribie` no existe y `gh` está
  autenticado como `camilomeneses`, que no tiene acceso a la organización. Sin cambios desde la mañana.
- 🔴 **Consultar con RIBIE la paleta viva** (D43): 6 de 7 colores no están en el manual.
- 🔴 **Constancia escrita del Anexo C** (D47).
- ⚪ **`src/lib/canvasui/` y `RetroDither.astro` quedan sin uso** (D46): el efecto operaba sobre la
  fotografía del hero, que ya no existe. No pesan —sin `import` no entran al bundle—; se conservan para
  cuando llegue material real. Si no llega, se borran.
- ⚪ **`astro check` no se pudo ejecutar:** `@astrojs/check` no está instalado en el proyecto y añadirlo
  no formaba parte del encargo. El `build` sí pasa limpio.
