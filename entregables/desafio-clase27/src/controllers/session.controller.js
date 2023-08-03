import { createHashValue, isValidPwd } from "../utils/encrypt.js";
import { generateJwt } from "../utils/jwt.js";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../config/config.js";
import SessionService from "../services/session.services.js";

class SessionController {
  sessionService;

  constructor() {
    this.sessionService = new SessionService();
  }

  // Métodos:
  registerUser = async (req, res) => {
    try {
      const { first_name, last_name, email, age, password } = req.body;

      if (
        !first_name ||
        !last_name ||
        !email ||
        !age ||
        !password ||
        password === ""
      ) {
        return res
          .status(400)
          .send({ message: "Please fill all required fields." });
      }

      const pwdHashed = createHashValue(password);

      const userInfo = {
        first_name,
        last_name,
        email,
        age,
        password: pwdHashed,
      };

      const checkUser = await this.sessionService.findUser(email);

      if (checkUser) {
        // return res.redirect("/login");
        return (
          res
            .status(400)
            // .redirect("/login");
            .send({ message: "User already exists!" })
        );
      } else {
        const newUser = await this.sessionService.createUser(userInfo);

        // return res.status(200).redirect("/login");
        return res.send({ message: "Succesful registry", newUser });
      }
    } catch (err) {
      console.log(err);
    }
  };

  userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;

      const admin = {
        first_name: "Admin CODER",
        age: "-",
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
      };

      if (email !== admin.email || password !== admin.password) {
        const findUser = await this.sessionService.findUser(email);
        if (!findUser) {
          return res.status(400).send({
            message: "User does not exist, please create an account.",
          });
        }
        const isValidComparePwd = isValidPwd(password, findUser.password);
        if (!isValidComparePwd) {
          return (
            res
              .status(401)
              // .redirect("/login")
              .send({ message: "Incorrect password." })
          );
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
          // .render("profile")
          .send({ message: `Successful login! Welcome ${email}` });
      } else {
        const { docs } = await this.sessionService.getProducts();

        // res.render("admin", {
        //   style: "styles.css",
        //   first_name: admin.first_name,
        //   age: admin.age,
        //   email: req.session?.user?.email || email,
        //   role: admin.role,
        //   products: docs,
        // });
        res.send({ message: `Succesful admin login! Welcome!`, admin });
      }
    } catch (err) {
      console.log(err);
    }
  };

  userLogout = async (req, res) => {
    req.session.destroy((err) => {
      if (!err) return res.redirect("/login");
      return res.send({ message: "Logout error", body: err });
    });
  };

  getCurrentUser = (req, res) => {
    res.send({ message: "Current user:", user });
  };

  // Github:
  githubLogin = async (req, res) => {};

  getGithubUser = async (req, res) => {
    try {
      req.session.user = req.user;
      // console.log(req.session.user);
      const user = req.user;

      const { docs } = await this.sessionService.getProducts();
      // const { docs } = await productsModel.paginate({}, { lean: true });

      // res.render("profile", {
      //   style: "styles.css",
      //   first_name: req.session?.user?.first_name,
      //   last_name: req.session?.user?.last_name,
      //   email: req.session?.user?.email,
      //   age: req.session?.user?.age,
      //   role: req.session?.user?.role,
      //   products: docs,
      // });
      res.send({ message: "Welcome github user", user });
    } catch (err) {
      console.log(err);
    }
  };
}

export default SessionController;
