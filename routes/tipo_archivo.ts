import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import {
  getAllTipoArchivo,
  getTipoArchivo,
  registerTipoArchivo,
  updateIsRequired,
  updateTipoArchivo,
} from "../controllers/tipo_archivo";

const tipoArchivoRouter = Router();
tipoArchivoRouter.use(validarJWT);
tipoArchivoRouter.post("/", registerTipoArchivo);
tipoArchivoRouter.post("/update_tipo_archivo", updateTipoArchivo);
tipoArchivoRouter.post("/get_tipo_archivo", getTipoArchivo);
tipoArchivoRouter.get("/get_all_tipo_archivo", getAllTipoArchivo);
tipoArchivoRouter.put("/update_is_required", updateIsRequired);

export { tipoArchivoRouter };
