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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.verifyUniqueKey = exports.generateKey = void 0;
const forgottenPasswordServices_1 = require("../services/forgottenPasswordServices");
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../models");
const generateKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const adminExist = yield models_1.Administrador.findOne({
            where: {
                email,
            },
        });
        if (adminExist) {
            return res.status(404).json({
                success: false,
                errors: [
                    "Si has olvidado la contraseña, por favor comunícate con un administrador",
                ],
            });
        }
        const clientExist = yield models_1.Cliente.findOne({
            where: {
                email,
            },
        });
        if (!clientExist) {
            return res.status(404).json({
                success: false,
                errors: ["No hemos encontrado registro del correo: " + email],
            });
        }
        console.log(clientExist.dataValues.id);
        // const createRegister = await Forgotten_password.findAll();
        const uniqueKey = (0, forgottenPasswordServices_1.generateUniqueRecoveyPassword)({
            id: clientExist.dataValues.id,
            email: clientExist.dataValues.email,
        });
        const createRegister = yield models_1.Forgotten_password.create({
            clienteId: clientExist.dataValues.id,
            email: clientExist.dataValues.email,
            keyRecovery: uniqueKey,
        });
        // TODO SEND EMAIL
        const nombre = clientExist.dataValues.nombre;
        yield (0, forgottenPasswordServices_1.sendEmailRecovey)({ nombre, emailTo: email, uniqueKey });
        console.log(createRegister);
        return res.status(201).json({
            success: true,
            data: {
                msg: "Registro exitoso",
                clave: uniqueKey,
            },
        });
    }
    catch (error) {
        console.log({ error });
        const err = error;
        res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.generateKey = generateKey;
const verifyUniqueKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, uniqueKey } = req.body;
    try {
        if (uniqueKey === "") {
            return res.status(404).json({
                success: false,
                errors: ["Ingrese la clave enviada al correo"],
            });
        }
        const clientExist = yield models_1.Cliente.findOne({
            where: {
                email,
            },
        });
        if (!clientExist) {
            return res.status(404).json({
                success: false,
                errors: ["No hemos encontrado registro del correo: " + email],
            });
        }
        const recovery = yield models_1.Forgotten_password.findOne({
            where: {
                keyRecovery: uniqueKey,
                email: email,
            },
            order: [["createdAt", "ASC"]],
            limit: 1, // Limitar el resultado a 1 registro
        });
        console.log(recovery);
        if (!recovery) {
            return res.status(404).json({
                success: false,
                errors: ["La clave no coincide", "Favor de verificar en el correo"],
            });
        }
        return res.status(201).json({
            success: true,
            data: {
                msg: "Claves correctas",
            },
        });
    }
    catch (error) {
        console.log({ error });
        const err = error;
        res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.verifyUniqueKey = verifyUniqueKey;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, uniqueKey, password, confirmPassword } = req.body;
    try {
        const clientExist = yield models_1.Cliente.findOne({
            where: {
                email,
            },
        });
        if (!clientExist) {
            return res.status(404).json({
                success: false,
                errors: ["No hemos encontrado registro del correo: " + email],
            });
        }
        const recovery = yield models_1.Forgotten_password.findOne({
            where: {
                keyRecovery: uniqueKey,
                email: email,
            },
        });
        if (!recovery) {
            return res.status(404).json({
                success: false,
                errors: ["La clave no coincide", "Favor de verificar en el correo"],
            });
        }
        // Verifica que los tipos de datos sean correctos
        if (typeof password !== "string" || typeof confirmPassword !== "string") {
            return res.status(400).json({
                success: false,
                errors: ["Los tipos de datos son incorrectos"],
            });
        }
        // Valida que no vengan campos vacios
        if (password === "") {
            return res.status(400).json({
                success: false,
                errors: ["El campo contraseña no puede ir vacío"],
            });
        }
        if (confirmPassword === "") {
            return res.status(400).json({
                success: false,
                errors: ["El campo confirmar nueva contraseña no puede ir vacío"],
            });
        }
        // Verifica que no haya error al introducir la nueva contraseña
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                errors: ["Las nuevas contraseñas no coinciden entre sí"],
            });
        }
        recovery.update({ keyRecovery: "" });
        const hash = yield bcrypt_1.default.hash(password, 10);
        yield clientExist.update({ password: hash });
        // Retorna la respuesta de la contraseña si es efectuada con éxito
        return res.status(201).json({
            success: true,
            data: ["Contraseña actualizada con éxito"],
        });
    }
    catch (error) {
        console.log({ error });
        const err = error;
        res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.updatePassword = updatePassword;
