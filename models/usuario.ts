import { DataTypes } from "sequelize";
import { db } from "../config";

const Usuario = db.define("Usuario", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.BOOLEAN,
  },
});

export default Usuario;
