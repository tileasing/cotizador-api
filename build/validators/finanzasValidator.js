"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finanzasValidator = void 0;
const yup_1 = require("yup");
exports.finanzasValidator = (0, yup_1.object)({
    id: (0, yup_1.number)(),
    // pago_inicial: string().oneOf(["Aprobado"], "El estado solo acepta Aprobado"),
    orden_compra: (0, yup_1.string)(),
    factura_unidad: (0, yup_1.string)(),
    tipo_pago: (0, yup_1.string)().oneOf(["contado", "financiado"], "Método de pago inválido"),
});
