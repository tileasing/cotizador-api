import { Router } from "express";
import {
  registerValoresResiduales,
  updateValoresResiduales,
  showValorValoresResiduales,
  testValoresResiduales,
  residualByPlazo,
} from "../controllers/valor_residual";
import { validarJWT } from "../middlewares/validarJWT";
import { verificadorSesion } from "../middlewares/validarSession";

const valorResidualRouter = Router();
valorResidualRouter.use(validarJWT);
valorResidualRouter.get("/session", verificadorSesion);
valorResidualRouter.put("/", updateValoresResiduales);
valorResidualRouter.post("/", registerValoresResiduales);
valorResidualRouter.get("/show_all_valor_residual", showValorValoresResiduales);
valorResidualRouter.post("/test_valor_residual", testValoresResiduales);
valorResidualRouter.post("/get_valor_residual_by_plazo", residualByPlazo);

export { valorResidualRouter };
