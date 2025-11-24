const path = require('path');

// Configuración general de la aplicación
module.exports = {
  PORT: 8080,
  paths: {
    public: path.join(__dirname, '../../public'),
    views: path.join(__dirname, '../views'),
    layouts: path.join(__dirname, '../views/layouts'),
    partials: path.join(__dirname, '../views/partials')
  }
};