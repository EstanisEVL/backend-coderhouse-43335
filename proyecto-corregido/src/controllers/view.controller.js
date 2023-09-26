import ProductDTO from "../dtos/product.dto.js";
import {
  CartService,
  ProductService,
  SessionService,
} from "../repositories/index.js";

export const home = async (req, res) => {
  try {
    res.redirect("/login");
  } catch (err) {
    req.logger.error(`Error in view.controller.js - line 5 - ${err}`);
    throw err;
  }
};

export const login = async (req, res) => {
  try {
    res.render("login", { style: "styles.css" });
  } catch (err) {
    req.logger.error(`Error in view.controller.js - line 14 - ${err}`);
  }
};

export const register = async (req, res) => {
  try {
    res.render("register", { style: "styles.css" });
  } catch (err) {
    req.logger.error(`Error in view.controller.js - line 22 - ${err}`);
  }
};

export const recover = async (req, res) => {
  try {
    res.render("recover", { style: "styles.css" });
  } catch (err) {
    req.logger.error(`Error in view.controller.js - line 30 - ${err}`);
  }
};

export const reset = async (req, res) => {
  try {
    res.render("reset", { style: "styles.css" });
  } catch (err) {
    req.logger.error(`Error in view.controller.js - line 38 - ${err}`);
  }
};

export const profile = async (req, res) => {
  try {
    const githubUser = req.query;
    const user = await SessionService.findUser(githubUser.user);
    const cart = user.carts.map((cart) => String(cart._id));
    const findCart = await CartService.getCartById(String(cart));

    let productsInCart = [];

    if (findCart.products.length > 0) {
      const updatedProductsInCart = findCart.products.map(
        (prod) => new ProductDTO(prod.product, findCart._id.toHexString())
      );
      productsInCart = updatedProductsInCart;
    }

    const docs = await ProductService.getAllProducts();
    const filteredDocs = docs.filter((prod) => prod.owner !== user.id);
    const productsRender = filteredDocs.map(
      (prod) => new ProductDTO(prod, findCart._id.toHexString())
    );

    console.log(user);

    res.status(200).render("profile", {
      style: "styles.css",
      first_name: user.first_name,
      age: user.age || "-",
      email: user.email,
      role: user.role,
      cid: String(findCart._id),
      carts: findCart,
      productsTitle:
        productsInCart.length === 0 || !findCart
          ? "El carrito está vacío"
          : "Productos en el carrito:",
      productsInCart: productsInCart,
      products: productsRender,
    });
  } catch (err) {
    req.logger.error(`Error in view.controller.js - line 47 - ${err}`);
  }
};

export const admin = async (req, res) => {
  try {
    const user = req - session.user;
    res.status(200).render("admin", { style: "styles.css", user });
  } catch (err) {
    req.logger.error(`Error in view.controller.js - line 56 - ${err}`);
  }
};
