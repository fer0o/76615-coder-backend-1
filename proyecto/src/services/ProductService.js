const { productRepository } = require("../repositories");
//Service para obtener los productos
class ProductService {
  async getProducts({ limit = 10, page = 1 } = {}) {
    try {
      const result = await productRepository.findAllPaginated({ limit, page });

      return {
        statusCode: 200,
        body: {
          status: "success",
          payload: result.payload,
          pagination: result.pagination,
        },
      };
    } catch (error) {
      console.error("Error en ProductService.getProducts:", error.message);
      return {
        statusCode: 500,
        body: {
          status: "error",
          message: "Error interno del servidor",
        },
      };
    }
  }
//Service para obtener un producto por su ID
  async getProductById(pid) {
    try {
      const product = await productRepository.findById(pid);

      if (!product) {
        return {
          statusCode: 404,
          body: {
            status: "error",
            message: "Producto no encontrado",
          },
        };
      }

      return {
        statusCode: 200,
        body: {
          status: "success",
          payload: product,
        },
      };
    } catch (error) {
      console.error("Error en ProductService.getProductById:", error.message);
      return {
        statusCode: 500,
        body: {
          status: "error",
          message: "Error interno del servidor",
        },
      };
    }
  }
//Service para crear un producto
  async createProduct(productData) {
  try {
    const newProduct = await productRepository.create(productData);

    return {
      statusCode: 201,
      body: {
        status: "success",
        message: "Producto agregado exitosamente",
        product: newProduct,
      },
    };
  } catch (error) {
    console.error("Error en ProductService.createProduct:", error.message);
    return {
      statusCode: 500,
      body: {
        status: "error",
        message: "Error interno del servidor",
      },
    };
  }
  }
//Service para actualizar un producto
  async updateProduct(pid, updateFields) {
    try {
      const updatedProduct = await productRepository.updateById(pid, updateFields);

      if (!updatedProduct) {
        return {
          statusCode: 404,
          body: {
            status: "error",
            message: "Producto no encontrado",
          },
        };
      }

      return {
        statusCode: 200,
        body: {
          status: "success",
          message: "Producto actualizado exitosamente",
          product: updatedProduct,
        },
      };
    } catch (error) {
      console.error("Error en ProductService.updateProduct:", error.message);
      return {
        statusCode: 500,
        body: {
          status: "error",
          message: "Error interno del servidor",
        },
      };
    }
  }
//Service para eliminar un producto
  async deleteProduct(pid) {
    try {
      const deletedProduct = await productRepository.deleteById(pid);

      if (!deletedProduct) {
        return {
          statusCode: 404,
          body: {
            status: "error",
            message: "Producto no encontrado",
          },
        };
      }

      return {
        statusCode: 200,
        body: {
          status: "success",
          message: `Producto con ID ${pid} eliminado correctamente`,
        },
      };
    } catch (error) {
      console.error("Error en ProductService.deleteProduct:", error.message);
      return {
        statusCode: 500,
        body: {
          status: "error",
          message: "Error interno del servidor",
        },
      };
    }
  }

}



module.exports = new ProductService();
