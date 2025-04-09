import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import {
  getAllTipoArchivoA,
  getTipoArchivoA,
  registerTipoArchivoA,
  updateTipoArchivo,
} from "../controllers/tipo_archivo_a";

const tipoArchivoARouter = Router();
tipoArchivoARouter.use(validarJWT);
tipoArchivoARouter.post("/", registerTipoArchivoA);
tipoArchivoARouter.post("/update_tipo_archivo", updateTipoArchivo);
tipoArchivoARouter.post("/get_tipo_archivo", getTipoArchivoA);
tipoArchivoARouter.get("/get_all_tipo_archivo", getAllTipoArchivoA);

export { tipoArchivoARouter };
