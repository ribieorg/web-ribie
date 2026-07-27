// @ts-check
import { defineConfig } from 'astro/config';

// Sitio estático en GitHub Pages con dominio propio.
// ⚠️ `base` NO se define: solo aplica a sitios servidos en usuario.github.io/repo.
//    Con dominio propio, ponerlo rompe todas las rutas. Ver docs/DESIGN.md §10.
export default defineConfig({
  site: 'https://ribie.org',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
