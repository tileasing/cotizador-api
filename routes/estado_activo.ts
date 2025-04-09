import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import {
  getEstadoActivo,
  registerEstadoActivo,
  updateEstadoActivo,
  showEstadoActivo,
  deleteEstadoActivo,
} from "../controllers/estado_activo";

const estadoActivoRouter = Router();
estadoActivoRouter.use(validarJWT);
estadoActivoRouter.get("/", getEstadoActivo);
estadoActivoRouter.post("/", registerEstadoActivo);
estadoActivoRouter.put("/", updateEstadoActivo);
estadoActivoRouter.get("/show_all_estado_activo", showEstadoActivo);
estadoActivoRouter.put("/delete_estado_activo", deleteEstadoActivo);

export { estadoActivoRouter };
