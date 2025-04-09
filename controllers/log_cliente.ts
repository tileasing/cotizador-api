import { Request, Response } from "express";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import { col, fn } from "sequelize";
import { Administrador, Cliente, LogCliente } from "../models";

export const getLogsClienteByAdmins = async (
  req: Request,
  res: Response<BaseResponseType>
) => {
  try {
    const adminExist = await Administrador.findOne({
      where: { id: req.authData?.id },
    });
    if (!adminExist) {
      return res.json({ success: false, errors: ["No estás autorizado"] });
    }

    const logs = await LogCliente.findAll({
      attributes: [
        "cliente_id",
        [fn("MAX", col("Cliente.nombre")), "nombre_cliente"],
      ],
      include: [
        {
          model: Cliente,
          attributes: [],
        },
      ],
      group: ["cliente_id"],
      raw: true, // Obtener resultados en formato JSON
    });

    return res.json({ success: true, data: { logs } });
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    return res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const getLogsClienteSpecByAdmins = async (
  req: Request<{}, {}, { cliente_id: string }>,
  res: Response<BaseResponseType>
) => {
  try {
    const { cliente_id } = req.body;
    const adminExist = await Administrador.findOne({
      where: { id: req.authData?.id },
    });
    if (!adminExist) {
      return res.json({ success: false, errors: ["No estás autorizado"] });
    }

    const logs = await LogCliente.findAll({
      attributes: [
        "cliente_id",
        [fn("MAX", col("Cliente.nombre")), "nombre_cliente"],
        [fn("COUNT", col("tipo")), "count_tipo"],
        "tipo",
      ],
      include: [
        {
          model: Cliente,
          attributes: [],
          where: {
            id: cliente_id,
          },
        },
      ],
      group: ["cliente_id", "tipo"],
      raw: true, // Obtener resultados en formato JSON
    });

    return res.json({ success: true, data: { logs } });
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    return res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const getLogsSpecificsType = async (
  req: Request<{}, {}, { cliente_id: string; tipo: string }>,
  res: Response<BaseResponseType>
) => {
  try {
    const { cliente_id, tipo } = req.body;

    const adminExist = await Administrador.findOne({
      where: { id: req.authData?.id },
    });
    if (!adminExist) {
      return res.json({ success: false, errors: ["No estás autorizado"] });
    }

    const logs = await LogCliente.findAll({
      attributes: ["id", "cliente_id", "fecha", "tipo", "new_register"],
      where: { tipo },
      order: [["id", "ASC"]],
      include: [
        {
          model: Cliente,
          attributes: [],
          where: {
            id: cliente_id,
          },
        },
      ],
    });
    return res.json({ success: true, data: { logs } });
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    return res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};
