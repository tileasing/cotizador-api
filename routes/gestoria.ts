import { Router } from "express";
import { getGestoria, updateGestoria } from "../controllers/gestoria";
import { validarJWT } from "../middlewares/validarJWT";
import { errorAdmin } from "../middlewares/errorResponse";

const gestoriaRouter = Router();

gestoriaRouter.use(validarJWT);
gestoriaRouter.use(errorAdmin);
gestoriaRouter.get("/get_gestoria", getGestoria);
gestoriaRouter.put("/update_unidad", updateGestoria);
// gestoriaRouter.post("/get_contrato", getContrato);
// gestoriaRouter.post("/update_archivo", updateContrato);

export { gestoriaRouter };
