# 2026-07-29 · Actualidad, Proyectos y el modo demostración

_Avance técnico de la decisión **D49** del `00_SDD-ADDENDUM` (repo documental)._
_Continúa `2026-07-28b-maqueta-de-referencia.md`._

---

## Contexto

Al abrir el sitio junto al cliente aparecieron huecos grandes. El diagnóstico separó **dos problemas que
se veían igual pero no lo eran**:

1. **Faltaban dos secciones de la referencia.** Se detectó al comparar con la referencia **renderizada**
   (`claude.ai/design`) y no con el código de `claude-references/`, que está desactualizado respecto a
   ella —en el zip la cuña del hero es azul; en la versión vigente es púrpura—.
2. **El contenido no faltaba por implementar: las hojas del Drive están a medio llenar.** `pnpm sync`
   funciona y trae lo que hay; lo que hay son cuatro celdas vacías, dos filas en `borrador` y cinco
   enlaces sin URL.

## Qué se hizo

### 1. Actualidad y Proyectos, con huecos declarados

| Archivo | Cambio |
|---|---|
| `components/Actualidad.astro` | **nuevo** — mosaico a sangre de 4 columnas, 8 celdas (4 texto, 4 foto) |
| `components/Proyectos.astro` | **nuevo** — bloque apaisado a doble columna + 2 columnas con muesca |
| `components/MuroColaboradores.astro` | **nuevo** — bloques planos alineados a su base |
| `components/LogoWall.astro` | el muro pasa a **país arriba, sede debajo**; el logotipo va discreto al pie |
| `data/contenido.ts` | `actualidad` y `proyectos`, con su plantilla de celdas |
| `pages/index.astro` | las dos secciones entre Historia y Objetivos; colaboradores a `tono="oscuro"` |

Ninguna noticia inventada: mientras `items` esté vacío, cada celda de texto declara **qué va en ella y en
qué formato**, en monoespaciada tenue. Es el lenguaje de `Rayado.astro` aplicado al texto.

### 2. Modo demostración aislado por entorno

`src/data/demo.json` llena la maqueta (4 noticias, 2 proyectos, 18 nodos, 5 colaboradores, 3 cifras y el
correo). Se activa **solo** con `import.meta.env.DEV` o `PUBLIC_DEMO=1`.

Cuatro reglas que lo mantienen honesto:

1. No apaga las marcas de contenido provisional.
2. No convierte una cifra inventada en verificada — las cifras pasan a tener **tres estados**: sin dato
   (gris), con dato sin verificar (a color **y con la nota**), verificado.
3. En nodos, **lo del Drive pisa a la demostración**: Colombia conserva su sitio y su logotipo reales.
4. Se verifica en cada compilación con `grep` sobre `dist/index.html`.

### 3. Diagnóstico del contenido

`docs/CARGA-DE-HOJAS.md` — **nuevo**. Qué celda rellenar en cada hoja y qué filas pasar de `borrador` a
`publicado`, leído directamente de las hojas publicadas con `pnpm sync:check`.

## Verificación

- `pnpm build` ✅ · `dist/` **412 KB** · **0 archivos JS** (sigue sin JavaScript de terceros).
- **Modo demo verificado en los dos sentidos:** con `PUBLIC_DEMO=1` el contenido aparece en
  `dist/index.html`; sin él, `grep` devuelve **0**.
- Sin desbordamiento horizontal en **390**, **768** y **1440 px**.
- Contrastes **medidos, no estimados** (ver más abajo).

## Bugs encontrados y corregidos

1. 🔴 **El título bicolor sobre la banda púrpura daba 1,02:1** — el peor par de todo el sistema,
   literalmente invisible. `.destacado` hereda `--brand` de `global.css` y **nadie lo revisa al teñir una
   banda nueva**. Cada tono de `Seccion.astro` declara ahora el suyo: verde sobre oscuro (12,82:1),
   `--brand-deep` sobre turquesa (5,67:1, era 3,80), amarillo sobre púrpura (4,58:1).
2. 🔴 **Dos textos del pie reprobaban:** los rótulos «SECCIONES»/«CONTACTO» a `rgba(255,255,255,.55)` →
   **3,87:1**, y el copyright a `.60` → **4,27:1**. Ambos a `.74` → 5,66:1. **Un color translúcido no
   tiene contraste propio**: lo tiene el compuesto contra su fondo, y hay que calcularlo.
3. **Franja de fondo entre los dos mosaicos:** `.actualidad` llevaba `padding-block`, que también aplica
   abajo. En la referencia los mosaicos **se tocan**, y ese contacto es lo que los hace leer como un
   bloque continuo. Ahora el padding es solo superior (verificado: 0 px de separación).
4. **Los bloques de objetivos estiraban** a la altura de la fila (`align-items: stretch` por defecto),
   dejando un tercio de aire muerto bajo el primero. → `align-items: start`.
5. **Marca stale en el pie:** decía *"Se define el 25 jul"*, fecha ya pasada. La dirección existe desde el
   27 jul; lo que falta es publicarla en la hoja, y eso dice ahora.
6. **Comentario JSX entre las dos ramas de un ternario** rompía el compilador de Astro
   (`Expected ':' but found '{'`). Va fuera del ternario.

## Pendientes

- 🔴 **Cargar las hojas del Drive** → `docs/CARGA-DE-HOJAS.md`. ⚠️ Las **fechas del XV Foro (5–7 oct
  2026)** ya están escritas en la hoja pero **hay que confirmarlas con RIBIE** antes de publicarlas: que
  estén ahí no significa que la red las haya validado, y con ellas la gente organiza viajes.
- 🔴 **El sitio sigue sin publicarse** — acceso a `ribieorg`, sin cambios.
- 🔴 **Consultar la paleta viva con RIBIE** (D43) y la **constancia del Anexo C** (D47).
- ⚪ `src/lib/canvasui/` y `RetroDither.astro` (D46) siguen sin uso.
- ⚪ `astro check` sigue sin poder ejecutarse: `@astrojs/check` no está instalado.
