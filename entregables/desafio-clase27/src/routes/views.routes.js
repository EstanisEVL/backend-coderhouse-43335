import { Router } from "express";
import authMdw from "../middlewares/auth.middleware.js";
import ViewsController from "../controllers/views.controller.js";

const router = Router();

const viewsController = new ViewsController();

router.get("/", viewsController.home);

router.get("/login", viewsController.login);

router.get("/register", viewsController.register);

router.get("/recover", viewsController.recover);

router.get("/profile", authMdw, viewsController.profile);

router.get("/admin", authMdw, viewsController.admin);

export default router;
