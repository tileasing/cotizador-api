export interface IDTOCalculadora {
  monto_invertir: number;
  tipo_plan: string;
  plazo: number;
}

export interface IDTOCalculadoraMeInteresa {
  calculo: CalculosFija | CalculosAmortizable;
}

//           ===================FIJA=================
export interface CalculosFija {
  tipo_plan: string;
  plazo: number;
  monto_invertir: number;
  rendmens: number;
  rendanual: number;
  rend: number;
  captot: number;
}
//           ===================AMORTIZABLE=================
export interface CalculosAmortizable {
  tipo_plan: string;
  plazo: number;
  monto_invertir: number;
  calculapago: number;
  sumaIntereses: number;
  sumaTot: number;
}
