import { DataTypes, Model } from "sequelize";
import { db } from "../config";
import { ITipoActivo } from '../interfaces/tipoActivoInterfaces';

const Tipo_Activo = db.define<Model<ITipoActivo, any>, ITipoActivo>("Tipo_Activo", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tipo_activo: {
    type: DataTypes.STRING,
    allowNull: false,
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
}, {tableName: "tipo_activo"});

export { Tipo_Activo };
