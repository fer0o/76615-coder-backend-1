// ProductManagerMongo.js
const { productRepository } = require("../repositories");

class ProductManagerMongo {
  //pagination
  async getProducts({ limit = 10, page = 1 } = {}) {
    try {
      const result = await productRepository.findAllPaginated({ limit, page });

      return {
        status: "success",
        payload: result.payload,
        pagination: result.pagination,
      };
    } catch (error) {
      console.error("Error al obtener productos (Mongo):", error);
      throw error;
    }
  }

  async getProductById(pid) {
    try {
      const product = await productRepository.findById(pid);
      return product || null;
    } catch (error) {
      console.error("Error al obtener producto por ID (Mongo):", error);
      return null;
    }
  }

  async addProduct(product) {
    try {
      const newProduct = await productRepository.create(product);
      return {
        message: "Producto agregado exitosamente",
        product: newProduct,
      };
    } catch (error) {
      console.error("Error al agregar producto (Mongo):", error);
      throw error;
    }
  }

  async updateProduct(pid, updateFields) {
    try {
      const updatedProduct = await productRepository.updateById(
        pid,
        updateFields,
      );

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
      const deletedProduct = await productRepository.deleteById(pid);

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
