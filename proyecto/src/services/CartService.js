const mongoose = require("mongoose");
const {
  cartRepository,
  productRepository,
  ticketRepository,
} = require("../repositories");

const generateTicketCode = () =>
  `TKT-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

class CartService {
  //Service para crear un carrito
  async createCart() {
    try {
      const newCart = await cartRepository.create({ products: [] });

      return {
        statusCode: 201,
        body: {
          status: "success",
          message: "Carrito creado exitosamente",
          cart: newCart,
        },
      };
    } catch (error) {
      console.error("Error en CartService.createCart:", error.message);
      return {
        statusCode: 500,
        body: {
          status: "error",
          message: "Error interno del servidor",
        },
      };
    }
  }

  //Service para obtener un carrito por su ID
  async getCartById(cid) {
    try {
      const cart = await cartRepository.findByIdPopulated(cid);

      if (!cart) {
        return {
          statusCode: 404,
          body: {
            status: "error",
            message: "Carrito no encontrado",
          },
        };
      }

      return {
        statusCode: 200,
        body: {
          status: "success",
          payload: cart,
        },
      };
    } catch (error) {
      console.error("Error en CartService.getCartById:", error.message);
      return {
        statusCode: 500,
        body: {
          status: "error",
          message: "Error interno del servidor",
        },
      };
    }
  }

  //Service para agregar un producto al carrito
  async addProductToCart(cid, pid) {
    try {
      const updatedCart = await cartRepository.addProduct(cid, pid);

      if (!updatedCart) {
        return {
          statusCode: 404,
          body: {
            status: "error",
            message: "Carrito no encontrado",
          },
        };
      }

      return {
        statusCode: 200,
        body: {
          status: "success",
          message: "Producto agregado al carrito",
          cart: updatedCart,
        },
      };
    } catch (error) {
      console.error("Error en CartService.addProductToCart:", error.message);
      return {
        statusCode: 500,
        body: {
          status: "error",
          message: "Error al agregar producto al carrito",
          details: error.message,
        },
      };
    }
  }
  //Service para eliminar un producto del carrito
  async removeProductFromCart(cid, pid) {
    try {
      const updatedCart = await cartRepository.removeProduct(cid, pid);

      if (!updatedCart) {
        return {
          statusCode: 404,
          body: {
            status: "error",
            message: "Carrito o producto no encontrado",
          },
        };
      }

      return {
        statusCode: 200,
        body: {
          status: "success",
          message: "Producto eliminado del carrito",
          cart: updatedCart,
        },
      };
    } catch (error) {
      console.error("Error en CartService.removeProductFromCart:", error.message);
      return {
        statusCode: 500,
        body: {
          status: "error",
          message: "Error al eliminar el producto del carrito",
        },
      };
    }
  }
//Service para vaciar un carrito
  async clearCart(cid) {
    try {
      const clearedCart = await cartRepository.clear(cid);

      if (!clearedCart) {
        return {
          statusCode: 404,
          body: {
            status: "error",
            message: "Carrito no encontrado",
          },
        };
      }

      return {
        statusCode: 200,
        body: {
          status: "success",
          message: "Carrito vaciado correctamente",
          cart: clearedCart,
        },
      };
    } catch (error) {
      console.error("Error en CartService.clearCart:", error.message);
      return {
        statusCode: 500,
        body: {
          status: "error",
          message: "Error al vaciar el carrito",
        },
      };
    }
  }

  //Service para comprar un carrito
  async purchaseCart({ cid, purchaserEmail }) {
    let session;

    try {
      session = await mongoose.startSession();
      session.startTransaction();

      const cart = await cartRepository.findByIdPopulated(cid, { session });

      if (!cart) {
        await session.abortTransaction();
        return {
          statusCode: 404,
          body: {
            status: "error",
            message: "Carrito no encontrado",
          },
        };
      }

      if (!cart.products || cart.products.length === 0) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          body: {
            status: "error",
            message: "El carrito está vacío",
          },
        };
      }

      const purchasable = [];
      const notPurchasable = [];

      for (const item of cart.products) {
        const product = item.product;
        const quantity = Number(item.quantity);

        if (!product || !product._id) {
          notPurchasable.push({
            product: item.product?._id || item.product,
            quantity: item.quantity,
            reason: "Producto no encontrado",
          });
          continue;
        }

        const price = Number(product.price);
        const stock = Number(product.stock);

        if (!Number.isFinite(price) || price < 0) {
          notPurchasable.push({
            product: product._id,
            quantity,
            reason: "Precio inválido",
          });
          continue;
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
          notPurchasable.push({
            product: product._id,
            quantity: item.quantity,
            reason: "Cantidad inválida",
          });
          continue;
        }

        if (!Number.isFinite(stock) || stock < quantity) {
          notPurchasable.push({
            product: product._id,
            quantity,
            reason: "Stock insuficiente",
          });
          continue;
        }

        purchasable.push({
          productId: product._id,
          title: `${product.team} - ${product.player}`,
          price,
          quantity,
        });
      }

      if (purchasable.length === 0) {
        await session.abortTransaction();
        return {
          statusCode: 409,
          body: {
            status: "error",
            message:
              "No hay productos con stock suficiente para completar la compra",
            productsNotPurchased: notPurchasable,
          },
        };
      }

      const purchasedAfterStockUpdate = [];
      const failedAfterStockUpdate = [];

      for (const item of purchasable) {
        const updated = await productRepository.decreaseStockIfAvailable(
          item.productId,
          item.quantity,
          { session },
        );

        if (!updated) {
          failedAfterStockUpdate.push({
            product: item.productId,
            quantity: item.quantity,
            reason: "Stock insuficiente (actualización concurrente)",
          });
          continue;
        }

        purchasedAfterStockUpdate.push(item);
      }

      if (purchasedAfterStockUpdate.length === 0) {
        await session.abortTransaction();
        return {
          statusCode: 409,
          body: {
            status: "error",
            message:
              "No hay productos con stock suficiente para completar la compra",
            productsNotPurchased: [
              ...notPurchasable,
              ...failedAfterStockUpdate,
            ],
          },
        };
      }

      const productsNotPurchased = [
        ...notPurchasable,
        ...failedAfterStockUpdate,
      ];

      const finalAmount = purchasedAfterStockUpdate.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      const ticket = await ticketRepository.create(
        {
          code: generateTicketCode(),
          amount: finalAmount,
          purchaser: purchaserEmail,
        },
        { session },
      );

      const remainingProducts = productsNotPurchased.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }));

      await cartRepository.replaceProducts(cid, remainingProducts, { session });

      await session.commitTransaction();

      return {
        statusCode: 200,
        body: {
          status: "success",
          purchaseStatus:
            productsNotPurchased.length === 0 ? "complete" : "partial",
          ticket,
          productsPurchased: purchasedAfterStockUpdate,
          productsNotPurchased,
        },
      };
    } catch (error) {
      if (session?.inTransaction()) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      if (session) {
        session.endSession();
      }
    }
  }
}

module.exports = new CartService();
