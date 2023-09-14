import { ProductService, SessionService } from "../repositories/index.js";

export const getProducts = async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();
    return res.status(200).json({ message: "Carts: ", products });
  } catch (err) {
    req.logger.error(`Error in product.controller.js - line 4 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error getting all products." });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    // PROBAR SI EL REPOSITORY RECIBE CORRECTAMENTE LOS PARÁMETROS:
    const product = await ProductService.getProduct({ pid: pid });
    if (!product) {
      return res.status(404).json({ message: "Error: Product not found." });
    } else {
      return res.status(200).json({ message: "Product found: ", product });
    }
  } catch (err) {
    req.logger.error(`Error in product.controller.js - line 26 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error getting all products." });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = req.body;
    if (!validationUtils.validateProduct(product)) {
      return res.status(400).json({
        message:
          "Please fill all required product fields: title, description, code, price, status, stock and category.",
      });
    } else {
      if (!validationUtils.validatePrice(product.price)) {
        return res.status(400).json({ message: "Invalid price range." });
      }

      // Revisar nombre del método del repositorio:
      const fUser = await SessionService.findUserById(req.user.user.id);

      const cProduct = await ProductService.getProduct({ code: product.code });
      if (!cProduct) {
        if (fUser.role !== "admin") {
          const pBody = { ...product, owner: req.user.user.id };
          const nProduct = await ProductService.createProduct(pBody);
          return res
            .status(200)
            .json({ message: "Product created: ", nProduct });
        } else {
          const pBody = await ProductService.createProduct(pBody);
          return res
            .status(200)
            .json({ message: "Product created: ", productBody });
        }
      } else {
        return res.status(400).json({
          message:
            "Product already exists. Please update product if you want to modify its values.",
        });
      }
    }
  } catch (err) {
    req.logger.error(`Error in product.controller.js - line 71 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error creating a product." });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const pBody = req.body;

    if (!validationUtils.validateProductBody(productBody)) {
      return res.status(400).json({
        message:
          "Only the following product fields can be modified: title, description, code, price, status, stock and category.",
      });
    } else {
      const uProduct = await ProductService.updateProduct(pid, pBody);

      if (!uProduct) {
        return res.status(404).json({ message: "Error: Product not found." });
      } else {
        return res.status(200).json({ message: "Product Updated: ", uProduct });
      }
    }
  } catch (err) {
    req.logger.error(`Error in product.controller.js - line 100 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error creating a product." });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductService.getProduct(pid);

    if (!product) {
      return res.status(404).json({ message: "Error: Product not found." });
    } else {
      // REVISAR NOMBRE DE MÉTODO DEL REPOSITORIO:
      const fUser = await SessionService.findUserById(req.user.user.id);

      if (fUser.role === "premium") {
        if (product.owner !== String(fUser._id)) {
          return res.status(400).json({
            message:
              "Premium users cannot delete products created by the admin.",
          });
        } else {
          const dProduct = await ProductService.deleteProduct(pid);
          return res.status(200).json({
            message: "Product deleted",
            dProduct,
          });
        }
      }
      const dProduct = await ProductService.deleteProduct(pid);
      return res.status(200).json({
        message: "Product deleted",
        dProduct,
      });
    }
  } catch (err) {
    req.logger.error(`Error in product.controller.js - line 150 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error creating a product." });
  }
};
