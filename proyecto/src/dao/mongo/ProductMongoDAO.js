const ProductModel = require("../../models/Product.model");

class ProductMongoDAO {
    async findAllPaginated({ limit = 10, page = 1 } = {}) {
        const skip = (page - 1) * limit;

        const products = await ProductModel.find().skip(skip).limit(limit).lean();
        const totalProducts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        return {
            payload: products,
            pagination: {
                totalProducts,
                totalPages,
                page,
                limit,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
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
    async updateStockById(pid, newStock) {
        return ProductModel.findByIdAndUpdate(
            pid,
            { $set: { stock: newStock } },
            { new: true, runValidators: true }
        ).lean();
    }
}

module.exports = new ProductMongoDAO();
