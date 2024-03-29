import productModel from "../../models/product.model.js";

export default class Products {
  get = async () => {
    try {
      const products = await productModel.find();
      return products;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  getById = async (pid) => {
    try {
      const product = await productModel.findById({ _id: pid });
      return product;
    } catch (err) {
      console.log(err);
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

  create = async (productBody) => {
    try {
      const product = await productModel.create(productBody);
      return product;
    } catch (err) {
      console.log(err);
    }
  };

  update = async (pid, productBody) => {
    try {
      const product = await productModel.findByIdAndUpdate(pid, productBody, {new: true});
      return product;
    } catch (err) {
      console.log(err);
    }
  };

  delete = async (pid) => {
    try {
      const product = await productModel.deleteOne({_id: pid});
      return product;
    } catch (err) {
      console.log(err);
    }
  };
}
