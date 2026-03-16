const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");
const {
  authenticateCurrent,
  authorizeRoles,
  authorizeCartOwner,
} = require("../middlewares/auth.middleware");

// Crea un carrito nuevo (solo admin).
router.post(
  "/",
  authenticateCurrent,
  authorizeRoles("admin"),
  cartController.createCart,
);

// Obtiene un carrito por ID (admin o dueño del carrito).
router.get(
  "/:cid",
  authenticateCurrent,
  authorizeRoles("user", "admin"),
  authorizeCartOwner,
  cartController.getCartById,
);

// Agrega un producto al carrito del usuario autenticado.
router.post(
  "/:cid/product/:pid",
  authenticateCurrent,
  authorizeRoles("user"),
  authorizeCartOwner,
  cartController.addProductToCart,
);

// Elimina un producto específico del carrito.
router.delete(
  "/:cid/product/:pid",
  authenticateCurrent,
  authorizeRoles("user"),
  authorizeCartOwner,
  cartController.removeProductFromCart,
);

// Vacía completamente un carrito.
router.delete(
  "/:cid",
  authenticateCurrent,
  authorizeRoles("user"),
  authorizeCartOwner,
  cartController.clearCart,
);

// Ejecuta la compra del carrito (user o admin).
router.post(
  "/:cid/purchase",
  authenticateCurrent,
  authorizeRoles("user", "admin"),
  authorizeCartOwner,
  cartController.purchaseCart,
);

module.exports = router;
