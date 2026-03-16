const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");
const {
  authenticateCurrent,
  authorizeRoles,
  authorizeCartOwner,
} = require("../middlewares/auth.middleware");

//Ruta para crear un nuevo carrito
router.post(
  "/",
  authenticateCurrent,
  authorizeRoles("admin"),
  cartController.createCart,
);

//Ruta para obtener un carrito por su ID admin y user
router.get(
  "/:cid",
  authenticateCurrent,
  authorizeRoles("user", "admin"),
  authorizeCartOwner,
  cartController.getCartById,
);
//ruta para agregar un producto (solo user)
router.post(
  "/:cid/product/:pid",
  authenticateCurrent,
  authorizeRoles("user"),
  authorizeCartOwner,
  cartController.addProductToCart,
);

// DELETE: eliminar un producto específico del carrito (solo user)
router.delete(
  "/:cid/product/:pid",
  authenticateCurrent,
  authorizeRoles("user"),
  authorizeCartOwner,
  cartController.removeProductFromCart,
);

// DELETE: vaciar completamente un carrito (solo user)
router.delete(
  "/:cid",
  authenticateCurrent,
  authorizeRoles("user"),
  authorizeCartOwner,
  cartController.clearCart,
);
//Ruta para comprar un carrito (solo user)
router.post(
  "/:cid/purchase",
  authenticateCurrent,
  authorizeRoles("user", "admin"),
  authorizeCartOwner,
  cartController.purchaseCart,
);

module.exports = router;
