import { BaseResponseType } from "../interfaces/BaseResponseType";
import { Request, Response } from "express";
import { Op } from "sequelize";
import {
  IAOrDDocumentClientA,
  ICreateDocumentClientA,
  IDocsA,
  IUpdateDocumentClientA,
} from "../interfaces/documentosClienteA";
import {
  AorDeclineAValidator,
  documentsClientAValidator,
  updateDocsClientAValidator,
} from "../validators/documentosClienteAValidator";
import { sendWarningPreReq } from "../services/avisosServices";
import {
  Administrador,
  Cliente,
  Documentos_Cliente,
  Documentos_Cliente_A,
  Tipo_Archivo,
  Tipo_Archivo_A,
} from "../models";

export const addDocument = async (
  req: Request<{}, {}, ICreateDocumentClientA>,
  res: Response<BaseResponseType>
) => {
  try {
    const data = await documentsClientAValidator.validate(req.body);
    const searchArchivo = await Tipo_Archivo_A.findOne({
      where: {
        tipo_archivo_a: data.tipo_archivo_a,
      },
      attributes: ["id"],
    });
    const tipo_archivo_a_id = searchArchivo?.dataValues.id;
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
    await Documentos_Cliente_A.create({
      ...data,
      cliente_id: cliente.dataValues.id,
      tipo_archivo_a_id,
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
          model: Documentos_Cliente_A,
          as: "documentos_a",
          attributes: ["id", "estado", "informacion", "path"],
          include: [
            {
              model: Tipo_Archivo_A,
              as: "tipo_archivo_a",
              attributes: ["tipo_archivo_a", "regimen_fiscal"],
            },
          ],
        },
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
          required: false, // Hace que la inclusión de Documentos_Cliente sea opcional
          where: {
            estado: "Aceptado",
          },
        },
      ],
      attributes: ["id", "nombre"],
      where: {
        // Esta condición excluye clientes sin documentos
        [Op.or]: [
          { "$documentos_a.id$": { [Op.ne]: null } },
          { "$documentos.id$": { [Op.ne]: null } },
        ],
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
  "tipo_archivo_a_id",
  "cliente_id",
];

export const getUpdateFiles = async (
  req: Request,
  res: Response<BaseResponseType>
) => {
  try {
    const cliente = await Cliente.findOne({
      where: { id: req.authData?.id },
    });
    if (!cliente)
      return res
        .status(400)
        .json({ success: false, errors: ["Error al obtener el cliente"] });
    const cliente_id = req.authData?.id;
    const docs = await Documentos_Cliente_A.findAll({
      where: { cliente_id },
      attributes,
      include: [
        {
          model: Tipo_Archivo_A,
          as: "tipo_archivo_a",
          attributes: ["tipo_archivo_a", "regimen_fiscal"],
        },
      ],
    });
    const { count } = await Tipo_Archivo_A.findAndCountAll({
      where: {
        regimen_fiscal: cliente?.dataValues.regimen_fiscal,
      },
    });
    return res.json({ success: true, data: { docs, count } });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const updateDocument = async (
  req: Request<{}, {}, IUpdateDocumentClientA>,
  res: Response<BaseResponseType>
) => {
  try {
    // console.log(req.body);
    const data = await updateDocsClientAValidator.validate(req.body);
    const cliente = await Cliente.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    const updatedRow = await Documentos_Cliente_A.update(
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
  req: Request<{}, {}, IAOrDDocumentClientA>,
  res: Response<BaseResponseType>
) => {
  try {
    // console.log(req.body);
    const data = await AorDeclineAValidator.validate(req.body);
    const admin = await Administrador.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    const updatedRow = await Documentos_Cliente_A.update(
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

export const aceptAllDocs = async (
  req: Request<{}, {}, IDocsA>,
  res: Response<BaseResponseType>
) => {
  const { idClient, estado, mensaje } = req.body;
  try {
    const admin = await Administrador.findOne({
      where: { id: req.authData?.id },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        errors: [
          "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
        ],
      });
    }

    const client = await Cliente.findOne({
      where: { id: idClient },
      attributes: ["nombre", "regimen_fiscal", "email"],
    });

    const documents = await Documentos_Cliente.count({
      where: {
        cliente_id: idClient,
        estado: "Aceptado",
      },
    });

    const documents_a = await Documentos_Cliente_A.count({
      where: {
        cliente_id: idClient,
        estado: "Aceptado",
      },
    });

    const tipo = await Tipo_Archivo.count({
      where: {
        regimen_fiscal: client?.dataValues.regimen_fiscal,
        requerido: true,
      },
    });

    const tipo_a = await Tipo_Archivo_A.count({
      where: { regimen_fiscal: client?.dataValues.regimen_fiscal },
    });
    // TODO Revisar condicional
    if (documents <= tipo || documents_a < tipo_a || estado === "Rechazado") {
      return res.json({
        success: false,
        errors: [
          estado === "Rechazado"
            ? "Ha sido rechazado con éxito"
            : "Documentos incompletos",
        ],
      });
    }

    await sendWarningPreReq({
      emailTo: client?.dataValues.email,
      nombre: client?.dataValues.nombre,
    });

    return res.json({
      success: true,
      data: { msg: "Éxito" },
    });
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    return res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};
