// src/app.js

const express = require('express');
const app = express();
const { paths } = require('./config/config');
const handlebars = require('express-handlebars');

// Middleware
app.use(express.json());

// Rutas API
const apiRoutes = require('./routes/index');
app.use('/api', apiRoutes);

// Rutas de Vistas (nuevo)
const viewsRouter = require('./routes/views.router');
app.use('/', viewsRouter);

// Archivos estáticos
app.use("/public", express.static(paths.public));

// Handlebars
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: paths.layouts,
    partialsDir: paths.partials,
  })
);
app.set("view engine", "hbs");
app.set("views", paths.views);

// Exportar app
module.exports = app;