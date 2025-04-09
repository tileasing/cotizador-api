"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auto_Activos = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const Auto_Activos = config_1.db.define("Auto_Activos", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    modelo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    monto_arrendamiento: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    plazo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    tasa: {
        type: sequelize_1.DataTypes.FLOAT,
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
}, { tableName: "autos_activos" });
exports.Auto_Activos = Auto_Activos;
