"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyValorFacturaCliente = exports.getTypeOfUser = void 0;
const administrador_1 = require("../models/administrador");
const cliente_1 = require("../models/cliente");
const getTypeOfUser = (obj) => __awaiter(void 0, void 0, void 0, function* () {
    const retorno = {
        isCorrect: true,
        nombre: "",
        telefono: "",
        email: "",
    };
    if ((obj === null || obj === void 0 ? void 0 : obj.tipoUsuario) != "Cliente") {
        const admin = yield administrador_1.Administrador.findOne({
            where: {
                id: obj === null || obj === void 0 ? void 0 : obj.id,
            },
        });
        if (!admin) {
            retorno.isCorrect = false;
        }
        retorno.nombre = admin === null || admin === void 0 ? void 0 : admin.dataValues.nombre;
        retorno.email = admin === null || admin === void 0 ? void 0 : admin.dataValues.email;
    }
    if ((obj === null || obj === void 0 ? void 0 : obj.tipoUsuario) === "Cliente") {
        const cliente = yield cliente_1.Cliente.findOne({
            where: {
                id: obj === null || obj === void 0 ? void 0 : obj.id,
            },
        });
        if (!cliente) {
            retorno.isCorrect = false;
        }
        retorno.nombre = cliente === null || cliente === void 0 ? void 0 : cliente.dataValues.nombre;
        retorno.telefono = cliente === null || cliente === void 0 ? void 0 : cliente.dataValues.telefono;
        retorno.email = cliente === null || cliente === void 0 ? void 0 : cliente.dataValues.email;
    }
    return retorno;
});
exports.getTypeOfUser = getTypeOfUser;
const verifyValorFacturaCliente = (valorFactura, totalPagoInicial) => {
    const respuesta = {
        error: "",
        isValid: true,
    };
    if (valorFactura == 0) {
        const retorno = {
            error: "El valor de la factura no puede ser cero",
            isValid: false,
        };
        return retorno;
    }
    const limite = valorFactura * 0.45;
    if (totalPagoInicial > limite) {
        const retorno = {
            error: "El pago inicial no puede ser mayor al 45% del valor de la factura",
            isValid: false,
        };
        return retorno;
    }
    return respuesta;
};
exports.verifyValorFacturaCliente = verifyValorFacturaCliente;
