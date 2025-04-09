export interface IDTOInversionAmortizable {
  id?: number;
  minimo: number;
  maximo: number;
  tasa: number;
  who_created: string;
  when_created: Date;
  who_modified: string | null;
  when_modified: Date | null;
}
export interface IDTOInversionAmortizableCreate {
  id?: number;
  minimo: number;
  maximo: number;
  tasa: number;
}

export interface IDTOInversionAmortizableUpdate {
  id: number;
  minimo?: number;
  maximo?: number;
  tasa?: number;
}
