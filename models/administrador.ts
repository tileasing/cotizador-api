import { DataTypes, Model } from "sequelize";
import { db } from "../config";
import { IAdministrador } from "../interfaces/administradorInterfaces";

const Administrador = db.define<Model<IAdministrador, any>, IAdministrador>("Administrador", {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: "email",
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_administrador: {
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
  who_modified: {
    type: DataTypes.STRING,
  },
  when_modified: {
    type: DataTypes.DATE,
  }
}, {tableName: "administrador"});

export {Administrador};
