"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Documentos_Cliente = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const cliente_1 = require("./cliente");
const tipo_archivo_1 = require("./tipo_archivo");
const Documentos_Cliente = config_1.db.define("Documentos_Cliente", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    estado: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    informacion: {
        type: sequelize_1.DataTypes.STRING,
    },
    path: {
        type: sequelize_1.DataTypes.STRING,
    },
    tipo_archivo_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: tipo_archivo_1.Tipo_Archivo,
            key: "id", // Establece la clave foránea como el campo id del modelo Tipo_Archivo
        },
    },
    cliente_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: cliente_1.Cliente,
            key: "id", // Establece la clave foránea como el campo id del modelo Cliente
        },
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
}, { tableName: "documentos_cliente" });
exports.Documentos_Cliente = Documentos_Cliente;
// Modelo Cliente
cliente_1.Cliente.hasMany(Documentos_Cliente, {
    foreignKey: "cliente_id",
    as: "documentos",
});
// Modelo Documentos_Cliente
Documentos_Cliente.belongsTo(cliente_1.Cliente, {
    foreignKey: "cliente_id",
    as: "cliente",
});
// Modelo Tipo Archivo
tipo_archivo_1.Tipo_Archivo.hasMany(Documentos_Cliente, {
    foreignKey: "tipo_archivo_id",
    as: "documentos_cliente",
});
// Modelo Documentos_Cliente
Documentos_Cliente.belongsTo(tipo_archivo_1.Tipo_Archivo, {
    foreignKey: "tipo_archivo_id",
    as: "tipo_archivo",
});
