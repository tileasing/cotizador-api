import { Request, Response } from "express";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import { Cliente, Cliente_Arrendamiento } from "../models";
import { adminContratoValidator } from "../validators/adminContratoValidator";
import { IUpdateAdminContrato } from "../interfaces/adminContratoInterface";

export const getClientAdminContr = async (
  req: Request,
  res: Response<BaseResponseType>
) => {
  try {
    const administrador_contrato = await Cliente_Arrendamiento.findAll({
      where: { estado: "Aprobado" },
      attributes: ["id", "cliente_id", "firma_contrato"],
      include: [
        {
          model: Cliente,
          as: "cliente",
          attributes: ["nombre", "regimen_fiscal"],
        },
      ],
    });
    return res.json({
      success: true,
      data: { administrador_contrato },
    });
  } catch (error) {
    const err = error as Error;
    return res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const updateClientAdminContr = async (
  req: Request<{}, {}, IUpdateAdminContrato>,
  res: Response<BaseResponseType>
) => {
  try {
    const { firma_contrato, id } = await adminContratoValidator.validate(
      req.body
    );
    const administrador_contrato = await Cliente_Arrendamiento.findOne({
      where: { id },
    });
    if (!administrador_contrato)
      return res
        .status(400)
        .json({ success: false, errors: ["Ha ocurrido un error inesperado"] });
    await administrador_contrato.update({
      firma_contrato,
      pago_inicial: "En proceso",
    });
    return res.json({
      success: true,
      data: { msg: "Se ha actualizo el estatus con éxito" },
    });
  } catch (error) {
    const err = error as Error;
    return res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};
