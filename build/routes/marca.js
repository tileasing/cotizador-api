"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marcaRouter = void 0;
const express_1 = require("express");
const validarJWT_1 = require("../middlewares/validarJWT");
const marca_1 = require("../controllers/marca");
const marcaRouter = (0, express_1.Router)();
exports.marcaRouter = marcaRouter;
marcaRouter.use(validarJWT_1.validarJWT);
marcaRouter.get("/", marca_1.getMarca);
marcaRouter.post("/", marca_1.registerMarca);
marcaRouter.put("/", marca_1.updateMarca);
marcaRouter.get("/show_all_marca", marca_1.showMarca);
marcaRouter.put("/delete_marca", marca_1.deleteMarca);
