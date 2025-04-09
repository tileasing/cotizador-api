import { DataTypes } from "sequelize";
import { db } from "../config";
import { Cliente } from "./cliente";
import { Tipo_Archivo_A } from "./tipo_archivo_a";

const Documentos_Cliente_A = db.define(
  "Documentos_Cliente_A",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    informacion: {
      type: DataTypes.STRING,
    },
    path: {
      type: DataTypes.STRING,
    },
    tipo_archivo_a_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Tipo_Archivo_A, // Establece la referencia al modelo Tipo_Archivo_A
        key: "id", // Establece la clave foránea como el campo id del modelo Tipo_Archivo
      },
    },
    cliente_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Cliente, // Establece la referencia al modelo Cliente
        key: "id", // Establece la clave foránea como el campo id del modelo Cliente
      },
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
  { tableName: "documentos_cliente_a" }
);

// Modelo Cliente
Cliente.hasMany(Documentos_Cliente_A, {
  foreignKey: "cliente_id",
  as: "documentos_a",
});
// Modelo Documentos_Cliente_A
Documentos_Cliente_A.belongsTo(Cliente, {
  foreignKey: "cliente_id",
  as: "cliente",
});
// Modelo Tipo Archivo
Tipo_Archivo_A.hasMany(Documentos_Cliente_A, {
  foreignKey: "tipo_archivo_a_id",
  as: "documentos_cliente_a",
});
// Modelo Documentos_Cliente
Documentos_Cliente_A.belongsTo(Tipo_Archivo_A, {
  foreignKey: "tipo_archivo_a_id",
  as: "tipo_archivo_a",
});

export { Documentos_Cliente_A };
