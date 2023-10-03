import { Router } from "express";
import {
  registerUser,
  userLogin,
  userLogout,
  githubLogin,
  getGithubUser,
} from "../controllers/session.controller.js";
import { passportCall } from "../utils/jwt.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", userLogin);

router.get("/logout", [passportCall("jwt")], userLogout);

router.get("/github", [passportCall("github")], githubLogin);

router.get(
  "/githubcallback",
  [passportCall("github", { failureRedirect: "/login" })],
  getGithubUser
);

export default router;
