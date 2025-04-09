import {
  IDTOCotCliente,
  IDTOCotizacion,
} from "../interfaces/cotizacionInterfaces";
import { Editable } from "../models/editable";
import { Valor_Otros_Gastos } from "../models/valor_otros_gastos";
import { Valor_Residual } from "../models/valor_residual";
import { Valor_Tasas } from "../models/valor_tasas";
import {
  descripcionAccesoriosType,
  respuestaCot,
  resultado,
  resultadov2,
} from "../interfaces/types";
import { Op } from "sequelize";

interface RespuestaValidacion {
  isValid: boolean;
  error: string;
}

interface RespuestaDataTasas {
  isValid: boolean;
  error?: string;
  data?: any;
}

type renta = {
  plazo: number;
  renta: number;
  ivadeRentaMensual: number;
  rentaMensualTotal: number;
  valorResidualSugerido: number;
};

export type opciones = {
  plazo: number;
  rentaMensual: number;
  ivadeRentaMensual: number;
  rentaMensualTotal: number;
  valorResidualSugerido: number;
};

const obtenerValoresOtrosGastos = async (plazo: number) => {
  try {
    const tablaOtrosGastos = await Valor_Otros_Gastos.findAll({
      where: { deleted: false },
      attributes: [
        "id",
        "plazo",
        "instalacion",
        "gps_anual",
        "gastos_notariales",
        "total",
      ],
    });
    const valorOtrosGastos = tablaOtrosGastos.find(
      (valor) => plazo <= valor.dataValues.plazo
    );
    return valorOtrosGastos?.dataValues.total;
  } catch (error) {
    console.log(error);
  }
};

const obtenerCamposEditables = async (campo: string) => {
  try {
    const tablaCamposEditables = await Editable.findAll({
      where: { deleted: false },
      attributes: ["campo", "valor", "tipo"],
    });
    const porcentajePagoIncial = tablaCamposEditables.find(
      (obj) => obj.dataValues.campo === campo
    );
    return porcentajePagoIncial?.dataValues.valor;
  } catch (error) {
    console.log(error);
  }
};

const obtenerTasas = async (
  plan: string,
  tipoActivo: string,
  plazo: number
) => {
  try {
    const tablaTasas = await Valor_Tasas.findAll({
      where: { deleted: false },
      attributes: [
        "tipo_activo",
        "plazo",
        "tasa_a",
        "tasa_b",
        "tasa_alfa",
        "tasa_beta",
        "tasa_gamma",
      ],
    });
    const valorTasas = tablaTasas.find(
      (valor) =>
        valor.dataValues.tipo_activo === tipoActivo &&
        valor.dataValues.plazo >= plazo
    );

    if (!valorTasas) {
      throw new Error(
        "No se encontró un valor de tasa para el tipo de activo y plazo proporcionados"
      );
    }
    switch (plan) {
      case "tasa_a":
        return valorTasas.dataValues.tasa_a;
      case "tasa_b":
        return valorTasas.dataValues.tasa_b;
      case "tasa_alfa":
        return valorTasas.dataValues.tasa_alfa;
      case "tasa_beta":
        return valorTasas.dataValues.tasa_beta;
      case "tasa_gamma":
        return valorTasas.dataValues.tasa_gamma;
      default:
        throw new Error("Plan no válido");
    }
  } catch (error) {
    console.log(error);
  }
};

const calculatePayment = (
  interestRate: number,
  periods: number,
  presentValue: number,
  futureValue: number,
  paymentFrequency: number
): number => {
  let paymentAmount, presentValueInterestFactor;

  futureValue = futureValue || 0;
  paymentFrequency = paymentFrequency || 0;

  if (interestRate === 0) return -(presentValue + futureValue) / periods;

  presentValueInterestFactor = Math.pow(1 + interestRate, periods);
  paymentAmount =
    (-interestRate *
      (presentValue * presentValueInterestFactor + futureValue)) /
    (presentValueInterestFactor - 1);

  if (paymentFrequency === 1) paymentAmount /= 1 + interestRate;
  return paymentAmount;
};

const selectedValue = (value: number, valueModified: number): number => {
  let newValue = 0;
  if (value != valueModified) {
    if (valueModified === 0) newValue = value;
    if (valueModified > value) newValue = valueModified;
  }
  if (Number.isNaN(newValue)) {
    return 0;
  }
  return newValue;
};

const calculateValuesRenta = (renta: number) => {
  const ivadeRentaMensual = renta * 0.16;
  const rentaMensualTotal = ivadeRentaMensual + renta;
  return { ivadeRentaMensual, rentaMensualTotal };
};

const getResidual = async (plazo: number) => {
  const valoresResiduales = await Valor_Residual.findOne({
    where: { plazo, deleted: false },
    attributes: ["id", "plazo", "minimo", "maximo"],
  });
  if (!valoresResiduales) {
    const valorResidual = await Valor_Residual.findOne({
      where: {
        plazo: { [Op.gt]: plazo },
        deleted: false,
      },
      order: [["plazo", "ASC"]],
      attributes: ["id", "plazo", "minimo", "maximo"],
    });
    if (!valorResidual) {
      return 0;
    }
    return valorResidual.dataValues.maximo;
  }
  return valoresResiduales.dataValues.maximo;
};

const getResiduales = async (plazo: number) => {
  const valoresResiduales = await Valor_Residual.findOne({
    where: { plazo, deleted: false },
    attributes: ["id", "plazo", "minimo", "maximo"],
  });
  if (!valoresResiduales) {
    const valorResidual = await Valor_Residual.findOne({
      where: {
        plazo: { [Op.gt]: plazo },
        deleted: false,
      },
      order: [["plazo", "ASC"]],
      attributes: ["id", "plazo", "minimo", "maximo"],
    });
    if (!valorResidual) {
      const resp: RespuestaDataTasas = {
        isValid: false,
        error: "No se encuentra el valor residual",
      };
      return resp;
    }
    const resp: RespuestaDataTasas = {
      isValid: true,
      data: valorResidual.dataValues as {
        id: number;
        plazo: number;
        minimo: number;
        maximo: number;
      },
    };
    return resp;
  }
  const respIsCorrect: RespuestaDataTasas = {
    isValid: true,
    data: valoresResiduales.dataValues as {
      id: number;
      plazo: number;
      minimo: number;
      maximo: number;
    },
  };
  return respIsCorrect;
};

const isBetween = (
  principal: number,
  inferiror: number,
  superior: number
): boolean => {
  return principal >= inferiror && principal <= superior;
};

