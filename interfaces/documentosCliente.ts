export interface IDocumentClient {
  id: number;
  estado: string;
  informacion: string;
  path: string;
  tipo_archivo_id: string;
  cliente_id: string;
  who_created?: string;
  when_created?: Date;
  who_modified: string | null;
  when_modified: Date | null;
  who_deleted: string | null;
  when_deleted: Date | null;
}
export interface ICreateDocumentClient {
  estado: string;
  informacion: string;
  path: string;
  tipo_archivo_id: string;
  cliente_id?: string;
}

export interface IUpdateDocumentClient {
  id: number;
  path: string;
  tipo_archivo: string;
}

export interface IAOrDDocumentClient {
  id: number;
  estado: string;
  informacion?: string;
}
