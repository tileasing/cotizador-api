// Se declaran los tipos de datos que se van a recibir

export interface IDTOCotizacion {
  cliente: string;
  enAtencionA: string;
  tipoCliente: string;
  promotor: string;
  correo: string;
  telefono: string;
  tipoActivo: string;
  cantidadUnidades: number;
  marca: string;
  modelo: string;
  version: string;
  estado: string;
  valorFactura: number;
  plazo: number;
  comisionApertura: number;
  totalPagoInicial: number;
  plan: string;
  tipoSeguro: string;
  costoSeguro: number;
  rentasDeposito: number;
  tipoResidual: string;
  fondoReserva: number;
  valorResidualConvenido: number;
  isEspecial: boolean;
  accesorios: IDTOAccesorios[];
}

export interface IDTOAccesorios {
  nombreAccesorio: string;
  descripcionAccesorio: string;
  valorAccesorio: number;
}

export interface IDTOCotCliente {
  tipoActivo: string;
  valorFactura: number;
  valorAccesorios: number;
  plazo: number;
  totalPagoInicial: number;
  valorResidualConvenido: number;
}
