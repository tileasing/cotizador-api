import { Request, Response } from "express";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import { tipoArchivoSearchValidator } from "../validators/tipoArchivoValidator";
import {
  tipoArchivoEditValidator,
  tipoArchivoValidator,
} from "../validators/tipoArchivoValidator";
import {
  ITipoArchivoCreate,
  ITipoArchivoUpdate,
} from "../interfaces/tipoArchivoInterface";
import { Administrador, Cliente, Documentos_Cliente_A, Tipo_Archivo, Tipo_Archivo_A } from "../models";

export const registerTipoArchivo = async (
  req: Request<{}, {}, ITipoArchivoCreate>,
  res: Response<BaseResponseType>
) => {
  try {
    const data = await tipoArchivoValidator.validate(req.body);
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
    const saveTipoActivo = await Tipo_Archivo.create({
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
  req: Request<{}, {}, ITipoArchivoUpdate>,
  res: Response<BaseResponseType>
) => {
  try {
    const { tipo_archivo, regimen_fiscal, id } =
      await tipoArchivoEditValidator.validate(req.body);
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
    const updatedRow = await Tipo_Archivo.update(
      {
        tipo_archivo,
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

export const getTipoArchivo = async (
  req: Request<{}, {}, { regimen_fiscal: string }>,
  res: Response<BaseResponseType>
) => {
  try {
    const { regimen_fiscal } = await tipoArchivoSearchValidator.validate(
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
    const { count } = await Tipo_Archivo_A.findAndCountAll({
      where: {
        regimen_fiscal,
      },
    });
    const count_doc = await Documentos_Cliente_A.findAndCountAll({
      where: { cliente_id: req.authData?.id, estado: "Aceptado" },
    });
    if (count_doc.count < count)
      return res.json({
        success: false,
        errors: ["Por favor completa los pre requisitos"],
      });
    const archivos = await Tipo_Archivo.findAll({
      where: {
        regimen_fiscal,
      },
      attributes: [
        "id",
        "tipo_archivo",
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

export const getAllTipoArchivo = async (
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
    const archivos = await Tipo_Archivo.findAll({
      attributes: ["id", "tipo_archivo", "regimen_fiscal", "requerido"],
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

export const updateIsRequired = async (
  req: Request<{}, {}, { id: number; requerido: boolean }>,
  res: Response<BaseResponseType>
) => {
  try {
    const { id, requerido } = req.body;
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
    const tipo_archivo = await Tipo_Archivo.findOne({
      where: { id },
    });
    if (!tipo_archivo)
      return res
        .status(400)
        .json({ success: false, errors: ["Ha ocurrido un error"] });
    await tipo_archivo.update({ requerido });
    return res.json({
      success: true,
      data: { msg: "Se ha actualizado con éxito" },
    });
  } catch (error) {
    const err = error as Error;
    return res.status(400).json({ success: false, errors: [err.message] });
  }
};
