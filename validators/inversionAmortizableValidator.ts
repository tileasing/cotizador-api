import { object, number } from "yup";

export const inversionAmortizableValidator = object({
  minimo: number().required("El valor minimo es Requerido"),
  maximo: number().required("El valor maximo es Requerido"),
  tasa: number().required("El valor tasa agregada es Requerido"),
});

export const inversionAmortizableValidatorUpdate = object({
  minimo: number(),
  maximo: number(),
  tasa: number(),
});
