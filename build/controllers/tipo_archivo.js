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
exports.updateIsRequired = exports.getAllTipoArchivo = exports.getTipoArchivo = exports.updateTipoArchivo = exports.registerTipoArchivo = void 0;
const tipoArchivoValidator_1 = require("../validators/tipoArchivoValidator");
const tipoArchivoValidator_2 = require("../validators/tipoArchivoValidator");
const models_1 = require("../models");
const registerTipoArchivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = yield tipoArchivoValidator_2.tipoArchivoValidator.validate(req.body);
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
        const saveTipoActivo = yield models_1.Tipo_Archivo.create(Object.assign(Object.assign({}, data), { who_created: admin.dataValues.email, when_created: new Date(), deleted: false }));
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
exports.registerTipoArchivo = registerTipoArchivo;
const updateTipoArchivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { tipo_archivo, regimen_fiscal, id } = yield tipoArchivoValidator_2.tipoArchivoEditValidator.validate(req.body);
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
        const updatedRow = yield models_1.Tipo_Archivo.update({
            tipo_archivo,
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
const getTipoArchivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const { regimen_fiscal } = yield tipoArchivoValidator_1.tipoArchivoSearchValidator.validate(req.body);
        const client = yield models_1.Cliente.findOne({
            where: {
                id: (_c = req.authData) === null || _c === void 0 ? void 0 : _c.id,
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
        const { count } = yield models_1.Tipo_Archivo_A.findAndCountAll({
            where: {
                regimen_fiscal,
            },
        });
        const count_doc = yield models_1.Documentos_Cliente_A.findAndCountAll({
            where: { cliente_id: (_d = req.authData) === null || _d === void 0 ? void 0 : _d.id, estado: "Aceptado" },
        });
        if (count_doc.count < count)
            return res.json({
                success: false,
                errors: ["Por favor completa los pre requisitos"],
            });
        const archivos = yield models_1.Tipo_Archivo.findAll({
            where: {
                regimen_fiscal,
            },
            attributes: [
                "id",
                "tipo_archivo",
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
exports.getTipoArchivo = getTipoArchivo;
const getAllTipoArchivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_e = req.authData) === null || _e === void 0 ? void 0 : _e.id,
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
        const archivos = yield models_1.Tipo_Archivo.findAll({
            attributes: ["id", "tipo_archivo", "regimen_fiscal", "requerido"],
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
exports.getAllTipoArchivo = getAllTipoArchivo;
const updateIsRequired = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const { id, requerido } = req.body;
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_f = req.authData) === null || _f === void 0 ? void 0 : _f.id,
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
        const tipo_archivo = yield models_1.Tipo_Archivo.findOne({
            where: { id },
        });
        if (!tipo_archivo)
            return res
                .status(400)
                .json({ success: false, errors: ["Ha ocurrido un error"] });
        yield tipo_archivo.update({ requerido });
        return res.json({
            success: true,
            data: { msg: "Se ha actualizado con éxito" },
        });
    }
    catch (error) {
        const err = error;
        return res.status(400).json({ success: false, errors: [err.message] });
    }
});
exports.updateIsRequired = updateIsRequired;
