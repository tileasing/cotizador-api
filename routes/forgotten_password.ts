import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import {
  generateKey,
  updatePassword,
  verifyUniqueKey,
} from "../controllers/forgotten_password";

const forgottenPasswordRouter = Router();

forgottenPasswordRouter.post("/", generateKey);
forgottenPasswordRouter.post("/varify_unique_key", verifyUniqueKey);
forgottenPasswordRouter.post("/update_password", updatePassword);
forgottenPasswordRouter.use(validarJWT);

export { forgottenPasswordRouter };
