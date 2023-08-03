import { Router } from "express";
import SessionController from "../controllers/session.controller.js";
import passport from "passport";
import { passportCall } from "../utils/jwt.js";

const router = Router();

const sessionController = new SessionController();

// Rutas:
router.post("/register", sessionController.registerUser);

router.post("/login", sessionController.userLogin);

router.get("/logout", sessionController.userLogout);

router.get("/current", passportCall("jwt"), sessionController.getCurrentUser);

router.get("/github", passport.authenticate("github", { scope: ["user: email"] }), sessionController.githubLogin);

router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), sessionController.getGithubUser);


export default router;
