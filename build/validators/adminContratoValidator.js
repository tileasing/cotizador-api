"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminContratoValidator = void 0;
const yup_1 = require("yup");
exports.adminContratoValidator = (0, yup_1.object)({
    id: (0, yup_1.number)(),
    firma_contrato: (0, yup_1.string)().oneOf(["Aprobado"], "El estado solo acepta Aprobado"),
});
