import { number, object, string } from "yup";

export const finanzasValidator = object({
  id: number(),
  // pago_inicial: string().oneOf(["Aprobado"], "El estado solo acepta Aprobado"),
  orden_compra: string(),
  factura_unidad: string(),
  tipo_pago: string().oneOf(
    ["contado", "financiado"],
    "Método de pago inválido"
  ),
});
