# Qué falta cargar en las hojas del Drive

_Diagnóstico del **29 de julio de 2026**, hecho leyendo directamente las hojas publicadas con
`pnpm sync:check`. No es una suposición: es lo que devuelven las URLs de `scripts/hojas.config.mjs`._

---

## El resumen en una línea

**El sitio no está roto ni le falta código: las hojas están a medio llenar.** Cuatro celdas vacías, dos
filas en `borrador` y cinco enlaces sin URL bastan para explicar todos los huecos que se ven hoy.

| Hoja | Lo que devuelve el Drive | Lo que llega al sitio |
|---|---|---|
| `textos` | 15 filas | 11 · **4 celdas vacías** |
| `eventos` | 1 fila | **0** · está en `borrador` |
| `nodos` | 1 fila | 1 |
| `colaboradores` | 1 fila | **0** · está vacía y en `borrador` |
| `redes` | 5 filas | **0** · sin URL y con `activo = no` |

---

## 1. Hoja `textos` — cuatro celdas vacías

Estas cuatro claves existen pero **su columna `valor` está en blanco**. El sitio no inventa datos: por eso
las cifras salen en gris con la nota *"por confirmar"* y el pie dice *"Correo institucional — falta
publicarlo en la hoja"*.

| Clave | Qué escribir | Nota |
|---|---|---|
| `cifra_paises` | El número de países miembros | ⚠️ **Lo tiene que decir RIBIE.** No es el 19 del CYTED: esos son los países que originaron la red en 1984, no sus miembros de hoy |
| `cifra_grupos` | Grupos de investigación | ⚠️ Sin confirmar por RIBIE |
| `cifra_instituciones` | Instituciones asociadas | ⚠️ Sin confirmar por RIBIE |
| `contacto_correo` | `contacto@ribie.org` | ✅ **Este sí se puede escribir ya.** La dirección existe y funciona en Cloudflare Email Routing desde el 27 de julio; lo único que falta es publicarla |

> 💡 Si escribes las cifras y **`mostrar_marcas` sigue en `si`**, los números aparecen pero conservan su
> nota "por confirmar". Es lo correcto mientras RIBIE no las valide: se ve la maqueta completa y el aviso
> sigue puesto. La nota desaparece sola cuando `mostrar_marcas` pase a `no`.

## 2. Hoja `eventos` — el XV Foro está en borrador

La fila `xv-foro-2026` ya existe y **trae un dato que el sitio todavía no muestra: las fechas exactas,
5 a 7 de octubre de 2026** (`fecha_inicio` y `fecha_fin`). Está en `estado = borrador`, así que el sitio
la descarta entera y cae al texto de respaldo ("Primera semana de octubre").

Para publicarla:

1. `estado` → **`publicado`**
2. `descripcion` → está **vacía**. Hay un texto ya redactado en
   `plantillas-hojas/demostracion/eventos.csv` que puedes pegar tal cual.
3. `enlace_inscripcion` → déjalo vacío mientras no exista. El sitio muestra el botón desactivado con la
   nota "Enlace pendiente de RIBIE", que es preferible a un enlace muerto.

> ⚠️ Antes de publicar, **confirma las fechas con RIBIE.** Que estén escritas en la hoja no significa que
> alguien de la red las haya validado, y una vez publicadas la gente organiza viajes con ellas.

## 3. Hoja `colaboradores` — una fila vacía en borrador

Hay una sola fila, con `grupo = Dirección` y **todo lo demás en blanco**, en `estado = borrador`.

Aquí no hay nada que arreglar por nuestra parte: hacen falta **nombres reales de personas** (comité
científico, organización, dirección) con su cargo e institución. Es el único contenido del sitio que
deliberadamente **no se rellenó ni siquiera como demostración**: inventar académicos con nombre y cargo
en el sitio de una red real es el riesgo que no vale la pena correr.

Mientras tanto el sitio muestra el bloque de "aquí irá el comité científico…" con su formato.

## 4. Hoja `redes` — cinco filas sin URL

Instagram, Facebook y YouTube (más dos) están listadas con `url` vacía y `activo = no`. El sitio las
descarta y muestra "Redes sociales — enlaces pendientes".

Cuando RIBIE entregue sus perfiles: pegar la URL completa y poner `activo` en **`sí`**. Sin URL, dejarlas
en `no` — un enlace roto en el pie es peor que la nota.

## 5. Hoja `nodos` — solo la Universidad de Nariño

Es la única cargada, y está completa (con sitio web y logotipo, que el sitio descarga solo del Drive).

Faltan los demás nodos de la red. El muro de la sección "Nodos e instituciones" está hecho para mostrar
**país arriba y sede de coordinación debajo**, así que por cada nodo hacen falta al menos `pais` y
`nombre_oficial`. El logotipo es opcional.

> ⚠️ Este listado se lee como una **afirmación de pertenencia institucional**. No conviene cargarlo con
> una lista tomada de memorias antiguas sin que RIBIE confirme quiénes integran la red hoy: mientras no
> lo confirmen, el sitio publica la advertencia que se ve sobre el listado.

---

## Cómo aplicar los cambios

1. Abre el cuaderno de contenido en el Drive institucional y edita las celdas.
2. Espera unos minutos: **Google cachea las hojas publicadas alrededor de 5 minutos.** Si `pnpm sync` no
   ve el cambio recién guardado, no es un fallo del script.
3. En el proyecto:

```bash
cd ~/Documentos/Proyectos/web-ribie
pnpm sync:check   # solo valida y muestra qué trae cada hoja, NO escribe nada
pnpm sync         # descarga hojas e imágenes → src/data/contenido.json
pnpm build        # compila el sitio
```

`sync:check` es el que conviene correr primero: dice cuántas filas ve en cada hoja sin tocar el
repositorio.

---

## Mientras tanto: el modo demostración

Para ver la maqueta **llena** sin depender del Drive, el proyecto trae `src/data/demo.json`, que se
carga **solo en desarrollo**:

```bash
pnpm dev          # el sitio se ve completo: 18 nodos, noticias, proyectos, colaboradores
```

⚠️ **Ese contenido no llega nunca a producción.** `pnpm build` no activa el modo demo, y está verificado
en cada compilación (`grep` sobre `dist/index.html`). Los datos de `demo.json` son **plausibles pero
inventados** —"Chile → Universidad de Chile" no lo ha confirmado nadie— y por eso viven detrás de una
puerta de entorno en vez de en las hojas.

Si necesitas enseñar el mockup completo a alguien fuera de tu máquina, se puede compilar con
`PUBLIC_DEMO=1 pnpm build`, pero **ese build no se publica en `ribie.org`** bajo ninguna circunstancia.
