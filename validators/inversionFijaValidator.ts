import { object, number } from "yup";

export const inversionFijaValidator = object({
  minimo: number().required("El valor minimo es Requerido"),
  maximo: number().required("El valor maximo es Requerido"),
  rendimiento: number().required("El valor rendimiento es Requerido"),
  tasa_ce_olr: number().required("El valor tasa CEOLR es Requerido"),
  tasa_agregada: number().required("El valor tasa agregada es Requerido"),
});

export const inversionFijaValidatorUpdate = object({
  minimo: number(),
  maximo: number(),
  rendimiento: number(),
  tasa_ce_olr: number(),
  tasa_agregada: number(),
});
