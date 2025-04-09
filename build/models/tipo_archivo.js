"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tipo_Archivo = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const Tipo_Archivo = config_1.db.define("Tipo_Archivo", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tipo_archivo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    regimen_fiscal: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    requerido: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    descripcion_archivo: {
        type: sequelize_1.DataTypes.STRING,
    },
    deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
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
}, { tableName: "tipo_archivo" });
exports.Tipo_Archivo = Tipo_Archivo;
