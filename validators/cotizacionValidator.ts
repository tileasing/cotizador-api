import { object, number, string, array, boolean } from "yup";
//TODO
export const cotizacionValidator = object({
  valorFactura: number()
    .required("El valor factura es requerido")
    .min(1, "El valor factura no puede ser 0 o menor")
    .when("tipoActivo", {
      is: "Bicicletas",
      then: (schema) =>
        schema.min(
          110000,
          "El valor de la factura no puede ser menor a 110,000 para bicicletas"
        ),
    }),
  plazo: number()
    .when("tipoActivo", {
      is: "Bicicletas",
      then: (schema) =>
        schema
          .min(12, "El plazo debe ser de 12 meses")
          .max(12, "El plazo debe ser de 12 meses"),
    })
    .when("tipoActivo", {
      is: "Motocicleta",
      then: (schema) =>
        schema
          .min(12, "El plazo debe ser al menos 12 meses")
          .max(24, "El plazo debe ser máximo 24 meses"),
    }),
  comisionApertura: string().required("La comisión por apertura es requerida"),
  tipoSeguro: string(),
  totalPagoInicial: number()
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
    .test(
      "MinimoPagoInicial",
      "El pago inicial debe ser mayor",
      function (value) {
        const { tipoSeguro, costoSeguro, rentasDeposito } = this.parent;
        if (value === 0)
          if (value < rentasDeposito || value < costoSeguro) return false;
        if (value) {
          if (value < 0) return false;
          const precioSeguro = tipoSeguro !== "Incluido" ? 0 : costoSeguro;
          const sum = precioSeguro + rentasDeposito;
          const dif = value - sum;
          return !(dif < 0);
        }
        return true;
      }
    ),
  plan: string().required("El plan es requerido"),
  costoSeguro: number(),
  rentasDeposito: number(),
  tipoResidual: string(),
  fondoReserva: number().test(
    "fondoReservaLimit",
    "El fondo de reserva debe ser un valor entre el 1% y el 60%",
    function (value) {
      if (!value) return true;
      if (value >= 1 && value <= 60) {
        return true;
      } else return false;
    }
  ),
  valorResidualConvenido: number(),
  tipoActivo: string()
    .required("El tipo de activo es requerido")
    .oneOf(
      ["Utilitario", "Bicicletas", "Tracto Camion", "Motocicleta"],
      "No es un tipo de activo válido"
    ),
  cantidadUnidades: number(),
  marca: string(),
  modelo: string(),
  version: string(),
  estado: string(),
  accesorios: array(),
  cliente: string(),
  enAtencionA: string(),
  tipoCliente: string(),
  promotor: string(),
  correo: string(),
  telefono: string(),
  isEspecial: boolean(),
});
