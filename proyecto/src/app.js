// src/app.js

const express = require('express');
const app = express();
const { paths } = require('./config/config');
const handlebars = require('express-handlebars');

const ProductManager = require ("./managers/ProductManager")
const productManager = new ProductManager();

// Middleware para que Express pueda leer JSON en las requests
app.use(express.json());

// Importar las rutas
const apiRoutes = require('./routes/index');

// Usar las rutas con el prefijo /api
app.use('/api', apiRoutes);

//servir los archivos estáticos desde la carpeta 'public'

// console.log("------->", paths.public);
app.use("/public",express.static(paths.public));


app.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.render("pages/home", {
      title: "Lista de productos",
      products,
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    res.status(500).send("Error cargando productos");
  }
  app.get("/realtimeproducts", (req, res)=>{
    res.render("pages/realtimeproducts");
  })
});


app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: paths.layouts,
    partialsDir: paths.partials,
  })
)
app.set("view engine", "hbs");
app.set("views", paths.views);


// Exportar la app para usarla en server.js
module.exports = app;