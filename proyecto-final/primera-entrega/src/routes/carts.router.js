import { Router } from "express";
import CartManager from "../managers/CartManager.js";
const router = Router();
const manager = new CartManager();

router.post("/", async (req, res) => {
  const cart = req.body;
  const newCart = await manager.addCart(cart);
  res.status(200).send({ message: "Carrito creado", payload: newCart });
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const carts = await manager.getCarts();
  const cart = carts.find((cart) => cart.id == cid);
  if (cart) return res.send(cart);
  res.status(404).json({ error: "El producto no existe" });
  res.status(200).send({message: "success", payload: carts});
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const cart = await manager.addProductToCart(parseInt(cid), parseInt(pid));

  if (cart) {
    res.status(200).send({ message: "Producto agregado al carrito", payload: cart });
  } else {
    res.status(404).send({
      error: "Error al agregar el producto",
    });
  }
});

export default router;