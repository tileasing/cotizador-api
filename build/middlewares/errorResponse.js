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
exports.errorAdmin = void 0;
const models_1 = require("../models");
const errorAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_a = req.authData) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
        if (!admin) {
            return res.status(404).json({
                success: false,
                errors: [
                    "No se pudo crear el valor, ocurrió un error con la identificación del usuario",
                ],
            });
        }
        next();
    }
    catch (error) {
        const err = error;
        return res.json({ success: false, errors: [err.message] });
    }
});
exports.errorAdmin = errorAdmin;
