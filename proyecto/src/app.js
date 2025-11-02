// src/app.js

const express = require('express');
const app = express();

// Middleware para que Express pueda leer JSON en las requests
app.use(express.json());

// --- RUTAS BASE --- //
const productsRouter = require ('./routes/products.routes')
const cartsRouter = require ('./routes/carts.routes')

// Usar las rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta raíz temporal
app.get('/', (req, res) => {
  res.send('Bienvenido a FutbolStore API ⚽');
});

// Exportar la app para usarla en server.js
module.exports = app;