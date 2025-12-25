require("dotenv").config();
const mongoose = require("mongoose");
require("../models/Product.model");

const CartManagerMongo = require("../managersMongo/CartManagerMongo");

async function testMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("🟢 Conectado a MongoDB (test)");

    const cartManager = new CartManagerMongo();

    const cartId = "694b584da8eb58cff9b8df64"; // tu carrito real

    // 1️⃣ Carrito ANTES
    const cartBefore = await cartManager.getCartById(cartId);
    console.log("🧺 Carrito ANTES de clearCart:");
    console.log(cartBefore);

    // 2️⃣ Ejecutar clearCart
    const clearedCart = await cartManager.clearCart(cartId);
    console.log("🧹 Resultado de clearCart:");
    console.log(clearedCart);

    // 3️⃣ Carrito DESPUÉS
    const cartAfter = await cartManager.getCartById(cartId);
    console.log("🧺 Carrito DESPUÉS de clearCart:");
    console.log(cartAfter);

  } catch (error) {
    console.error("🔴 Error en testMongo:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada");
  }
}

testMongo();