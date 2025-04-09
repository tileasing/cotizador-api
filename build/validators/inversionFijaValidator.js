"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inversionFijaValidatorUpdate = exports.inversionFijaValidator = void 0;
const yup_1 = require("yup");
exports.inversionFijaValidator = (0, yup_1.object)({
    minimo: (0, yup_1.number)().required("El valor minimo es Requerido"),
    maximo: (0, yup_1.number)().required("El valor maximo es Requerido"),
    rendimiento: (0, yup_1.number)().required("El valor rendimiento es Requerido"),
    tasa_ce_olr: (0, yup_1.number)().required("El valor tasa CEOLR es Requerido"),
    tasa_agregada: (0, yup_1.number)().required("El valor tasa agregada es Requerido"),
});
exports.inversionFijaValidatorUpdate = (0, yup_1.object)({
    minimo: (0, yup_1.number)(),
    maximo: (0, yup_1.number)(),
    rendimiento: (0, yup_1.number)(),
    tasa_ce_olr: (0, yup_1.number)(),
    tasa_agregada: (0, yup_1.number)(),
});
