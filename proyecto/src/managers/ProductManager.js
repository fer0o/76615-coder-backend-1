// ProductManager.js
// Maneja la lógica relacionada con los productos
const fs = require('fs');
const path = require('path');

class ProductManager{
    constructor(){
        this.path = path.join(__dirname, '../../data/products.json')
    }

    // Método para leer los productos desde el archivo JSON
    async getProducts(){
        try{
            const data = await fs.promises.readFile(this.path,  'utf-8');
            return JSON.parse(data);
        }
        catch(error){
            console.error('Error al leer los productos:', error);
            return [];
        }
    }
}

module.exports = ProductManager;