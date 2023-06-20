import { Router } from "express";
import productsModel from "../dao/models/products.models.js";
import productsData from "../db/products.js";
import ProductManager from "../dao/managers/products.manager.js";

class ProductRoutes {
  path = "/products";
  router = Router();
  productManager = new ProductManager();

  constructor() {
    this.initProductRoutes();
  }

  initProductRoutes() {
    // this.router.get(`${this.path}/insertion`, async (req, res) => {
    //   try {
    //     const products = await productsModel.insertMany(productsData);
    //     // TODO: agregar validaciones

    //     return res.json({
    //       message: "products inserted successfully",
    //       productsInserted: products,
    //     });
    //   } catch (err) {
    //     console.log(
    //       "🚀 ~ file: products.routes.js:27 ~ ProductRoutes ~ this.router.get ~ error:",
    //       err
    //     );
    //   }
    // });

    this.router.get(`${this.path}`, async (req, res) => {
      try {
        // TODO: agregar validaciones
        const productsArr = await this.productManager.getProducts();
        return res.json({
          message: `got all products succesfully`,
          productsLists: productsArr,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: products.routes.js:44 ~ ProductRoutes ~ this.router.get ~ error:",
          error
        );
      }
    });

    this.router.get(`${this.path}/:pid`, async (req, res) => {
      try {
        const { pid } = req.params;
        const productDetail = await this.productManager.getProductById(
          pid
        );
        // TODO: AGREGAR VALIDACION
        return res.json({
          message: `got product info of ${pid} succesfully`,
          product: productDetail,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: products.routes.js:60 ~ ProductRoutes ~ this.router.get ~ error:",
          error
        );
      }
    });

    this.router.post(`${this.path}`, async (req, res) => {
      try {
        // TODO: HACER VALIDACIONES DEL BODY
        const productBody = req.body;

        // TODO REVISANDO SI EL ESTUDIANTE YA FUE CREADO ANTERIOMENTE
        const newProduct = await this.productManager.createProduct(productBody);
        if (!newProduct) {
          return res.json({
            message: `the product with id ${productBody.id} is already registered`,
          });
        }

        return res.json({
          message: `product created successfully`,
          product: newProduct,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: products.routes.js:79 ~ ProductRoutes ~ this.router.post ~ error:",
          error
        );
      }
    });
  }
}

export default ProductRoutes;
