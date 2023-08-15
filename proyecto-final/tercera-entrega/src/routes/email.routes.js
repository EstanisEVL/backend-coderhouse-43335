import { Router } from "express";
import { sendMail } from "../controllers/email.controller.js";

const router = Router();

router.post("/send", sendMail);

export default router;
