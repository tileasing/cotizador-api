import { DataTypes, Model } from "sequelize";
import { db } from "../config";
import { IAutosActivos } from "../interfaces/autosActivosInterface";

const Auto_Activos = db.define<Model<IAutosActivos, any>, IAutosActivos>(
  "Auto_Activos",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monto_arrendamiento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    plazo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tasa: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    who_deleted: {
      type: DataTypes.STRING,
    },
    when_deleted: {
      type: DataTypes.DATE,
    },
    who_created: {
      type: DataTypes.STRING,
    },
    when_created: {
      type: DataTypes.DATE,
    },
    who_modified: {
      type: DataTypes.STRING,
    },
    when_modified: {
      type: DataTypes.DATE,
    },
  },
  { tableName: "autos_activos" }
);

export { Auto_Activos };
