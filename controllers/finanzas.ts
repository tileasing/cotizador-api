import { Request, Response } from "express";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import { Cliente, Cliente_Arrendamiento } from "../models";
import { finanzasValidator } from "../validators/finanzasValidator";
import { IUpdateFinanzas } from "../interfaces/finanzasInterfaces";

export const getFinanzas = async (
  req: Request,
  res: Response<BaseResponseType>
) => {
  try {
    const finanzas = await Cliente_Arrendamiento.findAll({
      where: { estado: "Aprobado" },
      attributes: [
        "id",
        "cliente_id",
        "pago_inicial",
        "path_factura_unidad",
        "path_orden_compra",
      ],
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
      data: { finanzas },
    });
  } catch (error) {
    const err = error as Error;
    return res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const updateFinanzas = async (
  req: Request<{}, {}, IUpdateFinanzas>,
  res: Response<BaseResponseType>
) => {
  try {
    const {
      // pago_inicial,
      id,
      orden_compra: path_orden_compra,
      factura_unidad: path_factura_unidad,
      tipo_pago,
    } = await finanzasValidator.validate(req.body);
    const finanzas = await Cliente_Arrendamiento.findOne({
      where: { id },
    });
    if (!finanzas)
      return res
        .status(400)
        .json({ success: false, errors: ["Ha ocurrido un error inesperado"] });
    await finanzas.update({
      // pago_inicial,
      path_orden_compra,
      path_factura_unidad,
      tipo_pago,
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