const doCalculatePayment = async (
  // plazos: number[],
  plazo: number,
  precioSinIVA: number,
  costoAccesoriosSinIVA: number,
  pagoInicialSinIVA: number,
  tipoTasa: string,
  tipoActivo: string,
  porcentajeComision: number
) => {
  const resultados: renta[] = []; // Aquí se declara como un arreglo de objetos 'renta'
  const plazos = [12, 24, 36, 48];
  switch (plazo) {
    case 12:
      plazos.splice(plazos.indexOf(plazo), 1);
      // console.log("Dentro del caso 1", plazos);
      break;
    case 24:
      plazos.splice(plazos.indexOf(plazo), 1);
      // console.log("Dentro del caso 2", plazos);
      break;
    case 36:
      plazos.splice(plazos.indexOf(plazo), 1);
      // console.log("Dentro del caso 3", plazos);
      break;
    case 48:
      plazos.splice(plazos.indexOf(plazo), 1);
      // console.log("Dentro del caso 4", plazos);
      break;
    default:
    // console.log("Dentro de default");
  }

  for (const plazo of plazos) {
    // // ***********************************************************************************************************
    const otrosGastos = (await obtenerValoresOtrosGastos(plazo)) || 0;
    // // ***********************************************************************************************************
    const tasa = (await obtenerTasas(tipoTasa, tipoActivo, plazo)) || 0.032;
    // // ***********************************************************************************************************
    let montoDelArrendamientoSinIVA =
      precioSinIVA + costoAccesoriosSinIVA + otrosGastos - pagoInicialSinIVA;
    const tasaArmada = parseFloat((tasa / 12 / 100).toFixed(4));
    let valorResidualConvenido = await getResidual(plazo);
    const residual = (valorResidualConvenido / 100) * precioSinIVA;
    let comisionAp = montoDelArrendamientoSinIVA * (porcentajeComision / 100);
    montoDelArrendamientoSinIVA += comisionAp;
    const renta = calculatePayment(
      tasaArmada,
      plazo,
      -montoDelArrendamientoSinIVA,
      residual,
      0
    );
    const { ivadeRentaMensual, rentaMensualTotal } =
      calculateValuesRenta(renta);
    const resultado: renta = {
      plazo,
      renta,
      ivadeRentaMensual,
      rentaMensualTotal,
      valorResidualSugerido: residual,
    }; // Se crea un objeto 'renta' con las propiedades 'plazo' y 'renta'
    resultados.push(resultado);
  }

  return resultados;
};

