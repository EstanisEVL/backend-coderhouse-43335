export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getCarts = async () => {
    try {
      const data = await this.dao.get();
      return data;
    } catch (err) {
      return err;
    }
  };

  getCartById = async (cid) => {
    try {
      const data = await this.dao.getById(cid);
      return data;
    } catch (err) {
      return err;
    }
  };

  createCart = async (cart) => {
    try {
      const data = await this.dao.create(cart);
      return data;
    } catch (err) {
      return err;
    }
  };

  addProductToCart = async (cid, pid) => {
    try {
      const cart = await this.dao.getById(cid);
      cart.products.push({ product: pid });
      await cart.save();
      return cart;
    } catch (err) {
      return err;
    }
  };

  updateCartById = async (cid, cart) => {
    try {
      const data = await this.dao.updateById(cid, cart);
      return data;
    } catch (err) {
      return err;
    }
  };

  updateProductFromCart = async (cid, pid, pBody) => {
    try {
      const data = await this.dao.getAndUpdateById(cid, pid, pBody);
      return data;
    } catch (err) {
      return err;
    }
  };

  deleteCartById = async (cid) => {
    try {
      const data = await this.dao.deleteById(cid);
      return data;
    } catch (err) {
      return err;
    }
  };
}
