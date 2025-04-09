import { DataTypes, Model } from "sequelize";
import { db } from "../config"; // Importa el objeto Sequelize y configura la conexión a tu base de datos
import { IDTOInversionAmortizable } from "../interfaces/inversionAmortizable";

const Inversion_amortizable = db.define<Model<IDTOInversionAmortizable, any>,IDTOInversionAmortizable>(
  "Inversion_amortizable",
  {
    // Define el modelo inversion_amortizable con los campos necesarios
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    minimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maximo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tasa: {
      type: DataTypes.DOUBLE,
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
  },
  { tableName: "inversion_amortizable" }
);

export { Inversion_amortizable };
