const express = require('express');
const router = express.Router();

const productsRouter = require('./products.routes');
const cartsRouter = require('./carts.routes');
const sessionsRouter = require('./sessions.routes');

// Usar las rutas
router.use('/products', productsRouter);
router.use('/carts', cartsRouter);
router.use('/sessions', sessionsRouter);

module.exports = router;