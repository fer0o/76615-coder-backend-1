
// ID del carrito usamos un id de cart por que no tenemos sesiones
const CART_ID = "694cade1a093c99f48f63e3e";

// Seleccionamos todos los botones de agregar
const addButtons = document.querySelectorAll(".add-btn");

//  clicks
addButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const productId = button.dataset.productId;

    if (!productId) {
      console.error("❌ No se encontró productId en el botón");
      return;
    }

    console.log(`Agregando producto ${productId} al carrito ${CART_ID}`);

    try {
      const response = await fetch(
        `/api/carts/${CART_ID}/product/${productId}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Error al agregar al carrito:", data);
        alert("Error al agregar el producto al carrito");
        return;
      }

      console.log("Producto agregado al carrito:", data);
      alert("Producto agregado al carrito");
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de conexión con el servidor");
    }
  });
});