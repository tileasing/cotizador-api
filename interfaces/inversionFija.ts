export interface IDTOInversionFija {
  id?: number;
  minimo: number;
  maximo: number;
  rendimiento: number;
  tasa_ce_olr: number;
  tasa_agregada: number;
  who_created: string;
  when_created: Date;
  who_modified: string | null;
  when_modified: Date | null;
}
export interface IDTOInversionFijaCreate {
  id?: number;
  minimo: number;
  maximo: number;
  rendimiento: number;
  tasa_ce_olr: number;
  tasa_agregada: number;
}
export interface IDTOInversionFijaUpdate {
  id: number;
  minimo?: number;
  maximo?: number;
  rendimiento?: number;
  tasa_ce_olr?: number;
  tasa_agregada?: number;
}
