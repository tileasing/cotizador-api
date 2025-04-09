import { DataTypes, Model } from "sequelize";
import { db } from "../config";
import { Administrador } from "./administrador";
import { IDTOLogAdmin } from "../interfaces/logAdmin";

const Log = db.define<Model<IDTOLogAdmin, any>, IDTOLogAdmin>(
  "Log",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    administrador_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Administrador,
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
  { tableName: "log" }
);
Log.belongsTo(Administrador, { foreignKey: "administrador_id" });

export { Log };
