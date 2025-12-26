

// ID del carrito, no hay sesion por eso usamos un id de cart
const CART_ID = "694cade1a093c99f48f63e3e";

const removeButtons = document.querySelectorAll(".remove-btn");

removeButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const productId = button.dataset.productId;

    if (!productId) {
      console.error("❌ No se encontró productId en el botón");
      return;
    }

    const confirmDelete = confirm(
      "¿Seguro que quieres eliminar este producto del carrito?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `/api/carts/${CART_ID}/product/${productId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(" Error al eliminar producto:", data);
        alert("Error al eliminar el producto");
        return;
      }

      console.log("🗑️ Producto eliminado:", data);
      location.reload();
    } catch (error) {
      console.error(" Error de red:", error);
      alert("Error de conexión con el servidor");
    }
  });
});

/* ======================================================
   2️⃣ VACIAR TODO EL CARRITO
====================================================== */

const clearCartBtn = document.getElementById("clear-cart-btn");

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", async () => {
    const confirmClear = confirm(
      "¿Seguro que quieres vaciar todo el carrito?"
    );

    if (!confirmClear) return;

    try {
      const response = await fetch(`/api/carts/${CART_ID}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Error al vaciar carrito:", data);
        alert("Error al vaciar el carrito");
        return;
      }

      console.log("🧹 Carrito vaciado:", data);
      location.reload();
    } catch (error) {
      console.error("❌ Error de red:", error);
      alert("Error de conexión con el servidor");
    }
  });
}