export const doCotizacion = async (cot: IDTOCotizacion) => {
  // try {
  const {
    cliente,
    enAtencionA,
    tipoCliente,
    promotor,
    correo,
    telefono,
    tipoActivo,
    cantidadUnidades,
    marca,
    modelo,
    version,
    estado,
    valorFactura,
    plazo,
    comisionApertura,
    totalPagoInicial,
    plan,
    tipoSeguro,
    costoSeguro,
    rentasDeposito,
    tipoResidual,
    fondoReserva,
    valorResidualConvenido,
    accesorios,
  } = cot;

  console.log(
    "*******************************************",
    "Aquí están todos los datos:",
    cot,
    "******************************************************************************************"
  );

  // // ***********************************************************************************************************
  const otrosGastos = (await obtenerValoresOtrosGastos(plazo)) || 0;
  console.log("El valor de los otros gastos es: ", otrosGastos);

  // // ***********************************************************************************************************
  const tasa = (await obtenerTasas(plan, tipoActivo, plazo)) || 0.032;
  console.log("La tasa que se tomará en cuenta es: ", tasa);

  // // ***********************************************************************************************************
  const precioSinIVA = valorFactura / 1.16;
  console.log(
    "============================================ACCESORIOS====================================="
  );
  const costoAccesoriosSinIVA =
    Object.keys(accesorios).reduce((total, acc, index) => {
      return total + accesorios[index].valorAccesorio;
    }, 0) / 1.16;
  console.log(costoAccesoriosSinIVA);
  // let costoAccesoriosSinIVA = 0;
  // if (accesorios.length > 0) {
  //   costoAccesoriosSinIVA = accesorios.reduce(
  //     (sum: number, acc: { valorAccesorio: string }) =>
  //       sum + parseFloat(acc.valorAccesorio),
  //     0
  //   );
  // }

  // const pagoInicialSinIVA =
  //   (totalPagoInicial - costoSeguro) / 1.16;
  // costoAccesoriosSinIVA /= 1.16;
  let valorInicialArrendamiento = totalPagoInicial - costoSeguro;
  const pagoInicialSinIVA = (totalPagoInicial - costoSeguro) / 1.16;
  // costoAccesoriosSinIVA /= 1.16;
  console.log("pagoInicialSinIVA: ", pagoInicialSinIVA);
  // TODO sumar rentas en deposito al valorInicialArrendamiento
  console.log("valorInicialArrendamiento: ", valorInicialArrendamiento);

  console.log(
    JSON.stringify(
      {
        precioSinIVA,
        costoAccesoriosSinIVA,
        otrosGastos,
        pagoInicialSinIVA,
      },
      null,
      3
    )
  );

  let montoDelArrendamientoSinIVA =
    precioSinIVA + costoAccesoriosSinIVA + otrosGastos - pagoInicialSinIVA;
  let montoDelArrendamiento = montoDelArrendamientoSinIVA;
  console.log("montoDelArrendamiento", montoDelArrendamiento);
  const tasaArmada = parseFloat((tasa / 12 / 100).toFixed(4));
  let residual = 0;
  console.log("La comision es: ", comisionApertura);
  if (tipoResidual == "Porcentaje") {
    residual = precioSinIVA * (valorResidualConvenido / 100);
    // montoDelArrendamientoSinIVA *= 1 + comisionApertura / 100;
  } else if (tipoResidual == "Cantidad") {
    residual = valorResidualConvenido;
    // montoDelArrendamientoSinIVA += comisionApertura;
  }

  // let comisionApSinIva = 0;
  let comisionAp = comisionApertura;
  if (comisionApertura < 100) {
    let comisionPorApertura =
      montoDelArrendamientoSinIVA * (comisionApertura / 100);
    comisionAp = comisionPorApertura;
    montoDelArrendamientoSinIVA += comisionAp;
    // comisionApSinIva = comisionPorApertura / 1.16;
  } else if (comisionApertura > 100) {
    comisionAp = comisionApertura;
    montoDelArrendamientoSinIVA += comisionAp;
    // comisionApSinIva = comisionApertura / 1.16;
  }
  console.log(
    JSON.stringify(
      {
        tasaArmada,
        plazo,
        montoDelArrendamientoSinIVA,
        residual,
      },
      null,
      3
    )
  );
  const rentaMensual = calculatePayment(
    tasaArmada,
    plazo,
    -montoDelArrendamientoSinIVA,
    residual,
    0
  );
  console.log("Comision: ", comisionAp);

  // // ***********************************************************************************************************
  // const porcentajeMaximo = await obtenerCamposEditables();
  // console.log("---***---Porcentaje es: ", porcentajeMaximo);

  // TODO Terminar total de renta con descuento

  let descuento = 0;
  let nuevaRentaEnDeposito = 0;
  let nuevosParametrosRenta = [
    {
      valorInicial: valorInicialArrendamiento,
      montoArrendamiento: 0,
      rentaMensual: 0,
      descuento,
      totalRentaMensual: 0,
      ivaRenta: 0,
      fondoReserva: 0,
      granTotalRentaMensual: 0,
    },
  ];
  if (rentasDeposito !== 0) {
    const porcentajeDescPorRenta =
      (await obtenerCamposEditables("Descuento mensual por rentas")) || 0;
    const porcentajeDescPorRentaMensual = porcentajeDescPorRenta / 12;

    console.log(".-.-.-.-.-.-.-.-.-.-.-.-.-.", porcentajeDescPorRentaMensual);
    if (porcentajeDescPorRentaMensual != 0) {
      descuento = rentaMensual * (porcentajeDescPorRentaMensual / 100);
    }
    console.log(" EL DESCUENTO ES: ", descuento);
    nuevaRentaEnDeposito = rentaMensual * rentasDeposito;

    nuevosParametrosRenta[0].valorInicial -= rentaMensual * rentasDeposito;
    if (nuevosParametrosRenta[0].valorInicial < 0) {
      console.log("No avanzar");
    }
    console.log(
      "El nuevo valor inicial es:",
      nuevosParametrosRenta[0].valorInicial
    );

    nuevosParametrosRenta[0].montoArrendamiento =
      precioSinIVA +
      costoAccesoriosSinIVA +
      otrosGastos -
      nuevosParametrosRenta[0].valorInicial / 1.16;

    if (comisionApertura < 100) {
      let comisionPorApertura =
        nuevosParametrosRenta[0].montoArrendamiento * (comisionApertura / 100);
      comisionAp = comisionPorApertura;
      nuevosParametrosRenta[0].montoArrendamiento += comisionAp;
      // comisionApSinIva = comisionPorApertura / 1.16;
    } else if (comisionApertura > 100) {
      comisionAp = comisionApertura;
      nuevosParametrosRenta[0].montoArrendamiento += comisionAp;
      // comisionApSinIva = comisionApertura / 1.16;
    }

    console.log(
      JSON.stringify(
        {
          tasaArmada,
          plazo,
          montoArrendamiento: nuevosParametrosRenta[0].montoArrendamiento,
          residual,
        },
        null,
        3
      )
    );
    nuevosParametrosRenta[0].rentaMensual = calculatePayment(
      tasaArmada,
      plazo,
      -nuevosParametrosRenta[0].montoArrendamiento,
      residual,
      0
    );
    console.log(
      JSON.stringify(
        {
          nuevaRenta: nuevosParametrosRenta[0].rentaMensual,
        },
        null,
        3
      )
    );

    nuevosParametrosRenta[0].ivaRenta =
      nuevosParametrosRenta[0].rentaMensual * 0.16;

    // const subtotalRentaMensual = rentaMensual + fondoReservaCantidad;
    nuevosParametrosRenta[0].totalRentaMensual =
      nuevosParametrosRenta[0].rentaMensual - descuento;
    console.log(
      "El subtotal antes del IVA es: ",
      nuevosParametrosRenta[0].totalRentaMensual
    );

    if (fondoReserva) {
      nuevosParametrosRenta[0].fondoReserva =
        nuevosParametrosRenta[0].totalRentaMensual * (fondoReserva / 100);
    }
    console.log(
      "**********El fondo de reserva expresado en cantidad es: ",
      nuevosParametrosRenta[0].fondoReserva
    );

    nuevosParametrosRenta[0].granTotalRentaMensual =
      nuevosParametrosRenta[0].ivaRenta +
      nuevosParametrosRenta[0].totalRentaMensual +
      nuevosParametrosRenta[0].fondoReserva;
    console.log(
      "El total de la renta mensual con IVA más el sutotal es: ",
      nuevosParametrosRenta[0].granTotalRentaMensual
    );
  }

  const ivadeRentaMensual = rentaMensual * 0.16;

  // const subtotalRentaMensual = rentaMensual + fondoReservaCantidad;
  const subtotalRentaMensual = rentaMensual - descuento;
  console.log("El subtotal antes del IVA es: ", subtotalRentaMensual);

  let fondoReservaCantidad = 0;
  if (fondoReserva) {
    fondoReservaCantidad = subtotalRentaMensual * (fondoReserva / 100);
  }
  console.log(
    "**********El fondo de reserva expresado en cantidad es: ",
    fondoReservaCantidad
  );

  const rentaMensualTotal =
    ivadeRentaMensual + subtotalRentaMensual + fondoReservaCantidad;
  console.log(
    "El total de la renta mensual con IVA más el sutotal es: ",
    rentaMensualTotal
  );

  // ----------------------------------- // ------------------------------ // ---------------------------- // -----------------------------------
  // let totalRentaDescuento = rentaMensual;
  // let totalRentas = 0;
  // if (rentasDeposito) {
  //   totalRentas = rentasDeposito * rentaMensual;
  // }
  // let maximoAnticipoArrendamiento =
  //   totalPagoInicial - (costoSeguro + totalRentas);
  // const excedente = await calculatePorcentage(
  //   totalPagoInicial,
  //   maximoAnticipoArrendamiento
  // );
  // let nuevoTotalPagoInicial = totalPagoInicial;
  // if (excedente < 0) {
  //   console.log("Algo ocurrio en el llamado");
  // } else if (excedente > 0) {
  //   nuevoTotalPagoInicial += excedente;
  //   console.log("Mostrar excedente: ", excedente);
  // }

  // let fondoReservaCantidad = 0;
  // if (fondoReserva) {
  //   fondoReservaCantidad = totalRentaDescuento * (fondoReserva / 100);
  // }
  // console.log(
  //   "**********El fondo de reserva expresado en cantidad es: ",
  //   fondoReservaCantidad
  // );

  // const ivadeRentaMensual = rentaMensual * 0.16;

  // const subtotalRentaMensual = rentaMensual + fondoReservaCantidad;
  // const subtotalRentaMensual = rentaMensual - descuento;
  // console.log("El subtotal antes del IVA es: ", subtotalRentaMensual);

  // const rentaMensualTotal = ivadeRentaMensual + subtotalRentaMensual;
  // console.log(
  //   "El total de la renta mensual con IVA más el sutotal es: ",
  //   rentaMensualTotal
  // );

  // ************************************************************************* //

  const resultadosRentas = await doCalculatePayment(
    plazo,
    precioSinIVA,
    costoAccesoriosSinIVA,
    pagoInicialSinIVA,
    plan,
    tipoActivo,
    comisionApertura
  );
  const opc_rentas: opciones[] = [];
  if (resultadosRentas.length > 0) {
    for (let index = 0; index < resultadosRentas.length; index++) {
      const opcionesValores: opciones = {
        plazo: resultadosRentas[index].plazo,
        rentaMensual: resultadosRentas[index].renta,
        ivadeRentaMensual: resultadosRentas[index].ivadeRentaMensual,
        rentaMensualTotal: resultadosRentas[index].rentaMensualTotal,
        valorResidualSugerido: resultadosRentas[index].valorResidualSugerido,
      };
      opc_rentas.push(opcionesValores);
    }
  }

  const resultados: resultado = {
    cantidadUnidades: cantidadUnidades,
    cliente: cliente,
    enAtencionA: enAtencionA,
    tipoCliente: tipoCliente,
    tipoActivo: tipoActivo,
    montoArrendamientoFinal: selectedValue(
      montoDelArrendamientoSinIVA,
      nuevosParametrosRenta[0].montoArrendamiento
    ),
    comisionApertura: comisionAp,
    valorInicialArrendamiento:
      valorInicialArrendamiento != nuevosParametrosRenta[0].valorInicial
        ? nuevosParametrosRenta[0].valorInicial
        : valorInicialArrendamiento,
    valorResidualSinIva: residual,
    seguroAnualConIVA: costoSeguro,
    totalPagoInicial: totalPagoInicial,
    costoAccesorios: costoAccesoriosSinIVA * 1.16,
    rentaMensual: selectedValue(
      rentaMensual,
      nuevosParametrosRenta[0].rentaMensual
    ),
    rentasDeposito:
      rentasDeposito === 0 ? rentasDeposito : nuevaRentaEnDeposito,
    descuentoMxRD: descuento,
    subtotalRentaMensual:
      nuevosParametrosRenta[0].totalRentaMensual != 0
        ? nuevosParametrosRenta[0].totalRentaMensual
        : subtotalRentaMensual,
    ivadeRentaMensual:
      nuevosParametrosRenta[0].ivaRenta != 0
        ? nuevosParametrosRenta[0].ivaRenta
        : ivadeRentaMensual,
    fondoReserva:
      nuevosParametrosRenta[0].fondoReserva != 0
        ? nuevosParametrosRenta[0].fondoReserva
        : fondoReservaCantidad,
    rentaMensualTotal:
      nuevosParametrosRenta[0].granTotalRentaMensual != 0
        ? nuevosParametrosRenta[0].granTotalRentaMensual
        : rentaMensualTotal,
    opciones: opc_rentas,
  };

  // No existe un error como tal, es de typescript por el tipado
  // const sumaa = accesorio.reduce(
  //   (sum: number, acc: { valorAccesorio: number }) =>
  //     sum + acc.valorAccesorio,
  //   0
  // );
  // // console.log('En Cotiza, el valor factura:', valorFactura)
  // let vFSInIVA = valorFactura / 1.16;
  // let valorResidualSinIva = 0;
  // if (tipoResidual === "Porcentaje") {
  //   valorResidualSinIva = vFSInIVA * (valorResidualConvenido / 100);
  //   // valorResidualSinIva = valorResidual / 1.16
  // } else if (tipoResidual === "Cantidad") {
  //   valorResidualSinIva = valorResidualConvenido / 1.16;
  // }
  // resultados.valorResidualSinIva = valorResidualSinIva;
  // console.log("valor residual", valorResidualSinIva);

  // let valorInicialArrendamiento = anticipoArrendamiento;
  // let ValorInicialArr = rentasDeposito + costoSeguro;
  // if (valorInicialArrendamiento > 0) {
  //   valorInicialArrendamiento = ValorInicialArr - valorInicialArrendamiento;
  // }

  // resultados.valorInicialArrendamiento = valorInicialArrendamiento;
  // console.log(
  //   "Aquí esta el valor inicial del arrendamiento",
  //   valorInicialArrendamiento
  // );

  // let totalDelPagoInicial =
  //   anticipoArrendamiento + (costoSeguro + rentasDeposito);
  // console.log("El total del pago inicial es: ", totalDelPagoInicial);

  // let montoArrendamiento =
  //   valorFactura + sumaa + otrosGastos * 1.16 - anticipoArrendamiento;

  // console.log("Monto Arrendamiento: ", montoArrendamiento);
  // let comisionPorAperturaExcel =
  //   (montoArrendamiento * comisionApertura) / 100;
  // // console.log('Comisión Con IVA', comisionPorAperturaExcel)
  // let comisionApSinIva = comisionPorAperturaExcel / 1.16;
  // console.log("Comision: ", comisionApSinIva);
  // resultados.comision = comisionApSinIva;
  // let montoArrendamientoFinal = montoArrendamiento + comisionPorAperturaExcel;
  // // console.log('Arrendamiento final', montoArrendamientoFinal)
  // let montoArrendamientoFinalSinIva = montoArrendamientoFinal / 1.16;
  // console.log("Arrendamiento Sin iva", montoArrendamientoFinalSinIva);
  // resultados.montoArrendamientoFinal = montoArrendamientoFinalSinIva;

  // console.log("El plan es: ", plan);
  // console.log("El tipo de activo: ", tipoActivo);

  // const rentaMensual = calculatePayment(
  //   tasa / 100,
  //   plazo,
  //   -montoArrendamientoFinalSinIva,
  //   valorResidualSinIva,
  //   0
  // );
  // console.log("Resultado con la otra función: ", rentaMensual);
  // resultados.rentaMensual = rentaMensual;
  // console.log("Renta mensual", rentaMensual);

  // console.log(
  //   "****************************************************************************************************************************"
  // );

  // const valorFacturaExcelSinIVA = valorFactura / 1.16;
  // console.log("El valor factura sin IVA: ", valorFacturaExcelSinIVA);

  // const totalDelPagoInicialExcelSinIVA =
  //   (anticipoArrendamiento - costoSeguro) / 1.16;
  // console.log(
  //   "El total del pago inicial sin IVA: ",
  //   totalDelPagoInicialExcelSinIVA
  // );

  // console.log("---------------------------------");
  // console.log("El valor de los otros gastos es: ", otrosGastos);
  // const montoDelArrendamientoExcelSinIVA =
  //   valorFacturaExcelSinIVA +
  //   otrosGastos +
  //   sumaa -
  //   totalDelPagoInicialExcelSinIVA;
  // console.log(
  //   "El monto del arrendamiento es: ",
  //   montoDelArrendamientoExcelSinIVA
  // );

  // let comisionPorAperturaExcel1 = comisionApertura;
  // if (comisionApertura < 100) {
  //   console.log("Dentro de la condicional");
  //   comisionPorAperturaExcel1 =
  //     montoDelArrendamientoExcelSinIVA * (comisionApertura / 100);
  // }
  // console.log("Comision: ", comisionPorAperturaExcel1);

  // const anticipoDelArrendamiento =
  //   anticipoArrendamiento - (costoSeguro + rentasDeposito);
  // console.log("El anticipo del arrendamiento es: ", anticipoDelArrendamiento);

  // const porcentajeMaximo = await obtenerCamposEditablesPorcentajeMaximo();
  // console.log("Los campos son: ", porcentajeMaximo);

  // let valorExcedente = 0;
  // if (porcentajeMaximo) {
  //   valorExcedente = valorFactura * (porcentajeMaximo / 100);
  // }
  // console.log("El valor excedente es: ", valorExcedente);

  // const calculaRentasEnDeposito = () => {
  //   if (anticipoDelArrendamiento > valorExcedente) {
  //     let diferenciaDelAnticipoDeArrendamiento =
  //       anticipoDelArrendamiento - valorExcedente;
  //     return rentasDeposito + diferenciaDelAnticipoDeArrendamiento;
  //   }
  //   return rentasDeposito;
  // };
  // const rentasEnDeposito = calculaRentasEnDeposito();
  // console.log("Las rentas en deposito son: ", rentasEnDeposito);

  // console.log(
  //   "****************---------------***************_______**************"
  // );
  // console.log("Los datos que se envian a la formula son: ");
  // const tasaRedondeada = parseFloat((tasa / 12).toFixed(3)) / 100;
  // console.log("----------------------- La tasa es: ", tasaRedondeada);
  // console.log("----------------------- El plazo es: ", plazo);
  // const montoDelArrendamientoMasComisiónExcelSinIva = parseFloat(
  //   (montoDelArrendamientoExcelSinIVA + comisionPorAperturaExcel1).toFixed(2)
  // );
  // console.log(
  //   "----------------------- El monto del arrendamiento final es: ",
  //   montoDelArrendamientoMasComisiónExcelSinIva
  // );
  // console.log(
  //   "----------------------- ********************** -------------------------"
  // );
  // const tasaHecha = parseFloat((29 / 12 / 100).toFixed(4));
  // console.log("La tasa hecha es: ", tasaHecha);
  // const rentaMensualNuevoCalculo = calculatePayment(
  //   tasaHecha,
  //   plazo,
  //   -montoDelArrendamientoMasComisiónExcelSinIva,
  //   valorResidualSinIva,
  //   0
  // );
  // console.log("La renta mensual es: ", rentaMensualNuevoCalculo);

  // console.log(
  //   "****************************************************************************************************************************"
  // );

  // for (let index = 0; index < 10; index++) {
  //   console.log("*");
  // }
  // console.log("Valor factura: ", valorFactura);
  // const valorDeLaFacturaSinIva = valorFactura / 1.16;
  // console.log("Costo de los accesorios: ", sumaa);
  // console.log("Monto del arrendamiento: (PENDIENTE)");
  // console.log("Anticipo del arrendamiento: ", anticipoArrendamiento);
  // console.log("Rentas en deposito: ", rentasDeposito);
  // const totalDelPagoInicialBueno =
  //   (anticipoArrendamiento - costoSeguro) / 1.16;
  // console.log("Seguro anual con IVA: ", costoSeguro);
  // console.log("Valor residual sin IVA: ", valorResidualConvenido / 1.16);
  // let totalDelPagoInicialPDF =
  //   anticipoArrendamiento + costoSeguro + rentasDeposito;
  // console.log("El total del pago inicial es: ", totalDelPagoInicialPDF);
  // const calculaMontoDelArrendamiento =
  //   valorDeLaFacturaSinIva +
  //   sumaa +
  //   otrosGastos -
  //   (anticipoArrendamiento - costoSeguro) / 1.16;
  // console.log(
  //   " *[ El monto del arrendamiento es ]* ",
  //   calculaMontoDelArrendamiento
  // );
  // console.log("(");
  // console.log("Valor residual", valorResidualConvenido);
  // console.log("Valor factura sin IVA: ", valorDeLaFacturaSinIva);
  // console.log(
  //   "El total del pago inicial sin IVA: ",
  //   totalDelPagoInicialBueno
  // );
  // console.log(")");
  // const montoDelArrendamientoBueno =
  //   valorDeLaFacturaSinIva + otrosGastos + sumaa - totalDelPagoInicialBueno;
  // let comisionPorAperturaBuena = comisionApertura;
  // if (comisionApertura < 100) {
  //   console.log("Dentro de la condicional");
  //   comisionPorAperturaExcel1 =
  //     montoDelArrendamientoBueno * (comisionApertura / 100);
  // }
  // console.log("Comisión por apertura:  ", comisionPorAperturaBuena);
  // console.log("Valor inicial del arrendamiento o total del pago inicial: ");

  console.log(
    "****************************************************************************************************************************"
  );

  // for (let index = 0; index < 10; index++) {
  //   console.log("*");
  // }
  // } catch (error) {
  //   console.log(error);
  // }
  if (resultados) {
    console.log("EL RESULTADO ES: ");
    console.log(resultados);
  }
  return resultados;
};

