const CartModel = require("../../models/Cart.model");

class CartMongoDAO {
  async create(cartData = { products: [] }) {
    const cart = await CartModel.create(cartData);
    return cart.toObject();
  }
}

module.exports = new CartMongoDAO();
