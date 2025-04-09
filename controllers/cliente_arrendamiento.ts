import { Request, Response } from "express";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import {
  ICreateClienteArrend,
  IGetClienteArrend,
} from "../interfaces/clienteArrendamiento";
import {
  clientArrendValidator,
  getClientArrandValidator,
} from "../validators/clienteArrendamiento";
import { Administrador, Cliente, Cliente_Arrendamiento } from "../models";

export const getClientArrend = async (
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
    const arrend = await Cliente_Arrendamiento.findAll({});
    return res.json({
      success: true,
      data: { arrend },
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

export const updateClientArrend = async (
  req: Request<{}, {}, ICreateClienteArrend>,
  res: Response<BaseResponseType>
) => {
  try {
    const body = await clientArrendValidator.validate(req.body);
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
    const cliente = await Cliente.findOne({
      where: {
        id: body.cliente_id,
      },
    });
    if (!cliente) {
      return res.json({
        success: false,
        errors: ["No se ha encontrado el cliente"],
      });
    }
    await Cliente_Arrendamiento.create({
      ...body,
      analisis_riesgo: body.estado === "Aprobado" ? true : false,
      firma_contrato: body.estado === "Aprobado" ? "En proceso" : null,
      who_created: admin.dataValues.email,
      when_created: new Date(),
    });
    if (body.estado === "Rechazado") {
      return res.json({
        success: false,
        errors: [`${cliente.dataValues.nombre} ha sido rechazado`],
      });
    }
    return res.json({
      success: true,
      data: { msg: "El cliente ha sido aprobado" },
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

export const clientArrendExist = async (
  req: Request<{}, {}, IGetClienteArrend>,
  res: Response<BaseResponseType>
) => {
  try {
    const { cliente_id } = await getClientArrandValidator.validate(req.body);
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
    const clientExist = await Cliente_Arrendamiento.findOne({
      where: {
        cliente_id,
      },
    });
    if (!clientExist) {
      return res.json({
        success: false,
        errors: ["No se encuentra registro de cliente"],
      });
    }
    return res.json({
      success: true,
      data: {
        msg:
          !!clientExist === true &&
          clientExist.dataValues.estado === "Rechazado"
            ? "El cliente ya ha sido RECHAZADO"
            : "El cliente fue APROBADO",
        exist: !!clientExist,
      },
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

// PARA EL CLIENTE
export const stateClient = async (
  req: Request<{}, {}, {}>,
  res: Response<BaseResponseType>
) => {
  try {
    const client = await Cliente.findOne({
      where: {
        id: req.authData?.id,
      },
      attributes: ["nombre"],
      include: [
        {
          model: Cliente_Arrendamiento,
          as: "cliente_arrendamiento",
          attributes: ["firma_contrato", "pago_inicial", "entrega_unidad"], // Reemplaza con los campos que deseas traer
          where: {
            estado: "Aprobado", // Reemplaza con la condición que deseas aplicar
          },
        },
      ],
    });
    if (!client)
      return res.json({
        success: false,
        errors: ["Por el momento no hay un arrendamiento disponible"],
      });
    const cliente_arren = client.dataValues;
    return res.json({
      success: true,
      data: { ...cliente_arren },
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};
