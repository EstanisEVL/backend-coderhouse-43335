import productsModel from "../models/products.model.js";

export default class ProductManager {
  // Lee el modelo de productos y devuelve todos los productos:
  getProducts = async () => {
    try {
      const products = await productsModel.find({});
      return products;
    } catch (err) {
      console.log(err);
    }
  };

  // Recibe un id de producto, busca el producto con el id especificado y lo devuelve:
  getProductById = async (pid) => {
    try {
      const product = await productsModel.findById({ _id: pid });
      if(product) {
        return product;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Recibe un producto, chequea si existe y si no existe, lo agrega al arreglo de productos:
  addProduct = async (product) => {
    try {
      const checkProduct = await productsModel.findOne({
        code: `${Number(product.code)}`,
      });

      if (checkProduct) {
        // checkProduct.quantity++;
        // checkProduct.save();
        return checkProduct;
      }

      const newProduct = await productsModel.create({
        ...product,
        code: Number(product.code),
        // quantity: 1,
      });

      return newProduct;
    } catch (err) {
      console.log(err);
    }
  };

  // Recibe el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y actualiza el producto que tenga ese id en el archivo. SIN BORRAR SU ID:
  updateProduct = async (pid, updatedFields) => {
    try {
      const updatedProduct = await productsModel.updateOne({
        _id: pid,
        updatedFields,
      });

      if (pid === 0) {
        console.log("Error: id inexistente");
      } else if (pid === -1) {
        // ver si funciona con < 0
        console.log("Error: producto no encontrado");
      } else {
        return updatedProduct;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Recibe un id y elimina el producto que tenga ese id en el archivo:
  deleteProduct = async (pid) => {
    try {
      const products = await productsModel.deleteOne({ _id: pid });

      if (pid === 0) {
        console.log("Error: id inexistente");
      } else if (pid === -1) {
        console.log("Error: producto no encontrado");
      } else {
        return products;
      }
    } catch (err) {
      console.log(err);
    }
  };
}
