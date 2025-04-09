export interface ITipoArchivo {
  id: number;
  tipo_archivo: string;
  regimen_fiscal: string;
  descripcion_archivo?: string;
  requerido: boolean;
  deleted: boolean;
  who_created?: string;
  when_created?: Date;
  who_modified: string | null;
  when_modified: Date | null;
  who_deleted: string | null;
  when_deleted: Date | null;
}

export interface ITipoArchivoCreate {
  tipo_archivo: string;
  regimen_fiscal: string;
  descripcion_archivo: string;
}

export interface ITipoArchivoUpdate {
  id: number;
  tipo_archivo?: string;
  regimen_fiscal?: string;
}
