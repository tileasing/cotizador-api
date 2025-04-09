import { Request, Response } from "express";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import { Cliente, Cliente_Arrendamiento } from "../models";
import { IUpdateGestoria } from "../interfaces/gestoriaInterfaces";
import { gestoriaValidator } from "../validators/gestoriaValidator";

export const getGestoria = async (
  req: Request,
  res: Response<BaseResponseType>
) => {
  try {
    const gestoriaCli = await Cliente_Arrendamiento.findAll({
      where: { estado: "Aprobado" },
      attributes: ["id", "cliente_id", "entrega_unidad"],
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
      data: { gestoriaCli },
    });
  } catch (error) {
    const err = error as Error;
    return res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const updateGestoria = async (
  req: Request<{}, {}, IUpdateGestoria>,
  res: Response<BaseResponseType>
) => {
  try {
    const { entrega_unidad, id } = await gestoriaValidator.validate(req.body);
    const legal = await Cliente_Arrendamiento.findOne({
      where: { id },
    });
    if (!legal)
      return res
        .status(400)
        .json({ success: false, errors: ["Ha ocurrido un error inesperado"] });
    await legal.update({ entrega_unidad });
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
