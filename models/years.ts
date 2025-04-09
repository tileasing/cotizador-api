import { DataTypes, Model } from 'sequelize';
import { db } from "../config";
import { IYears } from '../interfaces/yearsInterface';

const Years = db.define<Model<IYears, any>, IYears>("Years", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
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
  who_deleted: {
    type: DataTypes.STRING,
  },
  when_deleted: {
    type: DataTypes.DATE,
  },
}, {tableName: "year"});

export { Years };
