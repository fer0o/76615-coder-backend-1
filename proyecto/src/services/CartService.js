const mongoose = require("mongoose");
const {
  cartRepository,
  productRepository,
  ticketRepository,
} = require("../repositories");

const generateTicketCode = () =>
  `TKT-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

class CartService {
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
