"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogCliente = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const cliente_1 = require("./cliente");
const LogCliente = config_1.db.define("LogCliente", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cliente_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: cliente_1.Cliente,
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
}, { tableName: "log_cliente" });
exports.LogCliente = LogCliente;
LogCliente.belongsTo(cliente_1.Cliente, { foreignKey: "cliente_id" });
