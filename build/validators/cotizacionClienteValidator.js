"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRF = exports.cotizacionClienteValidator = void 0;
const yup_1 = require("yup");
exports.cotizacionClienteValidator = (0, yup_1.object)({
    tipoActivo: (0, yup_1.string)()
        .required("El tipo de activo es requerido")
        .oneOf(["Utilitario", "Bicicletas", "Tracto Camion", "Motocicleta"], "No es un tipo de activo válido"),
    valorFactura: (0, yup_1.number)()
        .required("El valor factura es requerido")
        .min(0, "El valor factura no puede ser 0 o menor")
        .when("tipoActivo", {
        is: "Bicicletas",
        then: (schema) => schema.min(110000, "El valor de la factura no puede ser menor a 110,000 para bicicletas"),
    }),
    plazo: (0, yup_1.number)()
        .when("tipoActivo", {
        is: "Bicicletas",
        then: (schema) => schema
            .min(12, "El plazo debe ser de 12 meses")
            .max(12, "El plazo debe ser de 12 meses"),
    })
        .when("tipoActivo", {
        is: "Motocicleta",
        then: (schema) => schema
            .min(12, "El plazo debe ser al menos 12 meses")
            .max(24, "El plazo debe ser máximo 24 meses"),
    }),
    totalPagoInicial: (0, yup_1.number)().test("limitePagoInicial", "El pago inicial no puede ser mayor al 45% del valor de la factura", function (value) {
        if (!value)
            return true;
        const { valorFactura } = this.parent;
        const limite = valorFactura * 0.45;
        if (value) {
            return value <= limite;
        }
    }),
});
exports.clientRF = (0, yup_1.object)({
    regimen_fiscal: (0, yup_1.string)().oneOf(["Persona moral", "Persona fisica con actividad empresarial"], "El regimen fiscal solo acepta Persona moral o Persona fisica con actividad empresarial"),
});
