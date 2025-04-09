import { number, object, string } from "yup";

export const adminContratoValidator = object({
  id: number(),
  firma_contrato: string().oneOf(
    ["Aprobado"],
    "El estado solo acepta Aprobado"
  ),
});
