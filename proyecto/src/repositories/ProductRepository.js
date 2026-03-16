class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(productData, options = {}) {
    return this.dao.create(productData, options);
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

  async findAllPaginated({ limit = 10, page = 1 } = {}) {
    const parsedLimit = Number(limit);
    const parsedPage = Number(page);

    const safeLimit =
      Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;
    const safePage =
      Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const skip = (safePage - 1) * safeLimit;

    const [payload, ids] = await Promise.all([
      this.dao.getAll({}, { skip, limit: safeLimit }),
      this.dao.getAll({}, { select: "_id" }),
    ]);

    const totalProducts = ids.length;
    const totalPages = Math.max(1, Math.ceil(totalProducts / safeLimit));

    return {
      payload,
      pagination: {
        totalProducts,
        totalPages,
        page: safePage,
        limit: safeLimit,
        hasPrevPage: safePage > 1,
        hasNextPage: safePage < totalPages,
      },
    };
  }

  findById(pid, options = {}) {
    return this.dao.getOne(pid, options);
  }

  updateById(pid, updateFields, options = {}) {
    return this.dao.update(pid, updateFields, options);
  }

  deleteById(pid, options = {}) {
    return this.dao.delete(pid, options);
  }

  updateStockById(pid, newStock, options = {}) {
    return this.dao.update(pid, { $set: { stock: newStock } }, options);
  }

  decreaseStockIfAvailable(pid, qty, options = {}) {
    if (!Number.isInteger(qty) || qty <= 0) {
      return null;
    }

    return this.dao.update(
      { _id: pid, stock: { $gte: qty } },
      { $inc: { stock: -qty } },
      options,
    );
  }
}

module.exports = ProductRepository;
