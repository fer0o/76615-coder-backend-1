// index.js (root)

const app = require("./src/app");
const http = require("http");
const { Server } = require("socket.io");

const ProductManager = require("./src/managers/ProductManager");
const productManager = new ProductManager();

// Crear servidor HTTP basado en Express
const server = http.createServer(app);

// Crear instancia de Socket.IO
const io = new Server(server);

// Eventos WebSocket
io.on("connection", async (socket) => {
  console.log("🟢 Cliente conectado vía WebSocket");

  // Cuando un nuevo cliente se conecta, enviarle la lista actual
  const products = await productManager.getProducts();
  socket.emit("updateProducts", products);

  // ==============================
  // Evento: CREAR PRODUCTO
  // ==============================
  socket.on("crearProducto", async (data) => {
    console.log("📥 Producto recibido:", data);

    try {
      let products = await productManager.getProducts();

      const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;

      const newProduct = {
        id: maxId + 1,
        ...data
      };

      products.push(newProduct);

      await productManager.saveProducts(products);

      // Avisar a todos los clientes del nuevo estado
      io.emit("updateProducts", products);

    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  });

  // ==============================
  // Evento: ELIMINAR PRODUCTO
  // ==============================
  socket.on("eliminarProducto", async (productId) => {
    console.log("🗑 Eliminando producto ID:", productId);

    try {
      let products = await productManager.getProducts();

      products = products.filter((p) => p.id !== productId);

      await productManager.saveProducts(products);

      // Avisar a todos los clientes del nuevo listado
      io.emit("updateProducts", products);

    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});

// Puerto
const PORT = 3000;

// Levantar servidor HTTP + WebSocket
server.listen(PORT, () => {
  console.log(`Servidor HTTP/WS corriendo en el puerto ${PORT}`);
});