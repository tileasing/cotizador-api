export interface ITipoArchivoA {
  id: number;
  tipo_archivo_a: string;
  regimen_fiscal: string;
  descripcion_archivo?: string;
  deleted: boolean;
  who_created?: string;
  when_created?: Date;
  who_modified: string | null;
  when_modified: Date | null;
  who_deleted: string | null;
  when_deleted: Date | null;
}

export interface ITipoArchivoACreate {
  tipo_archivo_a: string;
  regimen_fiscal: string;
  descripcion_archivo: string;
}

export interface ITipoArchivoAUpdate {
  id: number;
  tipo_archivo_a?: string;
  regimen_fiscal?: string;
}