export const doCotCliente = async (cot: IDTOCotCliente) => {
  const resultados = {
    tipoActivo: "",
    plazo: 0,
    valorFactura: 0,
    cantidadUnidades: 1,
    valorResidualSinIva: 0,
    valorInicialArrendamiento: 0,
    montoArrendamientoFinal: 0,
    costoAccesorios: 0,
    totalPagoInicial: 0,
    comisionApertura: 0,
    rentaMensual: 0,
    ivadeRentaMensual: 0,
    rentaMensualTotal: 0,
    opciones: [] as opciones[],
  };
  const { tipoActivo, valorFactura, plazo, totalPagoInicial } = cot;

  const porcentajeComision = 3;
  const tipoTasa = "tasa_alfa";
  const pagoInicialSinIVA = totalPagoInicial / 1.16;
  const precioSinIVA = valorFactura / 1.16;
  let valorInicialArrendamiento: number = 0;
  if (totalPagoInicial) {
    valorInicialArrendamiento = totalPagoInicial;
  }
  // console.log("pagoInicialSinIVA: ", pagoInicialSinIVA);
  // console.log("valorInicialArrendamiento: ", valorInicialArrendamiento);

  // console.log(
  //   "*******************************************",
  //   "Aquí están todos los datos:",
  //   cot,
  //   "******************************************************************************************"
  // );

  // // ***********************************************************************************************************
  const otrosGastos = (await obtenerValoresOtrosGastos(plazo)) || 0;
  // console.log("El valor de los otros gastos es: ", otrosGastos);

  // // ***********************************************************************************************************
  // console.log(JSON.stringify({ tipoTasa, tipoActivo, plazo }));
  const tasa =
    tipoActivo === "Bicicletas"
      ? 45
      : (await obtenerTasas(tipoTasa, tipoActivo, plazo)) || 32;
  console.log("La tasa que se tomará en cuenta es: ", tasa);

  // // ***********************************************************************************************************

  // console.log(
  //   JSON.stringify(
  //     {
  //       precioSinIVA,
  //       costoAccesoriosSinIVA: 0,
  //       otrosGastos,
  //       pagoInicialSinIVA,
  //     },
  //     null,
  //     3
  //   )
  // );

  let montoDelArrendamientoSinIVA =
    precioSinIVA + otrosGastos - pagoInicialSinIVA;
  const tasaArmada = parseFloat((tasa / 12 / 100).toFixed(4));
  let valorResidualConvenido = await getResidual(plazo);
  const residual = (valorResidualConvenido / 100) * (valorFactura / 1.16);
  let comisionAp = montoDelArrendamientoSinIVA * (porcentajeComision / 100);
  montoDelArrendamientoSinIVA += comisionAp;

  // console.log(
  //   JSON.stringify(
  //     {
  //       tasaArmada,
  //       plazo,
  //       montoDelArrendamientoSinIVA,
  //       residual,
  //     },
  //     null,
  //     3
  //   )
  // );
  const rentaMensual = calculatePayment(
    tasaArmada,
    plazo,
    -montoDelArrendamientoSinIVA,
    residual,
    0
  );
  const costoAccesoriosSinIVA = 0;

  if (tipoActivo === "Bicicletas" || tipoActivo === "Motocicleta") {
    const { ivadeRentaMensual, rentaMensualTotal } =
      calculateValuesRenta(rentaMensual);
    resultados.plazo = plazo;
    resultados.tipoActivo = tipoActivo;
    resultados.valorFactura = valorFactura;
    resultados.montoArrendamientoFinal = montoDelArrendamientoSinIVA;
    resultados.comisionApertura = comisionAp;
    resultados.valorInicialArrendamiento = valorInicialArrendamiento;
    resultados.valorResidualSinIva = residual;
    resultados.totalPagoInicial = totalPagoInicial == 0 ? 0 : totalPagoInicial;
    resultados.costoAccesorios = costoAccesoriosSinIVA * 1.16;
    resultados.rentaMensual = rentaMensual;
    resultados.ivadeRentaMensual = ivadeRentaMensual;
    resultados.rentaMensualTotal = rentaMensualTotal;

    return resultados;
  }

  const resultadosRentas = await doCalculatePayment(
    plazo,
    precioSinIVA,
    costoAccesoriosSinIVA,
    pagoInicialSinIVA,
    tipoTasa,
    tipoActivo,
    porcentajeComision
  );

  const { ivadeRentaMensual, rentaMensualTotal } =
    calculateValuesRenta(rentaMensual);
  resultados.plazo = plazo;
  resultados.tipoActivo = tipoActivo;
  resultados.valorFactura = valorFactura;
  resultados.montoArrendamientoFinal = montoDelArrendamientoSinIVA;
  resultados.comisionApertura = comisionAp;
  resultados.valorInicialArrendamiento = valorInicialArrendamiento;
  resultados.valorResidualSinIva = residual;
  resultados.totalPagoInicial = totalPagoInicial == 0 ? 0 : totalPagoInicial;
  resultados.costoAccesorios = costoAccesoriosSinIVA * 1.16;
  resultados.rentaMensual = rentaMensual;
  resultados.ivadeRentaMensual = ivadeRentaMensual;
  resultados.rentaMensualTotal = rentaMensualTotal;
  if (resultadosRentas.length > 0) {
    for (let index = 0; index < resultadosRentas.length; index++) {
      const opcionesValores: opciones = {
        plazo: resultadosRentas[index].plazo,
        rentaMensual: resultadosRentas[index].renta,
        ivadeRentaMensual: resultadosRentas[index].ivadeRentaMensual,
        rentaMensualTotal: resultadosRentas[index].rentaMensualTotal,
        valorResidualSugerido: resultadosRentas[index].valorResidualSugerido,
      };
      resultados.opciones.push(opcionesValores);
    }
  }
  // console.log(resultados);
  return resultados;
};

