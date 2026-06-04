# Frontend — Alma Boho

Tienda de moda boho del proyecto **API_1C_2026**, desarrollada con **React 19** y **Vite**.

## Modo de ejecución actual

La aplicación funciona **sin backend**: catálogo, autenticación, carrito, checkout, pedidos y panel admin usan datos en `src/data/` y **localStorage** del navegador. No hace falta levantar Spring Boot ni MySQL para probarla.


## Funcionalidades

### Tienda (cliente)

- Home, catálogo con filtros y búsqueda
- Detalle de producto y productos relacionados
- Carrito con cantidades, envío estimado y códigos de descuento
- Checkout en **3 pasos**: envío → método de pago → confirmación
- **Mis pedidos** e historial con detalle por pedido
- Registro e inicio de sesión
- Página de contacto
- Toast al agregar productos al carrito

### Administración

- Panel en `/admin` (solo rol admin)
- CRUD de productos (se reflejan en el catálogo de la tienda)
- Listado de pedidos y cambio de estado

### Métodos de pago (simulados)

- Tarjeta de crédito
- Tarjeta de débito
- Transferencia bancaria

No se procesa un cobro real; es una demostración de UI.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (recomendado LTS)

## Instalación y ejecución

```bash
cd frontend
npm install
npm run dev
```

Abrí la URL que muestra Vite (por defecto `http://localhost:5173`).

## Cuentas demo

| Rol    | Email           | Contraseña |
|--------|-----------------|------------|
| Cliente | `demo@alma.com` | `demo123`  |
| Admin   | `admin@alma.com` | `admin123` |

También podés **registrar** un usuario nuevo; se guarda en este navegador.

## Códigos de descuento

Usalos en el carrito: `VERANO10`, `BOHO15`, `ALMA20`.

## Scripts

| Comando           | Descripción                         |
|-------------------|-------------------------------------|
| `npm run dev`     | Servidor de desarrollo              |
| `npm run build`   | Build de producción en `dist/`      |
| `npm run preview` | Previsualizar el build              |
| `npm run lint`    | ESLint                              |

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio |
| `/catalogo`, `/productos` | Catálogo |
| `/producto/:id` | Detalle de producto |
| `/carrito` | Carrito |
| `/checkout` | Checkout (requiere login) |
| `/pedidos` | Mis pedidos (requiere login) |
| `/pedidos/:id` | Detalle del pedido |
| `/login` | Iniciar sesión |
| `/registro` | Crear cuenta |
| `/contacto` | Contacto |
| `/admin` | Panel admin (redirige a productos) |
| `/admin/productos` | Gestión de productos |
| `/admin/pedidos` | Gestión de pedidos |

## Estructura del proyecto

```
frontend/
├── src/
│   ├── components/       # UI reutilizable (Navbar, CartToast, admin…)
│   ├── context/          # AuthContext, CartContext
│   ├── data/             # Productos, categorías, métodos de pago
│   ├── pages/            # Pantallas de la tienda
│   ├── pages/admin/      # Panel de administración
│   ├── services/         # Lógica local (catálogo, auth, pedidos)
│   └── styles/           # Fuentes (Montserrat + Playfair Display)
├── _backup-backend-integration/  # Respaldo API Spring (futuro)
└── public/
```

## Persistencia local (demo)

| Clave | Contenido |
|-------|-----------|
| `boho_auth` | Sesión del usuario |
| `boho_cart` | Ítems del carrito |
| `boho_catalog` | Catálogo editado desde admin |
| `boho_orders` | Pedidos confirmados |
| `boho_users` | Usuarios registrados |

Los datos son **por navegador**. Limpiar el almacenamiento del sitio borra carrito, pedidos y sesión.

## Tipografías

- **Montserrat** — navegación, botones y textos de interfaz
- **Playfair Display** — títulos y marca “Boho”

## Integración con backend (futuro)

1. Levantar `goated` (Spring + MySQL) en `http://localhost:8080`
2. Revisar `_backup-backend-integration/README.md`
3. Restaurar o fusionar `api.js` y los contextos con las llamadas HTTP
4. Opcional: variable `VITE_API_URL` en `.env`

## Repositorio

Frontend publicado en: [https://github.com/apis26uade/Frontend.git](https://github.com/apis26uade/Frontend.git)
