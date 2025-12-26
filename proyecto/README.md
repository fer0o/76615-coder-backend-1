FutbolStore API ⚽🛒

Curso 76615 – Backend 1 | CoderHouse
Proyecto Final – Node.js, Express y MongoDB

---

## Descripción
Uno de mis hobbies favoritos es el fútbol y como fanático de este deporte me ha dado para coleccionar jerseys de futbol ya sea en una tienda física o en línea.
Pero me encanta ir a las tiendas para poder ver fisicamente los jerseys, tocarlos y probarlos antes de comprarlos.
Una de las cosas que he notado es que las tiendas donde suelo comprar no tienen un sistema eficiente para gestionar el inventario y mucho de lo que tienen es desactualizado y en muchas ocasiones manejan el catalogo por whatsapp y no se tiene mucha información sobre los productos. asi que por eso he decidido crear una API para gestionar un catálogo de jerseys de fútbol que puede que sea útil para tiendas pequeñas que no cuentan con un sistema de gestión de inventario adecuado.

FutbolStore API es un servidor backend desarrollado con Node.js y Express, diseñado para gestionar un catálogo de jerseys de fútbol y un sistema de carrito de compras.

El proyecto nace de la necesidad de contar con un sistema simple pero funcional para tiendas pequeñas que no disponen de una plataforma formal de inventario, permitiendo:
	•	Gestionar productos (CRUD completo)
	•	Administrar carritos de compra
	•	Visualizar productos y carritos mediante vistas con Handlebars
	•	Persistir datos en MongoDB Atlas

---

## Estructura del Proyecto primera entrega
proyecto/
│
├── src/
│   ├── app.js
│   ├── routes/
│   │   ├── products.routes.js
│   │   ├── carts.routes.js
│   │   └── views.router.js
│   │
│   ├── managersMongo/
│   │   ├── ProductManagerMongo.js
│   │   └── CartManagerMongo.js
│   │
│   ├── models/
│   │   ├── Product.model.js
│   │   └── Cart.model.js
│   │
│   └── views/
│       ├── layouts/
│       ├── pages/
│       │   ├── home.hbs
│       │   ├── cart.hbs
│       │   └── realTimeProducts.hbs
│       └── partials/
│           └── nav.hbs
│
├── public/
│   └── js/
│       ├── realTime.js
│       ├── boton-home.js
│       └── cart.js
│
├── index.js
├── package.json
├── .env
└── README.md

## Instalación y Ejecución

Clonar el repositorio
cd proyecto

## Instalar dependencias
npm install

## Iniciar el servidor
npm run dev

El servidor estará corriendo en `http://localhost:3000`

## Variables de entorno

El proyecto requiere un archivo `.env` en la raíz del proyecto 

# Endpoints disponibles

## Productos

	•	GET /api/products
Obtiene productos con paginación (limit, page)
	•	GET /api/products/:pid
Obtiene un producto por ID
	•	POST /api/products
Crea un nuevo producto
	•	PUT /api/products/:pid
Actualiza un producto existente
	•	DELETE /api/products/:pid
Elimina un producto


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

## Carritos
	•	POST /api/carts
Crea un nuevo carrito
	•	GET /api/carts/:cid
Obtiene un carrito por ID (con productos con populate)
	•	POST /api/carts/:cid/product/:pid
Agrega un producto al carrito
	•	PUT /api/carts/:cid/product/:pid
Actualiza la cantidad de un producto
	•	DELETE /api/carts/:cid/product/:pid
Elimina un producto del carrito
	•	DELETE /api/carts/:cid
Vacía completamente el carrito
  
🖥️ Vistas disponibles
	•	/ → Home con listado de productos
	•	/realtimeproducts → Productos en tiempo real (Socket.IO)
	•	/cart/:cid → Vista del carrito de compras

Desde el Home es posible agregar productos directamente al carrito mediante botones que consumen la API.

## Autor
Fernando Medellin Cuevas
Email: fermedellincuevas@gmail.com
github: https://github.com/fer0o
