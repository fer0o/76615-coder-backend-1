console.log("realTime.js funcionando");

const socket = io();

socket.on("connect", () => {
  console.log("Conectado al servidor vía WebSocket");
});

// ===============================
// CREAR PRODUCTO (API REST)
// ===============================
const createForm = document.getElementById("createForm");

createForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(createForm);

  const product = {
    team: formData.get("team"),
    player: formData.get("player"),
    league: formData.get("league"),
    country: formData.get("country"),
    continent: formData.get("continent"),
    season: formData.get("season"),
    category: formData.get("category"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    sizes: formData
      .get("sizes")
      .split(",")
      .map((s) => s.trim()),
  };

  try {
    await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    createForm.reset();
  } catch (error) {
    console.error("Error creando producto:", error);
  }
});

// ===============================
// ACTUALIZAR LISTA (SOCKET)
// ===============================
socket.on("updateProducts", (data) => {
  const products = data.payload;

  const container = document.getElementById("products-container");
  container.innerHTML = "";

  products.forEach((p) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <strong>${p.team}</strong> — ${p.player}
      <span>$${p.price}</span>
      <button data-id="${p._id}" class="delete-btn">Eliminar</button>
    `;

    container.appendChild(card);
  });

  // eliminar por API
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
    });
  });
});