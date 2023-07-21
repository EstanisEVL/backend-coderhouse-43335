import { Router } from "express";
import passport from "passport";
import userModel from "../dao/models/user.model.js";

import { createHashValue, isValidPwd } from "../utils/encrypt.js";
import { generateJwt, passportCall } from "../utils/jwt.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const pwdHashed = await createHashValue(password);

    const addedUser = {
      first_name,
      last_name,
      email,
      age,
      password: pwdHashed,
    };

    const checkUser = await userModel.findOne({ email: email });

    if (checkUser) {
      // return res.redirect("/login");
      res.status(400).send({ message: "User already exists!" });
    } else {
      const newUser = await userModel.create(addedUser);
      // return res.redirect("/login");
      res.status(200).send({ message: "Succesful registry", newUser });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = {
      first_name: "Admin CODER",
      age: "-",
      email: "adminCoder@coder.com",
      password: "adminCod3r123",
      role: "admin",
    };

    if (email !== admin.email || password !== admin.password) {
      const findUser = await userModel.findOne({ email });
      if (!findUser) {
        return res
          .status(400)
          .send({ message: "User does not exist, please register." });
      }
      const isValidComparePwd = await isValidPwd(password, findUser.password);
      if (!isValidComparePwd) {
        return res.status(401).send({ message: "Incorrect password." });
        // res.redirect("/login")
      }

      const signUser = {
        email,
        role: findUser.role,
        id: findUser._id,
      };

      const token = await generateJwt({ ...signUser });

      req.user = { ...signUser };

      res
        .cookie("Cookie", token, { maxAge: 60 * 60 * 1000, httpOnly: true })
        .send({ message: `Successful login! Welcome ${email}` });
      // res.render("register")
    } else {
      const { docs } = await productsModel.paginate({}, { lean: true });
      res.render("admin", {
        style: "styles.css",
        first_name: admin.first_name,
        age: admin.age,
        email: req.session?.user?.email || email,
        role: admin.role,
        products: docs,
      });
    }
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

// Github:
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  async (req, res) => {}
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      req.session.user = req.user;
      console.log(req.session.user);
      const { docs } = await productsModel.paginate({}, { lean: true });
      res.render("profile", {
        style: "styles.css",
        first_name: req.session?.user?.first_name,
        last_name: req.session?.user?.last_name,
        email: req.session?.user?.email,
        age: req.session?.user?.age,
        role: req.session?.user?.role,
        products: docs,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

// Agregar al router /api/sessions/ la ruta /current, la cual utilizará el modelo de sesión que estés utilizando, para poder devolver en una respuesta el usuario actual:
router.get("/current", passportCall("jwt"), (req, res) => {
  res.send(req.user);
});

export default router;
