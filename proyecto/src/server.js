// src/server.js

// Importamos la app (donde está configurado Express)
const app = require('./app');

// Definimos el puerto
const PORT = 3000;

// Levantamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});