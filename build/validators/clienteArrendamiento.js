"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidateClientByAdmin = exports.getClientArrandValidator = exports.clientArrendValidator = void 0;
const yup_1 = require("yup");
exports.clientArrendValidator = (0, yup_1.object)({
    cliente_id: (0, yup_1.string)().required("El campo cliente_id es requerido"),
    path_analisis: (0, yup_1.string)(),
    estado: (0, yup_1.string)()
        .required("El estado es obligatorio")
        .oneOf(["Aprobado", "Rechazado"], "El estado solo acepta Aprobado o Rechazado"),
    motivo: (0, yup_1.string)(),
});
exports.getClientArrandValidator = (0, yup_1.object)({
    cliente_id: (0, yup_1.string)().required("El id del cliente es requerido"),
});
exports.createValidateClientByAdmin = (0, yup_1.object)({
    nombre_cliente: (0, yup_1.string)().required("El nombre es requerido"),
    correo_cliente: (0, yup_1.string)().required("El correo es requerido"),
});
