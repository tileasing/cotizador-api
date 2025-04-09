// import { Sequelize } from 'sequelize'
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Inicio - Conexion a local
const DB_USER = process.env.DB_USER as string;
const DB_PORT = parseInt(process.env.DB_PORT as string);
const DB_PASSWORD = process.env.DB_PASSWORD as string;
const DB_NAME = process.env.DB_NAME as string;
const DB_HOST = process.env.DB_HOST as string;
// const whatsappToken = process.env.WHATSAPP_TOKEN as string;

// const db = new Sequelize(CONNECTION_URL);

const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  logging: false, // Desactiva el logging de Sequelize
});
// Fin - Conexion a local

// Inicio - Conexion a test
// const db = new Sequelize(
//   "postgres://olr_user:umXkx1IpVY0r9xbmi0q8BBn9bpBMFxlz@dpg-chm21aqk728ntjdnnmm0-a.oregon-postgres.render.com/olr_db",
//   {
//     dialect: "postgres",
//     protocol: "postgres",
//     dialectOptions: {
//       ssl: {
//         require: "true",
//       },
//     },
//   }
// );
// Fin - Conexion a test

export { db };
