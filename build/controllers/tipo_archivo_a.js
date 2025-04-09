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
exports.updateTipoArchivo = exports.registerTipoArchivoA = exports.getAllTipoArchivoA = exports.getTipoArchivoA = void 0;
const tipoArchivoAValidator_1 = require("../validators/tipoArchivoAValidator");
const models_1 = require("../models");
const getTipoArchivoA = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { regimen_fiscal } = yield tipoArchivoAValidator_1.tipoArchivoASearchValidator.validate(req.body);
        const client = yield models_1.Cliente.findOne({
            where: {
                id: (_a = req.authData) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
        if (!client) {
            return res.status(404).json({
                success: false,
                errors: [
                    "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
                ],
            });
        }
        const archivos = yield models_1.Tipo_Archivo_A.findAll({
            where: {
                regimen_fiscal,
            },
            attributes: [
                "id",
                "tipo_archivo_a",
                "regimen_fiscal",
                "descripcion_archivo",
            ],
        });
        return res.json({
            success: true,
            data: { archivos },
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
exports.getTipoArchivoA = getTipoArchivoA;
const getAllTipoArchivoA = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
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
        const archivos = yield models_1.Tipo_Archivo_A.findAll({
            attributes: ["id", "tipo_archivo_a", "regimen_fiscal"],
        });
        return res.json({
            success: true,
            data: { archivos },
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
exports.getAllTipoArchivoA = getAllTipoArchivoA;
const registerTipoArchivoA = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const data = yield tipoArchivoAValidator_1.tipoArchivoAValidator.validate(req.body);
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
        const saveTipoActivo = yield models_1.Tipo_Archivo_A.create(Object.assign(Object.assign({}, data), { who_created: admin.dataValues.email, when_created: new Date(), deleted: false }));
        if (!saveTipoActivo) {
            return res.status(404).json({
                success: false,
                errors: ["No se pudo crear el valor"],
            });
        }
        return res.status(201).json({
            success: true,
            data: { msg: "Registro del archivo exitoso" },
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
exports.registerTipoArchivoA = registerTipoArchivoA;
const updateTipoArchivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const { tipo_archivo_a, regimen_fiscal, id } = yield tipoArchivoAValidator_1.tipoArchivoAEditValidator.validate(req.body);
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_d = req.authData) === null || _d === void 0 ? void 0 : _d.id,
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
        const updatedRow = yield models_1.Tipo_Archivo_A.update({
            tipo_archivo_a,
            regimen_fiscal,
            who_modified: admin.dataValues.email,
            when_modified: new Date(),
        }, { where: { id } });
        if (updatedRow[0] === 0) {
            return res.status(404).json({
                success: false,
                errors: [`No se encontró la fila con el id ${id}`],
            });
        }
        return res.status(200).json({
            success: true,
            data: { msg: "Se actualizó correctamente" },
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
exports.updateTipoArchivo = updateTipoArchivo;
