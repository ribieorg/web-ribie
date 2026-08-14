# Carga de las hojas del Drive — contrato de nueve hojas

_Actualizado el **14 de agosto de 2026** (D55). Sustituye al diagnóstico del 29 de julio, que describía el
contrato de cinco hojas y el modo demostración, ambos superados._

---

## Estado: ✅ las nueve hojas están cargadas y publicadas (14 ago 2026)

Verificado con `pnpm sync:check` contra el Drive real, **sin una sola advertencia**:

| Hoja | Filas | Contenido |
|---|---|---|
| `textos` | **25 claves** | Todos los textos del sitio |
| `eventos` | 1 | XV Foro, con `fechas_confirmadas` en `no` |
| `nodos` | **21** | Colombia con sede; 20 países `por confirmar` |
| `colaboradores` | 1 | Estructura lista, **sin datos reales** |
| `redes` | 5 | Listadas, **sin URL** |
| `cifras` | 4 | 1990 · 21 países · +15 eventos · 36 años |
| `hitos` | 4 | El recorrido histórico, con tres fotografías |
| `lineas` | 6 | Las líneas de trabajo, con color del manual |
| `memoria` | 6 | El archivo fotográfico |

**Diez imágenes se descargan del Drive** a `src/assets/remoto/` —seis del archivo, tres de los hitos y el
logotipo de la Universidad de Nariño— y Astro las optimiza en el build.

Los archivos de partida siguen en
`02_PROYECTOS/ribie/99_referencias/RIBIE Design System/exports/hojas/*.xlsx`, y los mismos datos en CSV en
`scripts/hojas-locales/` (es lo que lee `pnpm sync:local`).

> ⚠️ **Las nueve URLs se publicaron como *documento completo*** (`pub?output=csv`, sin `gid`), así que
> Google devuelve **la primera pestaña**. Hoy funciona porque la pestaña de datos va primera y la de `guia`
> segunda. **Si alguien reordena las pestañas, el sync empezaría a leer la guía** — al reordenar o añadir
> pestañas, republicar apuntando a la pestaña concreta.

> 💡 **El `gid` caduca cuando se reemplaza el contenido de una pestaña.** Las cinco URLs de julio llevaban
> `gid=…&single=true` y empezaron a dar **HTTP 400** en cuanto se importó el contenido nuevo: el documento
> era el mismo, la pestaña ya no. Si un día cinco hojas fallan a la vez y las nuevas funcionan, es esto.

---

## Cómo se cargó (procedimiento, por si hay que repetirlo)

---

## 1. Las cinco que ya existían — reemplazar el contenido y **republicar**

> Abrir la hoja en Sheets → **Archivo → Importar → Subir** el `.xlsx` →
> **«Reemplazar hoja actual»** → Importar datos.

⚠️ **Y después, republicar.** Reemplazar el contenido **cambia el `gid` de la pestaña**, de modo que la URL
anterior deja de servir (HTTP 400) aunque el documento sea el mismo. Hay que volver a
**Archivo → Compartir → Publicar en la web**, copiar la URL y actualizarla en `scripts/hojas.config.mjs`.
Fue exactamente lo que pasó el 14 de agosto con las cinco.

**Qué cambió en cada una:**

- **`textos`** pasa de 13 a 25 claves. Salen `cifra_anios` y `cifra_paises` (van a `cifras`),
  `historia_p1` y `historia_p2` (van a `hitos`) y `mostrar_marcas`, reemplazada por
  **`mostrar_franja_preparacion`**.
- **`eventos`** gana **`fechas_confirmadas`**. Es obligatoria: sin esa columna el sync **no publica la
  hoja** y el XV Foro desaparece del sitio. Va en `no` mientras RIBIE no valide las fechas — el sitio las
  muestra con la marca "por confirmar" en vez de como dato firme.
- **`nodos`** pasa de 1 a 21 filas: Colombia con la Universidad de Nariño, y los otros veinte países con
  `estado: por confirmar` y sin institución. El muro dice **país arriba y sede debajo**, así que un país
  sin sede se ve correcto; una sede inventada, no.
