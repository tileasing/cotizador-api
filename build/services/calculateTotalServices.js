"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotal = void 0;
const calculateTotal = (data) => {
    const { instalacion, gps_anual, gastos_notariales } = data;
    const total = instalacion + gps_anual + gastos_notariales;
    return total;
};
exports.calculateTotal = calculateTotal;
