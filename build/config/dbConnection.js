"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// import { Sequelize } from 'sequelize'
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Inicio - Conexion a local
const DB_USER = process.env.DB_USER;
const DB_PORT = parseInt(process.env.DB_PORT);
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_HOST = process.env.DB_HOST;
// const whatsappToken = process.env.WHATSAPP_TOKEN as string;
// const db = new Sequelize(CONNECTION_URL);
const db = new sequelize_1.Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
    logging: false, // Desactiva el logging de Sequelize
});
exports.db = db;
