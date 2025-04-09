"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AorDeclineValidator = exports.updateDocsClientValidator = exports.documentsClientValidator = void 0;
const yup_1 = require("yup");
exports.documentsClientValidator = (0, yup_1.object)({
    estado: (0, yup_1.string)()
        .required()
        .default("En revision")
        .oneOf(["Aceptado", "Rechazado", "En revision", "Sin archivo"], "No es un estado válido"),
    informacion: (0, yup_1.string)().required().default("Sin comentarios"),
    path: (0, yup_1.string)().required(),
    tipo_archivo: (0, yup_1.string)(),
    cliente_id: (0, yup_1.string)(),
});
exports.updateDocsClientValidator = (0, yup_1.object)({
    estado: (0, yup_1.string)()
        .default("En revision")
        .oneOf(["Aceptado", "Rechazado", "En revision", "Sin archivo"], "No es un estado válido"),
    informacion: (0, yup_1.string)().default("Sin comentarios"),
    path: (0, yup_1.string)().required(),
});
exports.AorDeclineValidator = (0, yup_1.object)({
    id: (0, yup_1.number)().required("El id es requerido"),
    estado: (0, yup_1.string)()
        .required("Es requerido un valor estado de Aceptado o Rechazado")
        .oneOf(["Aceptado", "Rechazado"], "No es un estado válido"),
    informacion: (0, yup_1.string)(),
});
