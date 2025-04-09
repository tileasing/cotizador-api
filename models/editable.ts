import { DataTypes, Model } from 'sequelize';
import { db } from "../config";
import { IEditable } from '../interfaces/editableInterface';

const Editable = db.define<Model<IEditable, any>, IEditable>("Editable", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  campo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  valor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
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
}, {tableName: "editable"});

export { Editable };
