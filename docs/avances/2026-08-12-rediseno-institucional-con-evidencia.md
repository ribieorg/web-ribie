# 12 ago 2026 — El sitio publicado, y por qué hay que rediseñarlo

_Decisiones **D50, D51, D52, D53 y D54** del `00_SDD-ADDENDUM`. Sistema de diseño: `docs/DESIGN.md` §14._

---

## 1. El sitio está publicado (D50)

Verificado el 12 de agosto sobre el dominio, no sobre el repositorio:

```
HTTP/2 200 · server: GitHub.com
last-modified: Tue, 11 Aug 2026 23:07:49 GMT
subject=CN = ribie.org
notBefore=Aug 11 21:15:59 2026 GMT   notAfter=Nov  9 21:15:58 2026 GMT
```

El certificado de Let's Encrypt se emitió el **11 de agosto a las 21:15 UTC** y el `last-modified`
coincide con el último commit de esa jornada. El bloqueo de titularidad que impidió cumplir el hito del
28 de julio —el acceso a la organización `ribieorg`— quedó resuelto: el repositorio existe, el `CNAME`
está creado y el despliegue corre.

Con eso se cierra **el único entregable comprometido de Renovatio** (D40), con catorce días de retraso, y
se recupera el −0,5 de mail-tester del 27 de julio, cuya única penalización era el enlace roto a un sitio
que no existía.

⚠️ **La jornada del 11 no se documentó el mismo día.** Nueve commits, contenido real cargado y el sitio
en vivo, sin decisión `Dxx`, sin avance y sin actualizar el tablero — que seguía diciendo *"publicar en
GitHub Pages es lo único que falta"*. Es exactamente el drift que originó **D40**, repetido. La fila D50
lo consolida retroactivamente.

---

## 2. El azul no era de RIBIE (D51)

El cliente dijo que el sitio no refleja lo que debe reflejar una red de grupos de investigación
universitarios. Puesto el hero de `ribie.org` al lado del de `turing.ac.uk`:

> el mismo azul eléctrico, la misma diagonal, el mismo negro a la izquierda,
> las mismas tarjetas de color con flecha a la derecha.

**§11 adoptó el Alan Turing Institute como referencia y lo que trasladó fue su firma de marca, no su
método** — incluido `#2B2BF5`, que es su color corporativo. El turquesa `#096D84` del manual de RIBIE
quedó reducido a un detalle. Por eso el cliente no se reconoce: el sitio se parece a otra institución.

Y hay una diferencia estructural que explica por qué allí funciona y aquí no. En el Turing, esas tarjetas
llevan **producción real fechada**: artículos, resultados, convocatorias. En RIBIE llevan enlaces a
anclas de la misma página. Se copió la estructura sin el contenido que la sostiene.

### El hallazgo que lo resuelve

| Uso de los 8 secundarios del manual | Medido |
|---|---|
| Como **texto sobre blanco** | 2,53–3,79:1 ❌ |
| Como **bloque de color con tinta `#111827`** | **4,68–7,01:1** ✅ |

§2 los declaró decorativos porque fallaban como texto, y §11 dedujo de ahí que hacía falta una paleta
nueva. **La deducción era falsa: fallaban en un uso, no en todos.** Los seis colores ajenos al manual
—azul, púrpura, magenta, verde neón, turquesa fosforescente, amarillo— nunca fueron necesarios.

### Las referencias, esta vez del nicho

Revisadas en vivo: **CYTED** (el programa que creó RIBIE en 1990; encabeza con *67 redes · 22 países ·
1.608 instituciones · 6.410 integrantes*), **CLACSO** (portada como sala de novedades, menú por función
académica), **RedCLARA** (fotografía real de investigación) e **IAS Princeton** (autoridad solo con
tipografía y contenido fechado).

Ninguno usa diagonales, bloques saturados ni titulares gigantes. Y los cuatro publican lo que RIBIE
todavía no: memorias, actas, personas con su afiliación.

> 💡 De paso: CYTED declara **22 países**. Es muy probable que el «21 países» de RIBIE venga de ahí y se
> refiera al programa, no a los nodos activos. Preguntado en el brief.

---

## 3. Lo que se retira y lo que se abre (D52)

**Actualidad y Proyectos se retiran** hasta que exista contenido. Llevan desde el 29 de julio como huecos
declarados ocupando casi un tercio del recorrido, y la regla de §8.5 —*si no hay contenido real, la
sección no existe*— también las alcanza. Vuelven solas cuando el grupo cargue una fila.

**Se abre página propia del XV Foro**, porque en octubre será lo más consultado del sitio y una sección
con anclas no alcanza para una convocatoria con seis ejes, fechas y plazos. No altera lo pactado: sigue
siendo sitio informativo con enlaces a los servicios que opera la red.

