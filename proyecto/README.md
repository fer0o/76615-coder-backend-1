FutbolStore API ⚽🛒

Curso Backend 2 Comisión 97050 | CoderHouse  
Proyecto final de ecommerce backend con Node.js, Express y MongoDB.

## Descripción
Uno de mis hobbies favoritos es el fútbol y como fanático de este deporte me ha dado para coleccionar jerseys de futbol ya sea en una tienda física o en línea.
Pero me encanta ir a las tiendas para poder ver fisicamente los jerseys, tocarlos y probarlos antes de comprarlos.
Una de las cosas que he notado es que las tiendas donde suelo comprar no tienen un sistema eficiente para gestionar el inventario y mucho de lo que tienen es desactualizado y en muchas ocasiones manejan el catalogo por whatsapp y no se tiene mucha información sobre los productos. asi que por eso he decidido crear una API para gestionar un catálogo de jerseys de fútbol que puede que sea útil para tiendas pequeñas que no cuentan con un sistema de gestión de inventario adecuado.

FutbolStore API es un servidor backend desarrollado con Node.js y Express, diseñado para gestionar un catálogo de jerseys de fútbol y un sistema de carrito de compras.

Incluye:
- Autenticación con JWT + Passport (`current`)
- Autorización por rol y ownership de carrito
- Recuperación de contraseña por email
- Compra con ticket, compra completa/parcial y control de stock
- Vistas con Handlebars y realtime básico con Socket.IO

## Arquitectura aplicada
Se implementó arquitectura por capas:

`Routes -> Services -> Repositories -> DAO -> MongoDB`

- `DTO`: para no exponer datos sensibles en `/api/sessions/current`
- `Repository`: separa acceso a datos de lógica de negocio
- `Service`: concentra lógica de negocio compleja (`purchase`, `forgot/reset password`)

## Estructura del proyecto (actual)
```text
proyecto/
├── index.js
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── config.js
│   │   └── passport.config.js
│   ├── dao/
│   │   └── mongo/
│   ├── dto/
│   │   └── users/
│   │       └── CurrentUserDTO.js
│   ├── managersMongo/
│   │   ├── ProductManagerMongo.js
│   │   └── CartManagerMongo.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── Product.model.js
│   │   ├── Cart.model.js
│   │   ├── User.model.js
│   │   └── Ticket.model.js
│   ├── repositories/
│   │   ├── UserRepository.js
│   │   ├── ProductRepository.js
│   │   ├── CartRepository.js
│   │   ├── TicketRepository.js
│   │   └── index.js
│   ├── routes/
│   │   ├── products.routes.js
│   │   ├── carts.routes.js
│   │   ├── sessions.routes.js
│   │   └── views.router.js
│   ├── services/
│   │   ├── CartService.js
│   │   └── SessionService.js
│   ├── utils/
│   │   ├── hash.js
│   │   ├── jwt.js
│   │   └── mailer.js
│   └── views/
└── README.md
```

## Instalación y ejecución
```bash
npm install
npm run dev
```

Servidor:
- `http://localhost:3000`

## Variables de entorno
Crear un archivo `.env` en la raíz con:

```env
MONGO_URL=
JWT_SECRET=
BCRYPT_SALT=10

RESET_PASSWORD_URL=

MAIL_HOST=
MAIL_PORT=
MAIL_SECURE=false
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
```

## Endpoints principales
### Sesiones
- `POST /api/sessions/register` Registra usuario y crea carrito
- `POST /api/sessions/login` Login y retorno de JWT
- `GET /api/sessions/current` Usuario actual con DTO (sin password)
- `POST /api/sessions/forgot-password` Envía email de recuperación
- `POST /api/sessions/reset-password` Restablece contraseña con token

# Ejemplo de producto
```json
{
  "_id": "ObjectId",
  "team": "FC Barcelona",
  "league": "La Liga",
  "country": "España",
  "continent": "Europa",
  "player": "Pedri",
  "season": "2024/25",
  "category": "Home",
  "price": 1700,
  "stock": 10,
  "sizes": ["S", "M", "L", "XL"]
}
```

### Productos
- `GET /api/products` Listado paginado
- `GET /api/products/:pid` Detalle por ID
- `POST /api/products` Solo `admin`
- `PUT /api/products/:pid` Solo `admin`
- `DELETE /api/products/:pid` Solo `admin`

### Carritos
- `POST /api/carts` Crear carrito (solo `admin`)
- `GET /api/carts/:cid` Ver carrito (owner o `admin`)
- `POST /api/carts/:cid/product/:pid` Agregar producto (solo `user` owner)
- `DELETE /api/carts/:cid/product/:pid` Eliminar producto (solo `user` owner)
- `DELETE /api/carts/:cid` Vaciar carrito (solo `user` owner)
- `POST /api/carts/:cid/purchase` Comprar carrito (owner o `admin`)

## Seguridad y autorización
- `authenticateCurrent`: valida JWT con estrategia `current`
- `authorizeRoles`: controla acceso por rol (`user/admin`)
- `authorizeCartOwner`: protege operaciones por propiedad del carrito (con bypass de `admin`)

## Lógica de compra
`POST /api/carts/:cid/purchase`:
- Valida carrito y productos
- Separa comprables/no comprables
- Descuenta stock de forma atómica (`decreaseStockIfAvailable`)
- Genera ticket solo si existe al menos un producto comprable
- Soporta compra completa o parcial
- Deja en carrito solo productos no comprados

## Recuperación de contraseña
- Se genera token y se guarda hasheado
- El enlace expira en 1 hora
- Se evita reutilizar la contraseña anterior
- El email contiene botón/enlace para restablecer contraseña

## Vistas (no funcionales)
- `/` Home
- `/realtimeproducts` Productos en tiempo real
- `/cart/:cid` Vista de carrito

## Autor
- Fernando Medellin Cuevas
- Email: `fermedellincuevas@gmail.com`
- GitHub: [fer0o](https://github.com/fer0o)
