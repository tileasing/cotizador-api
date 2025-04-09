import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import {
  getLogsByAdmins,
  getLogsSpecificByAdmins,
  getLogsSpecificsType,
} from "../controllers/log";

const logRouter = Router();

logRouter.use(validarJWT);
logRouter.get("/get_all_logs", getLogsByAdmins);
logRouter.post("/get_log_specific_admin", getLogsSpecificByAdmins);
logRouter.post("/get_logs_specifics_type", getLogsSpecificsType);

export { logRouter };
