import productsModel from "../models/products.models.js";

class ProductManager {
  getProducts = async () => {
    // Lee el archivo de productos y devuelve todos los productos en formato de arreglo:
    try {
      const data = await productsModel.find({});
      return data;
    } catch (err) {
      console.log(
        "🚀 ~ file: products.routes.js:11 ~ ProductManager ~ getProducts ~ error:",
        err
      );
    }
  };

  // Métodos:
  addProduct = async (product) => {
    // Recibe un objeto, le asigna un id autoincrementable y lo guarda en el arreglo:
    const products = await this.getProducts();

    if (products.length === 0) {
      product.id = 1;
    } else {
      product.id = products[products.length - 1].id + 1;
    }

    products.push(product);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, "\t")
    );
    return products;
  };

  getProductById = async (id) => {
    // Recibe un id, y tras leer el archivo, busca el producto con el id especificado y lo devuelve en formato objeto:
    try {
      const productDetail = await productsModel.findById({_id: id});
      // const productIndex = products.findIndex((product) => product.id === id);

      if (productDetail.id === 0) {
        console.log("Error: id inexistente");
      } else if (productDetail.id === -1) {
        console.log("Error: producto no encontrado");
      } else {
        return console.log(products[productDetail.id]);
      }
      return productDetail;
    } catch (err) {
      console.log(
        "🚀 ~ file: product.manager.js:43 ~ ProductManager ~ getProductById= ~ error:",
        err
      );
    }


    const products = await this.getProducts();

    const productIndex = products.findIndex((product) => product.id === id);

  };

  updateProduct = async (pid, updateFields) => {
    // Recibe el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y actualiza el producto que tenga ese id en el archivo. SIN BORRAR SU ID:
    const products = await this.getProducts();

    const productIndex = products.findIndex((product) => product.id === pid);

    if (productIndex !== -1) {
      const { pid, ...updatedFields } = updateFields;
      const updatedProduct = {
        ...products[productIndex],
        ...updatedFields,
        pid,
      };
      products[productIndex] = updatedProduct;
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return updatedProduct;
    } else {
      return console.log("Error: producto no encontrado");
    }
  };

  deleteProduct = async (pid) => {
    // Recibe un id y elimina el producto que tenga ese id en el archivo:
    const products = await this.getProducts();

    const productIndex = products.findIndex((product) => product.id === pid);
    if (pid === 0) {
      console.log("Error: id inexistente");
    }
    if (productIndex === -1) {
      console.log("Error: producto no encontrado");
    } else {
      products.splice(productIndex, 1);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return products;
    }
  };
}

export default ProductManager;