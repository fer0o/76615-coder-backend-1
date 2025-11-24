const express = require("express");
const router = express.Router();

const ProductManager = require("../managers/ProductManager");
const productManager = new ProductManager();

// Vista Home
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.render("pages/home", {
      title: "Lista de productos",
      products,
    });
  } catch (error) {
    res.status(500).send("Error cargando productos");
  }
});

// Vista RealTime
router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.render("pages/realTimeProducts", { products });
  } catch (error) {
    res.status(500).send("Error cargando productos (realtime)");
  }
});

module.exports = router;