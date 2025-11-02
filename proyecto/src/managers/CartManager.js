const fs = require("fs");
const path = require("path");

class CartManager {
    constructor(){
        //definimos la ruta del archivo JSON
        this.path = path.join (__dirname, '../../data/carts.json')
    }

    //obtenemos todos los carritos
    async getCarts(){
        try{
            const data = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse (data)
        } catch(error){
            console.error('Error al leer los carritos:', error);
            return [];
        }
    } 

    //creamos un carrito nuevo
    async createCart(){
        try{
            const carts = await this.getCarts()

            //generamos un ID unico
            const newID = carts.length > 0 ? carts[carts.length -1].id + 1 : 1;

            const newCart = {
                id: newID,
                products: []
            }
            carts.push(newCart)

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
            return newCart
        } catch(error){
            console.error('Error al crear el carrito:', error);
            throw error;
        }
    }
    //obtenemos un carrito por su ID
    async getCartById(cid){
        try{
            const carts = await this.getCarts()
            const cart = carts.find(c => c.id === cid)
            return cart || null
        } catch(error){
            console.error('Error al obtener el carrito por ID:', error);
            throw error;
        }
    }
    //agregamos un producto a un carrito
    async addProductToCart(cid, pid){
        try{
            const carts = await this.getCarts()
            const cartIndex = carts.findIndex(c => c.id === cid)
            if(cartIndex === -1){
                throw new Error(`Carrito con ID ${cid} no encontrado`)
            }
            //buscamos el producto en el carrito
            const cart = carts[cartIndex]
            
            //verificamos si el producto ya existe en el carrito
            const existindProducts = cart.products.find(p => p.productId === pid)
            if(existindProducts){
                //si existe aumentamos la cantidad
                existindProducts.quantity += 1
            }
            else{
                cart.products.push({productId: pid, quantity: 1})
            }
            //guaramos cambios
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
            return cart
        }
        catch(error){
            console.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    }

}
module.exports = CartManager;