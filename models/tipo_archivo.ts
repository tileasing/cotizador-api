import { DataTypes, Model } from "sequelize";
import { db } from "../config";
import { ITipoArchivo } from "../interfaces/tipoArchivoInterface";

const Tipo_Archivo = db.define<Model<ITipoArchivo, any>, ITipoArchivo>(
  "Tipo_Archivo",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo_archivo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regimen_fiscal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requerido: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    descripcion_archivo: {
      type: DataTypes.STRING,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
  { tableName: "tipo_archivo" }
);

export { Tipo_Archivo };
