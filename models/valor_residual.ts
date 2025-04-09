import { DataTypes, Model } from 'sequelize';
import { db } from "../config";
import { IValorResidual } from '../interfaces/valorResidualInterfaces';

const Valor_Residual = db.define<Model<IValorResidual, any>, IValorResidual>("Valor_Residual", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  plazo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: {
      name: 'unique error',
      msg: "El plazo ya existe",
    },
  },
  minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maximo: {
    type: DataTypes.INTEGER,
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
}, {tableName: "valor_residual"});

export { Valor_Residual };
