import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import {
  getLogsClienteByAdmins,
  getLogsClienteSpecByAdmins,
  getLogsSpecificsType,
} from "../controllers/log_cliente";

const logClienteRouter = Router();

logClienteRouter.use(validarJWT);
logClienteRouter.get("/get_all_logs_cliente", getLogsClienteByAdmins);
logClienteRouter.post(
  "/get_log_cliente_specs_admin",
  getLogsClienteSpecByAdmins
);
logClienteRouter.post("/get_logs_specifics_type", getLogsSpecificsType);

export { logClienteRouter };
