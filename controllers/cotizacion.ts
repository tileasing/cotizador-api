import { Request, Response } from "express";
import { IDTOCotizacion } from "../interfaces/cotizacionInterfaces";
import { doCotWithRenta } from "../services/cotizacionServices";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import { cotizacionValidator } from "../validators/cotizacionValidator";
import { Administrador, Log } from "../models";

export const getCotizacion = async (
  req: Request<{}, {}, IDTOCotizacion>,
  res: Response<BaseResponseType>
) => {
  // console.log(
  //   "==============================================Inicia la cotizacion=========================================="
  // );
  // console.log(req.body);
  const adminExist = await Administrador.findOne({
    where: { id: req.authData?.id },
  });
  try {
    const body = await cotizacionValidator.validate(req.body);
    const data = await doCotWithRenta(req.body);
    const {
      promotor,
      correo,
      telefono,
      marca,
      modelo,
      version,
      estado,
      plazo,
    } = body;
    if (data.error) {
      return res.status(401).json({
        success: data.isCorrect,
        errors: data.error,
      });
    }
    if (data.data) {
      if (!data.data.rentaMensual)
        return res.status(401).json({
          success: false,
          errors: ["No se ha podido realizar la cotización"],
        });
    }
    if (adminExist) {
      await Log.create({
        administrador_id: req.authData?.id,
        tipo: "Cotización",
        fecha: new Date(),
        old_register: "",
        new_register: JSON.stringify({
          ...data.data,
          valorFactura: req.body.valorFactura,
          promotor,
          correo,
          telefono,
          marca,
          modelo,
          version,
          estado,
          plazo,
        }),
      });
    }
    return res.status(200).json({
      success: true,
      data: {
        ...data.data,
        valorFactura: req.body.valorFactura,
        promotor,
        correo,
        telefono,
        marca,
        modelo,
        version,
        estado,
        plazo,
      },
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

// export const getCotizacionv2 = async (
//   req: Request<{}, {}, IDTOCotizacion>,
//   res: Response<BaseResponseType>
// ) => {
//   // console.log(req.body);
//   try {
//     const data = await doCotizacionv2(req.body);
//     const isValid = verifyRules(
//       req.body.valorFactura,
//       req.body.totalPagoInicial,
//       req.body.tipoSeguro,
//       req.body.costoSeguro,
//       req.body.rentasDeposito
//     );
//     if (!isValid.isValid) {
//       return res.status(401).json({
//         success: isValid.isValid,
//         errors: [isValid.error],
//       });
//     }
//     if (!data.rentaMensual)
//       return res.status(401).json({
//         success: false,
//         errors: ["No se ha podido realizar la cotización"],
//       });
//     return res.status(200).json({
//       success: true,
//       data: { ...data, valorFactura: req.body.valorFactura },
//     });
//   } catch (error) {
//     console.log({ error });
//     const err = error as Error;
//     res.status(400).json({
//       success: false,
//       errors: [err.message],
//     });
//   }
// };
