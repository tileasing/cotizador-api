"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gestoriaValidator = void 0;
const yup_1 = require("yup");
exports.gestoriaValidator = (0, yup_1.object)({
    id: (0, yup_1.number)(),
    entrega_unidad: (0, yup_1.string)().oneOf(["Aprobado"], "El campo solo acepta Aprobado"),
});
