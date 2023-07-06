import { Router } from "express";
import userModel from "../model/user.model.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const body = req.body;
    // const { first_name, last_name, email, age, password } = req.body;

    const newUser = await userModel.create(body);

    req.session.user = { ...body };

    console.log(newUser);
    return res.render("login");
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const session = req.session;
    const findUser = await userModel.findOne({ email });

    if (!findUser) {
      return res
        .status(401)
        .json({ message: "Usuario no registrado/existente" });
    }

    if (findUser.password !== password) {
      return res.status(401).json({ message: "Password incorrecto" });
    }

    req.session.user = {
      ...findUser,
      password: "",
    };

    return res.render("profile", {
      last_name: req.session?.user?.last_name || findUser.last_name,
      email: req.session?.user?.email || email,
      age: req.session?.user?.age || findUser.age,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (!err) return res.redirect("/login");
    return res.send({ message: "Logout error", body: err });
  });
});

export default router;
