// @ts-check
import { defineConfig } from 'astro/config';

// Sitio estático en GitHub Pages con dominio propio.
//
// Sin integraciones de framework: el sitio vuelve a ser CERO JavaScript de
// terceros (DESIGN.md §10). `@astrojs/react` estuvo aquí entre el 28 de julio y
// esta revisión, solo para sostener el efecto `border-beam` de una tarjeta del
// hero, y le costaba 68 KB gzip a cada visitante. El JS que queda es el del menú
// móvil y el del reveal, escritos a mano.
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