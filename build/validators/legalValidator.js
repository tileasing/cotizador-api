"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contratoValidator = exports.legalValidator = void 0;
const yup_1 = require("yup");
exports.legalValidator = (0, yup_1.object)({
    id: (0, yup_1.number)(),
    pago_inicial: (0, yup_1.string)().oneOf(["Aprobado"], "El campo solo acepta Aprobado"),
});
exports.contratoValidator = (0, yup_1.object)({
    id: (0, yup_1.number)(),
    // pago_inicial: string().oneOf(["Aprobado"], "El campo solo acepta Aprobado"),
    contrato_firmado: (0, yup_1.string)().required("El archivo es necesario"),
});
