import { DataTypes, Model } from "sequelize";
import { db } from "../config";
import { Cliente } from "./cliente";
import { IClienteArrend } from "../interfaces/clienteArrendamiento";

const Cliente_Arrendamiento = db.define<
  Model<IClienteArrend, any>,
  IClienteArrend
>(
  "Cliente_Arrendamiento",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cliente_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Cliente, // Establece la referencia al modelo Cliente
        key: "id", // Establece la clave foránea como el campo id del modelo Cliente
      },
    },
    firma_contrato: {
      type: DataTypes.STRING,
    },
    pago_inicial: {
      type: DataTypes.STRING,
    },
    entrega_unidad: {
      type: DataTypes.STRING,
    },
    analisis_riesgo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    tipo_pago: {
      type: DataTypes.STRING,
    },
    path_analisis: {
      type: DataTypes.STRING,
    },
    path_orden_compra: {
      type: DataTypes.STRING,
    },
    path_factura_unidad: {
      type: DataTypes.STRING,
    },
    path_contrato_firmado: {
      type: DataTypes.STRING,
    },
    path_unidad_entregada: {
      type: DataTypes.STRING,
    },
    motivo: {
      type: DataTypes.STRING,
    },
    estado: {
      type: DataTypes.STRING,
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
  { tableName: "cliente_arrendamiento" }
);

// Modelo Cliente
Cliente.hasMany(Cliente_Arrendamiento, {
  foreignKey: "cliente_id",
  as: "cliente_arrendamiento",
});

// Modelo Cliente_Arrendamiento
Cliente_Arrendamiento.belongsTo(Cliente, {
  foreignKey: "cliente_id",
  as: "cliente",
});

export { Cliente_Arrendamiento };
