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
exports.testValoresTasasMoto = exports.testValoresTasasBici = exports.testValoresTasasTracto = exports.testValoresTasas = exports.updateTasas = exports.getAllTipoTasa = exports.getTasasByTipoActivo = exports.registerValoresTasa = exports.getTasasByTipoActivoPaginate = exports.getValoresTasas = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const getValoresTasas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valoresTasas = yield models_1.Valor_Tasas.findAll();
        return res.json({
            data: valoresTasas,
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Ocurrió un error en el servidor",
        });
    }
});
exports.getValoresTasas = getValoresTasas;
const getTasasByTipoActivoPaginate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tipo_activo } = req.body;
        const page = parseInt(req.body.page) || 1; // obtener el número de página desde la consulta
        const limit = parseInt(req.body.limit) || 10; // obtener el límite de resultados desde la consulta
        const offset = (page - 1) * limit;
        const { count, rows } = yield models_1.Valor_Tasas.findAndCountAll({
            where: {
                tipo_activo: {
                    [sequelize_1.Op.like]: `%${tipo_activo}%`,
                },
            },
            limit,
            offset,
        });
        const totalPages = Math.ceil(count / limit); // calcular el número total de páginas
        return res.status(200).json({
            dataTasas: rows,
            page,
            totalPages,
            totalResults: count,
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Error en el servidor",
        });
    }
});
exports.getTasasByTipoActivoPaginate = getTasasByTipoActivoPaginate;
const registerValoresTasa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { plazo, tipo_activo, tasa_a, tasa_b, tasa_alfa, tasa_beta, tasa_gamma, } = req.body;
    try {
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_a = req.authData) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
        if (!admin) {
            return res.status(404).json({
                msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
            });
        }
        const saveValorTasas = yield models_1.Valor_Tasas.create({
            plazo,
            tipo_activo,
            tasa_a,
            tasa_b,
            tasa_alfa,
            tasa_beta,
            tasa_gamma,
            who_created: admin.dataValues.email,
            when_created: new Date(),
        });
        if (!saveValorTasas) {
            return res.status(404).json({
                msg: "No se pudo crear el valor",
            });
        }
        return res.status(201).json({
            msg: "Registro del valor de la tasa exitoso",
        });
    }
    catch (error) {
        return res.status(500).json({
            error: error,
        });
    }
});
exports.registerValoresTasa = registerValoresTasa;
const getTasasByTipoActivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { tipo_activo } = req.params;
    try {
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_b = req.authData) === null || _b === void 0 ? void 0 : _b.id,
            },
        });
        if (!admin) {
            return res.status(404).json({
                msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
            });
        }
        const rows = yield models_1.Valor_Tasas.findAll({
            where: {
                tipo_activo: {
                    [sequelize_1.Op.like]: `%${tipo_activo}%`,
                },
            },
            attributes: [
                "id",
                "plazo",
                "tasa_a",
                "tasa_b",
                "tasa_alfa",
                "tasa_beta",
                "tasa_gamma",
            ], // Solo obtener las columnas que deseas mostrar
        });
        return res.status(200).json({
            tipo_activo,
            data: rows,
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Error en el servidor",
        });
    }
});
exports.getTasasByTipoActivo = getTasasByTipoActivo;
const getAllTipoTasa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_c = req.authData) === null || _c === void 0 ? void 0 : _c.id,
            },
        });
        if (!admin) {
            return res.status(404).json({
                msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
            });
        }
        const tipoActivo = yield models_1.Valor_Tasas.findAll({
            attributes: [
                [sequelize_1.Sequelize.fn("DISTINCT", sequelize_1.Sequelize.col("tipo_activo")), "tipo_activo"],
            ],
        });
        if (!tipoActivo) {
            return res.status(404).json({
                msg: "No hay respuesta",
            });
        }
        return res.status(200).json({ data: tipoActivo });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Error al actualizar la fila",
        });
    }
});
exports.getAllTipoTasa = getAllTipoTasa;
const updateTasas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { id, tasa_a, tasa_b, tasa_alfa, tasa_beta, tasa_gamma } = req.body;
    try {
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_d = req.authData) === null || _d === void 0 ? void 0 : _d.id,
            },
        });
        if (!admin) {
            return res.status(404).json({
                msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
            });
        }
        const updatedRow = yield models_1.Valor_Tasas.update({
            tasa_a,
            tasa_b,
            tasa_alfa,
            tasa_beta,
            tasa_gamma,
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
exports.updateTasas = updateTasas;
const testValoresTasas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_e = req.authData) === null || _e === void 0 ? void 0 : _e.id,
            },
        });
        if (!admin) {
            return res.status(404).json({
                msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
            });
        }
        const tablaTasas = [
            {
                plazo: 12,
                planA: 32,
                planB: 33,
                alfa: 34,
                beta: 35,
                gamma: 36,
            },
            {
                plazo: 24,
                planA: 32,
                planB: 33,
                alfa: 34,
                beta: 35,
                gamma: 36,
            },
            {
                plazo: 36,
                planA: 32,
                planB: 33,
                alfa: 34,
                beta: 35,
                gamma: 36,
            },
            {
                plazo: 48,
                planA: 32,
                planB: 33,
                alfa: 34,
                beta: 35,
                gamma: 36,
            },
        ];
        for (const { plazo, alfa, beta, gamma, planA, planB } of tablaTasas) {
            yield models_1.Valor_Tasas.create({
                tipo_activo: "Autos",
                plazo,
                tasa_a: planA,
                tasa_b: planB,
                tasa_alfa: alfa,
                tasa_beta: beta,
                tasa_gamma: gamma,
                who_created: admin.dataValues.email,
                when_created: new Date(),
                deleted: false,
            });
        }
        return res.json({
            msg: "Petición exitosa",
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Ocurrió un error en el servidor",
        });
    }
});
exports.testValoresTasas = testValoresTasas;
const testValoresTasasTracto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        console.log("En peticion");
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_f = req.authData) === null || _f === void 0 ? void 0 : _f.id,
            },
        });
        console.log("El amdin es", admin);
        if (!admin) {
            return res.status(404).json({
                msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
            });
        }
        const tablaTasas = [
            {
                plazo: 12,
                planA: 34,
                planB: 35,
                alfa: 36,
                beta: 37,
                gamma: 38,
            },
            {
                plazo: 24,
                planA: 34,
                planB: 35,
                alfa: 36,
                beta: 37,
                gamma: 38,
            },
            {
                plazo: 36,
                planA: 34,
                planB: 35,
                alfa: 36,
                beta: 37,
                gamma: 38,
            },
            {
                plazo: 48,
                planA: 34,
                planB: 35,
                alfa: 36,
                beta: 37,
                gamma: 38,
            },
        ];
        for (const { plazo, alfa, beta, gamma, planA, planB } of tablaTasas) {
            yield models_1.Valor_Tasas.create({
                tipo_activo: "Tracto Camion",
                plazo,
                tasa_a: planA,
                tasa_b: planB,
                tasa_alfa: alfa,
                tasa_beta: beta,
                tasa_gamma: gamma,
                who_created: admin.dataValues.email,
                when_created: new Date(),
                deleted: false,
            });
        }
        return res.json({
            msg: "Petición exitosa",
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Ocurrió un error en el servidor",
        });
    }
});
exports.testValoresTasasTracto = testValoresTasasTracto;
const testValoresTasasBici = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        console.log("En peticion");
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_g = req.authData) === null || _g === void 0 ? void 0 : _g.id,
            },
        });
        console.log("El amdin es", admin);
        if (!admin) {
            return res.status(404).json({
                msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
            });
        }
        const tablaTasas = [
            {
                plazo: 12,
                planA: 0,
                planB: 0,
                alfa: 0,
                beta: 0,
                gamma: 0,
            },
        ];
        for (const { plazo, alfa, beta, gamma, planA, planB } of tablaTasas) {
            yield models_1.Valor_Tasas.create({
                tipo_activo: "Bicicletas",
                plazo,
                tasa_a: planA,
                tasa_b: planB,
                tasa_alfa: alfa,
                tasa_beta: beta,
                tasa_gamma: gamma,
                who_created: admin.dataValues.email,
                when_created: new Date(),
                deleted: false,
            });
        }
        return res.json({
            msg: "Petición exitosa",
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Ocurrió un error en el servidor",
        });
    }
});
exports.testValoresTasasBici = testValoresTasasBici;
const testValoresTasasMoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    try {
        console.log("En peticion");
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_h = req.authData) === null || _h === void 0 ? void 0 : _h.id,
            },
        });
        console.log("El amdin es", admin);
        if (!admin) {
            return res.status(404).json({
                msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
            });
        }
        const tablaTasas = [
            {
                plazo: 12,
                tasa_a: 45,
                tasa_b: 45,
                tasa_alfa: 45,
                tasa_beta: 45,
                tasa_gamma: 45,
            },
            {
                plazo: 24,
                tasa_a: 45,
                tasa_b: 45,
                tasa_alfa: 45,
                tasa_beta: 45,
                tasa_gamma: 45,
            },
        ];
        for (const { plazo, tasa_a, tasa_b, tasa_alfa, tasa_beta, tasa_gamma, } of tablaTasas) {
            yield models_1.Valor_Tasas.create({
                tipo_activo: "Motocicleta",
                plazo,
                tasa_a,
                tasa_b,
                tasa_alfa,
                tasa_beta,
                tasa_gamma,
                who_created: admin.dataValues.email,
                when_created: new Date(),
                deleted: false,
            });
        }
        return res.json({
            msg: "Petición exitosa",
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Ocurrió un error en el servidor",
        });
    }
});
exports.testValoresTasasMoto = testValoresTasasMoto;
