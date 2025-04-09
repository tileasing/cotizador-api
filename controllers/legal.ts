import { Request, Response } from "express";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import { Cliente, Cliente_Arrendamiento } from "../models";
import {
  contratoValidator,
  legalValidator,
} from "../validators/legalValidator";
import { IUpdateContrato, IUpdateLegal } from "../interfaces/legalInterfaces";

export const getLegal = async (
  req: Request,
  res: Response<BaseResponseType>
) => {
  try {
    const legalCli = await Cliente_Arrendamiento.findAll({
      where: { estado: "Aprobado" },
      attributes: ["id", "cliente_id", "pago_inicial"],
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
      data: { legalCli },
    });
  } catch (error) {
    const err = error as Error;
    return res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const updateLegal = async (
  req: Request<{}, {}, IUpdateLegal>,
  res: Response<BaseResponseType>
) => {
  try {
    const { pago_inicial, id } = await legalValidator.validate(req.body);
    const legal = await Cliente_Arrendamiento.findOne({
      where: { id },
    });
    if (!legal)
      return res
        .status(400)
        .json({ success: false, errors: ["Ha ocurrido un error inesperado"] });
    await legal.update({
      pago_inicial,
      entrega_unidad: "En proceso",
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

export const getContrato = async (
  req: Request<{}, {}, { cliente_id: string }>,
  res: Response<BaseResponseType>
) => {
  try {
    const { cliente_id } = req.body;
    const contrato = await Cliente_Arrendamiento.findOne({
      where: { estado: "Aprobado", firma_contrato: "Aprobado", cliente_id },
      attributes: ["id", "cliente_id", "pago_inicial", "path_contrato_firmado"],
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
      data: { contrato },
    });
  } catch (error) {
    const err = error as Error;
    return res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const updateContrato = async (
  req: Request<{}, {}, IUpdateContrato>,
  res: Response<BaseResponseType>
) => {
  try {
    const { id, contrato_firmado: path_contrato_firmado } =
      await contratoValidator.validate(req.body);
    const contrato = await Cliente_Arrendamiento.findOne({
      where: { id },
    });
    if (!contrato)
      return res
        .status(400)
        .json({ success: false, errors: ["Ha ocurrido un error inesperado"] });
    await contrato.update({ path_contrato_firmado });
    return res.json({
      success: true,
      data: { msg: "El archivo se ha cargado con éxito" },
    });
  } catch (error) {
    const err = error as Error;
    return res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};
