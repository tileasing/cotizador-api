"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const PASSWORD_EMAIL = process.env.PASSWORD_EMAIL;
const USER_EMAIL = process.env.USER_EMAIL;
const HOST_EMAIL = process.env.HOST_EMAIL;
const PORT_EMAIL = parseInt(process.env.PORT_EMAIL);
const CIPHER_EMAIL = process.env.CIPHER_EMAIL;
const transporter = nodemailer_1.default.createTransport({
    host: HOST_EMAIL,
    port: PORT_EMAIL,
    auth: {
        user: USER_EMAIL,
        pass: PASSWORD_EMAIL,
    },
    tls: {
        ciphers: CIPHER_EMAIL,
    },
});
exports.transporter = transporter;
