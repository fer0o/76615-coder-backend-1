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
    async updateStockById(pid, newStock, options = {}) {
        const { session } = options;

        const query = ProductModel.findByIdAndUpdate(
            pid,
            { $set: { stock: newStock } },
            { new: true, runValidators: true }
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
            { new: true }
        );

        if (session) {
            query.session(session);
        }

        return query.lean();
    }

}



module.exports = new ProductMongoDAO();
