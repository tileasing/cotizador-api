"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inversionAmortizableValidatorUpdate = exports.inversionAmortizableValidator = void 0;
const yup_1 = require("yup");
exports.inversionAmortizableValidator = (0, yup_1.object)({
    minimo: (0, yup_1.number)().required("El valor minimo es Requerido"),
    maximo: (0, yup_1.number)().required("El valor maximo es Requerido"),
    tasa: (0, yup_1.number)().required("El valor tasa agregada es Requerido"),
});
exports.inversionAmortizableValidatorUpdate = (0, yup_1.object)({
    minimo: (0, yup_1.number)(),
    maximo: (0, yup_1.number)(),
    tasa: (0, yup_1.number)(),
});
