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
exports.testValoresOtrosGastos = exports.showValorOtrosGastos = exports.updateOtrosGastos = exports.registerValoresOtrosGastos = exports.getValoresOtrosGastos = void 0;
const calculateTotalServices_1 = require("../services/calculateTotalServices");
const models_1 = require("../models");
const getValoresOtrosGastos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valoresOtrosGastos = yield models_1.Valor_Otros_Gastos.findAll();
        return res.json({
            data: valoresOtrosGastos
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error en el servidor'
        });
    }
});
exports.getValoresOtrosGastos = getValoresOtrosGastos;
const registerValoresOtrosGastos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { plazo, instalacion, gps_anual, gastos_notariales } = req.body;
    try {
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_a = req.authData) === null || _a === void 0 ? void 0 : _a.id
            }
        });
        if (!admin) {
            return res.status(404).json({
                msg: 'No se pudo crear el valor, ocurrió un error con la identificación del usuario'
            });
        }
        const saveValorTasas = yield models_1.Valor_Otros_Gastos.create({
            plazo,
            instalacion,
            gps_anual,
            gastos_notariales,
            total: (0, calculateTotalServices_1.calculateTotal)({ instalacion, gps_anual, gastos_notariales }),
            who_created: admin.dataValues.email,
            when_created: new Date()
        });
        if (!saveValorTasas) {
            return res.status(404).json({
                msg: 'No se pudo crear el valor'
            });
        }
        return res.status(201).json({
            msg: 'Registro del valor de otros gastos es exitoso'
        });
    }
    catch (error) {
        res.status(500).json({
            error
        });
    }
});
exports.registerValoresOtrosGastos = registerValoresOtrosGastos;
const updateOtrosGastos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { id, gastos_notariales, gps_anual, instalacion } = req.body;
    try {
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_b = req.authData) === null || _b === void 0 ? void 0 : _b.id
            }
        });
        if (!admin) {
            return res.status(404).json({
                msg: 'No se pudo crear el valor, ocurrió un error con la identificación del usuario'
            });
        }
        const row = yield models_1.Valor_Otros_Gastos.findOne({ where: { id } });
        if (!row) {
            return res.status(404).json({
                msg: `No se encontró la fila con el id ${id}`,
            });
        }
        const { instalacion: currentInstalacion, gps_anual: currentGPS, gastos_notariales: currentGastos } = row.dataValues;
        const updatedInstalacion = instalacion !== undefined ? instalacion : currentInstalacion;
        const updatedGPS = gps_anual !== undefined ? gps_anual : currentGPS;
        const updatedGastos = gastos_notariales !== undefined ? gastos_notariales : currentGastos;
        const total = (0, calculateTotalServices_1.calculateTotal)({ instalacion: updatedInstalacion, gps_anual: updatedGPS, gastos_notariales: updatedGastos });
        const updatedRow = yield models_1.Valor_Otros_Gastos.update({
            gastos_notariales: updatedGastos,
            gps_anual: updatedGPS,
            instalacion: updatedInstalacion,
            total,
            who_modified: admin.dataValues.email,
            when_modified: new Date(),
        }, { where: { id } });
        if (updatedRow[0] === 0) {
            return res.status(404).json({
                msg: `No se encontró la fila con el id ${id}`,
            });
        }
        return res.status(200).json({
            msg: "La fila se actualizó correctamente",
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Error al actualizar la fila",
        });
    }
});
exports.updateOtrosGastos = updateOtrosGastos;
const showValorOtrosGastos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valoresOtrosGastos = yield models_1.Valor_Otros_Gastos.findAll({
            where: { deleted: false },
            attributes: ['id', 'plazo', 'instalacion', 'gps_anual', 'gastos_notariales', 'total']
        });
        return res.json({
            data: valoresOtrosGastos
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error en el servidor'
        });
    }
});
exports.showValorOtrosGastos = showValorOtrosGastos;
const testValoresOtrosGastos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_c = req.authData) === null || _c === void 0 ? void 0 : _c.id
            }
        });
        if (!admin) {
            return res.status(404).json({
                msg: 'No se pudo crear el valor, ocurrió un error con la identificación del usuario'
            });
        }
        const tablaOtrosGastos = [{
                id: 0,
                plazo: 12,
                instalacion: 1000,
                gpsAnual: 4300,
                gastosNotariales: 4500
            }, {
                id: 1,
                plazo: 24,
                instalacion: 1000,
                gpsAnual: 8600,
                gastosNotariales: 4500
            }, {
                id: 2,
                plazo: 36,
                instalacion: 1000,
                gpsAnual: 12900,
                gastosNotariales: 4500
            }, {
                id: 3,
                plazo: 48,
                instalacion: 1000,
                gpsAnual: 17200,
                gastosNotariales: 4500
            }];
        for (const { plazo, gastosNotariales, gpsAnual, instalacion } of tablaOtrosGastos) {
            yield models_1.Valor_Otros_Gastos.create({
                plazo,
                gastos_notariales: gastosNotariales,
                gps_anual: gpsAnual,
                instalacion,
                total: (0, calculateTotalServices_1.calculateTotal)({ instalacion, gps_anual: gpsAnual, gastos_notariales: gastosNotariales }),
                who_created: admin.dataValues.email,
                when_created: new Date(),
                deleted: false
            });
        }
        return res.json({
            msg: 'Petición exitosa'
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error en el servidor'
        });
    }
});
exports.testValoresOtrosGastos = testValoresOtrosGastos;
