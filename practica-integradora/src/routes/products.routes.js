import { Router } from "express";
import productsModel from "../dao/models/products.models.js";
// import productsData from "../db/products.js";
// import ProductManager from "../dao/managers/products.manager.js";
const router = Router();

router.get("/", async (req, res) => {
  const products = await productsModel.find({});
  return res.json({ message: `getProducts`, products });
});

router.post("/", async (req, res) => {
  try {
    const productBody = req.body;

    if (
      productBody.title &&
      productBody.description &&
      productBody.description &&
      productBody.code &&
      productBody.price &&
      productBody.status &&
      productBody.stock &&
      productBody.category
    ) {
      const newProduct = await productsModel.create(productBody);
      return res.json({ message: `addProduct`, newProduct });
    } else
      return res
        .status(400)
        .json({ message: "Ingrese todos los campos requeridos" });
  } catch (err) {
    console.log("🚀 ~ file: products.routes.js:22 ~ router.post ~ error:", err);
  }
});

router.put("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const updateFields = req.body;

  const product = await productsModel.findOne({ _id: pid });

  // console.log(
  //   "🚀 ~ file: products.routes.js:31 ~ router.put ~ user:",
  //   updatedProduct
  // );

  if (product) {
    const updatedProduct = await productsModel.updateOne({ _id: pid }, product);

    return res.status(200).json({ message: `updateProductById`, updatedProduct });
  } else {
    return res.status(400).json({ error: "Producto no encontrado" });
  }
});

router.delete("/:pid", async (req, res) => {
  const deleteProduct = await productsModel.deleteOne({ _id: req.params.pid });
  return res.json({ message: `deleteProducts`, deleteProduct });
});

export default router;

// class ProductRoutes {
//   path = "/products";
//   router = Router();
//   productManager = new ProductManager();

//   constructor() {
//     this.initProductRoutes();
//   }

//   initProductRoutes() {
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

// this.router.get(`${this.path}`, async (req, res) => {
//   try {
//     // TODO: agregar validaciones
//     const productsArr = await this.productManager.getProducts();
//     return res.json({
//       message: `got all products succesfully`,
//       productsLists: productsArr,
//     });
//   } catch (error) {
//     console.log(
//       "🚀 ~ file: products.routes.js:44 ~ ProductRoutes ~ this.router.get ~ error:",
//       error
//     );
//   }
// });

// this.router.get(`${this.path}/:pid`, async (req, res) => {
//   try {
//     const { pid } = req.params;
//     const productDetail = await this.productManager.getProductById(
//       pid
//     );
//     // TODO: AGREGAR VALIDACION
//     return res.json({
//       message: `got product info of ${pid} succesfully`,
//       product: productDetail,
//     });
//   } catch (error) {
//     console.log(
//       "🚀 ~ file: products.routes.js:60 ~ ProductRoutes ~ this.router.get ~ error:",
//       error
//     );
//   }
// });

// this.router.post(`${this.path}`, async (req, res) => {
//   try {
//     // TODO: HACER VALIDACIONES DEL BODY
//     const productBody = req.body;

//     // TODO REVISANDO SI EL ESTUDIANTE YA FUE CREADO ANTERIOMENTE
//     const newProduct = await this.productManager.createProduct(productBody);
//     if (!newProduct) {
//       return res.json({
//         message: `the product with id ${productBody.id} is already registered`,
//       });
//     }

//     return res.json({
//       message: `product created successfully`,
//       product: newProduct,
//     });
//   } catch (error) {
//     console.log(
//       "🚀 ~ file: products.routes.js:79 ~ ProductRoutes ~ this.router.post ~ error:",
//       error
//     );
//   }
// });
//   }
// }

// export default ProductRoutes;
