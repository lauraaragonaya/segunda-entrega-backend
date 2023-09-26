const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.loadProductsFromFile();
  }

  loadProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (err) {
      this.products = [];
    }
  }

  saveProductsToFile() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
  }

  addProduct(productData) {
    if (!productData || !productData.title || !productData.description || !productData.price || !productData.thumbnail || !productData.code || !productData.stock) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    const newId = this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      ...productData
    };
    this.products.push(newProduct);
    this.saveProductsToFile();
    console.log("Producto agregado:", newProduct);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      console.error("Producto no encontrado");
      return null;
    }
    return product;
  }

  updateProduct(id, updatedData) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      console.error("Producto no encontrado");
      return;
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updatedData
    };

    this.saveProductsToFile();
    console.log("Producto actualizado:", this.products[productIndex]);
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      console.error("Producto no encontrado");
      return;
    }

    this.products.splice(productIndex, 1);
    this.saveProductsToFile();
    console.log("Producto eliminado");
  }
}

// Ejemplo de uso:
const manager = new ProductManager('productos.json');

manager.addProduct({
  title: "Mesa",
  description: "Mesa de madera",
  price: 10.99,
  thumbnail: "img/mesa-90-x-90-cuadrada.jpg",
  code: "001",
  stock: 100,
});

manager.addProduct({
  title: "Silla",
  description: "Silla de Madera",
  price: 19.99,
  thumbnail: "img/silla-de-madera.jpg",
  code: "002",
  stock: 50,
});

console.log("Todos los productos:", manager.getProducts());

const productId = 2;
const product = manager.getProductById(productId);
if (product) {
  console.log(`Producto con ID ${productId}:`, product);
}

manager.updateProduct(1, { price: 12.99 });

manager.deleteProduct(2);
