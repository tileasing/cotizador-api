import { DataTypes, Model } from "sequelize";
import { db } from "../config";
import { Cliente } from "./cliente";
import { IDTOLogAdminClient } from "../interfaces/logClient";

const LogCliente = db.define<Model<IDTOLogAdminClient, any>, IDTOLogAdminClient>(
  "LogCliente",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cliente_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Cliente,
        key: "id",
      },
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    old_register: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    new_register: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { tableName: "log_cliente" }
);
LogCliente.belongsTo(Cliente, { foreignKey: "cliente_id" });

export { LogCliente };
