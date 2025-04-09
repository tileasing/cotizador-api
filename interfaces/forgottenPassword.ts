export interface IDTOForgottenPassword {
  id?: number;
  clienteId: string;
  email: string;
  keyRecovery: string;
}
