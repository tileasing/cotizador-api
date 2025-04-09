import { Request, Response } from "express";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import {
  IDTOInversionFijaCreate,
  IDTOInversionFijaUpdate,
} from "../interfaces/inversionFija";
import {
  inversionFijaValidator,
  inversionFijaValidatorUpdate,
} from "../validators/inversionFijaValidator";
import { Administrador, Inversion_fija } from "../models";

export const getInvesionFija = async (
  req: Request,
  res: Response<BaseResponseType>
) => {
  try {
    const resp = await Inversion_fija.findAll();
    if (!resp) {
      return res.status(404).json({
        success: false,
        errors: ["No se encuenta respuesta"],
      });
    }
    return res.json({
      success: true,
      data: resp,
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

export const showInversionFija = async (
  req: Request,
  res: Response<BaseResponseType>
) => {
  try {
    const tasa_fija = await Inversion_fija.findAll({
      order: [["createdAt", "ASC"]],
      attributes: [
        "id",
        "minimo",
        "maximo",
        "rendimiento",
        "tasa_ce_olr",
        "tasa_agregada",
      ],
    });
    if (!tasa_fija) {
      return res.status(404).json({
        success: false,
        errors: ["No se han podido encontrar registros"],
      });
    }
    return res.json({
      success: true,
      data: {
        tasa_fija,
      },
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

export const registerInversionFija = async (
  req: Request<{}, {}, IDTOInversionFijaCreate>,
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
        data: {
          msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
        },
      });
    }
    const body = await inversionFijaValidator.validate(req.body);
    const resp = await Inversion_fija.create({
      ...body,
      who_created: admin.dataValues.email,
      when_created: new Date(),
    });
    if (!resp) {
      return res.json({
        success: false,
        errors: ["No se han podido registrar los valores"],
      });
    }
    return res.json({
      success: true,
      data: { msg: "Los valores de la inversión fija se han creado con exito" },
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

export const updateInversionFija = async (
  req: Request<{}, {}, IDTOInversionFijaUpdate>,
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
        data: {
          msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
        },
      });
    }
    const data = await inversionFijaValidatorUpdate.validate(req.body);
    const resp = await Inversion_fija.update(
      {
        ...data,
        who_modified: admin.dataValues.email,
        when_modified: new Date(),
      },
      { where: { id: req.body.id } }
    );
    if (!resp) {
      return res.status(404).json({
        success: false,
        errors: ["No se ha podido actualizar el registro"],
      });
    }
    return res.json({
      success: true,
      data: {
        msg: "Se ha actualizado con éxito",
      },
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

export const testInversionFija = async (req: Request, res: Response) => {
  const valores: IDTOInversionFijaCreate[] = [
    {
      minimo: 12,
      maximo: 24,
      rendimiento: 100,
      tasa_agregada: 1,
      tasa_ce_olr: 10,
    },
    {
      minimo: 25,
      maximo: 27,
      rendimiento: 110,
      tasa_agregada: 1,
      tasa_ce_olr: 10,
    },
    {
      minimo: 28,
      maximo: 35,
      rendimiento: 118,
      tasa_agregada: 1,
      tasa_ce_olr: 10,
    },
    {
      minimo: 36,
      maximo: 48,
      rendimiento: 125,
      tasa_agregada: 1,
      tasa_ce_olr: 10,
    },
  ];

  try {
    for (const {
      maximo,
      minimo,
      rendimiento,
      tasa_agregada,
      tasa_ce_olr,
    } of valores) {
      await Inversion_fija.create({
        maximo,
        minimo,
        rendimiento,
        tasa_agregada,
        tasa_ce_olr,
        who_created: "CODER",
        when_created: new Date(),
      });
    }
    return res.json({
      msg: "OK",
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
