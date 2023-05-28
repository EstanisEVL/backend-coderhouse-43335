import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
const router = Router();
const manager = new ProductManager();

router.get("/", async (req, res) => {
  const products = await manager.getProducts();
  const limit = parseInt(req.query.limit);
  const filteredProducts = products.slice(0, limit);
  if (limit) res.status(200).send({status: "success", payload: filteredProducts});
  else res.status(200).send({status: "success", payload: products});
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const products = await manager.getProducts();
  const product = products.find((product) => product.id == pid);
  if (product) return res.status(200).send({payload: product});
  res.status(404).json({ error: "El producto no existe" });
});

router.post("/", async (req, res) => {
  const products = await manager.getProducts();
  const product = req.body;
  if (
    product.title &&
    product.description &&
    product.code &&
    product.price &&
    product.status &&
    product.stock &&
    product.category
  ) {
    await manager.addProduct(product);
    res.status(200).send({ status: "success", message: "Created product", payload: product});
  } else return res.status(400).send({status: "error", message: "Ingrese todos los campos requeridos"})
});

router.put("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  const updateFields = req.body;
  delete updateFields.id;

  const updatedProduct = await manager.updateProduct(pid, updateFields);
  if(updatedProduct) {
    return res.status(200).send({status: "success", payload: updatedProduct});
  }
  else {
    return res.status(404).send({error: "Producto no encontrado"});
  }
});

router.delete("/:pid", (req, res) => {
  const pid = parseInt(req.params.pid);
  const deletedProduct = manager.deleteProduct(pid);

  if(deletedProduct) {
    return res.status(200).send({ status: "success", message: "Producto eliminado" });
  }
  else {
    return res.status(404).send({message: "Producto no encontrado"});
  }
});

export default router;