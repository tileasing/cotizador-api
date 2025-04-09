"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inversion_amortizable = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config"); // Importa el objeto Sequelize y configura la conexión a tu base de datos
const Inversion_amortizable = config_1.db.define("Inversion_amortizable", {
    // Define el modelo inversion_amortizable con los campos necesarios
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    minimo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    maximo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    tasa: {
        type: sequelize_1.DataTypes.DOUBLE,
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
}, { tableName: "inversion_amortizable" });
exports.Inversion_amortizable = Inversion_amortizable;
