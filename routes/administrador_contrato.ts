import { Router } from "express";
import { errorAdmin } from "../middlewares/errorResponse";
import {
  getClientAdminContr,
  updateClientAdminContr,
} from "../controllers/administrador_contrato";
import { validarJWT } from "../middlewares/validarJWT";

const administradorCRouter = Router();

administradorCRouter.use(validarJWT);
administradorCRouter.use(errorAdmin);
administradorCRouter.get("/get_clientes", getClientAdminContr);
administradorCRouter.put("/update_estatus", updateClientAdminContr);

export { administradorCRouter };
