import { Router } from "express";
import {
  // getTasasByTipoActivoPaginate,
  registerValoresTasa,
  getTasasByTipoActivo,
  updateTasas,
  testValoresTasas,
  getAllTipoTasa,
  testValoresTasasTracto,
  testValoresTasasBici,
  testValoresTasasMoto,
} from "../controllers/valor_tasas";
import { validarJWT } from "../middlewares/validarJWT";

const valorTasasRouter = Router();
valorTasasRouter.use(validarJWT);
valorTasasRouter.post("/", registerValoresTasa);
valorTasasRouter.put("/", updateTasas);
valorTasasRouter.get("/:tipo_activo", getTasasByTipoActivo);
valorTasasRouter.post("/test_valores_tasas", testValoresTasas);
valorTasasRouter.post("/test_valores_tasas_tracto", testValoresTasasTracto);
valorTasasRouter.post("/test_valores_tasas_bici", testValoresTasasBici);
valorTasasRouter.post("/test_valores_tasas_moto", testValoresTasasMoto);
valorTasasRouter.get("/", getAllTipoTasa);
// valorTasasRouter.get('/:tipo_activoPages', getTasasByTipoActivoPaginate)

export { valorTasasRouter };
