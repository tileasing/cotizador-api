import { DataTypes } from "sequelize";
import { db } from "../config";
import { Cliente } from "./cliente";
import { Tipo_Archivo } from "./tipo_archivo";

const Documentos_Cliente = db.define(
  "Documentos_Cliente",
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
    tipo_archivo_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Tipo_Archivo, // Establece la referencia al modelo Tipo_Archivo
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
  { tableName: "documentos_cliente" }
);

// Modelo Cliente
Cliente.hasMany(Documentos_Cliente, {
  foreignKey: "cliente_id",
  as: "documentos",
});
// Modelo Documentos_Cliente
Documentos_Cliente.belongsTo(Cliente, {
  foreignKey: "cliente_id",
  as: "cliente",
});
// Modelo Tipo Archivo
Tipo_Archivo.hasMany(Documentos_Cliente, {
  foreignKey: "tipo_archivo_id",
  as: "documentos_cliente",
});
// Modelo Documentos_Cliente
Documentos_Cliente.belongsTo(Tipo_Archivo, {
  foreignKey: "tipo_archivo_id",
  as: "tipo_archivo",
});

export { Documentos_Cliente };
