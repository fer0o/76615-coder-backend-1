// proyecto/public/js/realTime.js
console.log("realTime.js funcionando");

// Conectar con el servidor WebSocket
const socket = io();

// Mensaje cuando se establece la conexión
socket.on("connect", () => {
  console.log("Conectado al servidor vía WebSocket");
});

// Formulario: CREAR PRODUCTO
const createForm = document.getElementById("createForm");

createForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const product = {
    team: createForm.team.value,
    player: createForm.player.value,
    price: Number(createForm.price.value)
  };

  console.log("Enviando producto:", product);

  // Evento del socket para crear producto
  socket.emit("crearProducto", product);

  createForm.reset();
});

// Formulario: ELIMINAR PRODUCTO

const deleteForm = document.getElementById("deleteForm");

if (deleteForm) {
  deleteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const productId = Number(deleteForm.productId.value);

    console.log("Solicitando eliminación ID:", productId);

    socket.emit("eliminarProducto", productId);

    deleteForm.reset();
  });
}

// actualiza la lista de productos en pantalla en tiempo real
socket.on("updateProducts", (products) => {
  console.log("Lista actualizada de productos:", products);

  const container = document.getElementById("products-container");
  container.innerHTML = "";
products.forEach((p) => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  card.innerHTML = `
    <div class="product-info">
      <strong>${p.id}. ${p.team}</strong> — ${p.player}
      <span class="price">$${p.price}</span>
    </div>

    <button class="delete-btn" data-id="${p.id}">
      Eliminar
    </button>
  `;

  container.appendChild(card);
});

  // Escuchar clic de cada botón
  const buttons = container.querySelectorAll(".delete-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      console.log("Eliminando producto ID:", id);

      socket.emit("eliminarProducto", id);
    });
  });
});