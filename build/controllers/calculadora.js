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
exports.meInteresaInversion = exports.doCalculate = void 0;
const calculadoraValidator_1 = require("../validators/calculadoraValidator");
const calculadoraServices_1 = require("../services/calculadoraServices");
const sendEmailToMKT_1 = require("../services/sendEmailToMKT");
const models_1 = require("../models");
const doCalculate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield calculadoraValidator_1.calculadoraValidator.validate(req.body);
        let newSaldoInicial = [];
        const { monto_invertir, tipo_plan, plazo } = data;
        let tasaxrend = 0;
        if (tipo_plan === "Fija") {
            const valor = (yield (0, calculadoraServices_1.getvaluesCalculadoraFija)(plazo)) || {
                tasa_ce_olr: 10,
                tasa_agregada: 1,
                rendimiento: 100,
            };
            const tasaxrend = ((valor.tasa_ce_olr / 100 + valor.tasa_agregada / 100) *
                valor.rendimiento) /
                100 /
                12;
            const rendmens = monto_invertir * tasaxrend;
            const rendanual = monto_invertir * tasaxrend * 12;
            const rend = rendmens * plazo;
            const captot = monto_invertir + rend;
            return res.json({
                success: true,
                data: {
                    isFija: true,
                    calculos: {
                        plazo,
                        monto_invertir,
                        rendmens,
                        rendanual,
                        rend,
                        captot,
                    },
                },
            });
        }
        else if (tipo_plan === "Amortizable") {
            const valor = (yield (0, calculadoraServices_1.getvaluesCalculadoraAmortizable)(plazo)) || 14;
            tasaxrend = valor / 100 / 12;
            let nuevoMontoInvertir = monto_invertir;
            let intereses = 0;
            let calculapago = (monto_invertir * (tasaxrend * (1 + tasaxrend) ** plazo)) /
                ((1 + tasaxrend) ** plazo - 1);
            for (let rentas = 0; rentas < plazo; rentas++) {
                intereses = nuevoMontoInvertir * tasaxrend;
                nuevoMontoInvertir = nuevoMontoInvertir - calculapago + intereses;
                const montoAgregar = {
                    montoAInvertir: nuevoMontoInvertir,
                    interes: intereses,
                    renta: rentas,
                };
                newSaldoInicial.push(montoAgregar);
            }
            const sumaIntereses = newSaldoInicial.reduce((acumulador, { interes }) => interes + acumulador, 0);
            const sumaTot = monto_invertir + sumaIntereses;
            return res.json({
                success: true,
                data: {
                    isFija: false,
                    calculos: {
                        plazo,
                        monto_invertir,
                        calculapago,
                        sumaIntereses,
                        sumaTot,
                    },
                },
            });
        }
        return res.json({
            success: false,
            errors: ["Algo salió mal"],
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
exports.doCalculate = doCalculate;
const meInteresaInversion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        // Encuentra al cliente
        const clienteExist = yield models_1.Cliente.findOne({
            where: {
                id: (_a = req.authData) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
        const adminExist = yield models_1.Administrador.findOne({
            where: { id: (_b = req.authData) === null || _b === void 0 ? void 0 : _b.id },
        });
        if (clienteExist) {
            yield models_1.LogCliente.create({
                cliente_id: (_c = req.authData) === null || _c === void 0 ? void 0 : _c.id,
                tipo: "Calculadora",
                fecha: new Date(),
                old_register: "",
                new_register: JSON.stringify({
                    calculos: req.body,
                }),
            });
        }
        if (adminExist) {
            yield models_1.Log.create({
                administrador_id: (_d = req.authData) === null || _d === void 0 ? void 0 : _d.id,
                tipo: "Calculadora",
                fecha: new Date(),
                old_register: "",
                new_register: JSON.stringify({
                    calculos: req.body,
                }),
            });
        }
        if (clienteExist) {
            const calculos = req.body;
            const { nombre, email, telefono } = clienteExist.dataValues;
            yield (0, sendEmailToMKT_1.sendEmailToMKTCalculadora)({
                nombre,
                email,
                telefono,
                calculos,
            });
            return res.json({
                success: true,
                data: {
                    contacto: { nombre, email, telefono },
                    msg: ["Nos pondremos en contacto contigo"],
                },
            });
        }
        if (adminExist) {
            return res.json({
                success: true,
                data: {
                    contacto: {
                        nombre: adminExist === null || adminExist === void 0 ? void 0 : adminExist.dataValues.nombre,
                        email: "",
                        telefono: "",
                    },
                    msg: ["Patición exitosa"],
                },
            });
        }
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
exports.meInteresaInversion = meInteresaInversion;
