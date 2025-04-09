"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailToMKTCalculadora = exports.sendCancelEmailToMKT = exports.sendEmailToMKT = void 0;
const ejs_1 = __importDefault(require("ejs"));
const transporter_1 = require("./transporter");
const sendEmailToMKT = (respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    const datos = {
        nombre: respuesta.nombre,
        email: respuesta.email,
        telefono: respuesta.telefono,
        respuesta: respuesta.respuesta, // Pasar el objeto respuesta como cadena JSON
    };
    try {
        console.log("Entrando en el envio de correo");
        let html = ejs_1.default.render(`<h1>Detalles del Cliente</h1>
    <p>Nombre: <%= nombre %></p>
    <p>Email: <%= email %></p>
    <p>Teléfono: <%= telefono %></p>
    <h2>Aquí están los datos que ingresó el cliente</h2>
    <p>Valor de la factura: <%= respuesta.valorFactura %></p>
    <p>Pago inicial: <%= respuesta.totalPagoInicial %></p>
    <p>Plazo: <%= respuesta.plazo %></p>
    <p>Detalles adicionales:</p>
    <pre><%= JSON.stringify(respuesta, null, 2) %></pre>`, Object.assign({}, datos));
        const info = yield transporter_1.transporter.sendMail({
            from: "notificaciones@olrleasing.com.mx",
            to: "mkt@olrleasing.com.mx",
            // to: "tidesarrollo@olrleasing.com.mx",
            subject: "Un cliente está cotizando",
            html,
        });
        console.log(`Mensaje enviado: ${info.messageId}`);
        return info;
    }
    catch (error) {
        console.error(`Error al enviar el correo: ${error}`);
    }
});
exports.sendEmailToMKT = sendEmailToMKT;
const sendCancelEmailToMKT = (respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    const datos = {
        nombre: respuesta.nombre,
        email: respuesta.email,
        telefono: respuesta.telefono,
        respuesta: respuesta.respuesta, // Pasar el objeto respuesta como cadena JSON
    };
    try {
        console.log("Entrando en el envio de correo");
        let html = ejs_1.default.render(`<h1>El cliente dio me interesa pero canceló</h1>
    <h1>Detalles del Cliente</h1>
    <p>Nombre: <%= nombre %></p>
    <p>Email: <%= email %></p>
    <p>Teléfono: <%= telefono %></p>
    <h2>Aquí están los datos que ingresó el cliente</h2>
    <p>Valor de la factura: <%= respuesta.valorFactura %></p>
    <p>Pago inicial: <%= respuesta.totalPagoInicial %></p>
    <p>Plazo: <%= respuesta.plazo %></p>
    <p>Detalles adicionales:</p>
    <pre><%= JSON.stringify(respuesta, null, 2) %></pre>`, Object.assign({}, datos));
        const info = yield transporter_1.transporter.sendMail({
            from: "notificaciones@olrleasing.com.mx",
            to: "mkt@olrleasing.com.mx",
            // to: "tidesarrollo@olrleasing.com.mx",
            subject: "Un cliente está cotizando pero canceló",
            html,
        });
        console.log(`Mensaje enviado: ${info.messageId}`);
        return info;
    }
    catch (error) {
        console.error(`Error al enviar el correo: ${error}`);
    }
});
exports.sendCancelEmailToMKT = sendCancelEmailToMKT;
const sendEmailToMKTCalculadora = (respuesta) => __awaiter(void 0, void 0, void 0, function* () {
    const datos = {
        nombre: respuesta.nombre,
        email: respuesta.email,
        telefono: respuesta.telefono,
        calculos: respuesta.calculos, // Pasar el objeto respuesta como cadena JSON
    };
    try {
        console.log("Entrando en el envio de correo");
        let html = ejs_1.default.render(`<h1>Detalles del Cliente</h1>
    <p>Nombre: <%= nombre %></p>
    <p>Email: <%= email %></p>
    <p>Teléfono: <%= telefono %></p>
    <h2>Aquí están los calculos del cliente</h2>
    <h3><pre><%= JSON.stringify(calculos, null, 2) %></pre></h3>`, Object.assign({}, datos));
        const info = yield transporter_1.transporter.sendMail({
            from: "notificaciones@olrleasing.com.mx",
            to: "mkt@olrleasing.com.mx",
            // to: "tidesarrollo@olrleasing.com.mx",
            subject: "Un cliente quiere invertir",
            html,
        });
        console.log(`Mensaje enviado: ${info.messageId}`);
        return info;
    }
    catch (error) {
        console.error(`Error al enviar el correo: ${error}`);
    }
});
exports.sendEmailToMKTCalculadora = sendEmailToMKTCalculadora;
