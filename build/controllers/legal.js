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
exports.updateContrato = exports.getContrato = exports.updateLegal = exports.getLegal = void 0;
const models_1 = require("../models");
const legalValidator_1 = require("../validators/legalValidator");
const getLegal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const legalCli = yield models_1.Cliente_Arrendamiento.findAll({
            where: { estado: "Aprobado" },
            attributes: ["id", "cliente_id", "pago_inicial"],
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
            data: { legalCli },
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
exports.getLegal = getLegal;
const updateLegal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pago_inicial, id } = yield legalValidator_1.legalValidator.validate(req.body);
        const legal = yield models_1.Cliente_Arrendamiento.findOne({
            where: { id },
        });
        if (!legal)
            return res
                .status(400)
                .json({ success: false, errors: ["Ha ocurrido un error inesperado"] });
        yield legal.update({
            pago_inicial,
            entrega_unidad: "En proceso",
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
exports.updateLegal = updateLegal;
const getContrato = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cliente_id } = req.body;
        const contrato = yield models_1.Cliente_Arrendamiento.findOne({
            where: { estado: "Aprobado", firma_contrato: "Aprobado", cliente_id },
            attributes: ["id", "cliente_id", "pago_inicial", "path_contrato_firmado"],
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
            data: { contrato },
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
exports.getContrato = getContrato;
const updateContrato = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, contrato_firmado: path_contrato_firmado } = yield legalValidator_1.contratoValidator.validate(req.body);
        const contrato = yield models_1.Cliente_Arrendamiento.findOne({
            where: { id },
        });
        if (!contrato)
            return res
                .status(400)
                .json({ success: false, errors: ["Ha ocurrido un error inesperado"] });
        yield contrato.update({ path_contrato_firmado });
        return res.json({
            success: true,
            data: { msg: "El archivo se ha cargado con éxito" },
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
exports.updateContrato = updateContrato;
