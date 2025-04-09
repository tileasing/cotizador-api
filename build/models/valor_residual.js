"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Valor_Residual = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const Valor_Residual = config_1.db.define("Valor_Residual", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    plazo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: {
            name: 'unique error',
            msg: "El plazo ya existe",
        },
    },
    minimo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    maximo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
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
}, { tableName: "valor_residual" });
exports.Valor_Residual = Valor_Residual;
