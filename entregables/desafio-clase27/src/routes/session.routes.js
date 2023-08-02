import { Router } from "express";
import SessionController from "../controllers/session.controller.js";

const router = Router();

const sessionController = new SessionController();

// Rutas:
router.post("/register", sessionController.registerUser);

router.post("/login", sessionController.userLogin);

router.get("/logout", sessionController.userLogout);

router.get("/current", sessionController.getCurrentUser);

router.get("/github", sessionController.githubLogin);

router.get("/github/callback", sessionController.getGithubUser);


export default router;
