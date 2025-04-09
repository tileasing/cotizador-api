export interface IClienteArrend {
  id: number;
  cliente_id: string;
  firma_contrato: string;
  pago_inicial: string;
  entrega_unidad: string;
  analisis_riesgo: boolean;
  tipo_pago: string;
  path_analisis: string;
  path_factura_unidad: string;
  path_orden_compra: string;
  path_contrato_firmado: string;
  path_unidad_entregada: string;
  motivo: string;
  estado: string;
  who_created?: string;
  when_created?: Date;
  who_modified: string | null;
  when_modified: Date | null;
}

export interface ICreateClienteArrend {
  cliente_id: string;
  path_analisis?: string;
  motivo?: string;
  estado: string;
  who_created?: string;
  when_created?: Date;
}

export interface IGetClienteArrend {
  cliente_id: string;
}
