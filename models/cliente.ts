import { DataTypes } from "sequelize";
import { db } from "../config";
import { Administrador } from "./administrador";

const Cliente = db.define(
  "Cliente",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regimen_fiscal: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "email",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING,
    },
    tipo_cliente: {
      type: DataTypes.STRING,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    who_created: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Administrador, // Establece la referencia al modelo Cliente
        key: "id", // Establece la clave foránea como el campo id del modelo Cliente
      },
    },
  },
  { tableName: "cliente" }
);

// Modelo Administrador
Administrador.hasMany(Cliente, {
  foreignKey: "who_created",
  as: "cliente_created",
});

// Modelo Cliente
Cliente.belongsTo(Administrador, {
  foreignKey: "who_created",
  as: "administrador_id",
});

export { Cliente };
