"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inversion_fija = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config"); // Importa el objeto Sequelize y configura la conexión a tu base de datos
const Inversion_fija = config_1.db.define("Inversion_fija", {
    // Define el modelo inversion_fija con los campos necesarios
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
    rendimiento: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
    tasa_ce_olr: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
    tasa_agregada: {
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
}, { tableName: "inversion_fija" });
exports.Inversion_fija = Inversion_fija;
