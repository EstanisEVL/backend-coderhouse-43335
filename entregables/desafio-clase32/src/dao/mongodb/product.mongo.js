import productModel from "../../models/product.model.js";

export default class Products {
  create = async (productBody) => {
    try {
      const products = await productModel.create(productBody);
      return products;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  getByCode = async (code) => {
    try {
      const product = await productModel.findOne({ code: code });
      return product;
    } catch (err) {
      console.log(err);
    }
  };
}
