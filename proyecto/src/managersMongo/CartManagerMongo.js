const CartModel = require("../models/Cart.model");

class CartManagerMongo {
  async createCart() {
    try {
      const newCart = await CartModel.create({ products: [] });
      return newCart.toObject();
    } catch (error) {
      console.error("Error al crear carrito (Mongo):", error);
      throw error;
    }
  }

  async getCartById(cid) {
    try {
      const cart = await CartModel.findById(cid)
        .populate("products.product")
        .lean();

      return cart || null;
    } catch (error) {
      console.error("Error al obtener carrito por ID (Mongo):", error);
      return null;
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await CartModel.findById(cid);

      if (!cart) {
        return null;
      }

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === pid
      );

      if (productIndex !== -1) {
        // Producto ya existe → aumentar cantidad
        cart.products[productIndex].quantity += 1;
      } else {
        // Producto no existe → agregar
        cart.products.push({
          product: pid,
          quantity: 1,
        });
      }

      await cart.save();

      return cart.toObject();
    } catch (error) {
      console.error("Error al agregar producto al carrito (Mongo):", error);
      throw error;
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await CartModel.findById(cid);

      if (!cart) {
        return null;
      }

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === pid
      );

      if (productIndex === -1) {
        return null;
      }

      cart.products[productIndex].quantity = quantity;

      await cart.save();

      return cart.toObject();
    } catch (error) {
      console.error(
        "Error al actualizar cantidad del producto (Mongo):",
        error
      );
      throw error;
    }
  }
  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await CartModel.findById(cid);

      if (!cart) {
        return null;
      }

      const initialLength = cart.products.length;

      cart.products = cart.products.filter((p) => p.product.toString() !== pid);

      // Si no se eliminó nada, el producto no existía
      if (cart.products.length === initialLength) {
        return null;
      }

      await cart.save();

      return cart.toObject();
    } catch (error) {
      console.error("Error al eliminar producto del carrito (Mongo):", error);
      throw error;
    }
  }

  async clearCart(cid) {
    try {
      const cart = await CartModel.findById(cid);

      if (!cart) {
        return null;
      }

      cart.products = [];
      await cart.save();

      return cart.toObject();
    } catch (error) {
      console.error("Error al vaciar carrito (Mongo):", error);
      throw error;
    }
  }
}

module.exports = CartManagerMongo;
