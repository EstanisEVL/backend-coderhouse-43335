import { Router } from "express";
import {
  togglePremium,
  uploadDocuments,
} from "../controllers/user.controller.js";
import isValidMongoId from "../middlewares/validate-mongoId.middleware.js";
import handleUploads from "../middlewares/handle-uploads.middleware.js";

const router = Router();

router.get("/premium/:uid", [isValidMongoId("uid")], togglePremium);

router.post(
  "/:uid/documents",
  [isValidMongoId("uid"), handleUploads],
  uploadDocuments
);

export default router;
