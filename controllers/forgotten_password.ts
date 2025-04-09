import { Request, Response } from "express";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import {
  generateUniqueRecoveyPassword,
  sendEmailRecovey,
} from "../services/forgottenPasswordServices";
import bcrypt from "bcrypt";
import { Administrador, Cliente, Forgotten_password } from "../models";

export const generateKey = async (
  req: Request<{}, {}, { email: string }>,
  res: Response<BaseResponseType>
) => {
  const { email } = req.body;
  try {
    const adminExist = await Administrador.findOne({
      where: {
        email,
      },
    });
    if (adminExist) {
      return res.status(404).json({
        success: false,
        errors: [
          "Si has olvidado la contraseña, por favor comunícate con un administrador",
        ],
      });
    }
    const clientExist = await Cliente.findOne({
      where: {
        email,
      },
    });
    if (!clientExist) {
      return res.status(404).json({
        success: false,
        errors: ["No hemos encontrado registro del correo: " + email],
      });
    }
    console.log(clientExist.dataValues.id);
    // const createRegister = await Forgotten_password.findAll();
    const uniqueKey = generateUniqueRecoveyPassword({
      id: clientExist.dataValues.id,
      email: clientExist.dataValues.email,
    });
    const createRegister = await Forgotten_password.create({
      clienteId: clientExist.dataValues.id,
      email: clientExist.dataValues.email,
      keyRecovery: uniqueKey,
    });
    // TODO SEND EMAIL
    const nombre = clientExist.dataValues.nombre;
    await sendEmailRecovey({ nombre, emailTo: email, uniqueKey });
    console.log(createRegister);
    return res.status(201).json({
      success: true,
      data: {
        msg: "Registro exitoso",
        clave: uniqueKey,
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

export const verifyUniqueKey = async (
  req: Request<{}, {}, { email: string; uniqueKey: string }>,
  res: Response<BaseResponseType>
) => {
  const { email, uniqueKey } = req.body;
  try {
    if (uniqueKey === "") {
      return res.status(404).json({
        success: false,
        errors: ["Ingrese la clave enviada al correo"],
      });
    }
    const clientExist = await Cliente.findOne({
      where: {
        email,
      },
    });
    if (!clientExist) {
      return res.status(404).json({
        success: false,
        errors: ["No hemos encontrado registro del correo: " + email],
      });
    }
    const recovery = await Forgotten_password.findOne({
      where: {
        keyRecovery: uniqueKey,
        email: email,
      },
      order: [["createdAt", "ASC"]], // Ordenar por fecha de creación en orden descendente
      limit: 1, // Limitar el resultado a 1 registro
    });
    console.log(recovery);
    if (!recovery) {
      return res.status(404).json({
        success: false,
        errors: ["La clave no coincide", "Favor de verificar en el correo"],
      });
    }
    return res.status(201).json({
      success: true,
      data: {
        msg: "Claves correctas",
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

export const updatePassword = async (
  req: Request<
    {},
    {},
    {
      email: string;
      uniqueKey: string;
      password: string;
      confirmPassword: string;
    }
  >,
  res: Response<BaseResponseType>
) => {
  const { email, uniqueKey, password, confirmPassword } = req.body;
  try {
    const clientExist = await Cliente.findOne({
      where: {
        email,
      },
    });
    if (!clientExist) {
      return res.status(404).json({
        success: false,
        errors: ["No hemos encontrado registro del correo: " + email],
      });
    }
    const recovery = await Forgotten_password.findOne({
      where: {
        keyRecovery: uniqueKey,
        email: email,
      },
    });
    if (!recovery) {
      return res.status(404).json({
        success: false,
        errors: ["La clave no coincide", "Favor de verificar en el correo"],
      });
    }

    // Verifica que los tipos de datos sean correctos
    if (typeof password !== "string" || typeof confirmPassword !== "string") {
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
    if (confirmPassword === "") {
      return res.status(400).json({
        success: false,
        errors: ["El campo confirmar nueva contraseña no puede ir vacío"],
      });
    }
    // Verifica que no haya error al introducir la nueva contraseña
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        errors: ["Las nuevas contraseñas no coinciden entre sí"],
      });
    }

    recovery.update({ keyRecovery: "" });
    const hash = await bcrypt.hash(password, 10);
    await clientExist.update({ password: hash });

    // Retorna la respuesta de la contraseña si es efectuada con éxito
    return res.status(201).json({
      success: true,
      data: ["Contraseña actualizada con éxito"],
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
