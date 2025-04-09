
export interface IDTOValorOtrosGastos {
    plazo:number,
    instalacion:number,
    gps_anual:number,
    gastos_notariales:number
}

export interface IDTOValorOtrosGastosUpdate {
    id:number,
    instalacion:number,
    gps_anual:number,
    gastos_notariales:number
}

export interface IValorOtrosGastos {
    id: number;
    plazo: number;
    instalacion: number;
    gps_anual: number;
    gastos_notariales: number;
    total?: number;
    deleted: boolean;
    who_created?: string;
    when_created?: Date;
    who_modified: string | null;
    when_modified: Date | null;
    who_deleted: string | null;
    when_deleted: Date | null;
}
