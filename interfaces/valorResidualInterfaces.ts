
export interface IDTOValorResidual {
    plazo: number,
    minimo: number,
    maximo: number,
}

export interface IDTOValorResidualUpdate {
    id: number,
    plazo: number,
    minimo: number,
    maximo: number,
}

export interface IValorResidual {
    id: number;
    plazo: number;
    minimo: number;
    maximo: number;
    deleted: boolean;
    who_created?: string;
    when_created?: Date;
    who_modified: string | null;
    when_modified: Date | null;
    who_deleted: string | null;
    when_deleted: Date | null;
}
