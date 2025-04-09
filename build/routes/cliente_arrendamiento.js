"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientArrendamientoRouter = void 0;
const express_1 = require("express");
const validarJWT_1 = require("../middlewares/validarJWT");
const cliente_arrendamiento_1 = require("../controllers/cliente_arrendamiento");
const clientArrendamientoRouter = (0, express_1.Router)();
exports.clientArrendamientoRouter = clientArrendamientoRouter;
clientArrendamientoRouter.use(validarJWT_1.validarJWT);
clientArrendamientoRouter.get("/", cliente_arrendamiento_1.getClientArrend);
clientArrendamientoRouter.post("/", cliente_arrendamiento_1.updateClientArrend);
clientArrendamientoRouter.post("/get_client_a", cliente_arrendamiento_1.clientArrendExist);
// RUTAS PARA CLIENTE
clientArrendamientoRouter.get("/status", cliente_arrendamiento_1.stateClient);
