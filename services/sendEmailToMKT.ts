import ejs from "ejs";
import { transporter } from "./transporter";

export const sendEmailToMKT = async (respuesta: any) => {
  const datos = {
    nombre: respuesta.nombre,
    email: respuesta.email,
    telefono: respuesta.telefono,
    respuesta: respuesta.respuesta, // Pasar el objeto respuesta como cadena JSON
  };
  try {
    console.log("Entrando en el envio de correo");
    let html = ejs.render(
      `<h1>Detalles del Cliente</h1>
    <p>Nombre: <%= nombre %></p>
    <p>Email: <%= email %></p>
    <p>Teléfono: <%= telefono %></p>
    <h2>Aquí están los datos que ingresó el cliente</h2>
    <p>Valor de la factura: <%= respuesta.valorFactura %></p>
    <p>Pago inicial: <%= respuesta.totalPagoInicial %></p>
    <p>Plazo: <%= respuesta.plazo %></p>
    <p>Detalles adicionales:</p>
    <pre><%= JSON.stringify(respuesta, null, 2) %></pre>`,
      { ...datos }
    );
    const info = await transporter.sendMail({
      from: "notificaciones@olrleasing.com.mx",
      to: "mkt@olrleasing.com.mx",
      // to: "tidesarrollo@olrleasing.com.mx",
      subject: "Un cliente está cotizando",
      html,
    });
    console.log(`Mensaje enviado: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error al enviar el correo: ${error}`);
  }
};

export const sendCancelEmailToMKT = async (respuesta: any) => {
  const datos = {
    nombre: respuesta.nombre,
    email: respuesta.email,
    telefono: respuesta.telefono,
    respuesta: respuesta.respuesta, // Pasar el objeto respuesta como cadena JSON
  };
  try {
    console.log("Entrando en el envio de correo");
    let html = ejs.render(
      `<h1>El cliente dio me interesa pero canceló</h1>
    <h1>Detalles del Cliente</h1>
    <p>Nombre: <%= nombre %></p>
    <p>Email: <%= email %></p>
    <p>Teléfono: <%= telefono %></p>
    <h2>Aquí están los datos que ingresó el cliente</h2>
    <p>Valor de la factura: <%= respuesta.valorFactura %></p>
    <p>Pago inicial: <%= respuesta.totalPagoInicial %></p>
    <p>Plazo: <%= respuesta.plazo %></p>
    <p>Detalles adicionales:</p>
    <pre><%= JSON.stringify(respuesta, null, 2) %></pre>`,
      { ...datos }
    );
    const info = await transporter.sendMail({
      from: "notificaciones@olrleasing.com.mx",
      to: "mkt@olrleasing.com.mx",
      // to: "tidesarrollo@olrleasing.com.mx",
      subject: "Un cliente está cotizando pero canceló",
      html,
    });
    console.log(`Mensaje enviado: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error al enviar el correo: ${error}`);
  }
};

export const sendEmailToMKTCalculadora = async (respuesta: any) => {
  const datos = {
    nombre: respuesta.nombre,
    email: respuesta.email,
    telefono: respuesta.telefono,
    calculos: respuesta.calculos, // Pasar el objeto respuesta como cadena JSON
  };
  try {
    console.log("Entrando en el envio de correo");
    let html = ejs.render(
      `<h1>Detalles del Cliente</h1>
    <p>Nombre: <%= nombre %></p>
    <p>Email: <%= email %></p>
    <p>Teléfono: <%= telefono %></p>
    <h2>Aquí están los calculos del cliente</h2>
    <h3><pre><%= JSON.stringify(calculos, null, 2) %></pre></h3>`,
      { ...datos }
    );
    const info = await transporter.sendMail({
      from: "notificaciones@olrleasing.com.mx",
      to: "mkt@olrleasing.com.mx",
      // to: "tidesarrollo@olrleasing.com.mx",
      subject: "Un cliente quiere invertir",
      html,
    });
    console.log(`Mensaje enviado: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error al enviar el correo: ${error}`);
  }
};
