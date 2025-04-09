import { DataTypes, Model } from 'sequelize';
import { db } from "../config";
import { IValorTasas } from '../interfaces/valorTasasInterfaces';

const Valor_Tasas = db.define<Model<IValorTasas, any>, IValorTasas>("Valor_Tasas", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tipo_activo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  plazo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tasa_a: {
    type: DataTypes.INTEGER,
  },
  tasa_b: {
    type: DataTypes.INTEGER,
  },
  tasa_alfa: {
    type: DataTypes.INTEGER,
  },
  tasa_beta: {
    type: DataTypes.INTEGER,
  },
  tasa_gamma: {
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
}, {tableName: "valor_tasas"});

export { Valor_Tasas };
