"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Years = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const Years = config_1.db.define("Years", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    year: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
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
    who_deleted: {
        type: sequelize_1.DataTypes.STRING,
    },
    when_deleted: {
        type: sequelize_1.DataTypes.DATE,
    },
}, { tableName: "year" });
exports.Years = Years;
