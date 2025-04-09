"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AorDeclineAValidator = exports.updateDocsClientAValidator = exports.documentsClientAValidator = void 0;
const yup_1 = require("yup");
exports.documentsClientAValidator = (0, yup_1.object)({
    estado: (0, yup_1.string)()
        .required()
        .default("En revision")
        .oneOf(["Aceptado", "Rechazado", "En revision", "Sin archivo"], "No es un estado válido"),
    informacion: (0, yup_1.string)().required().default("Sin comentarios"),
    path: (0, yup_1.string)().required(),
    tipo_archivo_a: (0, yup_1.string)(),
    cliente_id: (0, yup_1.string)(),
});
exports.updateDocsClientAValidator = (0, yup_1.object)({
    estado: (0, yup_1.string)()
        .default("En revision")
        .oneOf(["Aceptado", "Rechazado", "En revision", "Sin archivo"], "No es un estado válido"),
    informacion: (0, yup_1.string)().default("Sin comentarios"),
    path: (0, yup_1.string)().required(),
});
exports.AorDeclineAValidator = (0, yup_1.object)({
    id: (0, yup_1.number)().required("El id es requerido"),
    estado: (0, yup_1.string)()
        .required("Es requerido un valor estado de Aceptado o Rechazado")
        .oneOf(["Aceptado", "Rechazado"], "No es un estado válido"),
    informacion: (0, yup_1.string)(),
});
