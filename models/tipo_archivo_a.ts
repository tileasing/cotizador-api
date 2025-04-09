import { DataTypes, Model } from "sequelize";
import { db } from "../config";
import { ITipoArchivoA } from "../interfaces/tipoArchivoAInterfaces";

const Tipo_Archivo_A = db.define<Model<ITipoArchivoA, any>, ITipoArchivoA>(
  "Tipo_Archivo_A",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo_archivo_a: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regimen_fiscal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    descripcion_archivo: {
      type: DataTypes.STRING,
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
  { tableName: "tipo_archivo_a" }
);

export { Tipo_Archivo_A };
