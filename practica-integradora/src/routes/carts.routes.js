import { Router } from "express";
import cartsModel from "../dao/models/carts.models.js";
import CartsManager from "../dao/managers/carts.manager.js";
const router = Router();
const manager = new CartsManager();

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsModel.findOne({ _id: cid });
    if (cart) return res.json({ message: `getCarts`, cart });
    res.status(404).json({ error: "El carrito no existe" });
  } catch (err) {
    console.log("🚀 ~ file: carts.routes.js:10 ~ router.post ~ error:", err);
  }
});

router.post("/", async (req, res) => {
  try {
    const cart = req.body;
    const newCart = await cartsModel.create(cart);
    return res.status(200).json({ message: "addCart", newCart });
  } catch (err) {
    console.log("🚀 ~ file: carts.routes.js:22 ~ router.post ~ error:", err);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await manager.addProductToCart(cid, pid);
    res.status(200).json({ message: "addProductToCart", cart });
  } catch (err) {
    console.log("🚀 ~ file: carts.routes.js:31 ~ router.post ~ error:", err);
  }
});

export default router;
