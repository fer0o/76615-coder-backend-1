const { cartRepository } = require("../repositories");

class CartManagerMongo {
  async createCart() {
    try {
      const newCart = await cartRepository.create({ products: [] });
      return newCart;
    } catch (error) {
      console.error("Error al crear carrito (Mongo):", error);
      throw error;
    }
  }

  async getCartById(cid) {
    try {
      const cart = await cartRepository.findByIdPopulated(cid);

      return cart || null;
    } catch (error) {
      console.error("Error al obtener carrito por ID (Mongo):", error);
      return null;
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const updatedCart = await cartRepository.addProduct(cid, pid);
      return updatedCart || null;
    } catch (error) {
      console.error("Error al agregar producto al carrito (Mongo):", error);
      throw error;
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await cartRepository.findById(cid);
      if (!cart) {
        return null;
      }

      const productIndex = cart.products.findIndex(
        (p) => String(p.product) === String(pid),
      );

      if (productIndex === -1) {
        return null;
      }

      cart.products[productIndex].quantity = quantity;

      const updatedCart = await cartRepository.replaceProducts(
        cid,
        cart.products,
      );
      return updatedCart;
    } catch (error) {
      console.error(
        "Error al actualizar cantidad del producto (Mongo):",
        error,
      );
      throw error;
    }
  }
  async deleteProductFromCart(cid, pid) {
    try {
      const updatedCart = await cartRepository.removeProduct(cid, pid);
      return updatedCart || null;
    } catch (error) {
      console.error("Error al eliminar producto del carrito (Mongo):", error);
      throw error;
    }
  }

  async clearCart(cid) {
    try {
      const clearedCart = await cartRepository.clear(cid);
      return clearedCart || null;
    } catch (error) {
      console.error("Error al vaciar carrito (Mongo):", error);
      throw error;
    }
  }
}

module.exports = CartManagerMongo;
