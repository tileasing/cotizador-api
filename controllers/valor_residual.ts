import { Request, Response } from "express";
import {
  IDTOValorResidual,
  IDTOValorResidualUpdate,
} from "../interfaces/valorResidualInterfaces";
import { Op } from "sequelize";
import { Administrador, Valor_Residual } from "../models";

export const getValoresResiduales = async (req: Request, res: Response) => {
  try {
    const valoresResiduales = await Valor_Residual.findAll();
    return res.json({
      data: valoresResiduales,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Ocurrió un error en el servidor",
    });
  }
};

export const registerValoresResiduales = async (
  req: Request<{}, {}, IDTOValorResidual>,
  res: Response
) => {
  const { plazo, maximo, minimo } = req.body;
  try {
    const admin = await Administrador.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    if (!admin) {
      return res.status(404).json({
        msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
      });
    }
    const saveValorResidual = await Valor_Residual.create({
      plazo,
      minimo,
      maximo,
      who_created: admin.dataValues.id,
      when_created: new Date(),
      deleted: false,
    });
    if (!saveValorResidual) {
      return res.status(404).json({
        msg: "No se pudo crear el valor",
      });
    }
    return res.status(201).json({
      msg: "Registro del valor residual exitoso",
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const updateValoresResiduales = async (
  req: Request<{}, {}, IDTOValorResidualUpdate>,
  res: Response
) => {
  const { id, plazo, minimo, maximo } = req.body;
  try {
    const admin = await Administrador.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    if (!admin) {
      return res.status(404).json({
        msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
      });
    }
    const updatedRow = await Valor_Residual.update(
      {
        plazo,
        minimo,
        maximo,
        who_modified: admin.dataValues.email,
        when_modified: new Date(),
      },
      { where: { id } }
    );

    if (updatedRow[0] === 0) {
      return res.status(404).json({
        msg: `No se encontró la fila con el id ${id}`,
      });
    }
    return res.status(200).json({
      msg: "La fila se actualizó correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al actualizar la fila",
    });
  }
};

export const showValorValoresResiduales = async (
  req: Request,
  res: Response
) => {
  try {
    const valoresResiduales = await Valor_Residual.findAll({
      where: { deleted: false },
      attributes: ["id", "plazo", "minimo", "maximo"],
    });
    return res.json({
      data: valoresResiduales,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Ocurrió un error en el servidor",
    });
  }
};

export const testValoresResiduales = async (req: Request, res: Response) => {
  try {
    const admin = await Administrador.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    if (!admin) {
      return res.status(404).json({
        msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
      });
    }
    const tablaResidual = [
      {
        id: 0,
        plazo: 12,
        minimo: 5,
        maximo: 50,
      },
      {
        id: 1,
        plazo: 24,
        minimo: 5,
        maximo: 40,
      },
      {
        id: 2,
        plazo: 36,
        minimo: 5,
        maximo: 35,
      },
      {
        id: 3,
        plazo: 48,
        minimo: 5,
        maximo: 25,
      },
    ];
    for (const { plazo, minimo, maximo } of tablaResidual) {
      await Valor_Residual.create({
        plazo,
        minimo,
        maximo,
        who_created: admin.dataValues.email,
        when_created: new Date(),
        deleted: false,
      });
    }
    return res.json({
      msg: "Petición exitosa",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Ocurrió un error en el servidor",
    });
  }
};

export const residualByPlazo = async (req: Request, res: Response) => {
  try {
    const { plazo } = req.body;
    const valoresResiduales = await Valor_Residual.findOne({
      where: { plazo, deleted: false },
      attributes: ["id", "plazo", "minimo", "maximo"],
    });
    if (!valoresResiduales) {
      const valorResidual = await Valor_Residual.findOne({
        where: {
          plazo: { [Op.gt]: plazo },
          deleted: false,
        },
        order: [["plazo", "ASC"]],
        attributes: ["id", "plazo", "minimo", "maximo"],
      });
      if (!valorResidual) {
        return res.status(401).json({
          msg: "No se encontró un plazo adecuado",
        });
      }
      return res.json({
        valorResidual,
      });
    }
    return res.json({
      valoresResiduales,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Ha ocurrido un error en el servidor",
    });
  }
};
