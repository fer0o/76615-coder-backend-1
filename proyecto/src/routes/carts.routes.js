const express = require('express');
const router = express.Router();
// const CartManager = require('../managers/CartManager');
//ahora usamos el manager de MongoDB
const CartManagerMongo = require('../managersMongo/CartManagerMongo');


//instancia del manager
// const cartManager = new CartManager();
//ahora usamos el manager de MongoDB
const cartManager = new CartManagerMongo();

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
        const cid = req.params.cid

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
//ruta para agregar un producto a un carrito por sus IDs con mongoDB
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const updatedCart = await cartManager.addProductToCart(cid, pid);

    if (!updatedCart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.status(200).json({
      message: `Producto agregado al carrito`,
      cart: updatedCart
    });

  } catch (error) {
    console.error('Error al agregar producto al carrito:', error.message);
    res.status(500).json({
      error: 'Error al agregar producto al carrito',
      details: error.message
    });
  }
});

// DELETE: eliminar un producto específico del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const updatedCart = await cartManager.deleteProductFromCart(cid, pid);

    if (!updatedCart) {
      return res.status(404).json({
        error: 'Carrito o producto no encontrado'
      });
    }

    res.status(200).json({
      message: 'Producto eliminado del carrito',
      cart: updatedCart
    });

  } catch (error) {
    console.error('Error en DELETE /api/carts/:cid/product/:pid:', error.message);
    res.status(500).json({
      error: 'Error al eliminar el producto del carrito'
    });
  }
});

// DELETE: vaciar completamente un carrito
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const clearedCart = await cartManager.clearCart(cid);

    if (!clearedCart) {
      return res.status(404).json({
        error: 'Carrito no encontrado'
      });
    }

    res.status(200).json({
      message: 'Carrito vaciado correctamente',
      cart: clearedCart
    });

  } catch (error) {
    console.error('Error en DELETE /api/carts/:cid:', error.message);
    res.status(500).json({
      error: 'Error al vaciar el carrito'
    });
  }
});



module.exports = router;