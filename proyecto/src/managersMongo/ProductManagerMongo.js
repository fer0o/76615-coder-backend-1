// ProductManagerMongo.js
const ProductModel = require("../models/Product.model");

class ProductManagerMongo {
  async getProducts() {
    try {
      const products = await ProductModel.find().lean();
      return products;
    } catch (error) {
      console.error("Error al obtener productos (Mongo):", error);
      return [];
    }
  }

  async getProductById(pid) {
    try {
      const product = await ProductModel.findById(pid).lean();

      // Si no existe, devolvemos null (igual que FS)
      if (!product) {
        return null;
      }

      return product;
    } catch (error) {
      // Si el id es inválido o hay otro error,
      // NO rompemos la app: devolvemos null
      console.error("Error al obtener producto por ID (Mongo):", error);
      return null;
    }
  }

  async addProduct(product) {
    try {
      const newProduct = await ProductModel.create(product);

      return {
        message: "Producto agregado exitosamente",
        product: newProduct.toObject(),
      };
    } catch (error) {
      console.error("Error al agregar producto (Mongo):", error);
      throw error;
    }
  }

  async updateProduct(pid, updateFields) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        pid,
        updateFields,
        { new: true, runValidators: true }
      ).lean();

      if (!updatedProduct) {
        throw new Error(`Producto con ID ${pid} no encontrado`);
      }

      return {
        message: "Producto actualizado exitosamente",
        product: updatedProduct,
      };
    } catch (error) {
      console.error("Error al actualizar producto (Mongo):", error);
      throw error;
    }
  }

  async deleteProduct(pid) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(pid);

      if (!deletedProduct) {
        throw new Error(`Producto con ID ${pid} no encontrado`);
      }

      return {
        message: `Producto con ID ${pid} eliminado correctamente`,
      };
    } catch (error) {
      console.error("Error al eliminar producto (Mongo):", error);
      throw error;
    }
  }
}

module.exports = ProductManagerMongo;
