import nodemailer from "nodemailer";
import { config } from "dotenv";
config();

const PASSWORD_EMAIL = process.env.PASSWORD_EMAIL as string;
const USER_EMAIL = process.env.USER_EMAIL as string;
const HOST_EMAIL = process.env.HOST_EMAIL as string;
const PORT_EMAIL = parseInt(process.env.PORT_EMAIL as string);
const CIPHER_EMAIL = process.env.CIPHER_EMAIL as string;

const transporter = nodemailer.createTransport({
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

export { transporter };
