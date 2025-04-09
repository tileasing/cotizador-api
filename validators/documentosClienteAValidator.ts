import { number, object, string } from "yup";

export const documentsClientAValidator = object({
  estado: string()
    .required()
    .default("En revision")
    .oneOf(
      ["Aceptado", "Rechazado", "En revision", "Sin archivo"],
      "No es un estado válido"
    ),
  informacion: string().required().default("Sin comentarios"),
  path: string().required(),
  tipo_archivo_a: string(),
  cliente_id: string(),
});

export const updateDocsClientAValidator = object({
  estado: string()
    .default("En revision")
    .oneOf(
      ["Aceptado", "Rechazado", "En revision", "Sin archivo"],
      "No es un estado válido"
    ),
  informacion: string().default("Sin comentarios"),
  path: string().required(),
});

export const AorDeclineAValidator = object({
  id: number().required("El id es requerido"),
  estado: string()
    .required("Es requerido un valor estado de Aceptado o Rechazado")
    .oneOf(["Aceptado", "Rechazado"], "No es un estado válido"),
  informacion: string(),
});
