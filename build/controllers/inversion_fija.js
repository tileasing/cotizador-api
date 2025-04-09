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
exports.testInversionFija = exports.updateInversionFija = exports.registerInversionFija = exports.showInversionFija = exports.getInvesionFija = void 0;
const inversionFijaValidator_1 = require("../validators/inversionFijaValidator");
const models_1 = require("../models");
const getInvesionFija = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resp = yield models_1.Inversion_fija.findAll();
        if (!resp) {
            return res.status(404).json({
                success: false,
                errors: ["No se encuenta respuesta"],
            });
        }
        return res.json({
            success: true,
            data: resp,
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
exports.getInvesionFija = getInvesionFija;
const showInversionFija = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasa_fija = yield models_1.Inversion_fija.findAll({
            order: [["createdAt", "ASC"]],
            attributes: [
                "id",
                "minimo",
                "maximo",
                "rendimiento",
                "tasa_ce_olr",
                "tasa_agregada",
            ],
        });
        if (!tasa_fija) {
            return res.status(404).json({
                success: false,
                errors: ["No se han podido encontrar registros"],
            });
        }
        return res.json({
            success: true,
            data: {
                tasa_fija,
            },
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
exports.showInversionFija = showInversionFija;
const registerInversionFija = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                data: {
                    msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
                },
            });
        }
        const body = yield inversionFijaValidator_1.inversionFijaValidator.validate(req.body);
        const resp = yield models_1.Inversion_fija.create(Object.assign(Object.assign({}, body), { who_created: admin.dataValues.email, when_created: new Date() }));
        if (!resp) {
            return res.json({
                success: false,
                errors: ["No se han podido registrar los valores"],
            });
        }
        return res.json({
            success: true,
            data: { msg: "Los valores de la inversión fija se han creado con exito" },
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
exports.registerInversionFija = registerInversionFija;
const updateInversionFija = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                data: {
                    msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
                },
            });
        }
        const data = yield inversionFijaValidator_1.inversionFijaValidatorUpdate.validate(req.body);
        const resp = yield models_1.Inversion_fija.update(Object.assign(Object.assign({}, data), { who_modified: admin.dataValues.email, when_modified: new Date() }), { where: { id: req.body.id } });
        if (!resp) {
            return res.status(404).json({
                success: false,
                errors: ["No se ha podido actualizar el registro"],
            });
        }
        return res.json({
            success: true,
            data: {
                msg: "Se ha actualizado con éxito",
            },
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
exports.updateInversionFija = updateInversionFija;
const testInversionFija = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const valores = [
        {
            minimo: 12,
            maximo: 24,
            rendimiento: 100,
            tasa_agregada: 1,
            tasa_ce_olr: 10,
        },
        {
            minimo: 25,
            maximo: 27,
            rendimiento: 110,
            tasa_agregada: 1,
            tasa_ce_olr: 10,
        },
        {
            minimo: 28,
            maximo: 35,
            rendimiento: 118,
            tasa_agregada: 1,
            tasa_ce_olr: 10,
        },
        {
            minimo: 36,
            maximo: 48,
            rendimiento: 125,
            tasa_agregada: 1,
            tasa_ce_olr: 10,
        },
    ];
    try {
        for (const { maximo, minimo, rendimiento, tasa_agregada, tasa_ce_olr, } of valores) {
            yield models_1.Inversion_fija.create({
                maximo,
                minimo,
                rendimiento,
                tasa_agregada,
                tasa_ce_olr,
                who_created: "CODER",
                when_created: new Date(),
            });
        }
        return res.json({
            msg: "OK",
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
exports.testInversionFija = testInversionFija;
