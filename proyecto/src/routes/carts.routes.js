const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');

//instancia del manager
const cartManager = new CartManager();

//Ruta para crear un nuevo carrito
router.post ('/', async (req, res)=>{
    try{
        const newCart = await cartManager.createCart()
        res.status(201).json({
            message: 'Carrito creado exitosamente',
            cart: newCart
        })
    }
    catch(error){
        console.error('Error al crear el carrito:', error);
        res.status(500).json({error: 'Error al crear el carrito'});
    }
})

//Ruta para obtener un carrito por su ID
router.get('/:cid', async (req, res)=>{
    try{
        const cid = parseInt (req.params.cid)
        const cart = await cartManager.getCartById (cid);
        //si no existe el carrito
        if(!cart){
            return res.status(404).json({error: 'Carrito no encontrado'});
        }
        //si existe el carrito
        res.status(200).json(cart);
    }
    catch(error){
        console.error('Error al obtener el carrito por ID:', error);
        res.status(500).json({error: 'Error al obtener el carrito por ID '});   
    }
})
//ruta para agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res)=>{
    try{
        const cid = parseInt (req.params.cid)
        const pid = parseInt (req.params.pid)

        const updateCart = await cartManager.addProductToCart (cid, pid);

        res.status(200).json({
            message: `Producto ${pid} agregado al carrito ${cid} exitosamente`,
            cart: updateCart
        })
    }
    catch(error){
        console.error('Error al agregar el producto al carrito:', error);
        if(error.message.includes('no encontrado')){
            res.status(404).json({error: error.message});
        }
    }
        res.status(500).json({error: 'Error interno del servidor'});
})

module.exports = router;