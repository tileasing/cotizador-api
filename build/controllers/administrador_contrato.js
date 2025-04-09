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
exports.updateClientAdminContr = exports.getClientAdminContr = void 0;
const models_1 = require("../models");
const adminContratoValidator_1 = require("../validators/adminContratoValidator");
const getClientAdminContr = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const administrador_contrato = yield models_1.Cliente_Arrendamiento.findAll({
            where: { estado: "Aprobado" },
            attributes: ["id", "cliente_id", "firma_contrato"],
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
            data: { administrador_contrato },
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
exports.getClientAdminContr = getClientAdminContr;
const updateClientAdminContr = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firma_contrato, id } = yield adminContratoValidator_1.adminContratoValidator.validate(req.body);
        const administrador_contrato = yield models_1.Cliente_Arrendamiento.findOne({
            where: { id },
        });
        if (!administrador_contrato)
            return res
                .status(400)
                .json({ success: false, errors: ["Ha ocurrido un error inesperado"] });
        yield administrador_contrato.update({
            firma_contrato,
            pago_inicial: "En proceso",
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
exports.updateClientAdminContr = updateClientAdminContr;
