console.log("🔥 realTime.js cargado");

// Conectar con el servidor WebSocket
const socket = io();

// Mensaje cuando se establece la conexión
socket.on("connect", () => {
  console.log("🟢 Conectado al servidor vía WebSocket");
});

// ================================
// FORMULARIO: CREAR PRODUCTO
// ================================
const createForm = document.getElementById("createForm");

createForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const product = {
    team: createForm.team.value,
    player: createForm.player.value,
    price: Number(createForm.price.value)
  };

  console.log("📤 Enviando producto:", product);

  // Emitir evento al servidor
  socket.emit("crearProducto", product);

  createForm.reset();
});


// ================================
// FORMULARIO: ELIMINAR PRODUCTO
// ================================
const deleteForm = document.getElementById("deleteForm");

deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const productId = Number(deleteForm.productId.value);

  console.log("🗑 Solicitando eliminación ID:", productId);

  socket.emit("eliminarProducto", productId);

  deleteForm.reset();
});


// ================================
// ACTUALIZAR LISTA EN TIEMPO REAL
// ================================
socket.on("updateProducts", (products) => {
  console.log("📦 Lista actualizada de productos:", products);

  const container = document.getElementById("products-container");
  container.innerHTML = "";

  products.forEach((p) => {
    const item = document.createElement("p");
    item.textContent = `${p.id} — ${p.team} / ${p.player} — $${p.price}`;
    container.appendChild(item);
  });
});