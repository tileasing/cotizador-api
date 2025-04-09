import { Router } from "express";
import {
  getAdmin,
  // loginAdmin,
  registerAdministrador,
  updateAdmin,
  updateAdminPass,
  deleteOtherAdmin,
  showAdmin,
  // getAdminSession,
  replacePassword,
  testCreateAdmins,
  viewClients,
} from "../controllers/administrador";
import { validarJWT } from "../middlewares/validarJWT";

const administradorRouter = Router();

// administradorRouter.post("/login", loginAdmin);
administradorRouter.post("/test", testCreateAdmins);
administradorRouter.use(validarJWT);
administradorRouter.post("/", registerAdministrador);
administradorRouter.put("/", updateAdmin);
administradorRouter.put("/password", updateAdminPass);
administradorRouter.put("/delete_admin", deleteOtherAdmin);
administradorRouter.get("/show_all_admins", showAdmin);
administradorRouter.put("/replace_password", replacePassword);
// administradorRouter.get("/get_data_session", getAdminSession);
administradorRouter.get("/", getAdmin);
administradorRouter.get("/get_clients", viewClients);

export { administradorRouter };
