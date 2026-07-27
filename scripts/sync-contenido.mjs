#!/usr/bin/env node
/**
 * Sincroniza el contenido del sitio desde las hojas de Google publicadas como CSV.
 *
 *   node scripts/sync-contenido.mjs            # descarga y escribe src/data/contenido.json
 *   node scripts/sync-contenido.mjs --check    # solo valida, no escribe (para revisar antes)
 *
 * Principio de diseño: **el sitio nunca se rompe por un error en la hoja.**
 * Si una descarga falla, si faltan columnas o si una hoja viene vacía, esa sección
 * conserva lo que ya había y el proceso termina con aviso — no con la página caída.
 * Solo se aborta del todo si NINGUNA hoja se pudo leer, porque entonces el problema
 * es de conectividad y publicar sería peor que no hacer nada.
 *
 * Sin dependencias externas: el parser de CSV va incluido (evita sumar superficie
 * de supply-chain a un repositorio público por algo de cuarenta líneas).
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HOJAS, ESQUEMA } from './hojas.config.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = resolve(RAIZ, 'src/data/contenido.json');
const IMAGENES = resolve(RAIZ, 'src/assets/remoto');
const SOLO_VALIDAR = process.argv.includes('--check');

/* ------------------------------------------------------------------ CSV --- */

/** Parser de CSV con soporte de comillas, comas y saltos de línea dentro de campo. */
function parseCSV(texto) {
  const filas = [];
  let campo = '';
  let fila = [];
  let enComillas = false;

  const limpio = texto.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < limpio.length; i++) {
    const c = limpio[i];
    if (enComillas) {
      if (c === '"') {
        if (limpio[i + 1] === '"') { campo += '"'; i++; }  // comilla escapada
        else enComillas = false;
      } else campo += c;
    } else if (c === '"') enComillas = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n') { fila.push(campo); filas.push(fila); fila = []; campo = ''; }
    else campo += c;
  }
  if (campo !== '' || fila.length) { fila.push(campo); filas.push(fila); }

  return filas.filter((f) => f.some((v) => v.trim() !== ''));
}

function aObjetos(filas) {
  if (!filas.length) return { cabeceras: [], datos: [] };
  const cabeceras = filas[0].map((h) => h.trim().toLowerCase());
  const datos = filas.slice(1).map((f) =>
    Object.fromEntries(cabeceras.map((h, i) => [h, (f[i] ?? '').trim()]))
  );
  return { cabeceras, datos };
}

/* -------------------------------------------------------------- imágenes --- */

/**
 * Las imágenes de Drive se **descargan al repositorio**, no se enlazan.
 *
 * Enlazar tendría dos problemas: cada visita al sitio pediría el archivo a Google
 * (dependencia externa en tiempo de ejecución) y Astro no podría optimizarlo. Al
 * traerlas al repo, se sirven desde el propio dominio, optimizadas y versionadas.
 */
const ID_DRIVE = /(?:\/file\/d\/|[?&]id=)([A-Za-z0-9_-]{20,})/;
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg' };

const usadas = new Set();