- **`colaboradores`** y **`redes`** se reemplazan por su estructura nueva, todavía **sin datos reales**:
  siguen esperando a RIBIE (§4).

## 2. Las cuatro nuevas — crear y publicar

Para cada una de `cifras`, `hitos`, `lineas` y `memoria`:

1. Subir el `.xlsx` al Drive (carpeta `Contenido Web`) y abrirlo como hoja de cálculo de Google.
2. **Archivo → Compartir → Publicar en la web** → preferiblemente seleccionar **la pestaña** de datos (no
   *"documento completo"*) → formato **CSV** → **Publicar**.
3. Copiar la URL y pegarla en `scripts/hojas.config.mjs`, en la clave del mismo nombre.

Esa URL es de **solo lectura**: aunque alguien la encuentre, no puede modificar nada. Editar sigue
exigiendo permiso de Editor en el Drive — la autenticación son los permisos de Drive, no la URL.

**Qué contiene cada una:**

- **`cifras`** — las cuatro cifras de portada: origen 1990, 21 países, +15 eventos, 36 años de trayectoria.
  ⚠️ `paises` va con `confirmado: no`: son los integrantes del programa CYTED, y **nadie ha confirmado que
  equivalgan a los nodos activos hoy**.
- **`hitos`** — el recorrido histórico en cuatro tiempos: CYTED (1990), el Premio de Informática Educativa
  con el Ministerio (1992–2018), los quince congresos y quince foros, y el XV Foro de 2026.
- **`lineas`** — las seis líneas de trabajo. `color_manual` **solo acepta uno de los ocho secundarios del
  manual de marca**; cualquier otro valor se descarta y el bloque cae al turquesa de la casa. `ancho` son
  columnas de doce (3 a 5).
- **`memoria`** — los pies del archivo fotográfico, con `tamano` (`grande` · `medio` · `pequena`) para
  componer la retícula.

---

## 3. Después de cargar

```bash
cd ~/Documentos/Proyectos/web-ribie
pnpm sync:check   # valida y dice qué trae cada hoja, sin escribir nada
pnpm sync         # descarga hojas e imágenes → src/data/contenido.json
pnpm build        # compila
```

⏱️ **Google cachea las hojas publicadas unos cinco minutos.** Si `sync:check` no ve un cambio recién
guardado, no es un fallo del script: es el caché.

**Para trabajar sin depender del Drive**, `pnpm sync:local` lee los CSV de `scripts/hojas-locales/`. No son
un segundo origen de verdad: **en cuanto la URL esté puesta, manda la hoja**.

**Dos guardas que conviene conocer** (y no desactivar): si a una hoja le falta una columna obligatoria del
`ESQUEMA`, **esa hoja no se publica** en vez de emitir el sitio a medias; y una hoja cuya URL esté vacía
simplemente **cae al contenido por defecto**, sin romper nada.

---

## 4. Lo que sigue dependiendo de RIBIE, no de nosotros

1. **Las fechas del XV Foro (5–7 oct 2026).** Están cargadas, pero **nadie de la red las ha validado**, y
   con fechas de congreso la gente compra pasajes. Se publican con `fechas_confirmadas: no` hasta que
   respondan; ese día se pone `sí` y desaparece la marca.
2. **`colaboradores`** — hacen falta nombres reales con cargo e institución. Es el único contenido que
   deliberadamente no se rellena ni como demostración: inventar académicos en el sitio de una red real no
   vale la pena.
3. **`redes`** — sin URL, `activo` en `no`. Un enlace roto en el pie es peor que la nota.
4. **El número de países** (`cifras.paises`) y **la ciudad de contacto** (`textos.contacto_ciudad`).
5. **`textos.mostrar_franja_preparacion`** — mientras diga `sí`, el sitio muestra la franja de *"sitio en
   preparación"*. **Pasa a `no` cuando RIBIE valide textos, cifras y años**, no antes.

> 💡 Regla que atraviesa todo lo anterior: **un dato cargado no es un dato aprobado.** Por eso el estado
> vive en la celda, junto al dato, y no en la sección.
