
export const calculateTotal = (data: { instalacion: number, gps_anual: number, gastos_notariales: number }) => {
    const { instalacion, gps_anual, gastos_notariales } = data
    const total = instalacion + gps_anual + gastos_notariales
    return total
}
