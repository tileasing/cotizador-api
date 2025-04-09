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
exports.getUserSession = exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const administrador_1 = require("../models/administrador");
const cliente_1 = require("../models/cliente");
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const admin = yield administrador_1.Administrador.findOne({
            where: {
                email,
            },
        });
        const cliente = yield cliente_1.Cliente.findOne({
            where: {
                email,
            },
        });
        if (!admin && !cliente) {
            return res.status(404).json({
                success: false,
                errors: ["No se encuentra el registro del correo"],
            });
        }
        if ((admin === null || admin === void 0 ? void 0 : admin.dataValues.email) === (cliente === null || cliente === void 0 ? void 0 : cliente.dataValues.email)) {
            return res.status(404).json({
                success: false,
                errors: ["Se encuentra una duplicidad en el correo"],
            });
        }
        if (admin && !cliente) {
            const passwordValidAdmin = yield bcrypt_1.default.compare(password, admin.dataValues.password);
            if (!passwordValidAdmin) {
                return res.status(400).json({
                    success: false,
                    errors: ["La contraseña es incorrecta"],
                });
            }
            const token = jsonwebtoken_1.default.sign({
                id: admin.dataValues.id,
                tipoUsuario: admin.dataValues.tipo_administrador,
            }, process.env.SECRET_JWT);
            return res.json({
                success: true,
                data: {
                    nombre: admin.dataValues.nombre,
                    email: admin.dataValues.email,
                    tipo_administrador: admin.dataValues.tipo_administrador,
                    token,
                },
            });
        }
        if (cliente && !admin) {
            const passwordValidClient = yield bcrypt_1.default.compare(password, cliente.dataValues.password);
            if (!passwordValidClient) {
                return res.status(400).json({
                    success: false,
                    errors: ["La contraseña es incorrecta",]
                });
            }
            const token = jsonwebtoken_1.default.sign({
                id: cliente.dataValues.id,
                tipoUsuario: cliente.dataValues.tipo_cliente,
            }, process.env.SECRET_JWT);
            return res.json({
                success: true,
                data: {
                    nombre: cliente.dataValues.nombre,
                    email: cliente.dataValues.email,
                    tipo_administrador: cliente.dataValues.tipo_cliente,
                    token,
                },
            });
        }
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
exports.loginUser = loginUser;
const getUserSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const admin = yield administrador_1.Administrador.findOne({
            where: { deleted: false, id: (_a = req.authData) === null || _a === void 0 ? void 0 : _a.id },
            attributes: ["nombre", "email", "tipo_administrador"],
        });
        const cliente = yield cliente_1.Cliente.findOne({
            where: { deleted: false, id: (_b = req.authData) === null || _b === void 0 ? void 0 : _b.id },
            attributes: ["nombre", "email", "tipo_cliente"],
        });
        if (!admin && !cliente) {
            return res.status(404).json({
                msg: "No se encuentra el registro",
            });
        }
        if (admin && !cliente) {
            return res.json(admin.dataValues);
        }
        if (cliente && !admin) {
            return res.json(Object.assign(Object.assign({}, cliente.dataValues), { tipo_administrador: cliente.dataValues.tipo_cliente }));
        }
    }
    catch (error) {
        return res.status(500).json({
            msg: "Ocurrió un error en el servidor",
        });
    }
});
exports.getUserSession = getUserSession;
