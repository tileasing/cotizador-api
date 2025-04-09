"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tipoArchivoSearchValidator = exports.tipoArchivoValidator = exports.tipoArchivoEditValidator = void 0;
const yup_1 = require("yup");
exports.tipoArchivoEditValidator = (0, yup_1.object)({
    id: (0, yup_1.number)().required(),
    tipo_archivo: (0, yup_1.string)().transform((value) => value ? value.replace(/\s+/g, "_") : value),
    regimen_fiscal: (0, yup_1.string)().oneOf(["Persona moral", "Persona fisica con actividad empresarial"], "El tipo de archivo solo acepta Persona moral o Persona fisica con actividad empresarial"),
});
exports.tipoArchivoValidator = (0, yup_1.object)({
    tipo_archivo: (0, yup_1.string)()
        .required("El tipo de archivo es requerido")
        .transform((value) => (value ? value.replace(/\s+/g, "_") : value)),
    regimen_fiscal: (0, yup_1.string)()
        .required("El regimen fiscal es requerido")
        .oneOf(["Persona moral", "Persona fisica con actividad empresarial"], "El tipo de archivo solo acepta Persona moral o Persona fisica con actividad empresarial"),
    descripcion_archivo: (0, yup_1.string)(),
});
exports.tipoArchivoSearchValidator = (0, yup_1.object)({
    regimen_fiscal: (0, yup_1.string)()
        .required()
        .oneOf(["Persona moral", "Persona fisica con actividad empresarial"], "El tipo de archivo solo acepta Persona moral o Persona fisica con actividad empresarial"),
});
