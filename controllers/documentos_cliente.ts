import { Request, Response } from "express";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import {
  AorDeclineValidator,
  documentsClientValidator,
  updateDocsClientValidator,
} from "../validators/documentosClienteValidator";
import {
  IAOrDDocumentClient,
  ICreateDocumentClient,
  IUpdateDocumentClient,
} from "../interfaces/documentosCliente";
import { Op } from "sequelize";
import { Administrador, Cliente, Documentos_Cliente, Tipo_Archivo } from "../models";

export const addDocument = async (
  req: Request<{}, {}, ICreateDocumentClient>,
  res: Response<BaseResponseType>
) => {
  try {
    const data = await documentsClientValidator.validate(req.body);
    const searchArchivo = await Tipo_Archivo.findOne({
      where: {
        tipo_archivo: data.tipo_archivo,
      },
      attributes: ["id"],
    });
    const tipo_archivo_id = searchArchivo?.dataValues.id;
    const cliente = await Cliente.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    if (!cliente) {
      return res.status(404).json({
        success: false,
        errors: [
          "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
        ],
      });
    }
    await Documentos_Cliente.create({
      ...data,
      cliente_id: cliente.dataValues.id,
      tipo_archivo_id,
      who_created: cliente.dataValues.email,
      when_created: new Date(),
    });
    // console.log(data);
    return res.status(201).json({
      success: true,
      data: { msg: "Registro del archivo exitoso", data },
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

export const getDocuments = async (
  req: Request<{}, {}, {}>,
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
    const client = await Cliente.findAll({
      include: [
        {
          model: Documentos_Cliente,
          as: "documentos",
          attributes: ["id", "estado", "informacion", "path"],
          include: [
            {
              model: Tipo_Archivo,
              as: "tipo_archivo",
              attributes: ["tipo_archivo", "regimen_fiscal"],
            },
          ],
        },
      ],
      attributes: ["id", "nombre"],
      where: {
        // Esta condición excluye clientes sin documentos
        "$documentos.id$": { [Op.ne]: null },
      },
    });
    if (!client) {
      return res.status(404).json({
        success: false,
        errors: ["No se encontraron documentos"],
      });
    }
    return res.status(201).json({
      success: true,
      data: { client },
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

const attributes = [
  "id",
  "estado",
  "informacion",
  "path",
  "tipo_archivo_id",
  "cliente_id",
];

export const getUpdateFiles = async (
  req: Request,
  res: Response<BaseResponseType>
) => {
  try {
    await Cliente.findAll({
      where: { id: req.authData?.id },
    });
    const cliente_id = req.authData?.id;
    const docs = await Documentos_Cliente.findAll({
      where: { cliente_id },
      attributes,
      include: [
        {
          model: Tipo_Archivo,
          as: "tipo_archivo",
          attributes: ["tipo_archivo", "regimen_fiscal"],
        },
      ],
    });
    return res.json({ success: true, data: { docs } });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const updateDocument = async (
  req: Request<{}, {}, IUpdateDocumentClient>,
  res: Response<BaseResponseType>
) => {
  try {
    // console.log(req.body);
    const data = await updateDocsClientValidator.validate(req.body);
    const cliente = await Cliente.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    const updatedRow = await Documentos_Cliente.update(
      {
        ...data,
        who_modified: cliente?.dataValues.email,
        when_modified: new Date(),
      },
      { where: { id: req.body.id } }
    );
    if (updatedRow[0] === 0) {
      return res.status(404).json({
        success: false,
        errors: [`No se encontró la fila con el registro`],
      });
    }
    return res.status(201).json({
      success: true,
      data: { msg: "Actualización del archivo exitoso" },
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

export const acceptOrDecline = async (
  req: Request<{}, {}, IAOrDDocumentClient>,
  res: Response<BaseResponseType>
) => {
  try {
    // console.log(req.body);
    const data = await AorDeclineValidator.validate(req.body);
    const admin = await Administrador.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    const updatedRow = await Documentos_Cliente.update(
      {
        ...data,
        who_modified: admin?.dataValues.email,
        when_modified: new Date(),
      },
      { where: { id: data.id } }
    );
    if (updatedRow[0] === 0) {
      return res.status(404).json({
        success: false,
        errors: [`No se encontró la fila con el registro`],
      });
    }
    return res.status(201).json({
      success: true,
      data,
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
