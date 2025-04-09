import { object, string } from "yup";

export const clientArrendValidator = object({
  cliente_id: string().required("El campo cliente_id es requerido"),
  path_analisis: string(),
  estado: string()
    .required("El estado es obligatorio")
    .oneOf(
      ["Aprobado", "Rechazado"],
      "El estado solo acepta Aprobado o Rechazado"
    ),
  motivo: string(),
});

export const getClientArrandValidator = object({
  cliente_id: string().required("El id del cliente es requerido"),
});

export const createValidateClientByAdmin = object({
  nombre_cliente: string().required("El nombre es requerido"),
  correo_cliente: string().required("El correo es requerido"),
});
