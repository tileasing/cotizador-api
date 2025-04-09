import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import {
  registerInversionFija,
  getInvesionFija,
  testInversionFija,
  showInversionFija,
  updateInversionFija,
} from "../controllers/inversion_fija";

const inversionFijaRouter = Router();

inversionFijaRouter.get("/", getInvesionFija);
inversionFijaRouter.post("/test", testInversionFija);
inversionFijaRouter.use(validarJWT);
inversionFijaRouter.get("/show_all_inversion_fija", showInversionFija);
inversionFijaRouter.put("/", updateInversionFija);
inversionFijaRouter.post("/", registerInversionFija);

export { inversionFijaRouter };