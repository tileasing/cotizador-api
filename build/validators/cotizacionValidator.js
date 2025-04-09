"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cotizacionValidator = void 0;
const yup_1 = require("yup");
//TODO
exports.cotizacionValidator = (0, yup_1.object)({
    valorFactura: (0, yup_1.number)()
        .required("El valor factura es requerido")
        .min(1, "El valor factura no puede ser 0 o menor")
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
    comisionApertura: (0, yup_1.string)().required("La comisión por apertura es requerida"),
    tipoSeguro: (0, yup_1.string)(),
    totalPagoInicial: (0, yup_1.number)()
        // .test(
        //   "limitePagoInicial",
        //   "El pago inicial no puede ser mayor al 45% del valor de la factura",
        //   function (value) {
        //     if (!value) return true;
        //     const { valorFactura } = this.parent;
        //     const limite = valorFactura * 0.45;
        //     if (value) {
        //       return value <= limite;
        //     }
        //   }
        // )
        .test("MinimoPagoInicial", "El pago inicial debe ser mayor", function (value) {
        const { tipoSeguro, costoSeguro, rentasDeposito } = this.parent;
        if (value === 0)
            if (value < rentasDeposito || value < costoSeguro)
                return false;
        if (value) {
            if (value < 0)
                return false;
            const precioSeguro = tipoSeguro !== "Incluido" ? 0 : costoSeguro;
            const sum = precioSeguro + rentasDeposito;
            const dif = value - sum;
            return !(dif < 0);
        }
        return true;
    }),
    plan: (0, yup_1.string)().required("El plan es requerido"),
    costoSeguro: (0, yup_1.number)(),
    rentasDeposito: (0, yup_1.number)(),
    tipoResidual: (0, yup_1.string)(),
    fondoReserva: (0, yup_1.number)().test("fondoReservaLimit", "El fondo de reserva debe ser un valor entre el 1% y el 60%", function (value) {
        if (!value)
            return true;
        if (value >= 1 && value <= 60) {
            return true;
        }
        else
            return false;
    }),
    valorResidualConvenido: (0, yup_1.number)(),
    tipoActivo: (0, yup_1.string)()
        .required("El tipo de activo es requerido")
        .oneOf(["Utilitario", "Bicicletas", "Tracto Camion", "Motocicleta"], "No es un tipo de activo válido"),
    cantidadUnidades: (0, yup_1.number)(),
    marca: (0, yup_1.string)(),
    modelo: (0, yup_1.string)(),
    version: (0, yup_1.string)(),
    estado: (0, yup_1.string)(),
    accesorios: (0, yup_1.array)(),
    cliente: (0, yup_1.string)(),
    enAtencionA: (0, yup_1.string)(),
    tipoCliente: (0, yup_1.string)(),
    promotor: (0, yup_1.string)(),
    correo: (0, yup_1.string)(),
    telefono: (0, yup_1.string)(),
    isEspecial: (0, yup_1.boolean)(),
});
