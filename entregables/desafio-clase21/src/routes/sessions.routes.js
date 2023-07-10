import { Router } from "express";
import passport from "passport";
import userModel from "../dao/models/user.model.js";
import productsModel from "../dao/models/products.model.js";
import { createHashValue, isValidPwd } from "../utils/encrypt.js";

const router = Router();

/*
Observaciones:
Lo mismo en router.post('/register') 
    Cuando lo crea bien también lo podes redirigir.
    Estas usando res.render() 

Y si es admin podes mandarlo a una vista para los admin.
Donde puedas gestionar los productos.. (agregar, borrar, modificar).
Esto igual es una sugerencia. No es necesario que lo hagas así.
*/

router.post("/register", async (req, res) => {
  try {
    // const body = req.body;
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
      // console.log(checkUser);
      alert("Usuario existente");
      return res.redirect("/login");
    } else {
      const newUser = await userModel.create(addedUser);
      req.session.user = { ...addedUser };
      console.log(newUser);
      // return res.render("login", { style: "styles.css" });
      return res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
  }
});

/* En el router.post('/login'...)
    Cuando no encontrás al usuario lo redirigís al login o el password.
    res.redirect('/login') */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const session = req.session;
    const admin = {
      first_name: "Admin CODER",
      age: "-",
      email: "adminCoder@coder.com",
      password: "adminCod3r123",
      role: "admin",
    };

    if (email !== admin.email || password !== admin.password) {
      const findUser = await userModel.findOne({ email });

      /* Si el usuario no existe o no coincide el password no mandes un json.
      Acordate que estamos trabajando con vistas. 
      Usando el res.redirect() lo mandas a la dirección que quieras.*/
      // REVISAR ESTADOS 401 Y 403 Y VER SI SE APLICAN EN ESTAS VALIDACIONES
      if (!findUser) {
        return res.status(401).redirect("/register");
        // .json({ message: "Usuario no registrado/existente" });
      }
      const isValidComparePwd = await isValidPwd(password, findUser.password);
      if (!isValidComparePwd) {
        return res.status(401).redirect("/login");
        // json({ message: "Password incorrecto" });
      }

      // if (findUser.password !== password) {
      // return res.status(401).redirect("/login");
      // json({ message: "Password incorrecto" });
      // }

      req.session.user = {
        ...findUser,
      };
      const { docs } = await productsModel.paginate({}, { lean: true });

      return res.render("profile", {
        style: "styles.css",
        first_name: req.session?.user?.first_name || findUser.first_name,
        email: req.session?.user?.email || email,
        age: req.session?.user?.age || findUser.age,
        role: req.session?.user?.role || findUser.role,
        products: docs,
      });
    } else {
      res.render("profile", {
        style: "styles.css",
        first_name: admin.first_name,
        age: admin.age,
        email: req.session?.user?.email || email,
        role: admin.role,
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

export default router;
