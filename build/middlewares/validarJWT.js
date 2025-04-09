"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validarJWT = (req, res, next) => {
    // Pendiente
    const token = req.header('token');
    // console.log('Aqui esta el token: ',token)
    if (!token) {
        // return res.status(401).json({ msg:'El token es necesario para la petición' })
        return res.status(401).send();
    }
    try {
        const extraccion = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT);
        // console.log(extraccion)
        req.authData = extraccion;
        next();
    }
    catch (error) {
        // res.status(401).json({  msg:'Token no válido' })
        res.status(401).send();
    }
};
exports.validarJWT = validarJWT;
module.exports = {
    validarJWT: exports.validarJWT
};
