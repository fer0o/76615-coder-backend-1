const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

//instancia del manager
const productManager = new ProductManager();

//Ruta get para obtener todos los productos
router.get('/', async (req, res)=>{
    try{
        const products = await productManager.getProducts();
        res.status(200).json(products);
    }
    catch(error){
        console.error('Error al obtener los productos:', error);
        res.status(500).json({error: 'Error al obtener los productos'});
    }
})

module.exports = router;