import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Administrador } from "../models/administrador";
import { Cliente } from "../models/cliente";
import { BaseResponseType } from "../interfaces/BaseResponseType";

export const loginUser = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response<BaseResponseType>
) => {
  const { email, password } = req.body;
  try {
    const admin = await Administrador.findOne({
      where: {
        email,
      },
    });
    const cliente = await Cliente.findOne({
      where: {
        email,
      },
    });
    if (!admin && !cliente) {
      return res.status(404).json({
        success: false,
        errors: ["No se encuentra el registro del correo"],
      });
    }
    if (admin?.dataValues.email === cliente?.dataValues.email) {
      return res.status(404).json({
        success: false,
        errors: ["Se encuentra una duplicidad en el correo"],
      });
    }
    if (admin && !cliente) {
      const passwordValidAdmin = await bcrypt.compare(
        password,
        admin.dataValues.password
      );
      if (!passwordValidAdmin) {
        return res.status(400).json({
          success: false,
          errors: ["La contraseña es incorrecta"],
        });
      }
      const token = jwt.sign(
        {
          id: admin.dataValues.id,
          tipoUsuario: admin.dataValues.tipo_administrador,
        },
        process.env.SECRET_JWT as string
      );
      return res.json({
        success: true,
        data: {
          nombre: admin.dataValues.nombre,
          email: admin.dataValues.email,
          tipo_administrador: admin.dataValues.tipo_administrador,
          token,
        },
      });
    }
    if (cliente && !admin) {
      const passwordValidClient = await bcrypt.compare(
        password,
        cliente.dataValues.password
      );
      if (!passwordValidClient) {
        return res.status(400).json({
          success: false,
          errors: ["La contraseña es incorrecta",]
        });
      }
      const token = jwt.sign(
        {
          id: cliente.dataValues.id,
          tipoUsuario: cliente.dataValues.tipo_cliente,
        },
        process.env.SECRET_JWT as string
      );
      return res.json({
        success: true,
        data: {
          nombre: cliente.dataValues.nombre,
          email: cliente.dataValues.email,
          tipo_administrador: cliente.dataValues.tipo_cliente,
          token,
        },
      });
    }
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const getUserSession = async (req: Request, res: Response) => {
  try {
    const admin = await Administrador.findOne({
      where: { deleted: false, id: req.authData?.id },
      attributes: ["nombre", "email", "tipo_administrador"],
    });
    const cliente = await Cliente.findOne({
      where: { deleted: false, id: req.authData?.id },
      attributes: ["nombre", "email", "tipo_cliente"],
    });
    if (!admin && !cliente) {
      return res.status(404).json({
        msg: "No se encuentra el registro",
      });
    }
    if (admin && !cliente) {
      return res.json(admin.dataValues);
    }
    if (cliente && !admin) {
      return res.json({
        ...cliente.dataValues,
        tipo_administrador: cliente.dataValues.tipo_cliente,
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: "Ocurrió un error en el servidor",
    });
  }
};
