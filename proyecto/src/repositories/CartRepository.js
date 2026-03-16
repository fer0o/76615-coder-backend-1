class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(cartData = { products: [] }, options = {}) {
    return this.dao.create(cartData, options);
  }

  getAll(filter = {}, options = {}) {
    return this.dao.getAll(filter, options);
  }

  getOne(filterOrId, options = {}) {
    return this.dao.getOne(filterOrId, options);
  }

  update(filterOrId, updateFields, options = {}) {
    return this.dao.update(filterOrId, updateFields, options);
  }

  delete(filterOrId, options = {}) {
    return this.dao.delete(filterOrId, options);
  }

  findById(cid, options = {}) {
    return this.dao.getOne(cid, options);
  }

  findByIdPopulated(cid, options = {}) {
    return this.dao.getOne(cid, {
      ...options,
      populate: "products.product",
    });
  }

  async addProduct(cid, pid, options = {}) {
    const { session } = options;

    const cart = await this.dao.getOne(cid, { session });
    if (!cart) {
      return null;
    }

    const products = Array.isArray(cart.products) ? cart.products : [];

    const alreadyInCart = products.some(
      (item) => String(item.product) === String(pid),
    );

    if (alreadyInCart) {
      return this.dao.update(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": 1 } },
        options,
      );
    }

    return this.dao.update(
      cid,
      { $push: { products: { product: pid, quantity: 1 } } },
      options,
    );
  }

  removeProduct(cid, pid, options = {}) {
    return this.dao.update(
      { _id: cid, "products.product": pid },
      { $pull: { products: { product: pid } } },
      options,
    );
  }

  clear(cid, options = {}) {
    return this.dao.update(cid, { $set: { products: [] } }, options);
  }

  replaceProducts(cid, products, options = {}) {
    return this.dao.update(cid, { $set: { products } }, options);
  }
}

module.exports = CartRepository;
