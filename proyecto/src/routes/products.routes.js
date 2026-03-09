const express = require("express");
const router = express.Router();
// const ProductManager = require('../managers/ProductManager');
//ahora usamos el manager de MongoDB
const ProductManagerMongo = require("../managersMongo/ProductManagerMongo");

const {authenticateCurrent, authorizeRoles} = require("../middlewares/auth.middleware")

//instancia del manager
// const productManager = new ProductManager();
//ahora usamos el manager de MongoDB
const productManager = new ProductManagerMongo();

//Ruta get para obtener todos los productos no hay necesidad de cambios p
router.get("/", async (req, res) => {
  try {
    const { limit, page } = req.query;

    const result = await productManager.getProducts({
      limit: limit ? Number(limit) : 10,
      page: page ? Number(page) : 1,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

//Ruta get para obtener un producto por su ID (MongoDB)
router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;

    const product = await productManager.getProductById(pid);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error al obtener el producto por ID:", error);
    res.status(500).json({ error: "Error al obtener el producto por ID" });
  }
});

//Ruta post para agregar un nuevo producto (solo admin)
router.post(
  "/",
  authenticateCurrent,
  authorizeRoles("admin"),
  async (req, res) => {
  try {
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
    const productData = req.body;
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
      "sizes",
    ];
    const missingFields = requieredFields.filter(
      (field) => productData[field] === undefined || productData[field] === null
    );
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Faltan los siguientes campos ${missingFields.join(",")}`,
      });
    }
    //llamamos al metodo del manager para agregar el producto
    const result = await productManager.addProduct(productData);

    //respondemos con el nuevo producto
    res.status(201).json(result);
  } catch (error) {
    console.error("Error en POST /api/products:", error.message);
    res
      .status(500)
      .json({ error: "Error interno del servidor", details: error.message });
  }
});

//Put para actualizar un producto existente (solo admin)
router.put(
  "/:pid",
  authenticateCurrent,
  authorizeRoles("admin"),
  async(req, res) => {
  try {
    const pid = req.params.pid;
    const updateFields = req.body;

    // Validamos que se haya enviado al menos un campo
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        error: "No se enviaron campos para actualizar",
      });
    }

    // Llamamos al método del manager
    const result = await productManager.updateProduct(pid, updateFields);

    // Si el producto no fue encontrado
    if (!result) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Respondemos con éxito
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en PUT /api/products/:pid:", error.message);
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    });
  }
});

// DELETE para eliminar un producto (solo admin)
router.delete(
  "/:pid",
  authenticateCurrent,
  authorizeRoles("admin"),
  async(req,res) => {
  try {
    const pid = req.params.pid; 

    const result = await productManager.deleteProduct(pid);

    if (!result) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error en DELETE /api/products/:pid:", error.message);
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    });
  }
});

module.exports = router;
