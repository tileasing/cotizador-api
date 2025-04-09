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
exports.acceptOrDecline = exports.updateDocument = exports.getUpdateFiles = exports.getDocuments = exports.addDocument = void 0;
const documentosClienteValidator_1 = require("../validators/documentosClienteValidator");
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const addDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = yield documentosClienteValidator_1.documentsClientValidator.validate(req.body);
        const searchArchivo = yield models_1.Tipo_Archivo.findOne({
            where: {
                tipo_archivo: data.tipo_archivo,
            },
            attributes: ["id"],
        });
        const tipo_archivo_id = searchArchivo === null || searchArchivo === void 0 ? void 0 : searchArchivo.dataValues.id;
        const cliente = yield models_1.Cliente.findOne({
            where: {
                id: (_a = req.authData) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
        if (!cliente) {
            return res.status(404).json({
                success: false,
                errors: [
                    "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
                ],
            });
        }
        yield models_1.Documentos_Cliente.create(Object.assign(Object.assign({}, data), { cliente_id: cliente.dataValues.id, tipo_archivo_id, who_created: cliente.dataValues.email, when_created: new Date() }));
        // console.log(data);
        return res.status(201).json({
            success: true,
            data: { msg: "Registro del archivo exitoso", data },
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
exports.addDocument = addDocument;
const getDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const client = yield models_1.Cliente.findAll({
            include: [
                {
                    model: models_1.Documentos_Cliente,
                    as: "documentos",
                    attributes: ["id", "estado", "informacion", "path"],
                    include: [
                        {
                            model: models_1.Tipo_Archivo,
                            as: "tipo_archivo",
                            attributes: ["tipo_archivo", "regimen_fiscal"],
                        },
                    ],
                },
            ],
            attributes: ["id", "nombre"],
            where: {
                // Esta condición excluye clientes sin documentos
                "$documentos.id$": { [sequelize_1.Op.ne]: null },
            },
        });
        if (!client) {
            return res.status(404).json({
                success: false,
                errors: ["No se encontraron documentos"],
            });
        }
        return res.status(201).json({
            success: true,
            data: { client },
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
exports.getDocuments = getDocuments;
const attributes = [
    "id",
    "estado",
    "informacion",
    "path",
    "tipo_archivo_id",
    "cliente_id",
];
const getUpdateFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        yield models_1.Cliente.findAll({
            where: { id: (_c = req.authData) === null || _c === void 0 ? void 0 : _c.id },
        });
        const cliente_id = (_d = req.authData) === null || _d === void 0 ? void 0 : _d.id;
        const docs = yield models_1.Documentos_Cliente.findAll({
            where: { cliente_id },
            attributes,
            include: [
                {
                    model: models_1.Tipo_Archivo,
                    as: "tipo_archivo",
                    attributes: ["tipo_archivo", "regimen_fiscal"],
                },
            ],
        });
        return res.json({ success: true, data: { docs } });
    }
    catch (error) {
        const err = error;
        res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.getUpdateFiles = getUpdateFiles;
const updateDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        // console.log(req.body);
        const data = yield documentosClienteValidator_1.updateDocsClientValidator.validate(req.body);
        const cliente = yield models_1.Cliente.findOne({
            where: {
                id: (_e = req.authData) === null || _e === void 0 ? void 0 : _e.id,
            },
        });
        const updatedRow = yield models_1.Documentos_Cliente.update(Object.assign(Object.assign({}, data), { who_modified: cliente === null || cliente === void 0 ? void 0 : cliente.dataValues.email, when_modified: new Date() }), { where: { id: req.body.id } });
        if (updatedRow[0] === 0) {
            return res.status(404).json({
                success: false,
                errors: [`No se encontró la fila con el registro`],
            });
        }
        return res.status(201).json({
            success: true,
            data: { msg: "Actualización del archivo exitoso" },
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
exports.updateDocument = updateDocument;
const acceptOrDecline = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        // console.log(req.body);
        const data = yield documentosClienteValidator_1.AorDeclineValidator.validate(req.body);
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_f = req.authData) === null || _f === void 0 ? void 0 : _f.id,
            },
        });
        const updatedRow = yield models_1.Documentos_Cliente.update(Object.assign(Object.assign({}, data), { who_modified: admin === null || admin === void 0 ? void 0 : admin.dataValues.email, when_modified: new Date() }), { where: { id: data.id } });
        if (updatedRow[0] === 0) {
            return res.status(404).json({
                success: false,
                errors: [`No se encontró la fila con el registro`],
            });
        }
        return res.status(201).json({
            success: true,
            data,
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
exports.acceptOrDecline = acceptOrDecline;
