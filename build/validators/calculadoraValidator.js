"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculadoraValidator = void 0;
const yup_1 = require("yup");
exports.calculadoraValidator = (0, yup_1.object)({
    monto_invertir: (0, yup_1.number)()
        .min(1000, "El monto debe ser mayor a $1,000")
        .required("El monto a invertir es requerido"),
    tipo_plan: (0, yup_1.string)()
        .oneOf(["Fija", "Amortizable"], "El tipo de plan solo acepta Fija o Amortizable")
        .required("El tipo de plan es requerido"),
    plazo: (0, yup_1.number)()
        .min(12, "El plazo mínimo es de 12 meses")
        .max(48, "El plazo máximo son 48 meses")
        .required("El plazo es requerido"),
});
