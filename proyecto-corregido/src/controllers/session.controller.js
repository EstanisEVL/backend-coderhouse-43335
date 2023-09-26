import {
  CartService,
  ProductService,
  SessionService,
} from "../repositories/index.js";
import AdminDTO from "../dtos/admin.dto.js";
import AuthDTO from "../dtos/auth.dto.js";
import CartDTO from "../dtos/cart.dto.js";
import ProductDTO from "../dtos/product.dto.js";
import UserDTO from "../dtos/user.dto.js";
import validationUtils from "../utils/validate.js";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../config/config.js";
import { createHashValue, isValidPwd } from "../utils/encrypt.js";
import { sendRecoveryMail } from "../helpers/email.helper.js";
import { generateJwt } from "../utils/jwt.js";

export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!validationUtils.validateRegisterBody(req.body)) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields." });
    }

    const checkUser = await SessionService.findUser(email);

    if (checkUser) {
      return res.status(400).json({ message: "User already exists!" });
    } else {
      if (!validationUtils.validateInput(first_name)) {
        return res.status(400).json({
          message: `${first_name} is not a valid name, it must contain only letters.`,
        });
      }

      if (!validationUtils.validateInput(last_name)) {
        return res.status(400).json({
          message: `${last_name} is not a valid name, it must contain only letters.`,
        });
      }

      if (!validationUtils.validateEmail(email)) {
        return res
          .status(400)
          .json({ message: "Please enter a valid email address." });
      }

      if (validationUtils.limitInputLength(first_name)) {
        return res.status(400).json({
          message: "Invalid first name. Máx. characters allowed: 20.",
        });
      }

      if (validationUtils.limitInputLength(last_name)) {
        return res
          .status(400)
          .json({ message: "Invalid last name. Máx. characters allowed: 20." });
      }

      if (validationUtils.validateAge(age)) {
        return res.status(400).json({ message: "Please enter a valid age." });
      }

      if (validationUtils.validatePassword(password)) {
        return res
          .status(400)
          .json({ message: validationUtils.validatePassword(password) });
      }

      const hashedPwd = createHashValue(password);

      const userInfo = {
        first_name,
        last_name,
        email,
        age,
        password: hashedPwd,
      };

      const newUser = await SessionService.createUser(userInfo);
      const userDTO = new UserDTO(newUser);
      return res.status(201).redirect("/login");
    }
  } catch (err) {
    req.logger.error(`Error in session.controller.js - line 86 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error registering user." });
  }
};

export const recoverPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUser = await SessionService.findUser(email);

    if (!checkUser) {
      return res.status(401).redirect("/register");
    } else {
      sendRecoveryMail(checkUser);
      return res.status(200).json({
        message: `Email succesfully sent to: ${email}! Please check your inbox to continue the password recovery process.`,
      });
    }
  } catch (err) {
    req.logger.error(`Error in session.controller.js - line 108 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error recovering password." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validationUtils.validateLoginBody(req.body)) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields." });
    }

    if (!validationUtils.validateEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address." });
    }

    if (validationUtils.validatePassword(password)) {
      return res
        .status(400)
        .json({ message: validationUtils.validatePassword(password) });
    }

    const hashedPwd = createHashValue(password);

    const checkUser = await SessionService.findUser(email);

    if (!checkUser) {
      return res.status(401).redirect("/register");
    } else {
      const isValidComparePwd = isValidPwd(password, checkUser.password);

      if (!isValidComparePwd) {
        const updatedUser = await SessionService.updateUser(email, hashedPwd);
        return res.status(200).redirect("/login");
      } else {
        return res.status(400).json({
          message: "Password cannot be the same as the existing one.",
        });
      }
    }
  } catch (err) {
    req.logger.error(`Error in session.controller.js - line 156 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error reseting password." });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = {
      first_name: "Admin CODER",
      age: "-",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    };

    if (!validationUtils.validateLoginBody(req.body)) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields." });
    }

    if (req.body.email !== admin.email) {
      const checkUser = await SessionService.findUser(email);

      if (!checkUser) {
        return res.status(401).redirect("/register");
      } else {
        const isValidComparePwd = isValidPwd(password, checkUser.password);

        if (!isValidComparePwd) {
          return res.status(401).redirect("/login");
        }
        if (checkUser.carts.length === 0) {
          try {
            const newCart = new CartDTO();
            const cart = await CartService.createCart(newCart);
            const createdCart = await CartService.getCartById(String(cart._id));

            checkUser.carts.push(createdCart);

            await checkUser.save();

            const signUser = {
              first_name: checkUser.first_name,
              last_name: checkUser.last_name,
              email,
              age: checkUser.age,
              role: checkUser.role,
              id: String(checkUser._id),
              carts: createdCart,
            };

            const token = await generateJwt({ ...signUser });
            req.user = { ...signUser };
            const user = new UserDTO(req.user);

            const docs = await ProductService.getAllProducts();
            const productsRender = docs.map((prod) => new ProductDTO(prod));

            return res
              .status(200)
              .cookie("Cookie", token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
              })
              .render("profile", {
                style: "styles.css",
                first_name: user.fullName,
                age: user.age,
                email: user.email,
                role: user.role,
                carts: user.userCarts,
                products: productsRender,
              });
          } catch (err) {
            req.logger.error(
              `Error in session.controller.js - line 235 - ${err}`
            );
            return res
              .status(500)
              .json({ message: "There was an error creating a cart." });
          }
        } else {
          const userCart = checkUser.carts.map((cart) => {
            return String(cart._id);
          });

          const cart = await CartService.getCartById(String(userCart[0]));

          const signUser = {
            first_name: checkUser.first_name,
            last_name: checkUser.last_name,
            email,
            age: checkUser.age,
            role: checkUser.role,
            id: String(checkUser._id),
            carts: cart,
          };
          const token = await generateJwt({ ...signUser });
          req.user = { ...signUser };
          const user = new UserDTO(req.user);

          let productsInCart = [];

          if (user.userCarts.products.length > 0) {
            const updatedProductsInCart = user.userCarts.products.map(
              (prod) =>
                new ProductDTO(prod.product, user.userCarts._id.toHexString())
            );

            productsInCart = updatedProductsInCart;
          }

          const docs = await ProductService.getAllProducts();
          const filteredDocs = docs.filter((prod) => prod.owner !== user.id);
          const productsRender = filteredDocs.map(
            (prod) => new ProductDTO(prod, user.userCarts._id.toHexString())
          );

          return res
            .status(200)
            .cookie("Cookie", token, {
              maxAge: 60 * 60 * 1000,
              httpOnly: true,
            })
            .render("profile", {
              style: "styles.css",
              first_name: user.fullName,
              age: user.age,
              email: user.email,
              role: user.role,
              cid: String(cart._id),
              carts: user.userCarts,
              productsTitle:
                productsInCart.length === 0 || !user.userCarts
                  ? "El carrito está vacío"
                  : "Productos en el carrito:",
              productsInCart: productsInCart,
              products: productsRender,
            });
        }
      }
    } else {
      const adminDTO = new AdminDTO(admin.first_name, admin.email, admin.role);
      const token = await generateJwt({ ...adminDTO });

      const docs = await ProductService.getAllProducts();
      const productsRender = docs.map((prod) => new ProductDTO(prod));

      return res
        .status(200)
        .cookie("Cookie", token, { maxAge: 60 * 60 * 1000, httpOnly: true })
        .render("admin", {
          style: "styles.css",
          first_name: adminDTO.fullName,
          age: adminDTO.age,
          email: adminDTO.email,
          role: adminDTO.role,
          products: productsRender,
        });
    }
  } catch (err) {
    req.logger.error(`Error in session.controller.js - line 321 - ${err}`);
    return res.status(500).json({ message: "There was an error logging in." });
  }
};

export const userLogout = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).redirect("/login");
    } else {
      res.clearCookie("Cookie");
      return res.status(200).redirect("/login");
    }
  } catch (err) {
    req.logger.error(`Error in session.controller.js - line 335 - ${err}`);
    return res.status(500).json({ message: "There was an error logging out." });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).redirect("/login");
    } else {
      const authDto = new AuthDTO(req.user);
      return res.status(200).json({
        message: `Current user: ${authDto.email} || Role: ${authDto.role}`,
      });
    }
  } catch (err) {
    req.logger.error(`Error in session.controller.js - line 349 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error getting the current user." });
  }
};

