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
exports.testEditable = exports.updateEditable = exports.getEditable = exports.registerEditable = void 0;
const models_1 = require("../models");
const registerEditable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { campo, valor, tipo } = req.body;
    try {
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_a = req.authData) === null || _a === void 0 ? void 0 : _a.id
            }
        });
        if (!admin) {
            return res.status(404).json({
                msg: 'No se pudo crear el campo, ocurrió un error con la identificación del usuario'
            });
        }
        const saveValorTasas = yield models_1.Editable.create({
            campo,
            valor,
            tipo,
            who_created: admin.dataValues.email,
            when_created: new Date()
        });
        if (!saveValorTasas) {
            return res.status(404).json({
                msg: 'No se pudo crear el campo'
            });
        }
        return res.status(201).json({
            msg: 'Registro del campo exitoso'
        });
    }
    catch (error) {
        return res.status(500).json({
            error: error
        });
    }
});
exports.registerEditable = registerEditable;
const getEditable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
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
        const edit = yield models_1.Editable.findAll({
            where: { deleted: false },
            attributes: ['id', 'campo', 'valor', 'tipo']
        });
        return res.status(200).json({
            data: edit
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: 'Error en el servidor'
        });
    }
});
exports.getEditable = getEditable;
const updateEditable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { id, campo, valor } = req.body;
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
        const updatedRow = yield models_1.Editable.update({
            campo,
            valor,
            who_modified: admin.dataValues.email,
            when_modified: new Date()
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
exports.updateEditable = updateEditable;
const testEditable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_d = req.authData) === null || _d === void 0 ? void 0 : _d.id
            }
        });
        if (!admin) {
            return res.status(404).json({
                msg: 'No se pudo crear el valor, ocurrió un error con la identificación del usuario'
            });
        }
        const tablaCamposEditables = [{
                campo: 'Porcentaje maximo (pago inicial)',
                valor: 45,
                tipo: ''
            }, {
                campo: 'Descuento mensual por rentas',
                valor: 10,
                tipo: 'Anual'
            }, {
                campo: 'Valor residual bicicletas',
                valor: 5,
                tipo: ''
            }];
        for (const { campo, tipo, valor } of tablaCamposEditables) {
            yield models_1.Editable.create({
                campo,
                tipo,
                valor,
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
exports.testEditable = testEditable;
