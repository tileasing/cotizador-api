
export interface IDTOEditable {
    campo: string;
    valor: number;
    tipo: string;
}

export interface IDTOEditableUpdate {
    id: number;
    campo: string;
    valor: number;
}

export interface IEditable {
    id: number;
    campo: string;
    valor: number;
    tipo: string;
    deleted: boolean;
    who_created?: string;
    when_created?: Date;
    who_modified: string | null;
    when_modified: Date | null;
    who_deleted: string | null;
    when_deleted: Date | null;
}
