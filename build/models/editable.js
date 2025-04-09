"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editable = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const Editable = config_1.db.define("Editable", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    campo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    valor: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    tipo: {
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
}, { tableName: "editable" });
exports.Editable = Editable;
