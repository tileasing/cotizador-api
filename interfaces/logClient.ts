export interface IDTOLogAdminClient {
  id: string;
  cliente_id: string;
  tipo: string;
  fecha: Date | null;
  old_register: Text;
  new_register: Text;
}
