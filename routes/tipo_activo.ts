import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import {
  getTipoActivo,
  registerTipoActivo,
  updateTipoActivo,
  showTipoActivo,
  deleteTipoActivo,
} from "../controllers/tipo_activo";

const tipoActivoRouter = Router();
tipoActivoRouter.use(validarJWT);
tipoActivoRouter.get("/", getTipoActivo);
tipoActivoRouter.post("/", registerTipoActivo);
tipoActivoRouter.put("/", updateTipoActivo);
tipoActivoRouter.get("/show_all_tipo_activo", showTipoActivo);
tipoActivoRouter.put("/delete_tipo_activo", deleteTipoActivo);

export { tipoActivoRouter };
