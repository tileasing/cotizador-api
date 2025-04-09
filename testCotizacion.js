const funcionPago = (interestRate, periods, presentValue, futureValue, paymentFrequency) => {
    let paymentAmount, presentValueInterestFactor;

    futureValue = futureValue || 0;
    paymentFrequency = paymentFrequency || 0;

    if (interestRate === 0)
        return -(presentValue + futureValue) / periods;

    presentValueInterestFactor = Math.pow(1 + interestRate, periods);
    paymentAmount = -interestRate * (presentValue * presentValueInterestFactor + futureValue) / (presentValueInterestFactor - 1);

    if (paymentFrequency === 1)
        paymentAmount /= (1 + interestRate);
    return paymentAmount;
}

const cotizacion = (
    precioActivo,
    plazo,
    comisionApertura,
    anticipoArrendamiento,
    costoSeguro,
    tipoResidual,
    valorResidualConvenido,
    otrosGastos,
    accesorios,
    rentasDeposito,
    tipoSeguro,
    plan
) => {
    const precioSinIVA = precioActivo / 1.16
    let costoAccesoriosSinIVA = 0
    if (accesorios.length > 0) {
        for (let accesorio of accesorios) {
            costoAccesoriosSinIVA += accesorio.precio
        }
    }
    const pagoIncialArrendamientoSinIVA = (anticipoArrendamiento - costoSeguro) / 1.16
    costoAccesoriosSinIVA /= 1.16
    let montoDelArrendamientoSinIVA = precioSinIVA + costoAccesoriosSinIVA + otrosGastos - pagoIncialArrendamientoSinIVA
    console.log('Esta es la tasa que se está usando: ', parseFloat(((32 / 12) / 100).toFixed(4)))
    const rentaMensual = funcionPago(parseFloat(((32 / 12) / 100).toFixed(4)), plazo, -montoDelArrendamientoSinIVA, valorResidualConvenido, 0)
    if (tipoResidual == 'Porcentaje') {
        montoDelArrendamientoSinIVA *= (1 + (comisionApertura / 100))
    } else if (tipoResidual == 'Cantidad') {
        montoDelArrendamientoSinIVA += comisionApertura
    }
    console.log(JSON.stringify({
        rentaMensual,
        montoDelArrendamientoSinIVA
    }, null, 3))
}
cotizacion(313900, 48, 8191.66, 24695.35, 9155, 'Cantidad', 40590.52, 22700, [{ precio: 1207.6 }], null, null, null)


cotizacion(313900, 48, 8384.34, 24695.35, 9155, 'Cantidad', 40590.52, 22700, [{ precio: 8658 }], null, null, null)