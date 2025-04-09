import { number, object, string } from "yup";

export const gestoriaValidator = object({
  id: number(),
  entrega_unidad: string().oneOf(["Aprobado"], "El campo solo acepta Aprobado"),
});
