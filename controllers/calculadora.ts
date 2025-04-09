import { Request, Response } from "express";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import { calculadoraValidator } from "../validators/calculadoraValidator";
import {
  getvaluesCalculadoraAmortizable,
  getvaluesCalculadoraFija,
} from "../services/calculadoraServices";
import {
  IDTOCalculadora,
  IDTOCalculadoraMeInteresa,
} from "../interfaces/calculadoraInterfaces";
import { sendEmailToMKTCalculadora } from "../services/sendEmailToMKT";
import { Administrador, Cliente, Log, LogCliente } from "../models";

type Montos = { montoAInvertir: number; interes: number; renta: number };

export const doCalculate = async (
  req: Request<{}, {}, IDTOCalculadora>,
  res: Response<BaseResponseType>
) => {
  try {
    const data = await calculadoraValidator.validate(req.body);
    let newSaldoInicial: Montos[] = [];
    const { monto_invertir, tipo_plan, plazo } = data;
    let tasaxrend = 0;

    if (tipo_plan === "Fija") {
      const valor = (await getvaluesCalculadoraFija(plazo)) || {
        tasa_ce_olr: 10,
        tasa_agregada: 1,
        rendimiento: 100,
      };
      const tasaxrend =
        ((valor.tasa_ce_olr / 100 + valor.tasa_agregada / 100) *
          valor.rendimiento) /
        100 /
        12;
      const rendmens = monto_invertir * tasaxrend;
      const rendanual = monto_invertir * tasaxrend * 12;
      const rend = rendmens * plazo;
      const captot = monto_invertir + rend;
      return res.json({
        success: true,
        data: {
          isFija: true,
          calculos: {
            plazo,
            monto_invertir,
            rendmens,
            rendanual,
            rend,
            captot,
          },
        },
      });
    } else if (tipo_plan === "Amortizable") {
      const valor = (await getvaluesCalculadoraAmortizable(plazo)) || 14;
      tasaxrend = valor / 100 / 12;
      let nuevoMontoInvertir = monto_invertir;
      let intereses = 0;
      let calculapago =
        (monto_invertir * (tasaxrend * (1 + tasaxrend) ** plazo)) /
        ((1 + tasaxrend) ** plazo - 1);
      for (let rentas = 0; rentas < plazo; rentas++) {
        intereses = nuevoMontoInvertir * tasaxrend;
        nuevoMontoInvertir = nuevoMontoInvertir - calculapago + intereses;
        const montoAgregar: Montos = {
          montoAInvertir: nuevoMontoInvertir,
          interes: intereses,
          renta: rentas,
        };
        newSaldoInicial.push(montoAgregar);
      }
      const sumaIntereses = newSaldoInicial.reduce(
        (acumulador, { interes }) => interes + acumulador,
        0
      );
      const sumaTot = monto_invertir + sumaIntereses;
      return res.json({
        success: true,
        data: {
          isFija: false,
          calculos: {
            plazo,
            monto_invertir,
            calculapago,
            sumaIntereses,
            sumaTot,
          },
        },
      });
    }
    return res.json({
      success: false,
      errors: ["Algo salió mal"],
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

export const meInteresaInversion = async (
  req: Request<{}, {}, IDTOCalculadoraMeInteresa>,
  res: Response<BaseResponseType>
) => {
  try {
    // Encuentra al cliente
    const clienteExist = await Cliente.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    const adminExist = await Administrador.findOne({
      where: { id: req.authData?.id },
    });
    if (clienteExist) {
      await LogCliente.create({
        cliente_id: req.authData?.id,
        tipo: "Calculadora",
        fecha: new Date(),
        old_register: "",
        new_register: JSON.stringify({
          calculos: req.body,
        }),
      });
    }
    if (adminExist) {
      await Log.create({
        administrador_id: req.authData?.id,
        tipo: "Calculadora",
        fecha: new Date(),
        old_register: "",
        new_register: JSON.stringify({
          calculos: req.body,
        }),
      });
    }
    if (clienteExist) {
      const calculos = req.body;
      const { nombre, email, telefono } = clienteExist.dataValues;
      await sendEmailToMKTCalculadora({
        nombre,
        email,
        telefono,
        calculos,
      });
      return res.json({
        success: true,
        data: {
          contacto: { nombre, email, telefono },
          msg: ["Nos pondremos en contacto contigo"],
        },
      });
    }
    if (adminExist) {
      return res.json({
        success: true,
        data: {
          contacto: {
            nombre: adminExist?.dataValues.nombre,
            email: "",
            telefono: "",
          },
          msg: ["Patición exitosa"],
        },
      });
    }
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};
