import { number, object, string } from "yup";

export const documentsClientValidator = object({
  estado: string()
    .required()
    .default("En revision")
    .oneOf(
      ["Aceptado", "Rechazado", "En revision", "Sin archivo"],
      "No es un estado válido"
    ),
  informacion: string().required().default("Sin comentarios"),
  path: string().required(),
  tipo_archivo: string(),
  cliente_id: string(),
});

export const updateDocsClientValidator = object({
  estado: string()
    .default("En revision")
    .oneOf(
      ["Aceptado", "Rechazado", "En revision", "Sin archivo"],
      "No es un estado válido"
    ),
  informacion: string().default("Sin comentarios"),
  path: string().required(),
});

export const AorDeclineValidator = object({
  id: number().required("El id es requerido"),
  estado: string()
    .required("Es requerido un valor estado de Aceptado o Rechazado")
    .oneOf(["Aceptado", "Rechazado"], "No es un estado válido"),
  informacion: string(),
});
