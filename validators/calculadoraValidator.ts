import { object, number, string } from "yup";

export const calculadoraValidator = object({
  monto_invertir: number()
    .min(1000, "El monto debe ser mayor a $1,000")
    .required("El monto a invertir es requerido"),
  tipo_plan: string()
    .oneOf(
      ["Fija", "Amortizable"],
      "El tipo de plan solo acepta Fija o Amortizable"
    )
    .required("El tipo de plan es requerido"),
  plazo: number()
    .min(12, "El plazo mínimo es de 12 meses")
    .max(48, "El plazo máximo son 48 meses")
    .required("El plazo es requerido"),
});
