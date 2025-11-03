// ProductManager.js
// Maneja la lógica relacionada con los productos
const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, "../../data/products.json");
  }

  // Método para leer los productos desde el archivo JSON
  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer los productos:", error);
      return [];
    }
  }
  //metodo. para obtener producto por su ID
async getProductById(pid) {
  try {
    const data = await this.getProducts();

    // Buscamos directamente el producto en el array principal
    const product = data.find((p) => p.id === pid);

    // Si no existe, devolvemos null
    if (!product) {
      return null;
    }

    // Si existe, devolvemos el objeto completo
    return product;

  } catch (error) {
    console.error("Error al obtener el producto por ID:", error);
    throw error;
  }
}

  //metodo para agregar un nuevo producto
  async addProduct (product){
    try{
        //leemos los productos existentes
        const data = await this.getProducts();

        //generamos un ID unico (incremental)
        const maxId = data.length > 0 ? Math.max(...data.map(p => p.id)) : 0
        const newProduct = {
            id: maxId + 1,
            ...product
        }
        //agregamos el nuevo producto al array
        data.push (newProduct)

        //escribimos el nuevo JSON
        await fs.promises.writeFile(this.path, JSON.stringify(data, null,2))
        return{
            message: 'Producto agregado exitosamente',
            product: newProduct
        }
    }
    catch(error){
        console.error('Error al agregar el producto:', error);
        throw error;
    }
  }

  //metodod para actualizar un producto existente
  async updateProduct (pid, updateFields){
    try{
        const data = await this.getProducts();
        //buscamos el indice del producto a actualizar
        const index = data.findIndex((p)=> p.id === pid)

        if(index === -1){
            throw new Error (`Producto con ID ${pid} no encontrado`)
        }
        // creamos el nuevo objeto actualizado sin cambiar el ID
        const updateProduct = {
            ...data[index],
            ...updateFields,
            id: data[index].id
        }
        // reemplazamos el producto en el array
        data[index] = updateProduct

        //Guardamos los cambios en el JSON
        await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2))
        return {
            message: "Producto actualizado exitosamente",
            product: updateProduct
        }
    } catch(error){
        console.error('Error al actualizar el producto:', error);
        throw error;
    }
  }

  // Método para eliminar un producto por su ID
async deleteProduct(pid) {
  try {
    const data = await this.getProducts();

    // Filtramos los productos para eliminar el que coincide con el ID
    const newData = data.filter((p) => p.id !== pid);

    // Si la longitud no cambió, no existe el producto
    if (data.length === newData.length) {
      throw new Error(`Producto con ID ${pid} no encontrado`);
    }

    // Guardamos el nuevo JSON
    await fs.promises.writeFile(this.path, JSON.stringify(newData, null, 2));

    return { message: `Producto con ID ${pid} eliminado correctamente` };
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    throw error;
  }
}
  }

module.exports = ProductManager;