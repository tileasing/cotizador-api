// Se declaran los tipos de datos que se van a recibir

export interface IDTOCliente {
  nombre: string;
  email: string;
  telefono: string;
  // password: string
}

export interface ICliente {
  id: string;
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  tipo_cliente: string;
}

export interface IDTOCreateClient {
  nombre_cliente: string;
  correo_cliente: string;
}
