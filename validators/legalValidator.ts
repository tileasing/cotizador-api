import { number, object, string } from "yup";

export const legalValidator = object({
  id: number(),
  pago_inicial: string().oneOf(["Aprobado"], "El campo solo acepta Aprobado"),
});

export const contratoValidator = object({
  id: number(),
  // pago_inicial: string().oneOf(["Aprobado"], "El campo solo acepta Aprobado"),
  contrato_firmado: string().required("El archivo es necesario"),
});
