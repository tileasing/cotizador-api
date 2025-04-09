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
exports.aceptAllDocs = exports.acceptOrDecline = exports.updateDocument = exports.getUpdateFiles = exports.getDocuments = exports.addDocument = void 0;
const sequelize_1 = require("sequelize");
const documentosClienteAValidator_1 = require("../validators/documentosClienteAValidator");
const avisosServices_1 = require("../services/avisosServices");
const models_1 = require("../models");
const addDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = yield documentosClienteAValidator_1.documentsClientAValidator.validate(req.body);
        const searchArchivo = yield models_1.Tipo_Archivo_A.findOne({
            where: {
                tipo_archivo_a: data.tipo_archivo_a,
            },
            attributes: ["id"],
        });
        const tipo_archivo_a_id = searchArchivo === null || searchArchivo === void 0 ? void 0 : searchArchivo.dataValues.id;
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
        yield models_1.Documentos_Cliente_A.create(Object.assign(Object.assign({}, data), { cliente_id: cliente.dataValues.id, tipo_archivo_a_id, who_created: cliente.dataValues.email, when_created: new Date() }));
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
                    model: models_1.Documentos_Cliente_A,
                    as: "documentos_a",
                    attributes: ["id", "estado", "informacion", "path"],
                    include: [
                        {
                            model: models_1.Tipo_Archivo_A,
                            as: "tipo_archivo_a",
                            attributes: ["tipo_archivo_a", "regimen_fiscal"],
                        },
                    ],
                },
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
                    required: false,
                    where: {
                        estado: "Aceptado",
                    },
                },
            ],
            attributes: ["id", "nombre"],
            where: {
                // Esta condición excluye clientes sin documentos
                [sequelize_1.Op.or]: [
                    { "$documentos_a.id$": { [sequelize_1.Op.ne]: null } },
                    { "$documentos.id$": { [sequelize_1.Op.ne]: null } },
                ],
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
    "tipo_archivo_a_id",
    "cliente_id",
];
const getUpdateFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const cliente = yield models_1.Cliente.findOne({
            where: { id: (_c = req.authData) === null || _c === void 0 ? void 0 : _c.id },
        });
        if (!cliente)
            return res
                .status(400)
                .json({ success: false, errors: ["Error al obtener el cliente"] });
        const cliente_id = (_d = req.authData) === null || _d === void 0 ? void 0 : _d.id;
        const docs = yield models_1.Documentos_Cliente_A.findAll({
            where: { cliente_id },
            attributes,
            include: [
                {
                    model: models_1.Tipo_Archivo_A,
                    as: "tipo_archivo_a",
                    attributes: ["tipo_archivo_a", "regimen_fiscal"],
                },
            ],
        });
        const { count } = yield models_1.Tipo_Archivo_A.findAndCountAll({
            where: {
                regimen_fiscal: cliente === null || cliente === void 0 ? void 0 : cliente.dataValues.regimen_fiscal,
            },
        });
        return res.json({ success: true, data: { docs, count } });
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
        const data = yield documentosClienteAValidator_1.updateDocsClientAValidator.validate(req.body);
        const cliente = yield models_1.Cliente.findOne({
            where: {
                id: (_e = req.authData) === null || _e === void 0 ? void 0 : _e.id,
            },
        });
        const updatedRow = yield models_1.Documentos_Cliente_A.update(Object.assign(Object.assign({}, data), { who_modified: cliente === null || cliente === void 0 ? void 0 : cliente.dataValues.email, when_modified: new Date() }), { where: { id: req.body.id } });
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
        const data = yield documentosClienteAValidator_1.AorDeclineAValidator.validate(req.body);
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_f = req.authData) === null || _f === void 0 ? void 0 : _f.id,
            },
        });
        const updatedRow = yield models_1.Documentos_Cliente_A.update(Object.assign(Object.assign({}, data), { who_modified: admin === null || admin === void 0 ? void 0 : admin.dataValues.email, when_modified: new Date() }), { where: { id: data.id } });
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
const aceptAllDocs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const { idClient, estado, mensaje } = req.body;
    try {
        const admin = yield models_1.Administrador.findOne({
            where: { id: (_g = req.authData) === null || _g === void 0 ? void 0 : _g.id },
        });
        if (!admin) {
            return res.status(404).json({
                success: false,
                errors: [
                    "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
                ],
            });
        }
        const client = yield models_1.Cliente.findOne({
            where: { id: idClient },
            attributes: ["nombre", "regimen_fiscal", "email"],
        });
        const documents = yield models_1.Documentos_Cliente.count({
            where: {
                cliente_id: idClient,
                estado: "Aceptado",
            },
        });
        const documents_a = yield models_1.Documentos_Cliente_A.count({
            where: {
                cliente_id: idClient,
                estado: "Aceptado",
            },
        });
        const tipo = yield models_1.Tipo_Archivo.count({
            where: {
                regimen_fiscal: client === null || client === void 0 ? void 0 : client.dataValues.regimen_fiscal,
                requerido: true,
            },
        });
        const tipo_a = yield models_1.Tipo_Archivo_A.count({
            where: { regimen_fiscal: client === null || client === void 0 ? void 0 : client.dataValues.regimen_fiscal },
        });
        // TODO Revisar condicional
        if (documents <= tipo || documents_a < tipo_a || estado === "Rechazado") {
            return res.json({
                success: false,
                errors: [
                    estado === "Rechazado"
                        ? "Ha sido rechazado con éxito"
                        : "Documentos incompletos",
                ],
            });
        }
        yield (0, avisosServices_1.sendWarningPreReq)({
            emailTo: client === null || client === void 0 ? void 0 : client.dataValues.email,
            nombre: client === null || client === void 0 ? void 0 : client.dataValues.nombre,
        });
        return res.json({
            success: true,
            data: { msg: "Éxito" },
        });
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
exports.aceptAllDocs = aceptAllDocs;
