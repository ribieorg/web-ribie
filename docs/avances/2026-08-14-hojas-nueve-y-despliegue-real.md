# 14 ago 2026 — Las nueve hojas, el despliegue, y un sitio que se publicaba por accidente

_Cierra la migración de **D54** y registra la decisión **D56**. El rediseño de **D55** queda en producción._

---

## 1. Las nueve hojas del Drive

El contenido dejó de vivir en el código y pasó al Drive de RIBIE, que era el punto de **D39** y lo que
**D54** amplió. Cinco hojas reemplazadas y cuatro creadas. Validadas contra el Drive real con
`pnpm sync:check`, **sin una sola advertencia**:

| `textos` | `eventos` | `nodos` | `colaboradores` | `redes` | `cifras` | `hitos` | `lineas` | `memoria` |
|---|---|---|---|---|---|---|---|---|
| 25 claves | 1 | 21 | 1 | 5 | 4 | 4 | 6 | 6 |

Con ellas entran **diez imágenes** que el sync descarga del Drive y Astro optimiza: el archivo fotográfico,
las tres fotos de los hitos y el logotipo de la Universidad de Nariño.

El sitio compilado muestra **74 marcas de «por confirmar»** —los veinte países sin sede, la cifra de países
y las fechas del Foro—, con lo que el sistema de estados del dato de **D52** queda verificado de punta a
punta: el estado viaja en la celda y llega hasta el HTML.

### 🚨 El `gid` de una pestaña caduca al reemplazar su contenido

Al terminar la carga, **las cinco hojas de julio empezaron a dar HTTP 400 todas a la vez**, mientras las
cuatro nuevas funcionaban. No eran documentos distintos: importar un `.xlsx` con *«Reemplazar hoja actual»*
**crea una pestaña nueva con otro `gid`**, y las URLs publicadas apuntaban a la anterior. Hubo que
republicar las nueve.

Se publicaron como *documento completo* (`pub?output=csv`, sin `gid`), que devuelve **la primera pestaña**.
Funciona porque la de datos va primera y la de `guia` segunda, pero **el orden de las pestañas pasó a ser
parte del contrato**: si alguien las reordena, el sync empieza a leer la guía sin avisar. Queda anotado en
`scripts/hojas.config.mjs` y en `docs/CARGA-DE-HOJAS.md`.

### La guarda del sync hizo exactamente lo que debía

El cron de las 21:52 UTC corrió con el código viejo, encontró los cinco 400 y **abortó sin tocar nada**:

```
❌ Ninguna hoja pudo leerse. No se toca el contenido:
   publicar así sería peor que no hacer nada.
```

Un sync menos cuidadoso habría publicado un sitio vacío sobre uno correcto.

---

## 2. El despliegue, y lo que apareció debajo (D56)

`main` avanzó siete commits y el workflow desplegó sin errores. Y el sitio en vivo **no era el nuestro**:

```
<title>Sitio web de RIBIE — ribie.org | web-ribie</title>
<meta name="generator" content="Jekyll v3.10.0" />
```

7 KB de `README.md` renderizado por Jekyll, en lugar de los 53 KB del sitio.

**La causa, en la configuración del repositorio:**

```
build_type: "legacy"
source:     { branch: "main", path: "/" }
```

GitHub Pages estaba en **«Deploy from a branch»**: construía el repositorio por su cuenta con Jekyll e
**ignoraba el artefacto de nuestro workflow**. La configuración correcta —la que **D36** daba por hecha al
elegir `withastro/action@v6` + `actions/deploy-pages@v5`— es **«GitHub Actions»**, y nunca se puso.

### Por qué el sitio funcionó igual durante tres días

Porque **el build de Jekyll fallaba**. El historial de ejecuciones del 11 de agosto lo muestra sin
ambigüedad:

```
08-11T23:07  success  Deploy to GitHub Pages       [push]      ← el nuestro
08-11T23:07  failure  pages build and deployment   [dynamic]   ← Jekyll
   ... y así en los siete intentos de esa noche
```

Al fallar el despliegue legacy, el último válido era el nuestro. **El sitio del 11 de agosto estuvo
correctamente publicado —D50 no fue un falso positivo—, pero por una carambola.**

Y el rediseño la deshizo: al borrar los archivos que hacían fallar a Jekyll, **Jekyll construyó por primera
vez y ganó la carrera**. El sitio no se rompió por un error del despliegue, sino porque **dejó de fallar lo
que lo estaba sosteniendo**.

### Lo que se hizo

1. **Mitigación inmediata:** relanzar `deploy.yml` para volver a ser el último despliegue. Restauró el
   sitio, pero era temporal — el siguiente push a `main` (incluido el sync horario) lo habría pisado otra
   vez.
2. **Arreglo de fondo (D56):** `Settings → Pages → Source: GitHub Actions`. Requiere permisos de
   **administrador**: la cuenta `camilomeneses` es colaboradora y la API devolvió `404`, así que lo ejecutó
   Camilo con la cuenta de administración de RIBIE. De paso quedó activado **Enforce HTTPS**, que estaba en
   `false`.

---

## 3. Verificación final, sobre el dominio

```
build_type: workflow · https_enforced: true · cert approved hasta 2026-11-09
HTTP/2 200 · 53 297 bytes · 0 rastros de Jekyll
<title>RIBIE — Red Iberoamericana de Informática Educativa</title>
0 apariciones de #2B2BF5 (el azul del Alan Turing Institute)
CYTED ×5 · 1990 ×8 · XV Foro ×4 · 74 marcas «por confirmar»
12 imágenes optimizadas · franja «sitio en preparación» presente
```

**El rediseño `institucional con evidencia` está en producción.**

---

## 4. Lo que sigue abierto

1. 🔴 **La página propia del XV Foro (D52)** no existe: el build emite una sola página. La decisión sigue
   implementada a medias.
2. 🔴 **El acta de aceptación del hito** — entregado y ahora también rediseñado, pero **nunca aceptado
   formalmente** (`[[administracion-contratos-po]]`).
3. ⚠️ **La constancia escrita de la autorización de RIBIE** para el rediseño.
4. ⚠️ **Las fechas del XV Foro** siguen sin validar. Ahora al menos se publican **marcadas**, que era el
   objetivo de D52: el riesgo pasó de "dato falso publicado como firme" a "dato visible como provisional".
5. **Contenido que solo RIBIE puede dar:** nombres de `colaboradores`, URL de `redes`, número de países y
   la ciudad de contacto. Y `mostrar_franja_preparacion` no pasa a `no` hasta que validen textos, cifras y
   años.
