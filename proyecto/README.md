# MI PRIMER SERVIDOR EN NODE CON EXPRESS
# FutbolStore API  
**Curso 76615-Backend 1 – CoderHouse**  
Entrega N.º 1 – API con FileSystem  

---

## Descripción
Uno de mis hobbies favoritos es el fútbol y como fanático de este deporte me ha dado para coleccionar jerseys de futbol ya sea en una tienda física o en línea.
Pero me encanta ir a las tiendas para poder ver fisicamente los jerseys, tocarlos y probarlos antes de comprarlos.
Una de las cosas que he notado es que las tiendas donde suelo comprar no tienen un sistema eficiente para gestionar el inventario y mucho de lo que tienen es desactualizado y en muchas ocasiones manejan el catalogo por whatsapp y no se tiene mucha información sobre los productos. asi que por eso he decidido crear una API para gestionar un catálogo de jerseys de fútbol que puede que sea útil para tiendas pequeñas que no cuentan con un sistema de gestión de inventario adecuado.

**FutbolStore API** es un servidor backend desarrollado con **Node.js** y **Express**, que gestiona un catálogo de productos (jerseys de fútbol) y  cuenta con su propio sistema de carritos de compra.  
En esta primera entrega, los datos se persisten mediante archivos JSON utilizando el módulo **FileSystem (`fs`)**.

---

## Estructura del Proyecto primera entrega
proyecto/
│
├── data/
│   ├── products.json          # Persistencia de productos (estructura plana)
│   └── carts.json             # Persistencia de carritos
│
├── src/
│   ├── app.js                 # Configuración principal de Express
│   ├── server.js              # Punto de entrada del servidor
│   ├── routes/
│   │   ├── products.routes.js # Rutas de productos (CRUD completo)
│   │   └── carts.routes.js    # Rutas de carritos
│   ├── managers/
│   │   ├── ProductManager.js  # Lógica de productos (FileSystem)
│   │   └── CartManager.js     # Lógica de carritos (FileSystem)
│
├── index.js                   
├── package.json
├── package-lock.json
└── README.md

## Instalación y Ejecución

Clonar el repositorio
cd proyecto

## Instalar dependencias
npm install

## Iniciar el servidor
npm run dev

El servidor estará corriendo en `http://localhost:3000`

# Endpoints disponibles

## Productos

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener un producto por ID
- `POST /api/products` - Crear un nuevo producto
- `PUT /api/products/:id` - Actualizar un producto por ID
- `DELETE /api/products/:id` - Eliminar un producto por ID

# Ejemplo del producto (primera entrega)
```json
{
  "id": 1,
  "team": "FC Barcelona",
  "country": "España",
  "continent": "Europa",
  "league": "La Liga",
  "player": "Pedri",
  "season": "2024/25",
  "category": "Home",
  "price": 1700,
  "stock": 10,
  "size": ["S", "M", "L", "XL"]
}
```

## Carritos
- `POST /api/carts` - Crear un nuevo carrito
- `GET /api/carts/:id` - Obtener un carrito por ID
- `POST /api/carts/:id/products` - Agregar un producto al carrito por ID
  
# Ejemplo del carrito (primera entrega)
```json
{
  "id": 1,
  "products": [
    { "id": 2, "quantity": 1 },
    { "id": 5, "quantity": 3 }
  ]
}
```
## Autor
Fernando Medellin Cuevas
Email: fermedellincuevas@gmail.com
github: https://github.com/fer0o
