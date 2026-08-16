# 15 ago 2026 — El icono del sitio, con los archivos que entregó la red

_Registra la decisión **D57**. Cierra un icono que llevaba un día publicado sin registro._

---

## 1. Qué había, y por qué no bastaba

El 14 de agosto el sitio estrenó icono de pestaña (commit `2c0daaa`), y lo estrenó **sin `Dxx`, sin
avance y sin una línea en el `DESIGN.md`**. El archivo no era el de la red: era el isotipo **recortado y
montado sobre el turquesa `#096D84`** por nosotros, con una justificación escrita en el propio
`Base.astro` que citaba el manual de marca (p. 3, *uso sobre fondos oscuros*) para autorizarse el fondo.

Estaba razonado, pero era una **derivación del material de marca del cliente hecha sin consultar** —de la
misma familia que la sustitución tipográfica de **D28** y los seis colores de **D43**, que siguen a deber
esa consulta.

## 2. Lo que llegó

Camilo entregó el paquete generado por la red en `src/favico/favicon_io/`: `favicon.ico`,
`apple-touch-icon.png` (180 px) y los dos `android-chrome` de 192 y 512 px. Mismo isotipo, **sobre blanco**.

Se ofreció una tercera vía —usar esos PNG como fuente y aplanarles el turquesa— con el argumento medido:
a 16 px el isotipo sobre blanco se deshace en puntos sueltos, y en pestañas de tema oscuro los nodos
verdes pierden contraste. **La decisión fue publicarlos tal cual.** El criterio manda sobre la mejora: el
icono es material entregado, y una mejora sobre él se ofrece, no se aplica.

## 3. Lo que se hizo

Los cuatro archivos se copiaron a `public/` conservando **nuestros nombres** —`icon-192`, no
`android-chrome-192x192`— porque son los que ya declaraba `site.webmanifest`. Verificado con `md5sum`
que la copia es **byte a byte**.

El manifiesto **no se reemplazó** por el del generador: ese llega con `name` y `short_name` vacíos y
`display: standalone`, que anunciaría el sitio como aplicación instalable. El nuestro conserva el nombre
completo de la red, `display: browser` y `theme_color: #096D84`.

El comprimido `favicon_io.zip` queda fuera del control de versiones (`.gitignore`); los PNG sueltos sí se
versionan, para que una regeneración futura parta del original y no de un reescalado de lo publicado.

### 🕳️ El fondo no era transparente: era blanco opaco

Al intentar el recoloreado apareció el primer dato que no se ve mirando la imagen. El canal alfa del PNG
de 512 px da `getextrema() == (255, 255)`: **opaco en todo el lienzo**. No hay transparencia que
respetar — hay un rectángulo blanco.

Eso descarta la vía obvia (reemplazar el blanco por turquesa): el isotipo tiene **brillos casi blancos**
en la esfera amarilla y en las azules, y un reemplazo por color los habría perforado. La vía correcta era
recortar por **flood-fill desde las cuatro esquinas**, que solo alcanza el blanco conectado al borde. Se
implementó y funcionó; no se usó, porque la decisión fue no colorear. Queda la lección.

### 🕳️ `file` no enumera todos los tamaños de un `.ico`

`file` describió el archivo entregado como *«MS Windows icon resource - 3 icons, 16x16, 32 bits/pixel,
32x32, 32 bits/pixel»*: **declara tres y enumera dos**. Por creerle salió publicado un
`sizes="32x32 16x16"` que anunciaba de menos. Abriendo el archivo aparece la verdad:

```
Image.open('favicon.ico').ico.sizes()  →  {(16,16), (32,32), (48,48)}
```

Corregido el mismo día en `486af86`. Un `.ico` es un contenedor: el `sizes` del `<link>` debe describir lo
que hay **dentro**, y eso se comprueba abriéndolo.

## 4. Verificación, sobre el dominio

No se verificó el `dist/` sino lo que sirve `ribie.org`:

| Recurso | Respuesta | Bytes |
|---|---|---|
| `/favicon.ico` | `HTTP 200` · `MD5 4effcdb5…` **idéntico al entregado** | 15 406 |
| `/apple-touch-icon.png` | `HTTP 200` | 31 194 |
| `/icon-192.png` | `HTTP 200` | 35 017 |
| `/icon-512.png` | `HTTP 200` | 141 130 |

El HTML en vivo declara `<link rel="icon" href="/favicon.ico" sizes="48x48 32x32 16x16">`. Los dos
despliegues (`3c5d956` y `486af86`) corrieron en verde.

⚠️ **El favicon no se ve cambiado de inmediato:** los navegadores lo cachean por fuera del caché normal
de la página. Para comprobarlo hay que abrir `ribie.org/favicon.ico` directo o una ventana de incógnito;
no es un fallo del despliegue.

## 5. Lo que sigue abierto

- 🔴 Las consultas de **D28** (tipografía) y **D43** (los seis colores vivos, ya retirados por **D51**)
  siguen sin plantearse formalmente a la red. D57 no las cierra: solo deja de sumar una más.
- 🔴 El hito del sitio sigue **entregado y no aceptado** (D50): falta el acta.
