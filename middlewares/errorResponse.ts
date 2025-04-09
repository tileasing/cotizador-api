import { NextFunction, Request, Response } from "express";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import { Administrador } from "../models";

export const errorAdmin = async (
  req: Request,
  res: Response<BaseResponseType>,
  next: NextFunction
) => {
  try {
    const admin = await Administrador.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    if (!admin) {
      return res.status(404).json({
        success: false,
        errors: [
          "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
        ],
      });
    }
    next();
  } catch (error) {
    const err = error as Error;
    return res.json({ success: false, errors: [err.message] });
  }
};
