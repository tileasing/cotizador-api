"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Valor_Tasas = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const Valor_Tasas = config_1.db.define("Valor_Tasas", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tipo_activo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    plazo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    tasa_a: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    tasa_b: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    tasa_alfa: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    tasa_beta: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    tasa_gamma: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    who_deleted: {
        type: sequelize_1.DataTypes.STRING,
    },
    when_deleted: {
        type: sequelize_1.DataTypes.DATE,
    },
    who_created: {
        type: sequelize_1.DataTypes.STRING,
    },
    when_created: {
        type: sequelize_1.DataTypes.DATE,
    },
    who_modified: {
        type: sequelize_1.DataTypes.STRING,
    },
    when_modified: {
        type: sequelize_1.DataTypes.DATE,
    },
}, { tableName: "valor_tasas" });
exports.Valor_Tasas = Valor_Tasas;
