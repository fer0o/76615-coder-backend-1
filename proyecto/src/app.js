// src/app.js

const express = require('express');
const app = express();
const { paths } = require('./config/config');

// Middleware para que Express pueda leer JSON en las requests
app.use(express.json());

// Importar las rutas
const apiRoutes = require('./routes/index');

// Usar las rutas con el prefijo /api
app.use('/api', apiRoutes);

//servir los archivos estáticos desde la carpeta 'public'

console.log("------->", paths.public);
app.use("/public",express.static(paths.public));

// Ruta raíz temporal
app.get('/', (req, res) => {
  try{
    res.status(200).json({
      title: "Bienvenido a FutbolStore API ⚽",
      message: "Usa las rutas /api/products y /api/carts para interactuar con la API",  
      description: "Proyecto final del curso Backend con Node.js - Coderhouse",
      version: "1.0.0",
    })
  }
  catch(error){
    res.status(500).json({ error: 'Error en el servidor' });
  }
})

// Exportar la app para usarla en server.js
module.exports = app;