
export interface IDTOAdministrador {
    id?: string,
    nombre: string,
    email: string,
    password: string,
    tipo_administrador: string
}

export interface IDTOUpdatePassword {
    password: string,
    newPassword: string
}

export interface IDTOReplacePassword {
    id_editPassword: number,
    newPassword: string
}

export interface IAdministrador {
    id: string;
    nombre: string;
    email: string;
    password: string;
    tipo_administrador: string;
    deleted: boolean;
    who_deleted: string | null;
    when_deleted: Date | null;
    who_modified: string | null;
    when_modified: Date | null;
}
