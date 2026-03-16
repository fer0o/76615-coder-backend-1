const express = require("express");
const router = express.Router();
// const ProductManager = require('../managers/ProductManager');
//ahora usamos el manager de MongoDB
const ProductManagerMongo = require("../managersMongo/ProductManagerMongo");
const productController = require("../controllers/ProductController");

const {authenticateCurrent, authorizeRoles} = require("../middlewares/auth.middleware")

//instancia del manager
// const productManager = new ProductManager();
//ahora usamos el manager de MongoDB
const productManager = new ProductManagerMongo();

//Ruta get para obtener todos los productos no hay necesidad de cambios p
router.get("/", productController.getProducts);

//Ruta get para obtener un producto por su ID (MongoDB)
router.get("/:pid", productController.getProductById);

//Ruta post para agregar un nuevo producto (solo admin)
router.post(
  "/",
  authenticateCurrent,
  authorizeRoles("admin"),
  productController.createProduct,
);

//Put para actualizar un producto existente (solo admin)
router.put(
  "/:pid",
  authenticateCurrent,
  authorizeRoles("admin"),
  productController.updateProduct,
);

// DELETE para eliminar un producto (solo admin)
router.delete(
  "/:pid",
  authenticateCurrent,
  authorizeRoles("admin"),
  productController.deleteProduct,
);

module.exports = router;
