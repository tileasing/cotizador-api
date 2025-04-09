import { Request, Response } from "express";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import {
  IDTOInversionAmortizableCreate,
  IDTOInversionAmortizableUpdate,
} from "../interfaces/inversionAmortizable";
import {
  inversionAmortizableValidator,
  inversionAmortizableValidatorUpdate,
} from "../validators/inversionAmortizableValidator";
import { Administrador, Inversion_amortizable } from "../models";

export const getInvesionAmortizable = async (
  req: Request,
  res: Response<BaseResponseType>
) => {
  try {
    const resp = await Inversion_amortizable.findAll();
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

export const showInversionAmortizable = async (
  req: Request,
  res: Response<BaseResponseType>
) => {
  try {
    const tasa_amortizable = await Inversion_amortizable.findAll({
      order: [["createdAt", "ASC"]],
      attributes: ["id", "minimo", "maximo", "tasa"],
    });
    if (!tasa_amortizable) {
      return res.status(404).json({
        success: false,
        errors: ["No se han podido encontrar registros"],
      });
    }
    return res.json({
      success: true,
      data: { tasa_amortizable },
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

export const registerInversionAmortizable = async (
  req: Request<{}, {}, IDTOInversionAmortizableCreate>,
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
    const body = await inversionAmortizableValidator.validate(req.body);
    const resp = await Inversion_amortizable.create({
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
      data: {
        msg: "Los valores de la inversión amortizable se han creado con exito",
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

export const updateInversionAmortizable = async (
  req: Request<{}, {}, IDTOInversionAmortizableUpdate>,
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
    const data = await inversionAmortizableValidatorUpdate.validate(req.body);
    const resp = await Inversion_amortizable.update(
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

export const testInversionAmortizable = async (req: Request, res: Response) => {
  const valores: IDTOInversionAmortizableCreate[] = [
    {
      minimo: 12,
      maximo: 24,
      tasa: 14,
    },
    {
      minimo: 25,
      maximo: 27,
      tasa: 16,
    },
    {
      minimo: 28,
      maximo: 35,
      tasa: 17,
    },
    {
      minimo: 36,
      maximo: 48,
      tasa: 18,
    },
  ];

  try {
    for (const { maximo, minimo, tasa } of valores) {
      await Inversion_amortizable.create({
        maximo,
        minimo,
        tasa,
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
