"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tipo_Archivo_A = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const Tipo_Archivo_A = config_1.db.define("Tipo_Archivo_A", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tipo_archivo_a: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    regimen_fiscal: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    descripcion_archivo: {
        type: sequelize_1.DataTypes.STRING,
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
}, { tableName: "tipo_archivo_a" });
exports.Tipo_Archivo_A = Tipo_Archivo_A;
