class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(cartData = { products: [] }) {
    return this.dao.create(cartData);
  }

  findById(cid) {
    return this.dao.findById(cid);
  }

  findByIdPopulated(cid, options = {}) {
    return this.dao.findByIdPopulated(cid, options);
  }

  addProduct(cid, pid) {
    return this.dao.addProduct(cid, pid);
  }

  removeProduct(cid, pid) {
    return this.dao.removeProduct(cid, pid);
  }

  clear(cid) {
    return this.dao.clear(cid);
  }

  replaceProducts(cid, products, options = {}) {
    return this.dao.replaceProducts(cid, products, options);
  }
}

module.exports = CartRepository;
