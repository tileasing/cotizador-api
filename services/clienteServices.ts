import { Administrador } from "../models/administrador";
import { Cliente } from "../models/cliente";

type retorno = {
  isCorrect: boolean;
  nombre: string | undefined;
  telefono: string | undefined;
  email: string | undefined;
};

interface RespuestaValidacionCotCliente {
  isValid: boolean;
  error: string;
}

export const getTypeOfUser = async (
  obj: { id?: string; iat?: any; tipoUsuario?: any } | undefined
) => {
  const retorno: retorno = {
    isCorrect: true,
    nombre: "",
    telefono: "",
    email: "",
  };
  if (obj?.tipoUsuario != "Cliente") {
    const admin = await Administrador.findOne({
      where: {
        id: obj?.id,
      },
    });
    if (!admin) {
      retorno.isCorrect = false;
    }
    retorno.nombre = admin?.dataValues.nombre;
    retorno.email = admin?.dataValues.email;
  }
  if (obj?.tipoUsuario === "Cliente") {
    const cliente = await Cliente.findOne({
      where: {
        id: obj?.id,
      },
    });
    if (!cliente) {
      retorno.isCorrect = false;
    }
    retorno.nombre = cliente?.dataValues.nombre;
    retorno.telefono = cliente?.dataValues.telefono;
    retorno.email = cliente?.dataValues.email;
  }
  return retorno;
};

export const verifyValorFacturaCliente = (
  valorFactura: number,
  totalPagoInicial: number
): RespuestaValidacionCotCliente => {
  const respuesta: RespuestaValidacionCotCliente = {
    error: "",
    isValid: true,
  };
  if (valorFactura == 0) {
    const retorno: RespuestaValidacionCotCliente = {
      error: "El valor de la factura no puede ser cero",
      isValid: false,
    };
    return retorno;
  }
  const limite = valorFactura * 0.45;
  if (totalPagoInicial > limite) {
    const retorno: RespuestaValidacionCotCliente = {
      error:
        "El pago inicial no puede ser mayor al 45% del valor de la factura",
      isValid: false,
    };
    return retorno;
  }
  return respuesta;
};
