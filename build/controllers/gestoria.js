"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGestoria = exports.getGestoria = void 0;
const models_1 = require("../models");
const gestoriaValidator_1 = require("../validators/gestoriaValidator");
const getGestoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gestoriaCli = yield models_1.Cliente_Arrendamiento.findAll({
            where: { estado: "Aprobado" },
            attributes: ["id", "cliente_id", "entrega_unidad"],
            include: [
                {
                    model: models_1.Cliente,
                    as: "cliente",
                    attributes: ["nombre", "regimen_fiscal"],
                },
            ],
        });
        return res.json({
            success: true,
            data: { gestoriaCli },
        });
    }
    catch (error) {
        const err = error;
        return res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.getGestoria = getGestoria;
const updateGestoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { entrega_unidad, id } = yield gestoriaValidator_1.gestoriaValidator.validate(req.body);
        const legal = yield models_1.Cliente_Arrendamiento.findOne({
            where: { id },
        });
        if (!legal)
            return res
                .status(400)
                .json({ success: false, errors: ["Ha ocurrido un error inesperado"] });
        yield legal.update({ entrega_unidad });
        return res.json({
            success: true,
            data: { msg: "Se ha actualizo el estatus con éxito" },
        });
    }
    catch (error) {
        const err = error;
        return res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.updateGestoria = updateGestoria;
