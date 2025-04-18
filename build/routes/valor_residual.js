"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valorResidualRouter = void 0;
const express_1 = require("express");
const valor_residual_1 = require("../controllers/valor_residual");
const validarJWT_1 = require("../middlewares/validarJWT");
const validarSession_1 = require("../middlewares/validarSession");
const valorResidualRouter = (0, express_1.Router)();
exports.valorResidualRouter = valorResidualRouter;
valorResidualRouter.use(validarJWT_1.validarJWT);
valorResidualRouter.get("/session", validarSession_1.verificadorSesion);
valorResidualRouter.put("/", valor_residual_1.updateValoresResiduales);
valorResidualRouter.post("/", valor_residual_1.registerValoresResiduales);
valorResidualRouter.get("/show_all_valor_residual", valor_residual_1.showValorValoresResiduales);
valorResidualRouter.post("/test_valor_residual", valor_residual_1.testValoresResiduales);
valorResidualRouter.post("/get_valor_residual_by_plazo", valor_residual_1.residualByPlazo);
