import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import {
  clientArrendExist,
  getClientArrend,
  stateClient,
  updateClientArrend,
} from "../controllers/cliente_arrendamiento";

const clientArrendamientoRouter = Router();
clientArrendamientoRouter.use(validarJWT);
clientArrendamientoRouter.get("/", getClientArrend);
clientArrendamientoRouter.post("/", updateClientArrend);
clientArrendamientoRouter.post("/get_client_a", clientArrendExist);
// RUTAS PARA CLIENTE
clientArrendamientoRouter.get("/status", stateClient);

export { clientArrendamientoRouter };
