import { Request, Response } from "express";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import {
  tipoArchivoAEditValidator,
  tipoArchivoASearchValidator,
  tipoArchivoAValidator,
} from "../validators/tipoArchivoAValidator";
import {
  ITipoArchivoACreate,
  ITipoArchivoAUpdate,
} from "../interfaces/tipoArchivoAInterfaces";
import { Administrador, Cliente, Tipo_Archivo_A } from "../models";

export const getTipoArchivoA = async (
  req: Request,
  res: Response<BaseResponseType>
) => {
  try {
    const { regimen_fiscal } = await tipoArchivoASearchValidator.validate(
      req.body
    );

    const client = await Cliente.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    if (!client) {
      return res.status(404).json({
        success: false,
        errors: [
          "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
        ],
      });
    }
    const archivos = await Tipo_Archivo_A.findAll({
      where: {
        regimen_fiscal,
      },
      attributes: [
        "id",
        "tipo_archivo_a",
        "regimen_fiscal",
        "descripcion_archivo",
      ],
    });
    return res.json({
      success: true,
      data: { archivos },
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

export const getAllTipoArchivoA = async (
  req: Request,
  res: Response<BaseResponseType>
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
    const archivos = await Tipo_Archivo_A.findAll({
      attributes: ["id", "tipo_archivo_a", "regimen_fiscal"],
    });
    return res.json({
      success: true,
      data: { archivos },
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

export const registerTipoArchivoA = async (
  req: Request<{}, {}, ITipoArchivoACreate>,
  res: Response<BaseResponseType>
) => {
  try {
    const data = await tipoArchivoAValidator.validate(req.body);
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
    const saveTipoActivo = await Tipo_Archivo_A.create({
      ...data,
      who_created: admin.dataValues.email,
      when_created: new Date(),
      deleted: false,
    });
    if (!saveTipoActivo) {
      return res.status(404).json({
        success: false,
        errors: ["No se pudo crear el valor"],
      });
    }
    return res.status(201).json({
      success: true,
      data: { msg: "Registro del archivo exitoso" },
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

export const updateTipoArchivo = async (
  req: Request<{}, {}, ITipoArchivoAUpdate>,
  res: Response<BaseResponseType>
) => {
  try {
    const { tipo_archivo_a, regimen_fiscal, id } =
      await tipoArchivoAEditValidator.validate(req.body);
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
    const updatedRow = await Tipo_Archivo_A.update(
      {
        tipo_archivo_a,
        regimen_fiscal,
        who_modified: admin.dataValues.email,
        when_modified: new Date(),
      },
      { where: { id } }
    );

    if (updatedRow[0] === 0) {
      return res.status(404).json({
        success: false,
        errors: [`No se encontró la fila con el id ${id}`],
      });
    }
    return res.status(200).json({
      success: true,
      data: { msg: "Se actualizó correctamente" },
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