// Se modificará la renta
export const doCotWithRenta = async (cot: IDTOCotizacion) => {
  // try {
  const {
    cliente,
    enAtencionA,
    tipoCliente,
    tipoActivo,
    cantidadUnidades,
    valorFactura,
    plazo,
    comisionApertura,
    totalPagoInicial,
    plan,
    tipoSeguro,
    costoSeguro,
    rentasDeposito,
    tipoResidual,
    fondoReserva,
    valorResidualConvenido,
    accesorios,
    isEspecial,
  } = cot;
  // console.log(isEspecial);

  // // ***********************************************************************************************************
  const otrosGastos = (await obtenerValoresOtrosGastos(plazo)) || 0;
  // console.log("El valor de los otros gastos es: ", otrosGastos);

  // // ***********************************************************************************************************
  const tasa = (await obtenerTasas(plan, tipoActivo, plazo)) || 32;
  // console.log("La tasa que se tomará en cuenta es: ", tasa);

  // // ***********************************************************************************************************
  const residuales = await getResiduales(plazo);
  // console.log(residuales);
  if (residuales.isValid) {
    if (!tipoResidual) {
      return {
        isCorrect: false,
        error: ["Favor de ingresar un valor residual"],
      };
    }
    const valorResidual: {
      id: number;
      plazo: number;
      minimo: number;
      maximo: number;
    } = residuales.data;
    const valorMaximo = valorResidual.maximo;
    const valorMinimo = valorResidual.minimo;
    if (tipoResidual === "Porcentaje") {
      const resp = isBetween(valorResidualConvenido, valorMinimo, valorMaximo);
      if (!resp) {
        return {
          isCorrect: false,
          error: [
            "Favor de ingresar en el valor residual un valor entre " +
              valorMinimo +
              " y " +
              valorMaximo,
          ],
        } as respuestaCot;
      }
    } else if (tipoResidual === "Cantidad") {
      const precioSinIVA = valorFactura / 1.16;
      const min = (precioSinIVA * valorMinimo) / 100;
      const max = (precioSinIVA * valorMaximo) / 100;
      const resp = isBetween(valorResidualConvenido, min, max);
      if (!resp) {
        return {
          isCorrect: false,
          error: [
            "Favor de ingresar en el valor residual un valor entre " +
              min.toFixed(2) +
              " y " +
              max.toFixed(2),
          ],
        } as respuestaCot;
      }
    }
    // console.log(resp);
  }

  // // ***********************************************************************************************************
  const precioSinIVA = valorFactura / 1.16;
  const costoAccesoriosSinIVA =
    Object.keys(accesorios).reduce((total, acc, index) => {
      return total + accesorios[index].valorAccesorio;
    }, 0) / 1.16;
  const precioSeguro = tipoSeguro !== "Incluido" ? 0 : costoSeguro;

  let rentasDepNuevo = rentasDeposito;
  let valorInicialArrendamiento = 0;
  if (isEspecial) {
    let rentasDepNuevo = rentasDeposito;
    // const valorExcedente = totalPagoInicial - valorFactura * 0.45;
    valorInicialArrendamiento =
      totalPagoInicial - rentasDeposito - precioSeguro;

    if (valorInicialArrendamiento > valorFactura * 0.45) {
      rentasDepNuevo += valorInicialArrendamiento;
    }
  } else {
    const valorExcedente = totalPagoInicial - valorFactura * 0.45;
    if (totalPagoInicial > valorFactura * 0.45) {
      // console.log("EN CONDICIONAL");
      rentasDepNuevo = valorExcedente - precioSeguro;
      valorInicialArrendamiento = valorFactura * 0.45;
    } else {
      // console.log("EN ELSE");
      valorInicialArrendamiento =
        totalPagoInicial - precioSeguro - rentasDepNuevo;
    }
  }

  const pagoInicialSinIVA = valorInicialArrendamiento / 1.16;
  let montoDelArrendamientoSinIVA =
    precioSinIVA + costoAccesoriosSinIVA + otrosGastos - pagoInicialSinIVA;
  // let montoDelArrendamiento = montoDelArrendamientoSinIVA;
  // console.log("montoDelArrendamiento", montoDelArrendamiento);
  const tasaArmada = parseFloat((tasa / 12 / 100).toFixed(4));
  let residual = 0;
  // console.log("La comision es: ", comisionApertura);
  if (tipoResidual == "Porcentaje") {
    residual = precioSinIVA * (valorResidualConvenido / 100);
  } else if (tipoResidual == "Cantidad") {
    residual = valorResidualConvenido;
  }

  let comisionAp = comisionApertura;
  if (comisionApertura < 100) {
    let comisionPorApertura =
      montoDelArrendamientoSinIVA * (comisionApertura / 100);
    comisionAp = comisionPorApertura;
    montoDelArrendamientoSinIVA += comisionAp;
  } else if (comisionApertura > 100) {
    comisionAp = comisionApertura;
    montoDelArrendamientoSinIVA += comisionAp;
  }
  const rentaMensual = calculatePayment(
    tasaArmada,
    plazo,
    -montoDelArrendamientoSinIVA,
    residual,
    0
  );
  let descuento = 0;
  let nuevaRentaEnDeposito = rentasDepNuevo;

  if (rentasDeposito) {
    const porcentajeDescPorRenta =
      (await obtenerCamposEditables("Descuento mensual por rentas")) || 0;
    const porcentajeDescPorRentaMensual = porcentajeDescPorRenta / 12;

    if (porcentajeDescPorRentaMensual != 0) {
      descuento = rentasDeposito * (porcentajeDescPorRentaMensual / 100);
    }
  }

  const subtotalRentaMensual = rentaMensual - descuento;
  const ivadeRentaMensual = subtotalRentaMensual * 0.16;

  let fondoReservaCantidad = 0;
  if (fondoReserva) {
    fondoReservaCantidad = subtotalRentaMensual * (fondoReserva / 100);
  }

  const rentaMensualTotal =
    ivadeRentaMensual + subtotalRentaMensual + fondoReservaCantidad;

  const resultadosRentas = await doCalculatePaymentv2(
    plazo,
    precioSinIVA,
    costoAccesoriosSinIVA,
    pagoInicialSinIVA,
    plan,
    tipoActivo,
    comisionApertura,
    fondoReserva,
    rentasDeposito,
    totalPagoInicial,
    precioSeguro
  );

  const opc_rentas: rentav2[] = [];
  if (resultadosRentas.length > 0) {
    for (let index = 0; index < resultadosRentas.length; index++) {
      const opcionesValores: rentav2 = {
        plazo: resultadosRentas[index].plazo,
        rentaMensual: resultadosRentas[index].rentaMensual,
        ivadeRentaMensual: resultadosRentas[index].ivadeRentaMensual,
        rentaMensualTotal: resultadosRentas[index].rentaMensualTotal,
        valorResidualSugerido: resultadosRentas[index].valorResidualSugerido,
        descuentoMxRD: resultadosRentas[index].descuentoMxRD,
        fondoReserva: resultadosRentas[index].fondoReserva,
        subtotalRentaMensual: resultadosRentas[index].subtotalRentaMensual,
      };
      opc_rentas.push(opcionesValores);
    }
  }

  const descripcionAccesorios = accesorios.map((objeto) => {
    return {
      nombreAccesorio: objeto.descripcionAccesorio,
      descripcionAccesorio: objeto.nombreAccesorio,
      valorAccesorio: objeto.valorAccesorio,
    } as descripcionAccesoriosType;
  });

  const resultados: resultadov2 = {
    cantidadUnidades: cantidadUnidades,
    cliente: cliente,
    enAtencionA: enAtencionA,
    tipoCliente: tipoCliente,
    tipoActivo: tipoActivo,
    montoArrendamientoFinal: montoDelArrendamientoSinIVA,
    comisionApertura: comisionAp,
    valorInicialArrendamiento,
    valorResidualSinIva: residual,
    seguroAnualConIVA: precioSeguro,
    totalPagoInicial,
    costoAccesorios: costoAccesoriosSinIVA * 1.16,
    rentaMensual,
    rentasDeposito: nuevaRentaEnDeposito,
    descuentoMxRD: descuento,
    subtotalRentaMensual,
    ivadeRentaMensual,
    fondoReserva: fondoReservaCantidad,
    rentaMensualTotal,
    descripcionAccesorios,
    opciones:
      tipoActivo === "Bicicletas" || tipoActivo === "Motocicleta"
        ? []
        : (opc_rentas as rentav2[]),
  };

  return {
    isCorrect: true,
    data: resultados,
  } as respuestaCot;
};

