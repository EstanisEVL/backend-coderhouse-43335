import { Router } from "express";
import {
  getCarts,
  getCartById,
  createCart,
  addProductToCart,
  updateCartById,
  updateProductFromCart,
  deleteCartById,
  deleteProductFromCart,
  purchaseProducts,
} from "../controllers/cart.controller.js";
import isValidMongoId from "../middlewares/validate-mongoId.js";
import { handlePolicies } from "../middlewares/policies.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.get("/", handlePolicies([ROLES[0]]), getCarts);

router.get("/:cid", isValidMongoId("cid"), getCartById);

router.post("/", createCart);

router.post(
  "/:cid/products/:pid",
  [isValidMongoId("cid"), isValidMongoId("pid"), handlePolicies([ROLES[2]])],
  addProductToCart
);

router.put(
  "/:cid",
  [isValidMongoId("cid"), handlePolicies([ROLES[0]])],
  updateCartById
);

/*
Para la ruta: router.put(
  "/:cid/products/:pid",
  [isValidMongoId("cid"), isValidMongoId("pid")],
  updateProductFromCart
);

Esa funcionalidad es para modificar la cantidad de productos que tenes en el carrito. no para cambiar el precio, nombre o lo que sea.

Lo que podes hacer es usar ese endpoint y agregar o sacar productos..

Por params envias el cid y pid. En el body envias lo que necesitas hacer..

{ quantity : 2, operation : “add” } // yo lo haria asi.. hay muchas formas de hacer lo mismo..

Para quitar.. { quantity : 2, operation : “remove” }

En el controller comparas el operation y le aplicas la lógica que necesites..

Puede ser que no se guarde en la base de datos porque la query que estas poniendo no encuentra un documento con lo que le pedis..

await Model.updateOne({ userID }, { $set: { ‘events.$[event].enabled’: true } }, { arrayFilters: [{ ‘event._id’: eventID }]);

Algo asi tenes que usar para hacer una actualizacion de un objeto dentro de un array
*/
router.put(
  "/:cid/products/:pid",
  [isValidMongoId("cid"), isValidMongoId("pid")],
  updateProductFromCart
);

router.delete(
  "/:cid",
  [isValidMongoId("cid"), handlePolicies([ROLES[0]])],
  deleteCartById
);

router.delete(
  "/:cid/products/:pid",
  [isValidMongoId("cid"), isValidMongoId("pid")],
  deleteProductFromCart
);

router.post("/:cid/purchase", isValidMongoId("cid"), purchaseProducts);

export default router;
