const CartModel = require("../../models/Cart.model");

class CartMongoDAO {
  async create(cartData = { products: [] }) {
    const cart = await CartModel.create(cartData);
    return cart.toObject();
  }

  async findById(cid) {
    return CartModel.findById(cid).lean();
  }

  async findByIdPopulated(cid) {
    return CartModel.findById(cid).populate("products.product").lean();
  }

  async addProduct(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(
      (p) => String(p.product) === String(pid)
    );

    if (productIndex === -1) {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      cart.products[productIndex].quantity += 1;
    }

    await cart.save();
    return cart.toObject();
  }

  async removeProduct(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    const initialLength = cart.products.length;
    cart.products = cart.products.filter(
      (p) => String(p.product) !== String(pid)
    );

    if (cart.products.length === initialLength) return null;

    await cart.save();
    return cart.toObject();
  }

  async clear(cid) {
    const cart = await CartModel.findByIdAndUpdate(
      cid,
      { $set: { products: [] } },
      { new: true }
    ).lean();

    return cart;
  }

  // clave para purchase: dejar en carrito solo los no comprados
  async replaceProducts(cid, products) {
    const cart = await CartModel.findByIdAndUpdate(
      cid,
      { $set: { products } },
      { new: true, runValidators: true }
    ).lean();

    return cart;
  }
}

module.exports = new CartMongoDAO();