export const verifyRules = (
  valorFactura: number,
  totalPagoInicial: number,
  tipoSeguro: string,
  costoSeguro: number,
  rentasDeposito: number
): RespuestaValidacion => {
  const respuesta: RespuestaValidacion = {
    error: "",
    isValid: true,
  };
  if (valorFactura == 0) {
    const retorno: RespuestaValidacion = {
      error: "El valor de la factura no puede ser cero",
      isValid: false,
    };
    return retorno;
  }
  const limite = valorFactura * 0.45;
  if (totalPagoInicial > limite) {
    const retorno: RespuestaValidacion = {
      error:
        "El pago inicial no puede ser mayor al 45% del valor de la factura",
      isValid: false,
    };
    return retorno;
  }
  const precioSeguro = tipoSeguro !== "Incluido" ? 0 : costoSeguro;
  const sum = precioSeguro + rentasDeposito;
  const dif = totalPagoInicial - sum;
  const msg = "El pago inicial debe ser al menos: " + sum;
  if (dif < 0) {
    const retorno: RespuestaValidacion = {
      error: msg,
      isValid: false,
    };
    return retorno;
  }
  return respuesta;
};

// ************************************************************** // Versión 2  de algunas funciones
export type rentav2 = {
  plazo: number;
  rentaMensual: number;
  descuentoMxRD: number;
  subtotalRentaMensual: number;
  ivadeRentaMensual: number;
  fondoReserva: number;
  rentaMensualTotal: number;
  valorResidualSugerido: number;
};

