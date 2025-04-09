import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import {
  getInvesionAmortizable,
  testInversionAmortizable,
  showInversionAmortizable,
  registerInversionAmortizable,
  updateInversionAmortizable,
} from "../controllers/inversion_amortizable";

const inversionAmortizableRouter = Router();

inversionAmortizableRouter.get("/", getInvesionAmortizable);
inversionAmortizableRouter.post("/test", testInversionAmortizable);
inversionAmortizableRouter.use(validarJWT);
inversionAmortizableRouter.get(
  "/show_all_inversion_amortizable",
  showInversionAmortizable
);
inversionAmortizableRouter.post("/", registerInversionAmortizable);
inversionAmortizableRouter.put("/", updateInversionAmortizable);

export { inversionAmortizableRouter };
