# Frontend — Alma Boho

Interfaz web del proyecto **API_1C_2026**: tienda de moda boho construida con **React** y **Vite**. Consume la API REST del backend Spring Boot (`goated`) para autenticación, catálogo, carrito y pedidos. Si el backend no está disponible, algunas pantallas usan datos locales de respaldo.

## Funcionalidades

- Catálogo de productos y detalle por artículo
- Registro e inicio de sesión (JWT)
- Carrito de compras y checkout con códigos de descuento
- Página de contacto

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior (se recomienda la versión LTS)
- Backend **goated** en ejecución (ver [README del repositorio](../README.md))

## Instalación

Desde la carpeta `frontend`:

```bash
npm install
```

## Configuración (opcional)

Por defecto la app apunta a `http://localhost:8080`. Para usar otra URL de la API, creá un archivo `.env` en esta carpeta:

```env
VITE_API_URL=http://localhost:8080
```

## Ejecución

1. Levantá el backend (puerto **8080** por defecto).
2. En `frontend`, iniciá el servidor de desarrollo:

```bash
npm run dev
```

3. Abrí en el navegador la URL que muestra Vite (normalmente `http://localhost:5173`).

## Otros comandos

| Comando           | Descripción                          |
|-------------------|--------------------------------------|
| `npm run build`   | Genera la versión de producción      |
| `npm run preview` | Previsualiza el build de producción  |
| `npm run lint`    | Ejecuta ESLint sobre el código       |

## Estructura principal

```
src/
  components/   # Navbar, Footer, tarjetas de producto, etc.
  context/      # Autenticación y carrito
  pages/        # Rutas de la aplicación
  services/     # Cliente HTTP hacia la API
  data/         # Datos de respaldo cuando la API no responde
```

## Rutas de la aplicación

| Ruta              | Pantalla        |
|-------------------|-----------------|
| `/`               | Inicio          |
| `/catalogo`       | Catálogo        |
| `/producto/:id`   | Detalle         |
| `/carrito`        | Carrito         |
| `/checkout`       | Finalizar compra|
| `/login`          | Inicio de sesión|
| `/registro`       | Registro        |
| `/contacto`       | Contacto        |
