import { generateProducts } from "../helpers/generate-products.js";
import { HttpResponse } from "../middlewares/error-handler.js";
import { ProductService } from "../repositories/index.js";
import CustomError from "../services/errors/CustomError.js";
import { EnumErrors } from "../services/errors/errorEnums.js";
import {
  generateProductErrorInfo,
  generateProductPriceErrorInfo,
} from "../services/errors/errorInfo.js";
import validationUtils from "../utils/validate.js";

const httpResp = new HttpResponse();

// Devuelve una respuesta de 100 productos "mock", generados con el formato de un producto real del proyecto:
export const createMockProducts = async (req, res) => {
  try {
    const products = generateProducts(100);
    return httpResp.OK(res, "Products created: ", products);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// Crea un producto en la base de datos:
export const createProducts = async (req, res) => {
  try {
    const product = req.body;

    if (!validationUtils.validateProduct(product)) {
      CustomError.createError({
        name: "Product creation error",
        cause: generateProductErrorInfo({
          title: product.title,
          description: product.description,
          code: product.code,
          price: product.price,
          status: product.status,
          stock: product.stock,
          category: product.category,
        }),
        message: "Error when creating product.",
        code: EnumErrors.INVALID_BODY_ERROR,
        res: res,
      });
    } else {
      if (!validationUtils.validatePrice(product.price)) {
        CustomError.createError({
          name: "Invalid price error",
          cause: generateProductPriceErrorInfo(product.price),
          message: `${EnumErrors.INVALID_PRICE_ERROR} - Invalid price range.`,
          code: EnumErrors.INVALID_PRICE_ERROR,
          res: res,
        });
      } else {
        const checkProduct = await ProductService.getProductByCode(
          product.code
        );
        if (!checkProduct) {
          const productBody = await ProductService.createProduct(product);
          return httpResp.OK(res, "Product created: ", productBody);
        } else {
          return httpResp.BadRequest(
            res,
            `${EnumErrors.DATABASE_ERROR} - Product already exists. Please update product if you want to modify its values.`,
            product
          );
        }
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
