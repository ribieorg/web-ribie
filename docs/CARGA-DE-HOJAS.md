# Carga de las hojas del Drive — contrato de once hojas

_Actualizado el **8 de septiembre de 2026** (D60). Sustituye al diagnóstico del 29 de julio —que describía
el contrato de cinco hojas y el modo demostración— y al estado del 14 de agosto, que hablaba de nueve: se
sumaron `foro_programa` (D58) y `estructura` (D60)._

---

## Estado: ✅ las once hojas están cargadas y publicadas

Verificado con `pnpm sync:check` contra el Drive real, **sin una sola advertencia**:

| Hoja | Filas | Contenido |
|---|---|---|
| `estructura` | 9 | ⚙️ **Qué secciones se publican** y cómo se llaman en el menú |
| `foro_programa` | 3 | Los tres encuentros que se celebran juntos |
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

> ⚠️ **Las URLs se publicaron como *documento completo*** (`pub?output=csv`, sin `gid`), así que
> Google devuelve **la primera pestaña**. Hoy funciona porque la pestaña de datos va primera y la de `guia`
> segunda. **Si alguien reordena las pestañas, el sync empezaría a leer la guía** — al reordenar o añadir
> pestañas, republicar apuntando a la pestaña concreta.

> 💡 **El `gid` caduca cuando se reemplaza el contenido de una pestaña.** Las cinco URLs de julio llevaban
> `gid=…&single=true` y empezaron a dar **HTTP 400** en cuanto se importó el contenido nuevo: el documento
> era el mismo, la pestaña ya no. Si un día cinco hojas fallan a la vez y las nuevas funcionan, es esto.

---

## 0. La hoja `estructura` — qué se publica y qué no

Es la única hoja que **no dice qué contiene el sitio, sino qué se ve de él**. Una fila por sección, en el
orden en que salen en la portada:

| Columna | Para qué sirve |
|---|---|
| `seccion` | El nombre que conoce el sitio: `convocatoria`, `hero`, `red`, `historia`, `lineas`, `foro`, `memoria`, `nodos`, `contacto`. **No se inventan**: uno que no esté en esa lista se ignora y el sync avisa (casi siempre es una errata). |
| `nombre` | Para entender la fila al leerla. No sale en ninguna parte del sitio. |
| `mostrar` | `sí` publica la sección · `no` la retira. |
| `rotulo_menu` | Cómo se llama en el menú de arriba. Un guion `-` o la celda vacía = **no va al menú**. |

**Encender y apagar es todo lo que hace.** No borra contenido: la sección apagada sigue con sus datos en su
hoja, y vuelve tal cual estaba en cuanto la celda diga `sí`. Tampoco cambia el orden — al encender una
sección, vuelve a su sitio en el recorrido, no al final.

> 🔒 **Apagar exige decirlo.** Si la hoja se cae, si se borra una fila o si `mostrar` trae algo que no es
> sí/no, **la sección se publica**. Es al revés que en las demás hojas —donde sin contenido no hay
> sección—, y a propósito: un error de red no puede dejar el sitio en blanco.

**El menú se arma solo con lo que esté encendido**, y el pie repite esa misma lista. Por eso no hay que
acordarse de quitar un enlace al apagar una sección: es imposible que el menú apunte a algo que no está.

### Estado hoy (8 sep 2026)

Portada reducida al encuentro, **a petición de RIBIE**: se publican la **franja del XV Foro** y la sección
de **Historia**, esta última rotulada **«Sobre nosotros»** en el menú. Las otras siete están en `no`.

> ⏰ **Fecha que hay que atender: el 8 de octubre.** La franja del encuentro **se apaga sola** cuando el
> foro pasa (es su diseño, D58). Con el resto en `no`, ese día la portada queda solo con «Sobre nosotros» y
> el pie. Antes de esa fecha hay que decidir con RIBIE qué se vuelve a encender.

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

1. **Las fechas del XV Foro — 6 y 7 de octubre de 2026** (corregidas el 7 sep, D58: la hoja decía 5–7).
   Siguen **sin validar por la red**, y con fechas de congreso la gente compra pasajes. Se publican con
   `fechas_confirmadas: no` hasta que respondan; ese día se pone `sí` y desaparece la marca.
2. **`colaboradores`** — hacen falta nombres reales con cargo e institución. Es el único contenido que
   deliberadamente no se rellena ni como demostración: inventar académicos en el sitio de una red real no
   vale la pena.
3. **`redes`** — sin URL, `activo` en `no`. Un enlace roto en el pie es peor que la nota.
4. **El número de países** (`cifras.paises`) y **la ciudad de contacto** (`textos.contacto_ciudad`).
5. **`textos.mostrar_franja_preparacion`** — mientras diga `sí`, el sitio muestra la franja de *"sitio en
   preparación"*. **Pasa a `no` cuando RIBIE valide textos, cifras y años**, no antes.

> 💡 Regla que atraviesa todo lo anterior: **un dato cargado no es un dato aprobado.** Por eso el estado
> vive en la celda, junto al dato, y no en la sección.