export const githubLogin = async (req, res) => {
  try {
    req.logger.info("Iniciar sesión con github");
  } catch (err) {
    req.logger.error(`Error in session.controller.js - line 359 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error logging in with GitHub." });
  }
};

export const getGithubUser = async (req, res) => {
  try {
    const githubUser = req.user;

    if (githubUser.carts.length === 0) {
      const newCart = new CartDTO();
      const cart = await CartService.createCart(newCart);
      const createdCart = await CartService.getCartById(String(cart._id));
      githubUser.carts.push(createdCart);
      await githubUser.save();

      const signUser = {
        first_name: githubUser.first_name,
        last_name: githubUser.last_name,
        email: githubUser.email,
        age: githubUser.age,
        role: githubUser.role,
        id: String(githubUser._id),
        carts: createdCart,
      };

      const token = await generateJwt({ ...signUser });
      req.user = { ...signUser };
      const user = new UserDTO(req.user);

      return res
        .status(200)
        .cookie("Cookie", token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        })
        .redirect(`/profile?user=${user.email}`);
    } else {
      const cart = githubUser.carts.map((cart) => String(cart._id));
      const findCart = await CartService.getCartById(String(cart));

      const signUser = {
        first_name: githubUser.first_name,
        last_name: githubUser.last_name,
        email: githubUser.email,
        age: githubUser.age,
        role: githubUser.role,
        id: String(githubUser._id),
        carts: findCart,
      };

      const token = await generateJwt({ ...signUser });
      req.user = { ...signUser };
      const user = new UserDTO(req.user);

      return res
        .status(200)
        .cookie("Cookie", token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        })
        .redirect(`/profile?user=${user.email}`);
    }
  } catch (err) {
    req.logger.error(
      `Error in session.controller.js - getGithubUser method - ${err}`
    );
    return res
      .status(500)
      .json({ message: "There was an error getting current GitHub user." });
  }
};
