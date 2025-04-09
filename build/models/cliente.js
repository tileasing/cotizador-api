"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const administrador_1 = require("./administrador");
const Cliente = config_1.db.define("Cliente", {
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
    regimen_fiscal: {
        type: sequelize_1.DataTypes.STRING,
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
    telefono: {
        type: sequelize_1.DataTypes.STRING,
    },
    tipo_cliente: {
        type: sequelize_1.DataTypes.STRING,
    },
    deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    who_created: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: administrador_1.Administrador,
            key: "id", // Establece la clave foránea como el campo id del modelo Cliente
        },
    },
}, { tableName: "cliente" });
exports.Cliente = Cliente;
// Modelo Administrador
administrador_1.Administrador.hasMany(Cliente, {
    foreignKey: "who_created",
    as: "cliente_created",
});
// Modelo Cliente
Cliente.belongsTo(administrador_1.Administrador, {
    foreignKey: "who_created",
    as: "administrador_id",
});
