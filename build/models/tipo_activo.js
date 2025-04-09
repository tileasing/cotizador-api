"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tipo_Activo = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const Tipo_Activo = config_1.db.define("Tipo_Activo", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tipo_activo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
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
}, { tableName: "tipo_activo" });
exports.Tipo_Activo = Tipo_Activo;
