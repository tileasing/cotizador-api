import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import {
  IDTOGetTasasByTipoActivo,
  IDTOValorTasas,
  IDTOValorTasasUpdate,
} from "../interfaces/valorTasasInterfaces";
import { Administrador, Valor_Tasas } from "../models";

export const getValoresTasas = async (req: Request, res: Response) => {
  try {
    const valoresTasas = await Valor_Tasas.findAll();
    return res.json({
      data: valoresTasas,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Ocurrió un error en el servidor",
    });
  }
};

export const getTasasByTipoActivoPaginate = async (
  req: Request<IDTOGetTasasByTipoActivo>,
  res: Response
) => {
  try {
    const { tipo_activo } = req.body;
    const page = parseInt(req.body.page as string) || 1; // obtener el número de página desde la consulta
    const limit = parseInt(req.body.limit as string) || 10; // obtener el límite de resultados desde la consulta

    const offset = (page - 1) * limit;

    const { count, rows } = await Valor_Tasas.findAndCountAll({
      where: {
        tipo_activo: {
          [Op.like]: `%${tipo_activo}%`,
        },
      },
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit); // calcular el número total de páginas

    return res.status(200).json({
      dataTasas: rows,
      page,
      totalPages,
      totalResults: count,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error en el servidor",
    });
  }
};

export const registerValoresTasa = async (
  req: Request<{}, {}, IDTOValorTasas>,
  res: Response
) => {
  const {
    plazo,
    tipo_activo,
    tasa_a,
    tasa_b,
    tasa_alfa,
    tasa_beta,
    tasa_gamma,
  } = req.body;
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
    const saveValorTasas = await Valor_Tasas.create({
      plazo,
      tipo_activo,
      tasa_a,
      tasa_b,
      tasa_alfa,
      tasa_beta,
      tasa_gamma,
      who_created: admin.dataValues.email,
      when_created: new Date(),
    });
    if (!saveValorTasas) {
      return res.status(404).json({
        msg: "No se pudo crear el valor",
      });
    }
    return res.status(201).json({
      msg: "Registro del valor de la tasa exitoso",
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
};

export const getTasasByTipoActivo = async (
  req: Request<{ tipo_activo: string }>,
  res: Response
) => {
  const { tipo_activo } = req.params;
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
    const rows = await Valor_Tasas.findAll({
      where: {
        tipo_activo: {
          [Op.like]: `%${tipo_activo}%`,
        },
      },
      attributes: [
        "id",
        "plazo",
        "tasa_a",
        "tasa_b",
        "tasa_alfa",
        "tasa_beta",
        "tasa_gamma",
      ], // Solo obtener las columnas que deseas mostrar
    });
    return res.status(200).json({
      tipo_activo,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error en el servidor",
    });
  }
};

export const getAllTipoTasa = async (req: Request, res: Response) => {
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
    const tipoActivo = await Valor_Tasas.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("tipo_activo")), "tipo_activo"],
      ],
    });
    if (!tipoActivo) {
      return res.status(404).json({
        msg: "No hay respuesta",
      });
    }
    return res.status(200).json({ data: tipoActivo });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al actualizar la fila",
    });
  }
};

export const updateTasas = async (
  req: Request<{}, {}, IDTOValorTasasUpdate>,
  res: Response
) => {
  const { id, tasa_a, tasa_b, tasa_alfa, tasa_beta, tasa_gamma } = req.body;
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
    const updatedRow = await Valor_Tasas.update(
      {
        tasa_a,
        tasa_b,
        tasa_alfa,
        tasa_beta,
        tasa_gamma,
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

export const testValoresTasas = async (req: Request, res: Response) => {
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
    const tablaTasas = [
      {
        plazo: 12,
        planA: 32,
        planB: 33,
        alfa: 34,
        beta: 35,
        gamma: 36,
      },
      {
        plazo: 24,
        planA: 32,
        planB: 33,
        alfa: 34,
        beta: 35,
        gamma: 36,
      },
      {
        plazo: 36,
        planA: 32,
        planB: 33,
        alfa: 34,
        beta: 35,
        gamma: 36,
      },
      {
        plazo: 48,
        planA: 32,
        planB: 33,
        alfa: 34,
        beta: 35,
        gamma: 36,
      },
    ];
    for (const { plazo, alfa, beta, gamma, planA, planB } of tablaTasas) {
      await Valor_Tasas.create({
        tipo_activo: "Autos",
        plazo,
        tasa_a: planA,
        tasa_b: planB,
        tasa_alfa: alfa,
        tasa_beta: beta,
        tasa_gamma: gamma,
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

export const testValoresTasasTracto = async (req: Request, res: Response) => {
  try {
    console.log("En peticion");
    const admin = await Administrador.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    console.log("El amdin es", admin);
    if (!admin) {
      return res.status(404).json({
        msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
      });
    }
    const tablaTasas = [
      {
        plazo: 12,
        planA: 34,
        planB: 35,
        alfa: 36,
        beta: 37,
        gamma: 38,
      },
      {
        plazo: 24,
        planA: 34,
        planB: 35,
        alfa: 36,
        beta: 37,
        gamma: 38,
      },
      {
        plazo: 36,
        planA: 34,
        planB: 35,
        alfa: 36,
        beta: 37,
        gamma: 38,
      },
      {
        plazo: 48,
        planA: 34,
        planB: 35,
        alfa: 36,
        beta: 37,
        gamma: 38,
      },
    ];
    for (const { plazo, alfa, beta, gamma, planA, planB } of tablaTasas) {
      await Valor_Tasas.create({
        tipo_activo: "Tracto Camion",
        plazo,
        tasa_a: planA,
        tasa_b: planB,
        tasa_alfa: alfa,
        tasa_beta: beta,
        tasa_gamma: gamma,
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

export const testValoresTasasBici = async (req: Request, res: Response) => {
  try {
    console.log("En peticion");
    const admin = await Administrador.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    console.log("El amdin es", admin);
    if (!admin) {
      return res.status(404).json({
        msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
      });
    }
    const tablaTasas = [
      {
        plazo: 12,
        planA: 0,
        planB: 0,
        alfa: 0,
        beta: 0,
        gamma: 0,
      },
    ];
    for (const { plazo, alfa, beta, gamma, planA, planB } of tablaTasas) {
      await Valor_Tasas.create({
        tipo_activo: "Bicicletas",
        plazo,
        tasa_a: planA,
        tasa_b: planB,
        tasa_alfa: alfa,
        tasa_beta: beta,
        tasa_gamma: gamma,
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

export const testValoresTasasMoto = async (req: Request, res: Response) => {
  try {
    console.log("En peticion");
    const admin = await Administrador.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    console.log("El amdin es", admin);
    if (!admin) {
      return res.status(404).json({
        msg: "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
      });
    }
    const tablaTasas = [
      {
        plazo: 12,
        tasa_a: 45,
        tasa_b: 45,
        tasa_alfa: 45,
        tasa_beta: 45,
        tasa_gamma: 45,
      },
      {
        plazo: 24,
        tasa_a: 45,
        tasa_b: 45,
        tasa_alfa: 45,
        tasa_beta: 45,
        tasa_gamma: 45,
      },
    ];
    for (const {
      plazo,
      tasa_a,
      tasa_b,
      tasa_alfa,
      tasa_beta,
      tasa_gamma,
    } of tablaTasas) {
      await Valor_Tasas.create({
        tipo_activo: "Motocicleta",
        plazo,
        tasa_a,
        tasa_b,
        tasa_alfa,
        tasa_beta,
        tasa_gamma,
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
