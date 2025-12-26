const express = require("express");
const router = express.Router();

const ProductManagerMongo = require("../managersMongo/ProductManagerMongo");
const CartManagerMongo = require("../managersMongo/CartManagerMongo");

const productManager = new ProductManagerMongo();
const cartManager = new CartManagerMongo();

// Vista Home
router.get("/", async (req, res) => {
  try {
    const result = await productManager.getProducts(req.query);

    res.render("pages/home", {
      title: "Lista de productos",
      products: result.payload,
      pagination: result.pagination,
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

// Vista Cart
router.get("/cart/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("pages/cart", {
      title: "Tu carrito",
      cart,
      products: cart.products,
    });
  } catch (error) {
    console.error("ERROR CART VIEW:", error);
    res.status(500).send("Error cargando carrito");
  }
});

module.exports = router;