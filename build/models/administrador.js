"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Administrador = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const Administrador = config_1.db.define("Administrador", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: "email",
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    tipo_administrador: {
        type: sequelize_1.DataTypes.STRING,
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
    who_modified: {
        type: sequelize_1.DataTypes.STRING,
    },
    when_modified: {
        type: sequelize_1.DataTypes.DATE,
    }
}, { tableName: "administrador" });
exports.Administrador = Administrador;
