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
exports.testInversionAmortizable = exports.updateInversionAmortizable = exports.registerInversionAmortizable = exports.showInversionAmortizable = exports.getInvesionAmortizable = void 0;
const inversionAmortizableValidator_1 = require("../validators/inversionAmortizableValidator");
const models_1 = require("../models");
const getInvesionAmortizable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resp = yield models_1.Inversion_amortizable.findAll();
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
exports.getInvesionAmortizable = getInvesionAmortizable;
const showInversionAmortizable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasa_amortizable = yield models_1.Inversion_amortizable.findAll({
            order: [["createdAt", "ASC"]],
            attributes: ["id", "minimo", "maximo", "tasa"],
        });
        if (!tasa_amortizable) {
            return res.status(404).json({
                success: false,
                errors: ["No se han podido encontrar registros"],
            });
        }
        return res.json({
            success: true,
            data: { tasa_amortizable },
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
exports.showInversionAmortizable = showInversionAmortizable;
const registerInversionAmortizable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const body = yield inversionAmortizableValidator_1.inversionAmortizableValidator.validate(req.body);
        const resp = yield models_1.Inversion_amortizable.create(Object.assign(Object.assign({}, body), { who_created: admin.dataValues.email, when_created: new Date() }));
        if (!resp) {
            return res.json({
                success: false,
                errors: ["No se han podido registrar los valores"],
            });
        }
        return res.json({
            success: true,
            data: {
                msg: "Los valores de la inversión amortizable se han creado con exito",
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
exports.registerInversionAmortizable = registerInversionAmortizable;
const updateInversionAmortizable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const data = yield inversionAmortizableValidator_1.inversionAmortizableValidatorUpdate.validate(req.body);
        const resp = yield models_1.Inversion_amortizable.update(Object.assign(Object.assign({}, data), { who_modified: admin.dataValues.email, when_modified: new Date() }), { where: { id: req.body.id } });
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
exports.updateInversionAmortizable = updateInversionAmortizable;
const testInversionAmortizable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const valores = [
        {
            minimo: 12,
            maximo: 24,
            tasa: 14,
        },
        {
            minimo: 25,
            maximo: 27,
            tasa: 16,
        },
        {
            minimo: 28,
            maximo: 35,
            tasa: 17,
        },
        {
            minimo: 36,
            maximo: 48,
            tasa: 18,
        },
    ];
    try {
        for (const { maximo, minimo, tasa } of valores) {
            yield models_1.Inversion_amortizable.create({
                maximo,
                minimo,
                tasa,
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
exports.testInversionAmortizable = testInversionAmortizable;