async function traerImagen(url, etiqueta) {
  if (!url) return '';
  const id = url.match(ID_DRIVE)?.[1];
  if (!id) return url;   // no es de Drive: se deja como está

  try {
    const r = await fetch(`https://drive.usercontent.google.com/download?id=${id}&export=download`, { redirect: 'follow' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);

    const tipo = (r.headers.get('content-type') ?? '').split(';')[0].trim();
    const ext = EXT[tipo];
    if (!ext) throw new Error(`tipo no soportado: ${tipo || 'desconocido'}`);

    const nombre = `${id}.${ext}`;              // el ID es estable: mismo archivo → mismo nombre
    mkdirSync(IMAGENES, { recursive: true });
    writeFileSync(resolve(IMAGENES, nombre), Buffer.from(await r.arrayBuffer()));
    usadas.add(nombre);
    console.log(`  ↓ ${etiqueta}: ${nombre}`);
    return nombre;
  } catch (e) {
    avisos.push(`⚠️  imagen de "${etiqueta}": ${e.message} — la fila se publica sin ella`);
    return '';
  }
}

/* --------------------------------------------------------------- helpers --- */

const esSi = (v) => ['sí', 'si', 'yes', 'true', 'x', '1'].includes(String(v).toLowerCase().trim());
const publicado = (fila) => !('estado' in fila) || ['publicado', 'publicada', ''].includes(fila.estado.toLowerCase());
const porOrden = (a, b) => (parseInt(a.orden || '999', 10) - parseInt(b.orden || '999', 10));

async function descargar(url, nombre) {
  const r = await fetch(url, { redirect: 'follow' });
  if (!r.ok) throw new Error(`HTTP ${r.status} al descargar "${nombre}"`);
  const texto = await r.text();
  if (texto.trimStart().startsWith('<')) {
    throw new Error(`"${nombre}" devolvió HTML, no CSV — probablemente la pestaña no está publicada`);
  }
  return texto;
}

/* ------------------------------------------------------------------ main --- */

const avisos = [];
const resultado = {};
let leidas = 0;
let configuradas = 0;

for (const [nombre, url] of Object.entries(HOJAS)) {
  if (!url) { avisos.push(`· "${nombre}": sin URL configurada — se conserva el contenido por defecto`); continue; }
  configuradas++;

  try {
    const { cabeceras, datos } = aObjetos(parseCSV(await descargar(url, nombre)));

    const faltan = (ESQUEMA[nombre] ?? []).filter((c) => !cabeceras.includes(c));
    if (faltan.length) {
      avisos.push(`⚠️  "${nombre}": faltan columnas [${faltan.join(', ')}] — hoja ignorada, se conserva lo anterior`);
      continue;
    }
    if (!datos.length) {
      avisos.push(`⚠️  "${nombre}": sin filas — se conserva el contenido por defecto`);
      continue;
    }

    resultado[nombre] = datos;
    leidas++;
    console.log(`✓ ${nombre}: ${datos.length} fila(s)`);
  } catch (e) {
    avisos.push(`⚠️  "${nombre}": ${e.message} — se conserva lo anterior`);
  }
}

if (configuradas > 0 && leidas === 0) {
  console.error('\n❌ Ninguna hoja pudo leerse. No se toca el contenido: publicar así sería peor que no hacer nada.');
  avisos.forEach((a) => console.error('   ' + a));
  process.exit(1);
}

/* ------ Transformar filas → estructura que consume el sitio ---------------- */

const salida = {};

if (resultado.textos) {
  salida.textos = Object.fromEntries(
    resultado.textos.filter((f) => f.clave && f.valor).map((f) => [f.clave, f.valor])
  );
}

if (resultado.eventos) {
  salida.eventos = await Promise.all(resultado.eventos.filter(publicado).map(async (f) => ({
    id: f.id,
    titulo: f.titulo,
    fechaInicio: f.fecha_inicio,
    fechaFin: f.fecha_fin || '',
    lugar: f.lugar,
    modalidad: f.modalidad,
    descripcion: f.descripcion,
    enlace: f.enlace_inscripcion || '',
    imagen: await traerImagen(f.imagen, `evento ${f.id || f.titulo}`),
    destacado: esSi(f.destacado),
  })));
}

if (resultado.nodos) {
  salida.nodos = await Promise.all(resultado.nodos.filter(publicado).sort(porOrden).map(async (f) => ({
    nombre: f.nombre_oficial, pais: f.pais, sitio: f.sitio_web || '',
    logo: await traerImagen(f.logo, `nodo ${f.nombre_oficial}`),
  })));
}

if (resultado.colaboradores) {
  salida.colaboradores = await Promise.all(resultado.colaboradores.filter(publicado).sort(porOrden).map(async (f) => ({
    nombre: f.nombre, cargo: f.cargo, institucion: f.institucion,
    grupo: f.grupo || 'Colaboradores',
    foto: await traerImagen(f.foto, `colaborador ${f.nombre}`),
  })));
}

if (resultado.redes) {
  salida.redes = resultado.redes.filter((f) => esSi(f.activo) && f.url).map((f) => ({
    nombre: f.red, url: f.url,
  }));
}

/* ------------------------------------------------------ escribir y cerrar -- */

// Imágenes que ya nadie referencia: se borran para que el repo no acumule basura.
if (existsSync(IMAGENES) && usadas.size > 0) {
  for (const f of readdirSync(IMAGENES)) {
    if (!usadas.has(f)) { unlinkSync(resolve(IMAGENES, f)); console.log(`  ✕ retirada ${f} (ya no se usa)`); }
  }
}

if (avisos.length) {
  console.log('\nAvisos:');
  avisos.forEach((a) => console.log('  ' + a));
}

if (SOLO_VALIDAR) {
  console.log('\n(--check) Validación terminada, no se escribió nada.');
  process.exit(0);
}

// Se fusiona con lo ya sincronizado: una hoja que falla hoy no borra lo de ayer.
let previo = {};
if (existsSync(DESTINO)) {
  try { previo = JSON.parse(readFileSync(DESTINO, 'utf8')); } catch { /* archivo corrupto: se regenera */ }
}
delete previo.sincronizado;

const final = { ...previo, ...salida };
const cambio = JSON.stringify(final) !== JSON.stringify(previo);

mkdirSync(dirname(DESTINO), { recursive: true });
writeFileSync(DESTINO, JSON.stringify(final, null, 2) + '\n', 'utf8');

console.log(cambio ? '\n✅ contenido.json actualizado' : '\nSin cambios respecto a la última sincronización.');
