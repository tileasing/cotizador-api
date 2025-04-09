import { opciones, rentav2 } from "../services";

export type resultado = {
  cantidadUnidades: number;
  cliente: string;
  enAtencionA: string;
  tipoCliente: string;
  tipoActivo: string;
  valorResidualSinIva: number;
  valorInicialArrendamiento: number;
  montoArrendamientoFinal: number;
  costoAccesorios: number;
  seguroAnualConIVA: number;
  totalPagoInicial: number;
  comisionApertura: number;
  rentasDeposito: number;
  rentaMensual: number;
  descuentoMxRD: number;
  subtotalRentaMensual: number;
  ivadeRentaMensual: number;
  fondoReserva: number;
  rentaMensualTotal: number;
  opciones: opciones[];
};

export type resultadov2 = {
  cantidadUnidades: number;
  cliente: string;
  enAtencionA: string;
  tipoCliente: string;
  tipoActivo: string;
  valorResidualSinIva: number;
  valorInicialArrendamiento: number;
  montoArrendamientoFinal: number;
  costoAccesorios: number;
  seguroAnualConIVA: number;
  totalPagoInicial: number;
  comisionApertura: number;
  rentasDeposito: number;
  rentaMensual: number;
  descuentoMxRD: number;
  subtotalRentaMensual: number;
  ivadeRentaMensual: number;
  fondoReserva: number;
  rentaMensualTotal: number;
  descripcionAccesorios: descripcionAccesoriosType[];
  opciones: rentav2[];
};

export type descripcionAccesoriosType = {
  nombreAccesorio: string;
  descripcionAccesorio: string;
  valorAccesorio: number;
};

export type respuestaCot = {
  isCorrect: boolean;
  error?: string[];
  data?: resultadov2;
};
