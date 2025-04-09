import { object, number, string } from "yup";

export const tipoArchivoEditValidator = object({
  id: number().required(),
  tipo_archivo: string().transform((value) =>
    value ? value.replace(/\s+/g, "_") : value
  ),
  regimen_fiscal: string().oneOf(
    ["Persona moral", "Persona fisica con actividad empresarial"],
    "El tipo de archivo solo acepta Persona moral o Persona fisica con actividad empresarial"
  ),
});

export const tipoArchivoValidator = object({
  tipo_archivo: string()
    .required("El tipo de archivo es requerido")
    .transform((value) => (value ? value.replace(/\s+/g, "_") : value)),
  regimen_fiscal: string()
    .required("El regimen fiscal es requerido")
    .oneOf(
      ["Persona moral", "Persona fisica con actividad empresarial"],
      "El tipo de archivo solo acepta Persona moral o Persona fisica con actividad empresarial"
    ),
  descripcion_archivo: string(),
});

export const tipoArchivoSearchValidator = object({
  regimen_fiscal: string()
    .required()
    .oneOf(
      ["Persona moral", "Persona fisica con actividad empresarial"],
      "El tipo de archivo solo acepta Persona moral o Persona fisica con actividad empresarial"
    ),
});
