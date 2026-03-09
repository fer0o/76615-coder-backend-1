class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  findAllPaginated(params) {
    return this.dao.findAllPaginated(params);
  }

  findById(pid) {
    return this.dao.findById(pid);
  }

  create(productData) {
    return this.dao.create(productData);
  }

  updateById(pid, updateFields) {
    return this.dao.updateById(pid, updateFields);
  }

  deleteById(pid) {
    return this.dao.deleteById(pid);
  }

  updateStockById(pid, newStock, options = {}) {
    return this.dao.updateStockById(pid, newStock, options);
  }

  decreaseStockIfAvailable(pid, qty, options = {}) {
    return this.dao.decreaseStockIfAvailable(pid, qty, options);
  }
}

module.exports = ProductRepository;
