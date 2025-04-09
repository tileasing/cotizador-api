
export interface IDTOValorTasas {
    plazo: number,
    tipo_activo: string,
    tasa_a: number,
    tasa_b: number,
    tasa_alfa: number,
    tasa_beta: number,
    tasa_gamma: number
}

export interface IDTOGetTasasByTipoActivo {
    tipo_activo: string,
    page: number,
    limit: number,
}

export interface IDTOValorTasasUpdate {
    id: number,
    tasa_a: number,
    tasa_b: number,
    tasa_alfa: number,
    tasa_beta: number,
    tasa_gamma: number
}

export interface IValorTasas {
    id: number;
    tipo_activo: string;
    plazo: number;
    tasa_a?: number;
    tasa_b?: number;
    tasa_alfa?: number;
    tasa_beta?: number;
    tasa_gamma?: number;
    deleted: boolean;
    who_created?: string;
    when_created?: Date;
    who_modified: string | null;
    when_modified: Date | null;
    who_deleted: string | null;
    when_deleted: Date | null;
}
