import { DataTypes, Model } from "sequelize";
import { db } from "../config"; // Importa el objeto Sequelize y configura la conexión a tu base de datos
import { IDTOInversionFija } from "../interfaces/inversionFija";

const Inversion_fija = db.define<Model<IDTOInversionFija, any>,IDTOInversionFija>(
  "Inversion_fija",
  {
    // Define el modelo inversion_fija con los campos necesarios
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
    rendimiento: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    tasa_ce_olr: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    tasa_agregada: {
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
  { tableName: "inversion_fija" }
);

export { Inversion_fija };
