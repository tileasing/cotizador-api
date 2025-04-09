import { DataTypes, Model } from 'sequelize';
import { db } from "../config";
import { IEstadoActivo } from '../interfaces/estadoActivoInterfaces';

const Estado_Activo = db.define<Model<IEstadoActivo, any>, IEstadoActivo>("Estado_Activo", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  estado_activo: {
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
}, {tableName: "estado_activo"});

export { Estado_Activo };
