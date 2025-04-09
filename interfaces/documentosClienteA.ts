export interface IDocumentClientA {
  id: number;
  estado: string;
  informacion: string;
  path: string;
  tipo_archivo_a_id: string;
  cliente_id: string;
  who_created?: string;
  when_created?: Date;
  who_modified: string | null;
  when_modified: Date | null;
  who_deleted: string | null;
  when_deleted: Date | null;
}
export interface ICreateDocumentClientA {
  estado: string;
  informacion: string;
  path: string;
  tipo_archivo_a_id: string;
  cliente_id?: string;
}

export interface IUpdateDocumentClientA {
  id: number;
  path: string;
  tipo_archivo_a: string;
}

export interface IAOrDDocumentClientA {
  id: number;
  estado: string;
  informacion?: string;
}

export interface IDocsA {
  idClient: string;
  estado: string;
  mensaje?: string;
}
