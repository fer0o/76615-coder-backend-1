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

//Ruta post para agregar un nuevo producto
router.post('/', async (req, res) => {
    try{
        /* body para el post
        {
            "contient": "Europa",
            "country": "España",
            "team": "FC Barcelona",
            "product": {
                "player": "Lionel Messi",
                "season": "2020/2021",
                "category": "Home",
                "price": 99.99,
                "stock": 50,
                "size": ["S", "M", "L", "XL"],
            }
        }
        */
        const {continent, country, team, product} = req.body;

        //validamos que los datos necesarios esten presentes
        if(!continent || !country || !team || !product){
            return res.status(400).json({
                error: 'Faltan datos. Debes enviar continent, country, team y product'
            })
        }
        // Llamamos al métodos del manager para agregar el producto
        const result = await productManager.addProduct({
            continent,
            country,
            team,
            product
        })
        //respondemos con 201 para el nuevo producto agregado
        res.status(201).json(result)
    }
    catch(error){
        console.error('Error en POST /api/products:', error.message);
        //detectamos errores comunes y devolvemos codigos adecuados
        if(error.message.includes('no encontrado')){
            return res.status(404).json({error: error.message})
        }
        res.status(500).json({error: 'Error al agregar el producto'})
    }
})

//ruta para actualizar un producto existente PUT
router.put('/:pid', async (req, res) =>{
    try{
        const pid = parseInt (req.params.pid)
        const updateFields = req.body //campos a actualizar

        //validamos que almenos hay un campo para actualizar
        if (Object.keys(updateFields).length === 0){
            return res.status(400).json({error: 'No se enviaron campos para actualizar'})
        }

        const result = await productManager.updateProduct(pid, updateFields)

        res.status(200).json(result)
    }
    catch(error){
        console.error('Error en PUT /api/products/:pid:', error.message)

        if(error.message.includes('no encontrado')){
            return res.status(404).json({error: error.message})
        }
        res.status(500).json({error: 'Error interno del servidor'})
   }
})

//DELETE para eliminar un producto por su ID
router.delete('/:pid', async (req, res)=>{
    try{
        const pid = parseInt (req.params.pid)
        const result = await productManager.deleteProduct(pid)
        //respondemos con exito
        res.status(200).json(result)
    }
    catch (error){
        console.error ('Error en DELETE /api/products/:pid:', error.message)

        if(error.message.includes('no encontrado')){
            return res.status(404).json({error: error.message})
        }
        res.status(500).json({error: 'Error interno del servidor'})
    }
})


module.exports = router;