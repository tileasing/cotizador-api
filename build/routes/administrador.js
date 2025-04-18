"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.administradorRouter = void 0;
const express_1 = require("express");
const administrador_1 = require("../controllers/administrador");
const validarJWT_1 = require("../middlewares/validarJWT");
const administradorRouter = (0, express_1.Router)();
exports.administradorRouter = administradorRouter;
// administradorRouter.post("/login", loginAdmin);
administradorRouter.post("/test", administrador_1.testCreateAdmins);
administradorRouter.use(validarJWT_1.validarJWT);
administradorRouter.post("/", administrador_1.registerAdministrador);
administradorRouter.put("/", administrador_1.updateAdmin);
administradorRouter.put("/password", administrador_1.updateAdminPass);
administradorRouter.put("/delete_admin", administrador_1.deleteOtherAdmin);
administradorRouter.get("/show_all_admins", administrador_1.showAdmin);
administradorRouter.put("/replace_password", administrador_1.replacePassword);
// administradorRouter.get("/get_data_session", getAdminSession);
administradorRouter.get("/", administrador_1.getAdmin);
administradorRouter.get("/get_clients", administrador_1.viewClients);
