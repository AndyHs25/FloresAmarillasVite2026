# Flores amarillas

Regalos digitales personalizados con flores amarillas. Es una aplicación estática hecha con Vite y TypeScript, sin backend ni base de datos.

## Arquitectura

- `src/main.ts`: composición de las vistas, navegación por pathname y eventos del formulario.
- `src/validation.ts`: normalización y validación segura de nombres.
- `src/url.ts`: generación de enlaces con `encodeURIComponent`.
- `src/components.ts`: markup reutilizable del ramo SVG y los pétalos.
- `src/style.css`: sistema visual responsive, animaciones CSS y soporte para `prefers-reduced-motion`.

La página inicial vive en `/`. La vista de regalo vive en `/flores?nombre=Camila`. El nombre obtenido desde la URL se valida otra vez y se inserta mediante `textContent`, nunca como HTML.

## Ejecutar

Requisitos: Node.js 18 o superior.

```bash
npm install
npm run dev
```

Abre la URL que muestre Vite, normalmente `http://localhost:5173/`.

## Compilar para producción

```bash
npm run build
npm run preview
```

El resultado se genera en `dist/` y puede desplegarse como sitio estático. El servidor de producción debe redirigir las rutas desconocidas a `index.html` para que los enlaces directos a `/flores?nombre=...` carguen la SPA. En Netlify se puede usar un archivo `_redirects` con `/* /index.html 200`; en Vercel, una regla equivalente de rewrites.
