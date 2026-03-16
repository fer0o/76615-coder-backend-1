const ProductManagerMongo = require("../managersMongo/ProductManagerMongo");

const productManager = new ProductManagerMongo();

//handler para obtener un producto por su ID 
class ProductController {
  async getProducts(req, res) {
    try {
      const { limit, page } = req.query;

      const result = await productManager.getProducts({
        limit: limit ? Number(limit) : 10,
        page: page ? Number(page) : 1,
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      return res.status(500).json({ error: "Error al obtener los productos" });
    }
  }
  //handler para obtener un producto por su ID 
  async getProductById(req, res) {
    try {
      const pid = req.params.pid;
      const product = await productManager.getProductById(pid);

      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error);
      return res.status(500).json({ error: "Error al obtener el producto por ID" });
    }
  }
  //handler para crear un producto 
  async createProduct(req, res) {
    //body esperado para este endpoint
    /*
      {
        "team": "Real Madrid",
        "league": "La Liga",
        "country": "España",
        "continent": "Europa",
        "player": "Bellingham",
        "season": "2024/25",
        "category": "Away",
        "price": 1800,
        "stock": 8,
        "sizes": ["M", "L"]
      }
        */
    try {
      const productData = req.body;
      const requiredFields = [
        "team",
        "league",
        "country",
        "continent",
        "player",
        "season",
        "category",
        "price",
        "stock",
        "sizes",
      ];

      const missingFields = requiredFields.filter(
        (field) => productData[field] === undefined || productData[field] === null,
      );

      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Faltan los siguientes campos ${missingFields.join(",")}`,
        });
      }

      const result = await productManager.addProduct(productData);

      return res.status(201).json(result);
    } catch (error) {
      console.error("Error en POST /api/products:", error.message);
      return res
        .status(500)
        .json({ error: "Error interno del servidor", details: error.message });
    }
  }
  //handler para actualizar un producto 
  async updateProduct(req, res) {
    try {
      const pid = req.params.pid;
      const updateFields = req.body;

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({
          error: "No se enviaron campos para actualizar",
        });
      }

      const result = await productManager.updateProduct(pid, updateFields);

      if (!result) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error en PUT /api/products/:pid:", error.message);
      return res.status(500).json({
        error: "Error interno del servidor",
        details: error.message,
      });
    }
  }
  //handler para eliminar un producto 
  async deleteProduct(req, res) {
    try {
      const pid = req.params.pid;
      const result = await productManager.deleteProduct(pid);

      if (!result) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error en DELETE /api/products/:pid:", error.message);
      return res.status(500).json({
        error: "Error interno del servidor",
        details: error.message,
      });
    }
  }
}

module.exports = new ProductController();
