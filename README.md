# Balajú — sitio web

Página de una sola vista (HTML + CSS + JS, sin dependencias) para Balajú, Texcoco Centro y Chiconcuac.

## Estructura

- `index.html` — contenido: hero Mañana/Tarde/Noche, La casa, Menú, Sucursales, A domicilio, Instagram
- `styles.css` — estilos; la paleta está en las variables de `:root`
- `main.js` — menú móvil, momento del día según la hora de CDMX, pestañas del menú, aviso "Abierto ahora"
- `assets/` — logo en alta resolución (color y versión blanca), favicons
- `assets/img/` — fotos optimizadas en WebP (700 y 1400 px), tomadas de `pictures/`
- `pictures/` — fotos originales de Instagram (294 MB). **No se publica**: el sitio solo usa `assets/`.

## Ver en local

```bash
python -m http.server 5173
```

Luego abrir http://localhost:5173

## Skills de diseño instaladas (`.claude/skills/`)

| Skill | Fuente | Uso en este sitio |
| --- | --- | --- |
| frontend-design | anthropics/skills | Plan de color/tipo/layout y evitar los rasgos de "página generada" |
| impeccable | pbakaus/impeccable | Modo Persuade, craft floor (contraste, estados, superficies del navegador) |
| emil-design-eng, animate, review-animations, find-animation-opportunities | emilkowalski/skills | Animaciones: entradas, scroll reveal, escalonados, easing y duraciones |
| web-design-guidelines | vercel-labs/agent-skills | Revisión de accesibilidad y UX |
| webapp-testing | anthropics/skills | Pruebas con Playwright (requiere `pip install playwright`) |

## Animaciones

Todo con CSS y `IntersectionObserver`, sin librerías. Se definen en la sección "Movimiento" de `styles.css`:
entrada del hero (palabras y paneles), cinta de platillos, revelado al hacer scroll (una sola vez), parallax
en La casa (CSS scroll-driven, solo en navegadores compatibles), neón que se enciende, cascada del menú y
header que se oculta al bajar. Con "reducir movimiento" activado en el sistema, todo se muestra estático.

Los hooks automáticos de Impeccable no están activados y su binario no se ha ejecutado; se usaron solo sus guías en texto.

## Pendiente de confirmar con Balajú

- **Dirección de Chiconcuac**: viene de su ficha en Rappi (Prol. Hidalgo Sur 347, San Cristóbal, 56280).
- **Foto de Chiconcuac**: se usó una terraza con sombrillas que parece ser esa sucursal; confirmar.
- **Menú**: platillos de sus menús en Rappi y de los nombres que aparecen en sus publicaciones; sin precios a propósito.
- **Plataformas de entrega**: Rappi y Uber Eats enlazan a la tienda de Texcoco Centro (Uber Eats también tiene Chiconcuac). DiDi Food lleva a su página general; cambiar por la liga directa de Balajú. Los botones van con texto: los logos oficiales se piden a cada plataforma desde su portal de aliados.

El horario (L–V 8:00–22:00, S–D 8:30–22:00) está confirmado por su publicación "Nuevo horario".

## Publicar

Subir todo **excepto** `pictures/` y `.claude/` a Netlify, Vercel, GitHub Pages o Cloudflare Pages.
