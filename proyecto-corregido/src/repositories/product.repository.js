export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  // Métodos:
  getAllProducts = async () => {
    try {
      const data = await this.dao.get();
      return data;
    } catch (err) {
      return err;
    }
  };

  // IDEA: UNIR MÉTODOS GETPRODUCTBYCODE Y BYID EN UNO SOLO:
  // SI NO FUNCIONA, SEPARAR
  getProduct = async (code = null, pid = null) => {
    if (code !== null) {
      try {
        const data = await this.dao.getByCode(code);
        return data;
      } catch (err) {
        return err;
      }
    } else {
      try {
        const data = await this.dao.getById(pid);
        return data;
      } catch (err) {
        return err;
      }
    }
  };

  createProduct = async (product) => {
    try {
      // IMPLEMENTAR DTO CON JOI:
      // const nProduct = new ProductDTO(product);
      // const data = await this.dao.create(nProduct);
      // return data;
    } catch (err) {
      return err;
    }
  };

  updateProduct = async (pid, pBody) => {
    try {
      const data = await this.dao.update(pid, pBody);
      return data;
    } catch (err) {
      return err;
    }
  };

  deleteProduct = async (pid) => {
    try {
      const data = await this.dao.delete(pid);
      return data;
    } catch (err) {
      return err;
    }
  };
}
