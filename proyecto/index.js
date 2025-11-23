//modularizacion del servidor

const app = require('./src/app')

//definimos el puerto
const PORT = 3000

//levantamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});