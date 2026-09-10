# El botón del encuentro llevaba a un 404, y nada lo miraba

_9 de septiembre de 2026_

## Lo que se encontró

El segundo botón de la franja del encuentro —«Ver la agenda»— apuntaba a

```
https://licinfor.udenar.edu.co/wp-content/uploads/2026/09/agenda-e-identidad-EVENTO-RIBIE-2026f.pdf
```

que devuelve **404**. La Licenciatura reorganizó su sitio: renombró el PDF a
`IDENTIDAD-E-INFORMACION-EVENTO-RIBIE-2026.pdf` y publicó la página `/evento-2026/`. Nadie tenía por
qué avisarnos, y no había forma de enterarse salvo pulsando el botón.

## Lo que se hizo

**1. El botón lleva a la página, no al archivo.** `eventos.enlace_agenda` pasa a
`https://licinfor.udenar.edu.co/evento-2026/`. Una página institucional sobrevive al próximo
renombrado; un `.pdf` con fecha en la ruta, no. Y esa página enlaza el PDF desde dentro, así que no
se pierde nada.

**2. El rótulo se ajusta al destino.** «Ver la agenda» prometía horarios que la página no da —lo que
hay es bienvenida, información, identidad, talleres y ponentes—. Pasa a «Ver la información del
evento» con la clave nueva `convocatoria_boton_agenda` de la hoja `textos`, sin tocar el código.

**3. El sync comprueba que los enlaces sigan vivos.** `scripts/sync-contenido.mjs` recorre el
contenido ya armado, extrae las URLs que el sitio va a pintar y pregunta por cada una. Avisa; **no
corrige**: retirar un botón por una comprobación fallida sería peor que dejar uno roto.

## Cinco desenlaces, no dos

La distinción es lo que hace útil el aviso. Si «no pude preguntar» y «el servidor dice que no está»
gritaran igual, el ruido se comería el próximo 404 de verdad.

| Estado | Qué significa | Qué hacer |
|---|---|---|
| `ok` | responde < 400 | nada |
| `roto` | 404 o 410 | corregir la celda de la hoja |
| `dudoso` | otro ≥ 400 (403, 429, 5xx) | mirar: puede ser el servidor rechazando al robot |
| `cadena` | responde bien, pero el certificado llega sin la intermedia | avisar al tercero |
| `incomprobable` | no hubo respuesta (DNS, timeout, red) | nada; no dice nada del enlace |

### Por qué hay un segundo intento con la verificación relajada

`licinfor.udenar.edu.co` sirve **solo el certificado hoja**, sin la CA intermedia (`Thawte TLS RSA CA
G1`). Node falla con `UNABLE_TO_VERIFY_LEAF_SIGNATURE` **antes de llegar a ver el estado HTTP** — los
navegadores lo disimulan buscando el intermedio por su cuenta, que es la razón de que la página se
vea perfectamente y el problema pase inadvertido.

Sin remedio, el chequeo habría sido inútil justo para el sitio que lo motivó: el PDF muerto habría
salido como «no se pudo comprobar» para siempre. Así que ante **ese error y ningún otro** se
repregunta con `node:https` y `rejectUnauthorized: false`, se lee el código de estado y se descarta
la respuesta. Sale de ahí un número, nunca contenido. Un certificado vencido o de otro dominio sí
bloquea al visitante y tiene que seguir avisando, por eso no entra en la excepción.

## De paso: `--check` sí escribía

`pnpm sync:check` promete «valida sin escribir nada» y borraba imágenes: la limpieza de
`src/assets/remoto` corría antes de la salida anticipada. Con las hojas locales —que citan menos
fotos que las de Google— una validación de prueba se llevó por delante diez imágenes en uso. Ahora la
limpieza queda tras `SOLO_VALIDAR`.

## Pendiente

Las dos celdas equivalentes en las hojas de Google (`eventos.enlace_agenda` y
`textos.convocatoria_boton_agenda`). Mientras no se editen, la corrida horaria de `contenido.yml`
revierte el contenido a lo anterior — el commit del repositorio no es la fuente de verdad.
