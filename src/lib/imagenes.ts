import type { ImageMetadata } from 'astro';

/**
 * Resolución de imágenes por NOMBRE DE ARCHIVO.
 *
 * Las hojas citan las fotografías como «acto-mesa-principal.webp», que es lo
 * único razonable de pedirle a quien llena una celda. Astro, en cambio, necesita
 * conocer cada imagen en tiempo de compilación para optimizarla, así que los dos
 * glob de abajo la recogen todas y este módulo hace de puente.
 *
 * Dos orígenes, misma búsqueda:
 *   - `assets/fotos/`  — archivo fotográfico de la red, versionado en el repo.
 *   - `assets/remoto/` — lo que `sync-contenido.mjs` descarga del Drive.
 *
 * Un nombre que no exista devuelve `undefined`, y quien lo pida no renderiza la
 * pieza. El sync ya avisa de esos casos al sincronizar; aquí solo hay que
 * asegurarse de que un nombre mal escrito no produzca una imagen rota.
 */
const locales = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/fotos/*.{png,jpg,jpeg,webp,avif}',
  { eager: true }
);
const remotas = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/remoto/*.{png,jpg,jpeg,webp,gif,avif}',
  { eager: true }
);

const CATALOGO = { ...locales, ...remotas };

export function foto(nombre?: string): ImageMetadata | undefined {
  const archivo = nombre?.trim();
  if (!archivo) return undefined;
  return Object.entries(CATALOGO).find(([ruta]) => ruta.endsWith('/' + archivo))?.[1].default;
}
