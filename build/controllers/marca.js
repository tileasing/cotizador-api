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
exports.deleteMarca = exports.showMarca = exports.updateMarca = exports.registerMarca = exports.getMarca = void 0;
const models_1 = require("../models");
const getMarca = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const marca = yield models_1.Marca.findAll();
        return res.status(200).json({
            data: marca
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Ocurrió un error en el servidor'
        });
    }
});
exports.getMarca = getMarca;
const registerMarca = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { marca } = req.body;
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
        const saveMarca = yield models_1.Marca.create({
            marca,
            who_created: admin.dataValues.email,
            when_created: new Date(),
            deleted: false
        });
        if (!saveMarca) {
            return res.status(404).json({
                msg: 'No se pudo crear el valor'
            });
        }
        return res.status(201).json({
            msg: 'Registro de la marca exitoso'
        });
    }
    catch (error) {
        res.status(500).json({
            error: error
        });
    }
});
exports.registerMarca = registerMarca;
const updateMarca = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { id, marca } = req.body;
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
        const updatedRow = yield models_1.Marca.update({
            marca,
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
exports.updateMarca = updateMarca;
const showMarca = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const marca = yield models_1.Marca.findAll({
            where: { deleted: false },
            attributes: ['id', 'marca']
        });
        return res.json({
            data: marca
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error en el servidor'
        });
    }
});
exports.showMarca = showMarca;
const deleteMarca = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { id_eliminar } = req.body;
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
        const eliminado = yield models_1.Marca.findOne({
            where: {
                id: id_eliminar
            }
        });
        if (!eliminado) {
            return res.status(404).json({
                msg: 'No se pudo eliminar la marca'
            });
        }
        yield eliminado.update({
            deleted: true,
            who_deleted: admin.dataValues.email,
            when_deleted: new Date()
        });
        return res.status(201).json({
            msg: 'La marca se ha eliminado con éxito'
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Error al actualizar la fila",
        });
    }
});
exports.deleteMarca = deleteMarca;
