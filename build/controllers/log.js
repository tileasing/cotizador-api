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
exports.getLogsSpecificsType = exports.getLogsSpecificByAdmins = exports.getLogsByAdmins = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const getLogsByAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminExist = yield models_1.Administrador.findOne({
            where: { id: (_a = req.authData) === null || _a === void 0 ? void 0 : _a.id },
        });
        if (!adminExist) {
            return res.json({ success: false, errors: ["No estás autorizado"] });
        }
        const logs = yield models_1.Log.findAll({
            attributes: [
                "administrador_id",
                [(0, sequelize_1.fn)("MAX", (0, sequelize_1.col)("Administrador.nombre")), "nombre_administrador"],
            ],
            include: [
                {
                    model: models_1.Administrador,
                    attributes: [],
                },
            ],
            group: ["administrador_id"],
            raw: true, // Obtener resultados en formato JSON
        });
        return res.json({ success: true, data: { logs } });
    }
    catch (error) {
        console.log({ error });
        const err = error;
        return res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.getLogsByAdmins = getLogsByAdmins;
const getLogsSpecificByAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { administrador_id } = req.body;
        const adminExist = yield models_1.Administrador.findOne({
            where: { id: (_b = req.authData) === null || _b === void 0 ? void 0 : _b.id },
        });
        if (!adminExist) {
            return res.json({ success: false, errors: ["No estás autorizado"] });
        }
        const logs = yield models_1.Log.findAll({
            attributes: [
                "administrador_id",
                [(0, sequelize_1.fn)("MAX", (0, sequelize_1.col)("Administrador.nombre")), "nombre_administrador"],
                [(0, sequelize_1.fn)("COUNT", (0, sequelize_1.col)("tipo")), "count_tipo"],
                "tipo",
            ],
            include: [
                {
                    model: models_1.Administrador,
                    attributes: [],
                    where: {
                        id: administrador_id,
                    },
                },
            ],
            group: ["administrador_id", "tipo"],
            raw: true, // Obtener resultados en formato JSON
        });
        const clientes = yield models_1.Cliente.findAll({
            where: {
                who_created: administrador_id,
            },
            attributes: ["nombre", "createdAt"],
            include: [
                {
                    model: models_1.Administrador,
                    as: "administrador_id",
                    attributes: ["nombre", "id"],
                },
            ],
        });
        // if (!clientes || clientes.length <= 0 || !logs || logs.length<=0)
        //   return res.status(400).json({
        //     success: false,
        //     data: { msg: "Ha ocurrido un error en la obtención del cliente" },
        //   });
        return res.json({ success: true, data: { logs, clientes } });
    }
    catch (error) {
        console.log({ error });
        const err = error;
        return res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.getLogsSpecificByAdmins = getLogsSpecificByAdmins;
const getLogsSpecificsType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { administrador_id, tipo } = req.body;
        const adminExist = yield models_1.Administrador.findOne({
            where: { id: (_c = req.authData) === null || _c === void 0 ? void 0 : _c.id },
        });
        if (!adminExist) {
            return res.json({ success: false, errors: ["No estás autorizado"] });
        }
        const logs = yield models_1.Log.findAll({
            attributes: ["id", "administrador_id", "fecha", "tipo", "new_register"],
            where: { tipo },
            order: [["id", "ASC"]],
            include: [
                {
                    model: models_1.Administrador,
                    attributes: [],
                    where: {
                        id: administrador_id,
                    },
                },
            ],
        });
        return res.json({ success: true, data: { logs } });
    }
    catch (error) {
        console.log({ error });
        const err = error;
        return res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.getLogsSpecificsType = getLogsSpecificsType;
