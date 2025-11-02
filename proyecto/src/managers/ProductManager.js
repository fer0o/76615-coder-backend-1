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
    //metodo. para obtener producto por su ID
    async getProductsById(pid){
        try{
            const data = await this.getProducts()

            //recorremos continentes
            for(const continent of data){
                //recorremos paises
                for(const country of continent.countries){
                    //recorremoos los equipos
                    for(const team of country.teams){
                        //buscamos el producto dentro de ese equipo
                        const product = team.products.find (p => p.id === pid)
                        if(product){
                            //si lo encontramos lo retornamos con la info del equipo, pais y continente
                            return {
                                continent: continent.continent,
                                country: country.name,
                                team: team.name,
                                ...product
                            }
                        }
                    }
                }
            }
            //si no lo encontramos retornamos null
            return null;
        }
        catch(error){
            console.error('Error al obtener el producto por ID:', error);
            throw error;    
        }
    }
}

module.exports = ProductManager;