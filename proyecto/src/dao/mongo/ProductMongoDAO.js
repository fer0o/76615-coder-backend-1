const ProductModel = require("../../models/Product.model");

class ProductMongoDAO {
  async findAllPaginated({ limit = 10, page = 1 } = {}) {
    const parsedLimit = Number(limit);
    const parsedPage = Number(page);

    const safeLimit =
      Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;
    const safePage =
      Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    const skip = (safePage - 1) * safeLimit;
    const products = await ProductModel.find()
      .skip(skip)
      .limit(safeLimit)
      .lean();
    const totalProducts = await ProductModel.countDocuments();
    const totalPages = Math.max(1, Math.ceil(totalProducts / safeLimit));

    return {
      payload: products,
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

  async findById(pid) {
    return ProductModel.findById(pid).lean();
  }

  async create(productData) {
    const product = await ProductModel.create(productData);
    return product.toObject();
  }

  async updateById(pid, updateFields) {
    return ProductModel.findByIdAndUpdate(pid, updateFields, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async deleteById(pid) {
    return ProductModel.findByIdAndDelete(pid).lean();
  }

  // para compra: actualizar stock exacto
  async updateStockById(pid, newStock, options = {}) {
    const { session } = options;

    const query = ProductModel.findByIdAndUpdate(
      pid,
      { $set: { stock: newStock } },
      { new: true, runValidators: true },
    );

    if (session) {
      query.session(session);
    }

    return query.lean();
  }

  async decreaseStockIfAvailable(pid, qty, options = {}) {
    const { session } = options;

    if (!Number.isInteger(qty) || qty <= 0) {
      return null;
    }

    const query = ProductModel.findOneAndUpdate(
      { _id: pid, stock: { $gte: qty } },
      { $inc: { stock: -qty } },
      { new: true },
    );

    if (session) {
      query.session(session);
    }

    return query.lean();
  }
}

module.exports = new ProductMongoDAO();
