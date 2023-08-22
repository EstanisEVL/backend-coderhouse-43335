import {Router} from "express";
import {createProducts} from "../controllers/product.controller.js"

const router = Router();

router.post("/", createProducts);

export default router;