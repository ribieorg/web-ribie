# Contenido de demostración — para presentar el sistema el 28 jul 2026

RIBIE no cargó contenido en el Drive dentro del plazo (tope: lunes 27 de julio). Estas hojas
existen para **presentar el sistema funcionando** el 28: el sitio se ve completo y, al mismo
tiempo, declara en pantalla que lo que muestra es material provisional.

> ⚠️ **No es contenido aprobado.** Todo lo de aquí lo redactó Renovatio Software. Se publica
> con las marcas de "contenido provisional" encendidas (`mostrar_marcas = si` en la hoja
> `textos`) precisamente para que nadie lo confunda con información oficial de la red.

## Cómo se carga

Cada archivo corresponde a **una pestaña** del cuaderno de contenido en el Drive institucional.
Se pega reemplazando el contenido actual de la pestaña (`Ctrl+A` → pegar), y luego:

```bash
cd ~/Documentos/Proyectos/web-ribie
pnpm sync      # descarga las hojas y las imágenes del Drive → src/data/contenido.json
pnpm build     # compila el sitio
```

⏱️ Google **cachea las hojas publicadas unos 5 minutos**: si `pnpm sync` no ve el cambio recién
pegado, no es un fallo del script — hay que esperar y repetir.

## Qué trae cada hoja

| Hoja | Estado del contenido |
|---|---|
| `textos.csv` | Textos ya redactados a partir de las fuentes de RIBIE + **cuatro cifras**. Solo `cifra_anios` (36) está verificada; las otras tres son de relleno y el sitio las pinta en gris con la nota "por confirmar". `contacto_correo` **sí es real**: `contacto@ribie.org` existe en Email Routing. |
| `eventos.csv` | XV Foro con los datos **verificados** en los requerimientos del 13 jul (sede, modalidad, primera semana de octubre). El día exacto y el enlace de inscripción van vacíos a propósito: el sitio muestra "Días por confirmar" y deja el botón inactivo en vez de inventar una fecha o un enlace muerto. |
| `nodos.csv` | Instituciones tomadas de la **memoria del Congreso de RIBIE-Col (2010)**, no de un listado vigente. Se publican con una advertencia visible sobre el propio listado. La Universidad de Nariño es la única con logotipo, y viene del Drive: sirve para demostrar que **las imágenes se descargan de las carpetas**. |

## 📷 Fotografía: RETIRADA el mismo 28 jul 2026

✅ **Ya no hay imágenes provisionales en el repositorio.** Durante unas horas del 28 de julio el sitio
llevó cinco fotografías de Pexels marcadas como provisionales (**D44**); se borraron esa misma jornada al
implementar la maqueta definitiva (**D48**), y `src/assets/mockup/` ya no existe.

En su lugar, cada hueco de fotografía se **declara** con el componente `Rayado.astro`: un rayado plano
inclinado en el ángulo de la marca, con un pie que dice qué imagen falta y en qué tamaño —
`[ foto: sesión de trabajo de la red — 2400 × 1400 ]`. Hay dos, en el **hero** y en la **banda del XV Foro**.

Por qué se prefiere al stock: un hueco declarado comunica el estado real del sitio mejor que una imagen
prestada, **no puede confundirse con un registro de la red** —que es lo que el `BRIEF` del grupo UdeNar
prohíbe expresamente— y no arrastra 400 KB que habrá que borrar después. La regla de `docs/DESIGN.md`
§8.5 (*"si no hay foto real, se cae la sección"*) **vuelve a regir sin excepciones**.

**Cuando llegue el material de RIBIE:** se sustituye cada `<Rayado>` por un `<Image>` de `astro:assets`
en la misma caja. La maqueta no se entera — los huecos ya tienen la proporción y la posición finales.

## Lo que deliberadamente NO se rellenó

- **Colaboradores** — inventar académicos con nombre y cargo en el sitio de una red real es el
  riesgo que no vale la pena correr: el dato de un mockup termina dándose por cierto. La sección
  conserva el marcador que indica qué va allí y en qué formato.
- **Redes sociales** — no se inventan URLs: un enlace roto en el pie es peor que la nota
  "enlaces pendientes" que se muestra ahora.
- **Retratos y fotografías** — el `DESIGN.md` prohíbe stock (§8.5), y desde el 28 jul por la tarde
  esa prohibición vuelve a aplicarse sin excepción: los huecos se declaran, no se rellenan.

## Al llegar el contenido real

1. RIBIE reemplaza los valores en sus hojas y sube las imágenes a las carpetas del Drive.
2. Se revisa que no quede ninguna fila de relleno (sobre todo las tres cifras y los nodos).
3. `mostrar_marcas` pasa a **`no`** → desaparecen las etiquetas, la banda de "Sitio en
   preparación" y la advertencia del listado de nodos, sin tocar una línea de código.
4. `pnpm sync && pnpm build` y se publica.
