"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCotizacion = void 0;
const cotizacionServices_1 = require("../services/cotizacionServices");
const cotizacionValidator_1 = require("../validators/cotizacionValidator");
const models_1 = require("../models");
const getCotizacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // console.log(
    //   "==============================================Inicia la cotizacion=========================================="
    // );
    // console.log(req.body);
    const adminExist = yield models_1.Administrador.findOne({
        where: { id: (_a = req.authData) === null || _a === void 0 ? void 0 : _a.id },
    });
    try {
        const body = yield cotizacionValidator_1.cotizacionValidator.validate(req.body);
        const data = yield (0, cotizacionServices_1.doCotWithRenta)(req.body);
        const { promotor, correo, telefono, marca, modelo, version, estado, plazo, } = body;
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
            yield models_1.Log.create({
                administrador_id: (_b = req.authData) === null || _b === void 0 ? void 0 : _b.id,
                tipo: "Cotización",
                fecha: new Date(),
                old_register: "",
                new_register: JSON.stringify(Object.assign(Object.assign({}, data.data), { valorFactura: req.body.valorFactura, promotor,
                    correo,
                    telefono,
                    marca,
                    modelo,
                    version,
                    estado,
                    plazo })),
            });
        }
        return res.status(200).json({
            success: true,
            data: Object.assign(Object.assign({}, data.data), { valorFactura: req.body.valorFactura, promotor,
                correo,
                telefono,
                marca,
                modelo,
                version,
                estado,
                plazo }),
        });
    }
    catch (error) {
        console.log({ error });
        const err = error;
        return res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.getCotizacion = getCotizacion;
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
