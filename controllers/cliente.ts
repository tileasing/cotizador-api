import { Request, Response } from "express";
import { IDTOCotCliente } from "../interfaces/cotizacionInterfaces";
import { IDTOCliente, IDTOCreateClient } from "../interfaces/clienteInterfaces";
import bcrypt from "bcrypt";
import { generatePassword, sendEmail } from "../services/generatePassword";
import { doCotCliente, getTypeOfUser } from "../services";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import {
  sendCancelEmailToMKT,
  sendEmailToMKT,
} from "../services/sendEmailToMKT";
import {
  clientRF,
  cotizacionClienteValidator,
} from "../validators/cotizacionClienteValidator";
import { createValidateClientByAdmin } from "../validators/clienteArrendamiento";
import { Administrador, Cliente, Log, LogCliente } from "../models";

export const getCliente = async (req: Request, res: Response) => {
  const cliente = await Cliente.findAll();
  res.json({ msg: "Cliente", cliente });
};

export const registerCliente = async (
  req: Request<{}, {}, IDTOCliente>,
  res: Response<BaseResponseType>
) => {
  const { nombre, email, telefono } = req.body;
  try {
    if (!nombre) {
      return res.status(404).json({
        success: false,
        errors: ["El nombre es requerido"],
      });
    }
    if (!email) {
      return res.status(404).json({
        success: false,
        errors: ["El correo es obligatorio"],
      });
    }
    console.log("Pasa validaciones");
    const clienteExist = await Cliente.findOne({
      where: {
        email,
      },
    });
    console.log("Busca al cliente");
    if (clienteExist) {
      return res.status(404).json({
        success: false,
        errors: ["Ya existe un usuario con el email: " + email],
      });
    }
    console.log("Busca al administrador");
    const clienteExistInAdmin = await Administrador.findOne({
      where: {
        email,
      },
    });
    if (clienteExistInAdmin) {
      return res.status(404).json({
        success: false,
        errors: ["Ya existe un usuario con el email: " + email],
      });
    }
    console.log("Pasó los filtros");
    const password = generatePassword();
    const sendCorrect = await sendEmail({
      nombre,
      password,
      emailTo: email,
    });
    if (!sendCorrect) {
      return res.status(404).json({
        success: false,
        errors: ["No se pudo crear el cliente: " + nombre],
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const saveCliente = await Cliente.create({
      ...req.body,
      tipo_cliente: "Cliente",
      password: hash,
    });
    if (!saveCliente) {
      return res.status(404).json({
        success: false,
        errors: ["No se pudo crear el cliente: " + nombre],
      });
    }
    return res.status(201).json({
      success: true,
      data: {
        msg: [
          "¡Te has registrado con éxito!",
          "Por favor, revisa tu correo para continuar",
        ],
      },
    });
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

// export const loginCliente = async (req: Request<{}, {}, { email: string, password: string }>, res: Response) => {
//     const { email, password } = req.body
//     try {
//         const cliente = await Cliente.findOne({
//             where: {
//                 email
//             }
//         })
//         if (!cliente) {
//             return res.status(404).json({
//                 msg: 'No se encuentra registro del cliente'
//             })
//         }
//         const passwordValid = await bcrypt.compare(password, cliente.dataValues.password)
//         if (!passwordValid) {
//             return res.status(400).json({
//                 msg: 'La contraseña es incorrecta'
//             })
//         }
//         const token = jwt.sign({ id: cliente.dataValues.id }, process.env.SECRET_JWT as string)
//         res.status(201).json({
//             nombre: cliente.dataValues.nombre,
//             email: cliente.dataValues.email,
//             telefono: cliente.dataValues.telefono,
//             tipo_cliente: cliente.dataValues.tipo_cliente,
//             token
//         })

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             msg: 'Ocurrió un error en el servidor'
//         })
//     }
// }

export const testCreateClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await Cliente.findAll(); // obtenemos los resultados de la base de datos
    const clientesExistentes = [
      "gustavo@gmail.com",
      "hugo@gmail.com",
      "fernanda@gmail.com",
      "brian@gmail.com",
    ];

    const clientesEncontrados = clientes.filter((objeto) =>
      clientesExistentes.includes(objeto.dataValues.email)
    );
    if (clientesEncontrados.length > 0) {
      return res.status(404).json({ msg: "Los clientes ya existen" });
    }
    const hash = await bcrypt.hash("123456789", 10);
    const saveCliente = await Cliente.create({
      nombre: "Gustavo",
      email: "gustavo@gmail.com",
      password: hash,
    });
    const saveCliente1 = await Cliente.create({
      nombre: "Hugo",
      email: "hugo@gmail.com",
      password: hash,
    });
    const saveCliente2 = await Cliente.create({
      nombre: "Fernanda",
      email: "fernanda@gmail.com",
      password: hash,
    });
    const saveCliente3 = await Cliente.create({
      nombre: "Brian",
      email: "brian@gmail.com",
      password: hash,
    });
    if (!saveCliente || !saveCliente1 || !saveCliente2 || !saveCliente3) {
      return res.status(404).json({
        msg: "No se pudo crear el cliente",
      });
    }
    return res.status(201).json({
      msg: "Clientes creados con éxito",
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const cotCliente = async (
  req: Request<{}, {}, IDTOCotCliente>,
  res: Response<BaseResponseType>
) => {
  try {
    await cotizacionClienteValidator.validate(req.body);
    // Encuentra al cliente
    const clienteExist = await Cliente.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    // Encuentra al administrador
    const adminExist = await Administrador.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    const isClienteOrAdmin = await getTypeOfUser(req.authData);
    const data = await doCotCliente(req.body);
    if (!data) {
      return res.status(401).json({
        success: false,
        errors: ["Ha ocurrido un error"],
      });
    }
    if (!data.rentaMensual)
      return res.status(401).json({
        success: false,
        errors: ["No se ha podido realizar la cotización"],
      });
    if (isClienteOrAdmin.isCorrect === false) {
      return res.status(401).json({
        success: false,
        errors: ["Algo ocurrió en la validación del usuario"],
      });
    }
    const { nombre, telefono, email } = isClienteOrAdmin;
    if (clienteExist) {
      await LogCliente.create({
        cliente_id: req.authData?.id,
        tipo: "Cotización",
        fecha: new Date(),
        old_register: "",
        new_register: JSON.stringify({
          ...data,
          nombre,
          telefono,
          email,
          valorFactura: req.body.valorFactura as number,
          totalPagoInicial: req.body.totalPagoInicial as number,
        }),
      });
    }
    if (adminExist) {
      await Log.create({
        administrador_id: req.authData?.id,
        tipo: "Cotización rápida",
        fecha: new Date(),
        old_register: "",
        new_register: JSON.stringify({
          ...data,
          nombre,
          telefono,
          email,
          valorFactura: req.body.valorFactura as number,
          totalPagoInicial: req.body.totalPagoInicial as number,
        }),
      });
    }
    return res.json({
      success: true,
      data: {
        ...data,
        nombre,
        telefono,
        email,
        valorFactura: req.body.valorFactura as number,
        totalPagoInicial: req.body.totalPagoInicial as number,
      },
    });
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const changePassword = async (
  req: Request,
  res: Response<BaseResponseType>
) => {
  const { password, newPassword, confirmPassword } = req.body;
  try {
    // Encuentra al cliente
    const clienteExist = await Cliente.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    // Verifica que se haya encontrado el cliente
    if (!clienteExist) {
      return res.status(404).json({
        success: false,
        errors: ["Ocurrió un error al encontrar al cliente"],
      });
    }
    // Verifica que los tipos de datos sean correctos
    if (
      typeof password !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return res.status(400).json({
        success: false,
        errors: ["Los tipos de datos son incorrectos"],
      });
    }
    // Valida que no vengan campos vacios
    if (password === "") {
      return res.status(400).json({
        success: false,
        errors: ["El campo contraseña no puede ir vacío"],
      });
    }
    if (newPassword === "") {
      return res.status(400).json({
        success: false,
        errors: ["El campo nueva contraseña no puede ir vacío"],
      });
    }
    if (confirmPassword === "") {
      return res.status(400).json({
        success: false,
        errors: ["El campo confirmar nueva contraseña no puede ir vacío"],
      });
    }
    // Verifica que no haya error al introducir la nueva contraseña
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        errors: ["Las nuevas contraseñas no coinciden entre sí"],
      });
    }
    // Verifica que la contraseña actual del usuario sea válida
    const validPassword = await bcrypt.compare(
      password,
      clienteExist.dataValues.password
    );
    // Verifica que la contraseña coincida con la existente en la base de datos
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        errors: [
          "La contraseña no coincide con el registro en la base de datos",
        ],
      });
    }

    // Actualiza la contraseña del usuario
    const passCifrada = await bcrypt.hash(newPassword, 10);
    await clienteExist.update({ password: passCifrada });

    // Retorna la respuesta de la contraseña si es efectuada con éxito
    return res.status(201).json({
      success: true,
      data: ["Contraseña actualizada con éxito"],
    });
  } catch (error) {
    // Retorna un error si es que ocurre en la operación
    console.log({ error });
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const updatePhoneNumber = async (
  req: Request<{}, {}, { telefono: string }>,
  res: Response<BaseResponseType>
) => {
  const { telefono } = req.body;
  console.log(req.body);
  try {
    // Encuentra al cliente
    const clienteExist = await Cliente.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    // Verifica que se haya encontrado el cliente
    if (!clienteExist) {
      return res.status(404).json({
        success: false,
        errors: ["No se encuentra el cliente"],
      });
    }
    // Verifica que sea un usuario activo
    if (clienteExist.dataValues.deleted === true) {
      return res.status(400).json({
        success: false,
        errors: ["Este usuario ha sido eliminado"],
      });
    }
    // Verifica que los tipos de datos sean correctos
    if (typeof telefono !== "string") {
      return res.status(400).json({
        success: false,
        errors: ["Los tipos de datos son incorrectos"],
      });
    }
    await clienteExist.update({ telefono });

    // Retorna la respuesta de la contraseña si es efectuada con éxito
    return res.status(201).json({
      success: true,
      data: ["Se ha actualizado el número de teléfono"],
    });
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const sendCotizacionToMKT = async (
  req: Request<{}, {}, { telefono: string; respuesta: object }>,
  res: Response<BaseResponseType>
) => {
  const { telefono, respuesta } = req.body;
  try {
    // Encuentra al cliente
    const clienteExist = await Cliente.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    // Verifica que se haya encontrado el cliente
    if (!clienteExist) {
      return res.status(404).json({
        success: false,
        errors: ["No se encuentra el cliente"],
      });
    }
    // Verifica que sea un usuario activo
    if (clienteExist.dataValues.deleted === true) {
      return res.status(400).json({
        success: false,
        errors: ["Este usuario ha sido eliminado"],
      });
    }
    // Verifica que los tipos de datos sean correctos
    if (typeof telefono !== "string") {
      return res.status(400).json({
        success: false,
        errors: ["Los tipos de datos son incorrectos"],
      });
    }
    const correctUpdatePhoneNumber = await clienteExist.update({ telefono });
    const { nombre, email } = correctUpdatePhoneNumber.dataValues;
    if (!correctUpdatePhoneNumber) {
      return res.status(400).json({
        success: false,
        errors: [
          "Lo sentimos, no se ha podido actualizar el número de teléfono",
        ],
      });
    }
    const sendCorrect = await sendEmailToMKT({
      nombre,
      email,
      telefono,
      respuesta,
    });
    if (!sendCorrect) {
      return res.status(400).json({
        success: false,
        errors: [
          "Lo sentimos, no hemos podido enviar el correo con tus datos",
          "Intente de nuevo",
        ],
      });
    }
    // Retorna la respuesta si es efectuada con éxito
    return res.status(201).json({
      success: true,
      data: [
        "Continua tu proceso en nuestro menú de Pre-requisitos",
        // "¡Estás a punto de tener el auto de tus sueños!",
        // "Nos comunicaremos contigo",
      ],
    });
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const sendCancelCotToMKT = async (
  req: Request<{}, {}, { telefono: string; respuesta: object }>,
  res: Response<BaseResponseType>
) => {
  const { telefono, respuesta } = req.body;
  try {
    // Encuentra al cliente
    const clienteExist = await Cliente.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    // Verifica que se haya encontrado el cliente
    if (!clienteExist) {
      return res.status(404).json({
        success: false,
        errors: ["No se encuentra el cliente"],
      });
    }
    // Verifica que sea un usuario activo
    if (clienteExist.dataValues.deleted === true) {
      return res.status(400).json({
        success: false,
        errors: ["Este usuario ha sido eliminado"],
      });
    }
    // Verifica que los tipos de datos sean correctos
    if (typeof telefono !== "string") {
      return res.status(400).json({
        success: false,
        errors: ["Los tipos de datos son incorrectos"],
      });
    }
    const correctUpdatePhoneNumber = await clienteExist.update({ telefono });
    const { nombre, email } = correctUpdatePhoneNumber.dataValues;
    if (!correctUpdatePhoneNumber) {
      return res.status(400).json({
        success: false,
        errors: [
          "Lo sentimos, no se ha podido actualizar el número de teléfono",
        ],
      });
    }
    const sendCorrect = await sendCancelEmailToMKT({
      nombre,
      email,
      telefono,
      respuesta,
    });
    if (!sendCorrect) {
      return res.status(400).json({
        success: false,
        errors: [
          "Lo sentimos, no hemos podido enviar el correo con tus datos",
          "Intente de nuevo",
        ],
      });
    }
    // Retorna la respuesta si es efectuada con éxito
    return res.status(201).json({
      success: true,
      data: ["¡Ok!"],
    });
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const getClient = async (
  req: Request,
  res: Response<BaseResponseType>
) => {
  try {
    return res.json({ success: true, data: req.authData?.id });
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const updateRF = async (
  req: Request<{}, {}, { regimen_fiscal: string }>,
  res: Response<BaseResponseType>
) => {
  try {
    const { regimen_fiscal } = await clientRF.validate(req.body);
    // Encuentra al cliente
    const clienteExist = await Cliente.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    // Verifica que se haya encontrado el cliente
    if (!clienteExist) {
      return res.status(404).json({
        success: false,
        errors: ["No se encuentra el cliente"],
      });
    }

    await clienteExist.update({
      regimen_fiscal,
    });

    return res.status(201).json({
      success: true,
      data: ["Se ha actualizado el régimen fiscal"],
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const getClientRF = async (
  req: Request,
  res: Response<BaseResponseType>
) => {
  try {
    // Encuentra al cliente
    const cliente = await Cliente.findOne({
      where: {
        id: req.authData?.id,
      },
      attributes: ["id", "regimen_fiscal"],
    });
    // Verifica que se haya encontrado el cliente
    if (!cliente) {
      return res.status(404).json({
        success: false,
        errors: ["No se encuentra el cliente"],
      });
    }
    return res.status(201).json({
      success: true,
      data: { cliente },
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const createClientByAdmin = async (
  req: Request<{}, {}, IDTOCreateClient>,
  res: Response<BaseResponseType>
) => {
  try {
    const data = await createValidateClientByAdmin.validate(req.body);
    const password = generatePassword();
    const sendCorrect = await sendEmail({
      nombre: data.nombre_cliente,
      password,
      emailTo: data.correo_cliente,
    });
    if (!sendCorrect) {
      return res.status(404).json({
        success: false,
        errors: ["No se pudo crear el cliente: " + data.nombre_cliente],
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const [clientExist, created] = await Cliente.findOrCreate({
      where: { email: data.correo_cliente },
      defaults: {
        nombre: data.nombre_cliente,
        email: data.correo_cliente,
        tipo_cliente: "Cliente",
        password: hash,
        who_created: req.authData?.id,
      },
      attributes: ["id", "nombre", "email"],
    });
    // console.log(clientExist);
    if (created)
      return res.json({
        success: true,
        data: { msg: "El cliente se ha registrado con éxito" },
      });
    if (clientExist) {
      return res.status(401).json({
        success: false,
        errors: ["El cliente ya ha sido registrado anteriormente"],
      });
    }
  } catch (error) {
    const err = error as Error;
    return res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};
