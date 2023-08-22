import ProductDTO from "../dtos/product.dto.js";

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createProduct = async (product) => {
    try {
      const newProduct = new ProductDTO(product);
      const data = await this.dao.create(newProduct);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  getProductByCode = async (code) => {
    try {
      const data = await this.dao.getByCode(code);
      return data;
    } catch (err) {
      console.log(err);
    }
  };
}
