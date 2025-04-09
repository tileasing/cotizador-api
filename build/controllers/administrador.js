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
exports.viewClients = exports.testCreateAdmins = exports.replacePassword = exports.showAdmin = exports.deleteOtherAdmin = exports.updateAdminPass = exports.updateAdmin = exports.registerAdministrador = exports.getAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../models");
const getAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield models_1.Administrador.findAll();
    res.json({ msg: "Admins", admin });
});
exports.getAdmin = getAdmin;
const registerAdministrador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, email, password, tipo_administrador } = req.body;
    try {
        const adminExist = yield models_1.Administrador.findOne({
            where: {
                email,
            },
        });
        if (adminExist) {
            return res.status(404).json({
                success: false,
                errors: ["Ya existe un usuario con el email: " + email],
            });
        }
        const hash = yield bcrypt_1.default.hash(password, 10);
        const saveAdmin = yield models_1.Administrador.create({
            nombre,
            email,
            tipo_administrador,
            password: hash,
        });
        if (!saveAdmin) {
            return res.status(404).json({
                success: false,
                errors: ["No se pudo crear el administrador: " + nombre],
            });
        }
        return res.status(201).json({
            success: true,
            data: {
                msg: "Administrador creado con éxito",
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
exports.registerAdministrador = registerAdministrador;
const updateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id, nombre, tipo_administrador, email } = req.body;
    try {
        const myID = (_a = req.authData) === null || _a === void 0 ? void 0 : _a.id;
        const adminExist = yield models_1.Administrador.findOne({
            where: {
                id: myID,
            },
        });
        if (!adminExist) {
            return res.status(404).json({
                success: false,
                errors: ["No se encuentra el administrador"],
            });
        }
        if (id !== myID) {
            console.log("Dentro de la condicional");
            const adminEdit = yield models_1.Administrador.findOne({
                where: {
                    id,
                },
            });
            if (!adminEdit) {
                return res.status(404).json({
                    success: false,
                    errors: ["No se encuentra el administrador a editar"],
                });
            }
            yield adminEdit.update({
                nombre,
                tipo_administrador,
                email,
            });
            return res.status(201).json({
                success: true,
                data: {
                    msg: "El administrador fue actualizado con éxito",
                },
            });
        }
        yield adminExist.update({
            nombre,
            tipo_administrador,
            email,
        });
        return res.status(201).json({
            success: true,
            data: {
                msg: "El administrador fue actualizado con éxito",
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
exports.updateAdmin = updateAdmin;
const updateAdminPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { password, newPassword } = req.body;
    try {
        // Encuentra al administrador
        const adminExist = yield models_1.Administrador.findOne({
            where: {
                id: (_b = req.authData) === null || _b === void 0 ? void 0 : _b.id,
            },
        });
        // Verifica que se haya encontrado el administrador
        if (!adminExist) {
            return res.status(404).json({
                success: false,
                errors: ["No se encuentra el administrador"],
            });
        }
        // Verifica que sea un usuario activo
        if (adminExist.dataValues.deleted === true) {
            return res.status(400).json({
                success: false,
                errors: ["Este usuario ha sido eliminado"],
            });
        }
        // Verifica que los tipos de datos sean correctos
        if (typeof password !== "string" || typeof newPassword !== "string") {
            return res.status(400).json({
                success: false,
                errors: ["Los tipos de datos son incorrectos"],
            });
        }
        // Verifica que la contraseña actual del usuario sea válida
        const validPassword = yield bcrypt_1.default.compare(password, adminExist.dataValues.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                errors: ["La contraseña actual es incorrecta"],
            });
        }
        // Actualiza la contraseña del usuario
        const passCifrada = yield bcrypt_1.default.hash(newPassword, 10);
        yield adminExist.update({ password: passCifrada });
        // Retorna la respuesta de la contraseña si es efectuada con éxito
        return res.status(201).json({
            success: true,
            data: {
                msg: "Contraseña actualizada con éxito",
            },
        });
    }
    catch (error) {
        // Retorna un error si es que ocurre en la operación
        console.log({ error });
        const err = error;
        res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.updateAdminPass = updateAdminPass;
const deleteOtherAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { id_eliminar } = req.body;
    try {
        // Encuentra al administrador
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_c = req.authData) === null || _c === void 0 ? void 0 : _c.id,
            },
        });
        if (!admin) {
            return res.status(404).json({
                success: false,
                errors: ["No se encuentra el administrador"],
            });
        }
        const eliminado = yield models_1.Administrador.findOne({
            where: {
                id: id_eliminar,
            },
        });
        if (!eliminado) {
            return res.status(404).json({
                success: false,
                errors: ["No se pudo eliminar el administrador"],
            });
        }
        yield eliminado.update({
            deleted: true,
            who_deleted: admin.dataValues.email,
            when_deleted: new Date(),
        });
        return res.status(201).json({
            success: true,
            data: {
                msg: "El administrador eliminado con éxito",
            },
        });
    }
    catch (error) {
        // Retorna un error si es que ocurre en la operación
        console.log({ error });
        const err = error;
        res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.deleteOtherAdmin = deleteOtherAdmin;
const showAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield models_1.Administrador.findAll({
            where: { deleted: false },
            attributes: ["id", "nombre", "email", "tipo_administrador"],
            order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ["createdAt", "ASC"],
            ],
        });
        if (!users) {
            return res.status(404).json({
                success: false,
                errors: ["Ha ocurrido un error al cargar los usuarios"],
            });
        }
        return res.json({
            success: true,
            data: { users },
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
exports.showAdmin = showAdmin;
const replacePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { id_editPassword, newPassword } = req.body;
    try {
        // Encuentra al administrador
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_d = req.authData) === null || _d === void 0 ? void 0 : _d.id,
            },
        });
        if (!admin) {
            return res.status(404).json({
                success: false,
                errors: ["No se encuentra el administrador"],
            });
        }
        // Encuentra al administrador al cual se le cambiará la contraseña
        const administradorUpdate = yield models_1.Administrador.findOne({
            where: {
                id: id_editPassword,
            },
        });
        if (!administradorUpdate) {
            return res.status(404).json({
                success: false,
                errors: ["No se pudo econtrar al administrador"],
            });
        }
        const hash = yield bcrypt_1.default.hash(newPassword, 10);
        yield administradorUpdate.update({
            password: hash,
        });
        return res.status(201).json({
            success: true,
            data: {
                msg: "Se ha actualizado la contraseña con éxito",
            },
        });
    }
    catch (error) {
        // Retorna un error si es que ocurre en la operación
        console.log({ error });
        const err = error;
        res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.replacePassword = replacePassword;
const testCreateAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resultados = yield models_1.Administrador.findAll();
        const administradoresExistentes = [
            "juan@gmail.com",
            "daniel@gmail.com",
            "leo@gmail.com",
        ];
        const correoABuscar = "brian@gmail.com";
        const objetoBrian = resultados.find((objeto) => objeto.dataValues.email === correoABuscar);
        if (objetoBrian) {
            yield objetoBrian.destroy();
        }
        const administradoresEncontrados = resultados.filter((objeto) => administradoresExistentes.includes(objeto.dataValues.email));
        if (administradoresEncontrados.length > 0) {
            return res.status(404).json({ msg: "Los administradores ya existen" });
        }
        const hash = yield bcrypt_1.default.hash("123456789", 10);
        const saveAdmin = yield models_1.Administrador.create({
            nombre: "Juan",
            email: "juan@gmail.com",
            tipo_administrador: "Administrador",
            password: hash,
        });
        const saveAdmin1 = yield models_1.Administrador.create({
            nombre: "Daniel",
            email: "daniel@gmail.com",
            tipo_administrador: "Promotor",
            password: hash,
        });
        const saveAdmin2 = yield models_1.Administrador.create({
            nombre: "Leo",
            email: "leo@gmail.com",
            tipo_administrador: "Validador",
            password: hash,
        });
        if (!saveAdmin || !saveAdmin1 || !saveAdmin2) {
            return res.status(404).json({
                msg: "No se pudo crear el administrador: ",
            });
        }
        return res.status(201).json({
            msg: "Administrador creado con éxito",
        });
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
});
exports.testCreateAdmins = testCreateAdmins;
const viewClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const admin = yield models_1.Administrador.findOne({
            where: {
                id: (_e = req.authData) === null || _e === void 0 ? void 0 : _e.id,
            },
        });
        if (!admin)
            return res.status(401).json({
                success: false,
                errors: ["Ha ocurrido un error de autenticación"],
            });
        const clientes = yield models_1.Cliente.findAll({
            attributes: ["id", "nombre"],
        });
        return res.json({
            success: true,
            data: { clientes },
        });
    }
    catch (error) {
        const err = error;
        res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.viewClients = viewClients;
