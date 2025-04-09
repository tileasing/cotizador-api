"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tipoArchivoARouter = void 0;
const express_1 = require("express");
const validarJWT_1 = require("../middlewares/validarJWT");
const tipo_archivo_a_1 = require("../controllers/tipo_archivo_a");
const tipoArchivoARouter = (0, express_1.Router)();
exports.tipoArchivoARouter = tipoArchivoARouter;
tipoArchivoARouter.use(validarJWT_1.validarJWT);
tipoArchivoARouter.post("/", tipo_archivo_a_1.registerTipoArchivoA);
tipoArchivoARouter.post("/update_tipo_archivo", tipo_archivo_a_1.updateTipoArchivo);
tipoArchivoARouter.post("/get_tipo_archivo", tipo_archivo_a_1.getTipoArchivoA);
tipoArchivoARouter.get("/get_all_tipo_archivo", tipo_archivo_a_1.getAllTipoArchivoA);