const doCalculatePaymentv2 = async (
  // plazos: number[],
  plazo: number,
  precioSinIVA: number,
  costoAccesoriosSinIVA: number,
  pagoInicialSinIVA: number,
  tipoTasa: string,
  tipoActivo: string,
  porcentajeComision: number,
  fondoReserva: number,
  rentasDeposito: number,
  totalPagoInicial: number,
  costoSeguro: number
) => {
  const resultados: rentav2[] = []; // Aquí se declara como un arreglo de objetos 'renta'
  const plazos = [12, 24, 36, 48];
  switch (plazo) {
    case 12:
      plazos.splice(plazos.indexOf(plazo), 1);
      // console.log("Dentro del caso 1", plazos);
      break;
    case 24:
      plazos.splice(plazos.indexOf(plazo), 1);
      // console.log("Dentro del caso 2", plazos);
      break;
    case 36:
      plazos.splice(plazos.indexOf(plazo), 1);
      // console.log("Dentro del caso 3", plazos);
      break;
    case 48:
      plazos.splice(plazos.indexOf(plazo), 1);
      // console.log("Dentro del caso 4", plazos);
      break;
    default:
    // console.log("Dentro de default");
  }

  for (const plazo of plazos) {
    // // ***********************************************************************************************************
    const otrosGastos = (await obtenerValoresOtrosGastos(plazo)) || 0;
    // // ***********************************************************************************************************
    const tasa = (await obtenerTasas(tipoTasa, tipoActivo, plazo)) || 0.032;
    // // ***********************************************************************************************************
    let montoDelArrendamientoSinIVA =
      precioSinIVA + costoAccesoriosSinIVA + otrosGastos - pagoInicialSinIVA;
    const tasaArmada = parseFloat((tasa / 12 / 100).toFixed(4));
    let valorResidualConvenido = await getResidual(plazo);
    const residual = (valorResidualConvenido / 100) * precioSinIVA;
    let comisionAp = montoDelArrendamientoSinIVA * (porcentajeComision / 100);
    montoDelArrendamientoSinIVA += comisionAp;
    const rentaMensual = calculatePayment(
      tasaArmada,
      plazo,
      -montoDelArrendamientoSinIVA,
      residual,
      0
    );
    let descuento = 0;

    if (rentasDeposito) {
      const porcentajeDescPorRenta =
        (await obtenerCamposEditables("Descuento mensual por rentas")) || 0;
      const porcentajeDescPorRentaMensual = porcentajeDescPorRenta / 12;

      if (porcentajeDescPorRentaMensual != 0) {
        descuento = rentasDeposito * (porcentajeDescPorRentaMensual / 100);
      }
    }
    const subtotalRentaMensual = rentaMensual - descuento;
    const ivadeRentaMensual = subtotalRentaMensual * 0.16;

    let fondoReservaCantidad = 0;
    if (fondoReserva) {
      fondoReservaCantidad = subtotalRentaMensual * (fondoReserva / 100);
    }

    const rentaMensualTotal =
      ivadeRentaMensual + subtotalRentaMensual + fondoReservaCantidad;

    const resultado: rentav2 = {
      plazo,
      rentaMensual,
      descuentoMxRD: descuento,
      ivadeRentaMensual,
      subtotalRentaMensual,
      fondoReserva: fondoReservaCantidad,
      rentaMensualTotal,
      valorResidualSugerido: residual,
    }; // Se crea un objeto 'renta' con las propiedades 'plazo' y 'renta'
    resultados.push(resultado);
  }

  return resultados;
};
