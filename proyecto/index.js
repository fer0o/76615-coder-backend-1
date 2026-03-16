// index.js (root)
require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("🟢 MongoDB conectado correctamente"))
  .catch((err) => {
    console.error("🔴 Error al conectar MongoDB:", err.message);
    process.exit(1);
  });

const app = require("./src/app");
const http = require("http");
const { Server } = require("socket.io");
const { productRepository } = require("./src/repositories");

const server = http.createServer(app);
const io = new Server(server);

// SOCKET.IO
io.on("connection", async (socket) => {
  console.log("Cliente conectado (Realtime)");

  // 🔹 Enviar productos actuales
  const products = await productRepository.findAllPaginated();
  socket.emit("updateProducts", products);

  // 🔹 CREAR PRODUCTO
  socket.on("crearProducto", async (data) => {
    try {
      await productRepository.create({
        team: data.team,
        league: "N/A",
        country: "N/A",
        continent: "N/A",
        player: data.player,
        season: "2024/25",
        category: "N/A",
        price: Number(data.price),
        stock: 0,
        sizes: [],
      });

      const updatedProducts = await productRepository.findAllPaginated();
      io.emit("updateProducts", updatedProducts);
    } catch (error) {
      console.error("Error creando producto realtime:", error.message);
    }
  });

  // 🔹 ELIMINAR PRODUCTO
  socket.on("eliminarProducto", async (productId) => {
    try {
      await productRepository.deleteById(productId);

      const updatedProducts = await productRepository.findAllPaginated();
      io.emit("updateProducts", updatedProducts);
    } catch (error) {
      console.error("Error eliminando producto realtime:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor HTTP + WS corriendo en puerto ${PORT}`);
});
