export interface IAutosActivos {
    id: number;
    modelo: string;
    monto_arrendamiento: number;
    plazo?: number;
    tasa?: number;
    deleted: boolean;
    who_created?: string;
    when_created?: Date;
    who_modified: string | null;
    when_modified: Date | null;
    who_deleted: string | null;
    when_deleted: Date | null;
}