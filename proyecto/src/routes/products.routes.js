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
        const product = await productManager.getProductById (pid);

        //si no existe el producto
        if(!product){
            return res.status(404).json({error: 'Producto no encontrado'});
        }
        res.status(200).json(product);
    }
    catch(error){
        console.error('Error al obtener el producto por ID:', error);
        res.status(500).json({error: 'Error al obtener el producto por ID '});
    }
})

//Ruta post para agregar un nuevo producto
router.post ('/', async (req, res)=>{
    try{
        //body esperado para este endpoint
        /*
      {
        "team": "Real Madrid",
        "league": "La Liga",
        "country": "España",
        "continent": "Europa",
        "player": "Bellingham",
        "season": "2024/25",
        "category": "Away",
        "price": 1800,
        "stock": 8,
        "sizes": ["M", "L"]
      }
        */
       const productData = req.body
       //validar que los campos minimos esten presentes
       const requieredFields = [
        "team",
        "league",
        "country",
        "continent",
        "player",
        "season",
        "category",
        "price",
        "stock",
        "sizes"
       ]
       const missingFields = requieredFields.filter(
        (field) => !productData[field]
       )
       if (missingFields.length > 0){
        return res.status(400).json({
            error: `Faltan los siguientes campos ${missingFields.join (",")}`
        })
       }
       //llamamos al metodo del manager para agregar el producto
       const result = await productManager.addProduct (productData)

       //respondemos con el nuevo producto
       res.status(201).json(result)
    }
    catch (error){
        console.error ("Error en POST /api/products:", error.message);
        res.status(500).json({error: 'Error interno del servidor', details: error.message});
    }
})

//ruta para actualizar un producto existente PUT
router.put('/:pid', async (req, res)=>{
    try{
        //el ID por ahora es numerico
        const pid = parseInt(req.params.pid)
        //campos a actualizar
        const updateFields = req.body

        //validamos que se haya enviado al menos un campo
        if(Object.keys(updateFields).length === 0){
            return res.status(400).json({
                error: 'No se enviaron campos para actualizar'
            })
        }
        //Llamamos al metodo del manager
        const result = await productManager.updateProduct(pid, updateFields)

        // si el producto no fue encontrado
        if(!result){
            return res.status(404).json({error: 'Producto no encontrado'})
        }
        // respondemos con exito
        res.status(200).json(result)
    }
    catch (error){
        console.error ('Error en PUT /api/products/:pid:', error.message)

        if(error.message.includes('no encontrado')){
            return res.status(404).json({error: error.message})
        }
        res.status(500).json({error: 'Error interno del servidor', details: error.message})
    }
})

// DELETE para eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
  try {
    // IDs son numéricos por ahora
    const pid = parseInt(req.params.pid);

    // Llamamos al método del manager
    const result = await productManager.deleteProduct(pid);

    // Si el producto fue eliminado correctamente
    res.status(200).json(result);

  } catch (error) {
    console.error('Error en DELETE /api/products/:pid:', error.message);

    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});


module.exports = router;