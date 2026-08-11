# Sitio web de RIBIE — `ribie.org`

Sitio institucional de la **Red Iberoamericana de Informática Educativa**.
Desarrollado por **Renovatio Software** en calidad de Aliado Tecnológico de la red.

**Contenido © RIBIE · Código © Renovatio Software — todos los derechos reservados.**
Este repositorio es público para poder publicarse en GitHub Pages; su código **no es de
libre reutilización** (no lleva licencia abierta).

---

## Stack

- **Astro 7.1.3** — genera HTML estático, **cero JavaScript de framework** en el navegador
- **pnpm 11** — con las defensas anti supply-chain del estudio (`.npmrc` + allowlist de scripts)
- **Oswald + Onest** auto-hospedadas (sin CDN de terceros), solo subsets latinos
- **GitHub Pages** con dominio propio · DNS en **Cloudflare** (registros en **DNS only**)

## Desarrollo

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # genera dist/
pnpm preview    # sirve dist/ para revisar el resultado real
```

## Dónde se edita el contenido

**Desde las hojas de Google**, sin tocar el código. Publicar un evento o cambiar un texto es llenar
una fila; el sitio se reconstruye solo, cada hora.

```
Hojas de Google  ──CSV──▶  scripts/sync-contenido.mjs  ──▶  src/data/contenido.json  ──▶  sitio
```

- **Configurar:** pegar las URLs de cada pestaña publicada en `scripts/hojas.config.mjs`.
  Las plantillas con las cabeceras exactas están en `plantillas-hojas/` — se importan a Sheets.
- **A mano:** `pnpm sync` (descarga) · `pnpm sync:check` (valida sin escribir nada).
- **Automático:** `.github/workflows/contenido.yml`, cada hora y a demanda.

**El sitio no puede romperse por un error en una hoja.** Si una descarga falla, faltan columnas o una
hoja viene vacía, esa sección **conserva lo anterior** y el proceso avisa. Los valores por defecto de
`src/data/contenido.ts` son el respaldo permanente.

Mientras no haya contenido sincronizado, el material de relleno se señala con una etiqueta visible
—para que **nadie confunda un placeholder con material aprobado por RIBIE**—; esas marcas **se apagan
solas** en cuanto llega contenido real de las hojas.

## Estructura

```
src/
├── data/contenido.ts     ← TODO el texto del sitio
├── styles/
│   ├── tokens.css        ← color, tipografía, espacio, motion (fuente única)
│   └── global.css        ← base y utilidades
├── components/           ← Header, Hero, Seccion, StatRow, FeatureGrid,
│                            EventCard, ListaPendiente, Footer, Logo, NodeTexture, Marca
├── layouts/Base.astro
└── pages/index.astro     ← la página única, con anclas
public/
├── CNAME                 ← ribie.org
├── .nojekyll             ← Astro emite en _astro/ y Jekyll ignora lo que empieza con _
└── robots.txt
```

## Sistema de diseño

Las decisiones visuales están en **[`docs/DESIGN.md`](docs/DESIGN.md)** y no se improvisan en los
componentes. Lo esencial:

- Color de marca `#096D84`; **ámbar `#E8901A` solo para acciones**, y **siempre con texto oscuro**
  (blanco sobre ámbar da 2.6:1 y reprueba WCAG)
- Los **ocho secundarios del manual no sirven como color de texto** sobre blanco (2.5–3.8:1)
- Título bicolor, bandas teal y textura de nodos: los patrones que aportan los mockups de RIBIE
- Sin tarjetas por defecto, sin sombras salvo donde algo se eleva de verdad, sin fotos de stock

## Despliegue

Automático al hacer push a `main` (`.github/workflows/deploy.yml`).
En GitHub: **Settings → Pages → Source: GitHub Actions**.

⚠️ En Cloudflare los registros del sitio van en **DNS only (gris)**. En naranja se rompe el
certificado HTTPS de GitHub Pages.

## Estado del contenido

Qué falta cargar y cómo se carga, celda por celda: **`docs/CARGA-DE-HOJAS.md`**.
