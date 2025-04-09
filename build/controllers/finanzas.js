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
exports.updateFinanzas = exports.getFinanzas = void 0;
const models_1 = require("../models");
const finanzasValidator_1 = require("../validators/finanzasValidator");
const getFinanzas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const finanzas = yield models_1.Cliente_Arrendamiento.findAll({
            where: { estado: "Aprobado" },
            attributes: [
                "id",
                "cliente_id",
                "pago_inicial",
                "path_factura_unidad",
                "path_orden_compra",
            ],
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
            data: { finanzas },
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
exports.getFinanzas = getFinanzas;
const updateFinanzas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { 
        // pago_inicial,
        id, orden_compra: path_orden_compra, factura_unidad: path_factura_unidad, tipo_pago, } = yield finanzasValidator_1.finanzasValidator.validate(req.body);
        const finanzas = yield models_1.Cliente_Arrendamiento.findOne({
            where: { id },
        });
        if (!finanzas)
            return res
                .status(400)
                .json({ success: false, errors: ["Ha ocurrido un error inesperado"] });
        yield finanzas.update({
            // pago_inicial,
            path_orden_compra,
            path_factura_unidad,
            tipo_pago,
        });
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
exports.updateFinanzas = updateFinanzas;
