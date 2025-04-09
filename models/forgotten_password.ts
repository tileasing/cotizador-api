import { DataTypes, Model } from "sequelize";
import { db } from "../config"; // Importa el objeto Sequelize y configura la conexión a tu base de datos
import { Cliente } from "./cliente";
import { IDTOForgottenPassword } from "../interfaces/forgottenPassword";

const Forgotten_password = db.define<Model<IDTOForgottenPassword, any>,IDTOForgottenPassword>("Forgotten_password", {
  // Define el modelo Forgotten_password con los campos necesarios
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  clienteId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Cliente, // Establece la referencia al modelo User
      key: "id", // Establece la clave foránea como el campo id del modelo User
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  keyRecovery: {
    type: DataTypes.STRING,
    allowNull:false,
  }
}, {tableName: "forgotten_password"});

Forgotten_password.belongsTo(Cliente, { foreignKey: "clienteId" }); // Establece la relación entre Forgotten_password y Cliente
export { Forgotten_password };
