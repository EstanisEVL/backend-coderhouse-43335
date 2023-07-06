import { Router } from "express";
import authMdw from "../middleware/auth.middleware.js";

const router = Router();

router.get("/login", async (req, res) => {
  res.render("login");
})

router.get("/register", async (req, res) => {
  res.render("register");
})

// Agregar middleware de AUTH
router.get("/profile", authMdw, async (req, res) => {
  const user = req.session.user;
  console.log(user);
  // Cambiar por cartModel:
  res.render("profile", {
    user,
    carrito: {
      carritoId: "carrito-1",
      productos: [{productoId: "1", nombre: "camisa"}],
    }
  });

})

export default router;