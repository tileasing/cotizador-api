export interface IDTOLogAdmin {
  id: string;
  administrador_id: string;
  tipo: string;
  fecha: Date | null;
  old_register: Text;
  new_register: Text;
}
