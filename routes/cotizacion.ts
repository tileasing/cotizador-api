import { Router } from "express";
import { getCotizacion} from "../controllers/cotizacion";
import { validarJWT } from "../middlewares/validarJWT";

const cotizacionRouter = Router();

cotizacionRouter.use(validarJWT);
cotizacionRouter.post("/", getCotizacion);
// cotizacionRouter.post("/cot_v2", getCotizacionv2);

export { cotizacionRouter };
