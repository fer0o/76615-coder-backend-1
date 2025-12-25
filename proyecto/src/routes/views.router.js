const express = require("express");
const router = express.Router();

const ProductManagerMongo = require("../managersMongo/ProductManagerMongo");
const productManager = new ProductManagerMongo();

// Vista Home
router.get("/", async (req, res) => {
  try {
    const result = await productManager.getProducts(req.query);

    res.render("pages/home", {
      title: "Lista de productos",
      products: result.payload,
      pagination: result.pagination, // por si luego lo quieres usar
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error cargando productos");
  }
});

// Vista RealTime
router.get("/realtimeproducts", async (req, res) => {
  try {
    const result = await productManager.getProducts(req.query);

    res.render("pages/realTimeProducts", {
      products: result.payload,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error cargando productos (realtime)");
  }
});

module.exports = router;