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
//Ruta get para obtener un producto por su ID
router.get('/:pid', async (req, res)=>{
    try{
        const pid = parseInt (req.params.pid)
        const product = await productManager.getProductsById (pid);
        //si no existe el producto
        if(!product){
            return res.status(404).json({error: 'Producto no encontrado'});
        }
        //si existe el producto
        res.status(200).json(product);
    }
    catch(error){
        console.error('Error al obtener el producto por ID:', error);
        res.status(500).json({error: 'Error al obtener el producto por ID '});
    }
})

module.exports = router;