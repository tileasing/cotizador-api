import { DataTypes, Model } from 'sequelize';
import { db } from "../config";
import { IValorOtrosGastos } from '../interfaces/valorOtrosGastosInterfaces';

const Valor_Otros_Gastos = db.define<Model<IValorOtrosGastos, any>, IValorOtrosGastos>("Valor_Otros_Gastos", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  plazo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  instalacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gps_anual: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gastos_notariales: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total: {
    type: DataTypes.INTEGER,
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
}, {tableName: "valor_otros_gastos"});

export { Valor_Otros_Gastos };
