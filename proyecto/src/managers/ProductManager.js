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

    //metodo para agregar un nuevo producto
    async addProduct({continent, country, team, product}){
        try{
            //leemos el catalogo actual
            const data = await this.getProducts()

            //buscamos el continente
            const continentFound = data.find(c => c.continent === continent)
            if(!continentFound){
                throw new Error (`Continente ${continent} no encontrado`)
            }
            //buscamos el pais dentro del continente
            const countryFound = continentFound.countries.find(countryItem => countryItem.name === country)
            if(!countryFound){
                throw new Error (`Pais ${country} no encontrado en el continente ${continent}`)
            }
            //buscamos el equipo dentro del pais
            const teamFound = countryFound.teams.find(t => t.name === team)
            if(!teamFound){
                throw new Error (`Equipo ${team} no encontrado en el pais ${country}`)
            }
            // generamos un ID unico para el nuevo producto
            //recorremos todo para encontrar el ID maximo
            let maxId =0
            for(const cont of data){
                for(const ctry of cont.countries){
                    for(const tm of ctry.teams){
                        for(const prod of tm.products){
                            if(prod.id > maxId){
                                maxId = prod.id
                            }
                        }
                    }
                }
            }
            const newID = maxId + 1
            const newProduct = {
                id: newID,
                ...product
            }
            //agregamos el nuevo producto al equipo correspondiente
            teamFound.products.push (newProduct)

            //escribimos de nuevo toto el catalogo en el archivo products.json
            const fs = require('fs')
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2))

            return {
                message: 'Producto agregado exitosamente',
                product: {
                    continent: continentFound.continent,
                    country: countryFound.name,
                    team: teamFound.name,
                    ...newProduct
                }
            }
        }
        catch(error){
            console.error('Error al agregar el producto:', error);
            throw error;
        }
    }

    //metodod para actualizar un producto existente
    async updateProduct(pid, updateFields){
        try{
            const data = await this.getProducts()
            let productFound = false

            //recorremos todo para encontrar el producto por su ID
            for (const continent of data){
                //recorremos paises
                for(const country of continent.countries){
                    //recorremos equipos
                    for (const team of country.teams){
                        //buscamos el producto por su ID
                        const productIndex = team.products.findIndex(p => p.id === pid)

                        if(productIndex !== -1){
                            //producto encontrado, actualizamos los campos excepuando el ID
                            const oldProduct = team.products[productIndex]

                            //actualizamos solo los campos proporcionados
                            const updateProduct = {
                                ...oldProduct,
                                ...updateFields,
                                id: oldProduct.id // ID no se actualiza
                            }
                            team.products[productIndex] = updateProduct
                            productFound = true
                            break // salimos del bucle de equipos, no es necesario seguir buscando
                        }
                    }
                    if(productFound) break; // salimos del bucle de paises
                }
                if(productFound) break; // salimos del bucle de continentes
            }
            if (!productFound){
                throw new Error (`Producto con ID ${pid} no encontrado`)
            }
            //Guardamos los cambios en el archivo JSON
            const fs = require('fs')
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2))
            return{message: 'Producto actualizado exitosamente',id: pid}
        }
        catch(error){
            console.error('Error al actualizar el producto:', error);
        }
    }
}

module.exports = ProductManager;