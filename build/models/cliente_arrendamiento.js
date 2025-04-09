"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente_Arrendamiento = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const cliente_1 = require("./cliente");
const Cliente_Arrendamiento = config_1.db.define("Cliente_Arrendamiento", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cliente_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: cliente_1.Cliente,
            key: "id", // Establece la clave foránea como el campo id del modelo Cliente
        },
    },
    firma_contrato: {
        type: sequelize_1.DataTypes.STRING,
    },
    pago_inicial: {
        type: sequelize_1.DataTypes.STRING,
    },
    entrega_unidad: {
        type: sequelize_1.DataTypes.STRING,
    },
    analisis_riesgo: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    tipo_pago: {
        type: sequelize_1.DataTypes.STRING,
    },
    path_analisis: {
        type: sequelize_1.DataTypes.STRING,
    },
    path_orden_compra: {
        type: sequelize_1.DataTypes.STRING,
    },
    path_factura_unidad: {
        type: sequelize_1.DataTypes.STRING,
    },
    path_contrato_firmado: {
        type: sequelize_1.DataTypes.STRING,
    },
    path_unidad_entregada: {
        type: sequelize_1.DataTypes.STRING,
    },
    motivo: {
        type: sequelize_1.DataTypes.STRING,
    },
    estado: {
        type: sequelize_1.DataTypes.STRING,
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
}, { tableName: "cliente_arrendamiento" });
exports.Cliente_Arrendamiento = Cliente_Arrendamiento;
// Modelo Cliente
cliente_1.Cliente.hasMany(Cliente_Arrendamiento, {
    foreignKey: "cliente_id",
    as: "cliente_arrendamiento",
});
// Modelo Cliente_Arrendamiento
Cliente_Arrendamiento.belongsTo(cliente_1.Cliente, {
    foreignKey: "cliente_id",
    as: "cliente",
});
