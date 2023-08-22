import {Router} from "express";
import {createMockProducts} from "../controllers/product.controller.js"

const router = Router();

router.get("/", createMockProducts);

export default router;