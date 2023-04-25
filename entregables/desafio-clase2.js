// Clases con ECMAScript y ECMAScript avanzado:

class ProductManager {
  constructor() {
    this.products = [];
    this.id = 0;
  }

  getProducts = () => {
    return this.products;
  };

  addProduct = (title, description, price, thumbnail, code, stock) => {
    const product = { title, description, price, thumbnail, code, stock };
    if (this.products.some((p) => p.code === code)) {
      console.log("Error: el producto ya existe.");
      return;
    }

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Error: todos los campos son requeridos.");
      return;
    }
    if (this.products.length === 0) {
      product.id = 1;
    } else {
      product.id = this.products[this.products.length - 1].id + 1;
    }

    this.products.push(product);
  };

  getProductById = (id) => {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (id === 0) {
      console.log("Error: id inexistente");
    }
    if (productIndex === -1) {
      console.log("Error: producto no encontrado");
    } else {
      console.log(this.products[productIndex]);
    }
  };
}
// ✓	Se creará una instancia de la clase “ProductManager”:
const manager = new ProductManager();

// ✓	Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []:
console.log(manager.getProducts());

/* ✓	Se llamará al método “addProduct” con los campos:
  -	title: “producto prueba”
  -	description:”Este es un producto prueba”
  -	price:200,
  -	thumbnail:”Sin imagen”
  -	code:”abc123”,
  -	stock:25
*/

manager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

// ✓	El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
// ✓	Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado:

console.log(manager.getProducts());

// ✓	Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido:

manager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

// ✓	Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo:

manager.getProductById(1);
