import { Request, Response } from "express";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import { col, fn } from "sequelize";
import { Administrador, Cliente, Log } from "../models";

export const getLogsByAdmins = async (
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

    const logs = await Log.findAll({
      attributes: [
        "administrador_id",
        [fn("MAX", col("Administrador.nombre")), "nombre_administrador"],
      ],
      include: [
        {
          model: Administrador,
          attributes: [],
        },
      ],
      group: ["administrador_id"],
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

export const getLogsSpecificByAdmins = async (
  req: Request<{}, {}, { administrador_id: string }>,
  res: Response<BaseResponseType>
) => {
  try {
    const { administrador_id } = req.body;
    const adminExist = await Administrador.findOne({
      where: { id: req.authData?.id },
    });
    if (!adminExist) {
      return res.json({ success: false, errors: ["No estás autorizado"] });
    }

    const logs = await Log.findAll({
      attributes: [
        "administrador_id",
        [fn("MAX", col("Administrador.nombre")), "nombre_administrador"],
        [fn("COUNT", col("tipo")), "count_tipo"],
        "tipo",
      ],
      include: [
        {
          model: Administrador,
          attributes: [],
          where: {
            id: administrador_id,
          },
        },
      ],
      group: ["administrador_id", "tipo"],
      raw: true, // Obtener resultados en formato JSON
    });

    const clientes = await Cliente.findAll({
      where: {
        who_created: administrador_id,
      },
      attributes: ["nombre", "createdAt"],
      include: [
        {
          model: Administrador,
          as: "administrador_id",
          attributes: ["nombre", "id"],
        },
      ],
    });
    // if (!clientes || clientes.length <= 0 || !logs || logs.length<=0)
    //   return res.status(400).json({
    //     success: false,
    //     data: { msg: "Ha ocurrido un error en la obtención del cliente" },
    //   });

    return res.json({ success: true, data: { logs, clientes } });
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
  req: Request<{}, {}, { administrador_id: string; tipo: string }>,
  res: Response<BaseResponseType>
) => {
  try {
    const { administrador_id, tipo } = req.body;

    const adminExist = await Administrador.findOne({
      where: { id: req.authData?.id },
    });
    if (!adminExist) {
      return res.json({ success: false, errors: ["No estás autorizado"] });
    }

    const logs = await Log.findAll({
      attributes: ["id", "administrador_id", "fecha", "tipo", "new_register"],
      where: { tipo },
      order: [["id", "ASC"]],
      include: [
        {
          model: Administrador,
          attributes: [],
          where: {
            id: administrador_id,
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
