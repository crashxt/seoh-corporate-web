# Identidad SEOH DESIGN TECH

Todo lo que hay aquí se genera con scripts desde `brand-src/`. No se edita a
mano: si la marca cambia, se cambia la fuente y se regenera, y así ninguna
variante puede quedar desincronizada de las demás.

| Comando | Qué regenera |
| --- | --- |
| `npm run formatos` | El paquete de formatos de `formatos/` |
| `npm run papeleria` | Tarjeta y firma de correo |
| `npm run plantillas` | Membrete y oficio en Word |
| `npm run images` | Los assets que sirve el sitio web |

## `formatos/` — el paquete que se entrega

Es lo que se manda a una imprenta, a un proveedor o a quien pida "el logo".

**`logotipo/`** — la marca completa con el nombre. Es la versión por defecto.
**`marca-s/`** — solo el símbolo, para cuando el contexto ya identifica a la
empresa o no cabe el nombre.

De cada uno hay cinco medidas (4K, 2K, HD, web, mini) en dos acabados:

- **`_transparente.png`** — el de referencia. Se monta sobre cualquier fondo
  claro.
- **`_fondo_claro.png`** — para quien no sabe manejar transparencias, que es la
  mayoría de la gente fuera del diseño.
- **`_fondo_blanco.jpg`** — para sistemas que no admiten PNG: algunos
  formularios de registro y plataformas de terceros.

**`vector-una-tinta/`** — los únicos archivos realmente escalables del paquete.
Silueta de la S trazada como vector, en azul, negro y blanco. Son para sellos,
grabado, vinilo de vehículo, bordado en uniformes y cualquier impresión a una
sola tinta.

> **Importante sobre el resto de archivos:** el logotipo original es una
> ilustración rasterizada, no un vector. Los PNG de 4K cubren cualquier
> impresión de tamaño razonable, pero no son escalables hasta el infinito. Para
> una gigantografía o un rótulo grande hay que redibujar el arte en vector; ver
> la nota al final.

## `plantillas/`

| Archivo | Para qué |
| --- | --- |
| `SEOH_membrete.docx` | Hoja con membrete, en blanco. Cualquier documento institucional. |
| `SEOH_oficio.docx` | Oficio con la estructura formal completa y sus campos. |
| `SEOH_tarjeta_presentacion.svg` | Tarjeta de 90 × 50 mm con 3 mm de sangrado, dos caras. |
| `SEOH_firma_correo.html` | Firma de correo compatible con Outlook y Gmail. |

Las dos plantillas de Word llevan la marca en el encabezado y el contacto en el
pie, así que se repiten solas en cada hoja. Son A4, el formato vigente en
Ecuador.

## Color

| Uso | HEX | CMYK aprox. | Pantone aprox. |
| --- | --- | --- | --- |
| Azul primario | `#0057B8` | 100 / 65 / 0 / 0 | 2935 C |
| Azul profundo | `#003B7E` | 100 / 78 / 18 / 5 | 2945 C |
| Fondo claro | `#EEF3F9` | 5 / 2 / 0 / 0 | — |
| Tinta de texto | `#0C1A2B` | 80 / 65 / 45 / 45 | — |
| Cian de marca | `#41D7FF` | **no reproducible** | — |

El cian está fuera del gamut CMYK: en offset sale un gris azulado apagado. Se
usa solo en pantalla y dentro del propio logotipo, nunca como tinta plana ni
como color de texto en impresos.

## Antes de mandar algo a imprenta

1. Convertir todo el texto a curvas.
2. Convertir el documento a CMYK.
3. Comprobar los 3 mm de sangrado y que ningún texto entre en los 5 mm
   interiores: el guillotinado tiene tolerancia.
4. Si el color debe ser idéntico entre tiradas, especificar Pantone 2935 C como
   tinta directa y pedir prueba de color.

## Pendiente

- **Datos de contacto reales.** Teléfono y correo definitivos en las plantillas,
  que hoy van entre corchetes.
- **Vector editable del logotipo completo.** Los SVG y PDF del paquete de
  formatos que recibió la empresa **no son vectores**: son el mismo PNG metido
  dentro de una carcasa SVG, y el propio archivo `LEEME.txt` de ese paquete lo
  advierte. Para tener un vector real del logotipo con su volumen hay que
  redibujarlo. Lo que sí está resuelto es la silueta a una tinta, en
  `formatos/vector-una-tinta/`.
