const express = require("express");
const router = express.Router();

const productService = require("../services/ProductService");
const cartService = require("../services/CartService");

const parsePaginationQuery = (query) => ({
  limit: query.limit ? Number(query.limit) : 10,
  page: query.page ? Number(query.page) : 1,
});

// Vista Home
router.get("/", async (req, res) => {
  try {
    const result = await productService.getProducts(parsePaginationQuery(req.query));

    if (result.statusCode !== 200) {
      return res
        .status(result.statusCode)
        .send(result.body?.message || "Error cargando productos");
    }

    res.render("pages/home", {
      title: "Lista de productos",
      products: result.body.payload,
      pagination: result.body.pagination,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error cargando productos");
  }
});

// Vista RealTime
router.get("/realtimeproducts", async (req, res) => {
  try {
    const result = await productService.getProducts(parsePaginationQuery(req.query));

    if (result.statusCode !== 200) {
      return res
        .status(result.statusCode)
        .send(result.body?.message || "Error cargando productos (realtime)");
    }

    res.render("pages/realTimeProducts", {
      products: result.body.payload,
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

    const result = await cartService.getCartById(cid);

    if (result.statusCode === 404) {
      return res.status(404).send("Carrito no encontrado");
    }

    if (result.statusCode !== 200) {
      return res
        .status(result.statusCode)
        .send(result.body?.message || "Error cargando carrito");
    }

    const cart = result.body.payload;

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
