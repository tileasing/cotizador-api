import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import {
  getValoresOtrosGastos,
  registerValoresOtrosGastos,
  updateOtrosGastos,
  showValorOtrosGastos,
  testValoresOtrosGastos
} from "../controllers/valor_otros_gastos";

const valorOtrosGastosRouter = Router();
valorOtrosGastosRouter.use(validarJWT);
valorOtrosGastosRouter.get("/", getValoresOtrosGastos);
valorOtrosGastosRouter.post("/", registerValoresOtrosGastos);
valorOtrosGastosRouter.put("/", updateOtrosGastos);
valorOtrosGastosRouter.get("/show_all_otros_gastos", showValorOtrosGastos);
valorOtrosGastosRouter.post("/test_valor_otros_gastos", testValoresOtrosGastos)

export { valorOtrosGastosRouter };
