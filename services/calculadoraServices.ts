import { Op } from "sequelize";
import { Inversion_amortizable } from "../models/inversion_amortizable";
import { Inversion_fija } from "../models/inversion_fija";

export const getvaluesCalculadoraAmortizable = async (plazo: number) => {
  const valores = await Inversion_amortizable.findOne({
    where: {
      minimo: {
        [Op.lte]: plazo,
      },
      maximo: {
        [Op.gte]: plazo,
      },
    },
    attributes: ["minimo", "maximo", "tasa"],
  });
  return valores?.dataValues.tasa;
};

export const getvaluesCalculadoraFija = async (plazo: number) => {
  const valores = await Inversion_fija.findOne({
    where: {
      minimo: {
        [Op.lte]: plazo,
      },
      maximo: {
        [Op.gte]: plazo,
      },
    },
    attributes: ["rendimiento", "tasa_agregada", "tasa_ce_olr"],
  });
  return valores?.dataValues;
};
