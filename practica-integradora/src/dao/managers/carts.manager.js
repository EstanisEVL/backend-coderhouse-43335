import cartsModel from "../models/carts.models.js";

class CartsManager {
  getCarts = async () => {
    try {
      const allCarts = await cartsModel.find();
      return allCarts;
    } catch (err) {
      console.log(
        "🚀 ~ file: carts.manager.js:11 ~ CartsManager ~ getCarts ~ error:",
        err
      );
    }
  };

  // getCartById = async (id) => {
  //   try {
  //     return await cartsModel.findById({ _id: id });
  //   } catch (err) {
  //     console.log(
  //       "🚀 ~ file: carts.manager.js:22 ~ CartsManager ~ getCartById= ~ err:",
  //       err
  //     );
  //   }
  // };

  addCart = async (cart) => {
    try {
      const carts = await cartsModel.find();

      if (carts.length === 0) {
        cart.id = 1;
      } else {
        cart.id = carts[carts.length - 1].id + 1;
      }

      cart.products = [];
      carts.push(cart);
      const newCart = await cartsModel.create({
        ...cart,
        products: cart.products,
      });

      return newCart;
    } catch (err) {
      console.log(
        "🚀 ~ file: carts.manager.js:48 ~ CartsManager ~ addCart=async ~ error:",
        err
      );
    }
  };

  addProductToCart = async (cid, pid) => {
    if (pid < 0) {
      console.log("Error: el id del producto no puede ser un número negativo.");
      return;
    }

    try {
      const carts = await cartsModel.find();
      const cartIndex = carts.findIndex((cart) => cart.id === cid);

      if (cartIndex !== -1) {
        const cart = carts[cartIndex];
        const existingProduct = cart.products.find(
          (item) => item.product === pid
        );
  
        if (existingProduct) {
          existingProduct.quantity++;
        } else {
          const product = {
            product: pid,
            quantity: 1,
          };
          cart.products.push(product);
        }
        await cart.save();
        return cart;
      } else {
        return console.log("Error: carrito no encontrado");
      }
    } catch (err) {
      console.log("🚀 ~ file: carts.manager.js:84 ~ router.post ~ error:", err);
    }
  };
};

export default CartsManager;