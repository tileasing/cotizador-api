"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const administrador_1 = require("./administrador");
const Log = config_1.db.define("Log", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    administrador_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: administrador_1.Administrador,
            key: "id",
        },
    },
    tipo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    fecha: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    old_register: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    new_register: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, { tableName: "log" });
exports.Log = Log;
Log.belongsTo(administrador_1.Administrador, { foreignKey: "administrador_id" });
