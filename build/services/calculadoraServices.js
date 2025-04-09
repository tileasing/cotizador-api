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
exports.getvaluesCalculadoraFija = exports.getvaluesCalculadoraAmortizable = void 0;
const sequelize_1 = require("sequelize");
const inversion_amortizable_1 = require("../models/inversion_amortizable");
const inversion_fija_1 = require("../models/inversion_fija");
const getvaluesCalculadoraAmortizable = (plazo) => __awaiter(void 0, void 0, void 0, function* () {
    const valores = yield inversion_amortizable_1.Inversion_amortizable.findOne({
        where: {
            minimo: {
                [sequelize_1.Op.lte]: plazo,
            },
            maximo: {
                [sequelize_1.Op.gte]: plazo,
            },
        },
        attributes: ["minimo", "maximo", "tasa"],
    });
    return valores === null || valores === void 0 ? void 0 : valores.dataValues.tasa;
});
exports.getvaluesCalculadoraAmortizable = getvaluesCalculadoraAmortizable;
const getvaluesCalculadoraFija = (plazo) => __awaiter(void 0, void 0, void 0, function* () {
    const valores = yield inversion_fija_1.Inversion_fija.findOne({
        where: {
            minimo: {
                [sequelize_1.Op.lte]: plazo,
            },
            maximo: {
                [sequelize_1.Op.gte]: plazo,
            },
        },
        attributes: ["rendimiento", "tasa_agregada", "tasa_ce_olr"],
    });
    return valores === null || valores === void 0 ? void 0 : valores.dataValues;
});
exports.getvaluesCalculadoraFija = getvaluesCalculadoraFija;
