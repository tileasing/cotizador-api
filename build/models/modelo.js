"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const Modelo = connection_1.default.define('Modelo', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    modelo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    },
    who_deleted: {
        type: sequelize_1.DataTypes.STRING
    },
    when_deleted: {
        type: sequelize_1.DataTypes.DATE
    },
    who_created: {
        type: sequelize_1.DataTypes.STRING
    },
    when_created: {
        type: sequelize_1.DataTypes.DATE
    },
    who_modified: {
        type: sequelize_1.DataTypes.STRING
    },
    when_modified: {
        type: sequelize_1.DataTypes.DATE
    }
});
exports.default = Modelo;
