import { ProductService, SessionService } from "../repositories/index.js";
import validationUtils from "../utils/validate.js";

export const getProducts = async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();
    return res.status(200).json({ message: "Products: ", products });
  } catch (err) {
    req.logger.error(`Error in product.controller.js - line 8 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error getting all products." });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductService.getProduct(null, pid);
    if (!product) {
      return res.status(404).json({ message: "Error - Product not found." });
    } else {
      return res.status(200).json({ message: "Product found: ", product });
    }
  } catch (err) {
    req.logger.error(`Error in product.controller.js - line 25 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error getting a product." });
  }
};

// QUE EL CÓDIGO SE AUTOGENERE COMO CON LOS TICKETS
// QUE NO ABANDONE LA PÁGINA DEL ADMIN CUANDO CREA EXITOSAMENTE EL PRODUCTO
export const createProduct = async (req, res) => {
  try {
    const product = req.body;
    if (!validationUtils.validateProduct(product)) {
      return res.status(400).json({
        message:
          "Error - Please fill all required product fields (title, description, code, price, status, stock and category).",
      });
    } else {
      if (!validationUtils.validatePrice(product.price)) {
        return res
          .status(400)
          .json({ message: "Error - Invalid price range." });
      }
      const checkProduct = await ProductService.getProduct(product.code, null);
      if (!checkProduct) {
        if (req.user.user.role.toLowerCase() !== "admin") {
          const findUser = await SessionService.findUser(
            null,
            req.user.user.id
          );

          console.log(findUser);

          const newProduct = { ...product, owner: req.user.user.id };
          const productBody = await ProductService.createProduct(newProduct);
          return res
            .status(201)
            .json({ message: "Product created. ", productBody });
        } else {
          const productBody = await ProductService.createProduct(product);
          return res
            .status(201)
            .json({ message: "Product created. ", productBody });
        }
      } else {
        return res.status(400).json({
          message:
            "Error - Product already exists. Please update product if you want to modify its values.",
        });
      }
    }
  } catch (err) {
    req.logger.error(err);
    return res
      .status(500)
      .json({ message: "There was an error creating a product." });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const productBody = req.body;

    if (!validationUtils.validateProductBody(productBody)) {
      return res.status(400).json({
        message:
          "Only the following product fields can be modified: title, description, code, price, status, stock and category.",
      });
    } else {
      // console.log(productBody);
      return res.status(200).json({ message: "Product updated." });
      // const updatedProduct = await ProductService.updateProduct(pid, productBody);

      // if (!updatedProduct) {
      //   return res.status(404).json({ message: "Error: Product not found." });
      // } else {
      //   // Actualizar producto en base al body:
      //   return res.status(200).json({ message: "Product Updated: ", updatedProduct });
      // }
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
      return res.status(404).json({ message: "Error - Product not found." });
    } else {
      const findUser = await SessionService.findUser(null, req.user.user.id);
      // Un usuario premium sólo pueda borrar los productos que le pertenecen:
      if (req.user.user.role.toLowerCase() === "premium") {
        if (product.owner !== String(findUser._id)) {
          return res.status(403).json({
            message:
              "Error - Premium users cannot delete products created by the admin.",
          });
        } else {
          const deletedProduct = await ProductService.deleteProduct(pid);
          return res.status(200).json({
            message: "Product deleted",
            deletedProduct,
          });
        }
      }
      const deletedProduct = await ProductService.deleteProduct(pid);
      return res.status(200).json({
        message: "Product deleted.",
        deletedProduct,
      });
    }
  } catch (err) {
    req.logger.error(err);
    return res
      .status(500)
      .json({ message: "There was an error deleting a product." });
  }
};