🔴 **Y aparece un riesgo que no depende del rediseño.** Las fechas del XV Foro —5 al 7 de octubre de
2026— **están publicadas en vivo**: la fila pasó de `borrador` a `publicado` en la hoja y el sitio las
muestra como dato firme, cuando el 29 de julio se dejó escrito que *nadie de la red las ha validado*. De
ahí sale el **sistema de estados del dato**: `confirmado` · `por confirmar` · `sin dato`.

---

## 4. Movimiento: la plataforma, no la librería (D53)

Se pidió que el sitio muestre el oficio del estudio, con `akaru.fr` como referencia. **Se rechaza la
referencia y se conserva la intención.**

Akaru es una agencia creativa: su sitio *es* su portafolio, y su público son marcas buscando agencia.
RIBIE es una red académica: su sitio es un servicio de información para investigadores y decanos de toda
Iberoamérica. Tres razones concretas:

1. **Presupuesto y política.** Ese tipo de sitio exige Lenis o GSAP más WebGL. Ya pasó con `border-beam`:
   68 KB, presupuesto de §10 superado, revertido a las doce horas (D45 → D48).
2. **Accesibilidad.** El scroll secuestrado rompe la navegación por teclado y desorienta a los lectores
   de pantalla, y va mal en equipos modestos.
3. **La tarea del sitio.** Quien entra a buscar las fechas del foro quiere el dato, no una experiencia.

La alternativa es **más demostrativa, no menos**: `animation-timeline: view()` y `scroll()`, `sticky` para
los recorridos, trazado de SVG y View Transitions. **0 KB de JavaScript.** Cualquiera instala una
librería; resolverlo con la plataforma es lo que distingue a un estudio.

---

## 5. El contrato de contenido pasa de 5 a 8 hojas (D54)

| Hoja | Hoy | Nuevo contrato |
|---|---|---|
| `textos` | ✅ | claves nuevas; `cifra_*` **se muda** a `cifras` |
| `eventos` | ✅ | columna nueva `fechas_confirmadas` |
| `nodos` · `redes` · `colaboradores` | ✅ | sin cambios |
| `cifras` · `hitos` · `lineas` · `memoria` | ❌ | **cuatro hojas nuevas** |
| `noticias` · `proyectos` | vacías | desaparecen (D52) |

El contenido de la historia, las líneas de trabajo, las cifras y los pies del archivo **hoy vive
incrustado en el código**: ni RIBIE ni el grupo pueden corregirlo sin pedírnoslo, que es justo lo que D39
quería evitar. Y el estado deja de ser por sección para ser **por dato** — hoy el «21 países, por
confirmar» está escrito a mano en el código; ahí sería una celda.

⚠️ **No es más trabajo para la red:** esas cuatro hojas las llena Renovatio una vez con el contenido que
ya redactó. El costo real es de migración: publicar 4 URLs, actualizar `scripts/hojas.config.mjs` y el
`ESQUEMA` de `sync-contenido.mjs`, y mover `cifra_anios`/`cifra_paises` sin romper lo que está en vivo.

---

## 6. Verificación

- **Contrastes de la paleta propuesta** — 12 pares medidos con la fórmula WCAG. Todo pasa salvo lo que se
  declara: `--turquesa-claro` 3,94:1 y `--state-info` 2,73:1 no sirven como texto normal.
- **Auditoría del DOM sobre la maqueta de referencia** (`portada-v2.html`, recorriendo cada nodo de texto
  y su fondo efectivo): **tres títulos de bloque reprueban** —2,35 · 2,53 · 2,68:1 frente a un mínimo de
  3:1— por usar tinta `#065163` en vez de `#111827`. Con la tinta correcta darían 5,35 · 4,68 · 5,06.
- **`--focus-ring` ámbar da 2,49:1 sobre fondo claro** y `base.css` lo aplica a todo `:focus-visible`:
  reprueba el mínimo de 3:1 y afecta a toda la navegación por teclado. Sobre turquesa profundo sí pasa
  (3,57:1).

Es el mismo patrón del 29 de julio, y por tercera vez: **el color se eligió mirando, no calculando.**

---

## 7. Pendientes

**Antes de implementar**
- Respuesta de RIBIE al brief — D51, D52 y D54 dependen de ella.
- Corregir los cuatro defectos de contraste del paquete.
- Decidir hoy, sin esperar al brief: si las fechas del Foro vuelven a `borrador`.

**Del paquete de diseño, a atajar**
- La maqueta de colaboradores **usa fotos de Unsplash**: es D44 otra vez, y ya se sabe cómo termina.
- Trae componentes de formulario (Field, Input, Select, Checkbox) que están **fuera de alcance por D40**.

**Heredados**
- Acta de aceptación del hito por el PO — el sitio está entregado, no aceptado.
- Constancia escrita del Anexo C (D47) y SLA del Anexo A, ambos abiertos dentro del convenio firmado.
- Cambios sin commitear en `EventCard.astro` y `Hero.astro` del 11 de agosto.
