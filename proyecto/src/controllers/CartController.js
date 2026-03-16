const cartService = require("../services/CartService");

class CartController {
  async createCart(req, res) {
    try {
      const result = await cartService.createCart();
      return res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error("Error en CartController.createCart:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async getCartById(req, res) {
    try {
      const { cid } = req.params;
      const result = await cartService.getCartById(cid);
      return res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error("Error en CartController.getCartById:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await cartService.addProductToCart(cid, pid);
      return res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error("Error en CartController.addProductToCart:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async removeProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await cartService.removeProductFromCart(cid, pid);
      return res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error("Error en CartController.removeProductFromCart:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async clearCart(req, res) {
    try {
      const { cid } = req.params;
      const result = await cartService.clearCart(cid);
      return res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error("Error en CartController.clearCart:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }
  async purchaseCart(req, res) {
    try {
      const { cid } = req.params;
      const result = await cartService.purchaseCart({
        cid,
        purchaserEmail: req.user.email,
      });
      return res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error("Error en CartController.purchaseCart:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }
}

module.exports = new CartController();
