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
exports.stateClient = exports.clientArrendExist = exports.updateClientArrend = exports.getClientArrend = void 0;
const clienteArrendamiento_1 = require("../validators/clienteArrendamiento");
const models_1 = require("../models");
const getClientArrend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_a = req.authData) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
        if (!admin) {
            return res.status(404).json({
                success: false,
                errors: [
                    "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
                ],
            });
        }
        const arrend = yield models_1.Cliente_Arrendamiento.findAll({});
        return res.json({
            success: true,
            data: { arrend },
        });
    }
    catch (error) {
        console.log({ error });
        const err = error;
        res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.getClientArrend = getClientArrend;
const updateClientArrend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const body = yield clienteArrendamiento_1.clientArrendValidator.validate(req.body);
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_b = req.authData) === null || _b === void 0 ? void 0 : _b.id,
            },
        });
        if (!admin) {
            return res.status(404).json({
                success: false,
                errors: [
                    "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
                ],
            });
        }
        const cliente = yield models_1.Cliente.findOne({
            where: {
                id: body.cliente_id,
            },
        });
        if (!cliente) {
            return res.json({
                success: false,
                errors: ["No se ha encontrado el cliente"],
            });
        }
        yield models_1.Cliente_Arrendamiento.create(Object.assign(Object.assign({}, body), { analisis_riesgo: body.estado === "Aprobado" ? true : false, firma_contrato: body.estado === "Aprobado" ? "En proceso" : null, who_created: admin.dataValues.email, when_created: new Date() }));
        if (body.estado === "Rechazado") {
            return res.json({
                success: false,
                errors: [`${cliente.dataValues.nombre} ha sido rechazado`],
            });
        }
        return res.json({
            success: true,
            data: { msg: "El cliente ha sido aprobado" },
        });
    }
    catch (error) {
        console.log({ error });
        const err = error;
        res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.updateClientArrend = updateClientArrend;
const clientArrendExist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { cliente_id } = yield clienteArrendamiento_1.getClientArrandValidator.validate(req.body);
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_c = req.authData) === null || _c === void 0 ? void 0 : _c.id,
            },
        });
        if (!admin) {
            return res.status(404).json({
                success: false,
                errors: [
                    "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
                ],
            });
        }
        const clientExist = yield models_1.Cliente_Arrendamiento.findOne({
            where: {
                cliente_id,
            },
        });
        if (!clientExist) {
            return res.json({
                success: false,
                errors: ["No se encuentra registro de cliente"],
            });
        }
        return res.json({
            success: true,
            data: {
                msg: !!clientExist === true &&
                    clientExist.dataValues.estado === "Rechazado"
                    ? "El cliente ya ha sido RECHAZADO"
                    : "El cliente fue APROBADO",
                exist: !!clientExist,
            },
        });
    }
    catch (error) {
        const err = error;
        res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.clientArrendExist = clientArrendExist;
// PARA EL CLIENTE
const stateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const client = yield models_1.Cliente.findOne({
            where: {
                id: (_d = req.authData) === null || _d === void 0 ? void 0 : _d.id,
            },
            attributes: ["nombre"],
            include: [
                {
                    model: models_1.Cliente_Arrendamiento,
                    as: "cliente_arrendamiento",
                    attributes: ["firma_contrato", "pago_inicial", "entrega_unidad"],
                    where: {
                        estado: "Aprobado", // Reemplaza con la condición que deseas aplicar
                    },
                },
            ],
        });
        if (!client)
            return res.json({
                success: false,
                errors: ["Por el momento no hay un arrendamiento disponible"],
            });
        const cliente_arren = client.dataValues;
        return res.json({
            success: true,
            data: Object.assign({}, cliente_arren),
        });
    }
    catch (error) {
        const err = error;
        res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.stateClient = stateClient;
