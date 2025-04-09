"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forgotten_password = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config"); // Importa el objeto Sequelize y configura la conexión a tu base de datos
const cliente_1 = require("./cliente");
const Forgotten_password = config_1.db.define("Forgotten_password", {
    // Define el modelo Forgotten_password con los campos necesarios
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    clienteId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: cliente_1.Cliente,
            key: "id", // Establece la clave foránea como el campo id del modelo User
        },
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    keyRecovery: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    }
}, { tableName: "forgotten_password" });
exports.Forgotten_password = Forgotten_password;
Forgotten_password.belongsTo(cliente_1.Cliente, { foreignKey: "clienteId" }); // Establece la relación entre Forgotten_password y Cliente
