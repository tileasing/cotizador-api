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
exports.createClientByAdmin = exports.getClientRF = exports.updateRF = exports.getClient = exports.sendCancelCotToMKT = exports.sendCotizacionToMKT = exports.updatePhoneNumber = exports.changePassword = exports.cotCliente = exports.testCreateClientes = exports.registerCliente = exports.getCliente = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const generatePassword_1 = require("../services/generatePassword");
const services_1 = require("../services");
const sendEmailToMKT_1 = require("../services/sendEmailToMKT");
const cotizacionClienteValidator_1 = require("../validators/cotizacionClienteValidator");
const clienteArrendamiento_1 = require("../validators/clienteArrendamiento");
const models_1 = require("../models");
const getCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cliente = yield models_1.Cliente.findAll();
    res.json({ msg: "Cliente", cliente });
});
exports.getCliente = getCliente;
const registerCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, email, telefono } = req.body;
    try {
        if (!nombre) {
            return res.status(404).json({
                success: false,
                errors: ["El nombre es requerido"],
            });
        }
        if (!email) {
            return res.status(404).json({
                success: false,
                errors: ["El correo es obligatorio"],
            });
        }
        console.log("Pasa validaciones");
        const clienteExist = yield models_1.Cliente.findOne({
            where: {
                email,
            },
        });
        console.log("Busca al cliente");
        if (clienteExist) {
            return res.status(404).json({
                success: false,
                errors: ["Ya existe un usuario con el email: " + email],
            });
        }
        console.log("Busca al administrador");
        const clienteExistInAdmin = yield models_1.Administrador.findOne({
            where: {
                email,
            },
        });
        if (clienteExistInAdmin) {
            return res.status(404).json({
                success: false,
                errors: ["Ya existe un usuario con el email: " + email],
            });
        }
        console.log("Pasó los filtros");
        const password = (0, generatePassword_1.generatePassword)();
        const sendCorrect = yield (0, generatePassword_1.sendEmail)({
            nombre,
            password,
            emailTo: email,
        });
        if (!sendCorrect) {
            return res.status(404).json({
                success: false,
                errors: ["No se pudo crear el cliente: " + nombre],
            });
        }
        const hash = yield bcrypt_1.default.hash(password, 10);
        const saveCliente = yield models_1.Cliente.create(Object.assign(Object.assign({}, req.body), { tipo_cliente: "Cliente", password: hash }));
        if (!saveCliente) {
            return res.status(404).json({
                success: false,
                errors: ["No se pudo crear el cliente: " + nombre],
            });
        }
        return res.status(201).json({
            success: true,
            data: {
                msg: [
                    "¡Te has registrado con éxito!",
                    "Por favor, revisa tu correo para continuar",
                ],
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
exports.registerCliente = registerCliente;
// export const loginCliente = async (req: Request<{}, {}, { email: string, password: string }>, res: Response) => {
//     const { email, password } = req.body
//     try {
//         const cliente = await Cliente.findOne({
//             where: {
//                 email
//             }
//         })
//         if (!cliente) {
//             return res.status(404).json({
//                 msg: 'No se encuentra registro del cliente'
//             })
//         }
//         const passwordValid = await bcrypt.compare(password, cliente.dataValues.password)
//         if (!passwordValid) {
//             return res.status(400).json({
//                 msg: 'La contraseña es incorrecta'
//             })
//         }
//         const token = jwt.sign({ id: cliente.dataValues.id }, process.env.SECRET_JWT as string)
//         res.status(201).json({
//             nombre: cliente.dataValues.nombre,
//             email: cliente.dataValues.email,
//             telefono: cliente.dataValues.telefono,
//             tipo_cliente: cliente.dataValues.tipo_cliente,
//             token
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             msg: 'Ocurrió un error en el servidor'
//         })
//     }
// }
const testCreateClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientes = yield models_1.Cliente.findAll(); // obtenemos los resultados de la base de datos
        const clientesExistentes = [
            "gustavo@gmail.com",
            "hugo@gmail.com",
            "fernanda@gmail.com",
            "brian@gmail.com",
        ];
        const clientesEncontrados = clientes.filter((objeto) => clientesExistentes.includes(objeto.dataValues.email));
        if (clientesEncontrados.length > 0) {
            return res.status(404).json({ msg: "Los clientes ya existen" });
        }
        const hash = yield bcrypt_1.default.hash("123456789", 10);
        const saveCliente = yield models_1.Cliente.create({
            nombre: "Gustavo",
            email: "gustavo@gmail.com",
            password: hash,
        });
        const saveCliente1 = yield models_1.Cliente.create({
            nombre: "Hugo",
            email: "hugo@gmail.com",
            password: hash,
        });
        const saveCliente2 = yield models_1.Cliente.create({
            nombre: "Fernanda",
            email: "fernanda@gmail.com",
            password: hash,
        });
        const saveCliente3 = yield models_1.Cliente.create({
            nombre: "Brian",
            email: "brian@gmail.com",
            password: hash,
        });
        if (!saveCliente || !saveCliente1 || !saveCliente2 || !saveCliente3) {
            return res.status(404).json({
                msg: "No se pudo crear el cliente",
            });
        }
        return res.status(201).json({
            msg: "Clientes creados con éxito",
        });
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
});
exports.testCreateClientes = testCreateClientes;
const cotCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        yield cotizacionClienteValidator_1.cotizacionClienteValidator.validate(req.body);
        // Encuentra al cliente
        const clienteExist = yield models_1.Cliente.findOne({
            where: {
                id: (_a = req.authData) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
        // Encuentra al administrador
        const adminExist = yield models_1.Administrador.findOne({
            where: {
                id: (_b = req.authData) === null || _b === void 0 ? void 0 : _b.id,
            },
        });
        const isClienteOrAdmin = yield (0, services_1.getTypeOfUser)(req.authData);
        const data = yield (0, services_1.doCotCliente)(req.body);
        if (!data) {
            return res.status(401).json({
                success: false,
                errors: ["Ha ocurrido un error"],
            });
        }
        if (!data.rentaMensual)
            return res.status(401).json({
                success: false,
                errors: ["No se ha podido realizar la cotización"],
            });
        if (isClienteOrAdmin.isCorrect === false) {
            return res.status(401).json({
                success: false,
                errors: ["Algo ocurrió en la validación del usuario"],
            });
        }
        const { nombre, telefono, email } = isClienteOrAdmin;
        if (clienteExist) {
            yield models_1.LogCliente.create({
                cliente_id: (_c = req.authData) === null || _c === void 0 ? void 0 : _c.id,
                tipo: "Cotización",
                fecha: new Date(),
                old_register: "",
                new_register: JSON.stringify(Object.assign(Object.assign({}, data), { nombre,
                    telefono,
                    email, valorFactura: req.body.valorFactura, totalPagoInicial: req.body.totalPagoInicial })),
            });
        }
        if (adminExist) {
            yield models_1.Log.create({
                administrador_id: (_d = req.authData) === null || _d === void 0 ? void 0 : _d.id,
                tipo: "Cotización rápida",
                fecha: new Date(),
                old_register: "",
                new_register: JSON.stringify(Object.assign(Object.assign({}, data), { nombre,
                    telefono,
                    email, valorFactura: req.body.valorFactura, totalPagoInicial: req.body.totalPagoInicial })),
            });
        }
        return res.json({
            success: true,
            data: Object.assign(Object.assign({}, data), { nombre,
                telefono,
                email, valorFactura: req.body.valorFactura, totalPagoInicial: req.body.totalPagoInicial }),
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
exports.cotCliente = cotCliente;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const { password, newPassword, confirmPassword } = req.body;
    try {
        // Encuentra al cliente
        const clienteExist = yield models_1.Cliente.findOne({
            where: {
                id: (_e = req.authData) === null || _e === void 0 ? void 0 : _e.id,
            },
        });
        // Verifica que se haya encontrado el cliente
        if (!clienteExist) {
            return res.status(404).json({
                success: false,
                errors: ["Ocurrió un error al encontrar al cliente"],
            });
        }
        // Verifica que los tipos de datos sean correctos
        if (typeof password !== "string" ||
            typeof newPassword !== "string" ||
            typeof confirmPassword !== "string") {
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
        if (newPassword === "") {
            return res.status(400).json({
                success: false,
                errors: ["El campo nueva contraseña no puede ir vacío"],
            });
        }
        if (confirmPassword === "") {
            return res.status(400).json({
                success: false,
                errors: ["El campo confirmar nueva contraseña no puede ir vacío"],
            });
        }
        // Verifica que no haya error al introducir la nueva contraseña
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                errors: ["Las nuevas contraseñas no coinciden entre sí"],
            });
        }
        // Verifica que la contraseña actual del usuario sea válida
        const validPassword = yield bcrypt_1.default.compare(password, clienteExist.dataValues.password);
        // Verifica que la contraseña coincida con la existente en la base de datos
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                errors: [
                    "La contraseña no coincide con el registro en la base de datos",
                ],
            });
        }
        // Actualiza la contraseña del usuario
        const passCifrada = yield bcrypt_1.default.hash(newPassword, 10);
        yield clienteExist.update({ password: passCifrada });
        // Retorna la respuesta de la contraseña si es efectuada con éxito
        return res.status(201).json({
            success: true,
            data: ["Contraseña actualizada con éxito"],
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
exports.changePassword = changePassword;
const updatePhoneNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const { telefono } = req.body;
    console.log(req.body);
    try {
        // Encuentra al cliente
        const clienteExist = yield models_1.Cliente.findOne({
            where: {
                id: (_f = req.authData) === null || _f === void 0 ? void 0 : _f.id,
            },
        });
        // Verifica que se haya encontrado el cliente
        if (!clienteExist) {
            return res.status(404).json({
                success: false,
                errors: ["No se encuentra el cliente"],
            });
        }
        // Verifica que sea un usuario activo
        if (clienteExist.dataValues.deleted === true) {
            return res.status(400).json({
                success: false,
                errors: ["Este usuario ha sido eliminado"],
            });
        }
        // Verifica que los tipos de datos sean correctos
        if (typeof telefono !== "string") {
            return res.status(400).json({
                success: false,
                errors: ["Los tipos de datos son incorrectos"],
            });
        }
        yield clienteExist.update({ telefono });
        // Retorna la respuesta de la contraseña si es efectuada con éxito
        return res.status(201).json({
            success: true,
            data: ["Se ha actualizado el número de teléfono"],
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
exports.updatePhoneNumber = updatePhoneNumber;
const sendCotizacionToMKT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const { telefono, respuesta } = req.body;
    try {
        // Encuentra al cliente
        const clienteExist = yield models_1.Cliente.findOne({
            where: {
                id: (_g = req.authData) === null || _g === void 0 ? void 0 : _g.id,
            },
        });
        // Verifica que se haya encontrado el cliente
        if (!clienteExist) {
            return res.status(404).json({
                success: false,
                errors: ["No se encuentra el cliente"],
            });
        }
        // Verifica que sea un usuario activo
        if (clienteExist.dataValues.deleted === true) {
            return res.status(400).json({
                success: false,
                errors: ["Este usuario ha sido eliminado"],
            });
        }
        // Verifica que los tipos de datos sean correctos
        if (typeof telefono !== "string") {
            return res.status(400).json({
                success: false,
                errors: ["Los tipos de datos son incorrectos"],
            });
        }
        const correctUpdatePhoneNumber = yield clienteExist.update({ telefono });
        const { nombre, email } = correctUpdatePhoneNumber.dataValues;
        if (!correctUpdatePhoneNumber) {
            return res.status(400).json({
                success: false,
                errors: [
                    "Lo sentimos, no se ha podido actualizar el número de teléfono",
                ],
            });
        }
        const sendCorrect = yield (0, sendEmailToMKT_1.sendEmailToMKT)({
            nombre,
            email,
            telefono,
            respuesta,
        });
        if (!sendCorrect) {
            return res.status(400).json({
                success: false,
                errors: [
                    "Lo sentimos, no hemos podido enviar el correo con tus datos",
                    "Intente de nuevo",
                ],
            });
        }
        // Retorna la respuesta si es efectuada con éxito
        return res.status(201).json({
            success: true,
            data: [
                "Continua tu proceso en nuestro menú de Pre-requisitos",
                // "¡Estás a punto de tener el auto de tus sueños!",
                // "Nos comunicaremos contigo",
            ],
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
exports.sendCotizacionToMKT = sendCotizacionToMKT;
const sendCancelCotToMKT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    const { telefono, respuesta } = req.body;
    try {
        // Encuentra al cliente
        const clienteExist = yield models_1.Cliente.findOne({
            where: {
                id: (_h = req.authData) === null || _h === void 0 ? void 0 : _h.id,
            },
        });
        // Verifica que se haya encontrado el cliente
        if (!clienteExist) {
            return res.status(404).json({
                success: false,
                errors: ["No se encuentra el cliente"],
            });
        }
        // Verifica que sea un usuario activo
        if (clienteExist.dataValues.deleted === true) {
            return res.status(400).json({
                success: false,
                errors: ["Este usuario ha sido eliminado"],
            });
        }
        // Verifica que los tipos de datos sean correctos
        if (typeof telefono !== "string") {
            return res.status(400).json({
                success: false,
                errors: ["Los tipos de datos son incorrectos"],
            });
        }
        const correctUpdatePhoneNumber = yield clienteExist.update({ telefono });
        const { nombre, email } = correctUpdatePhoneNumber.dataValues;
        if (!correctUpdatePhoneNumber) {
            return res.status(400).json({
                success: false,
                errors: [
                    "Lo sentimos, no se ha podido actualizar el número de teléfono",
                ],
            });
        }
        const sendCorrect = yield (0, sendEmailToMKT_1.sendCancelEmailToMKT)({
            nombre,
            email,
            telefono,
            respuesta,
        });
        if (!sendCorrect) {
            return res.status(400).json({
                success: false,
                errors: [
                    "Lo sentimos, no hemos podido enviar el correo con tus datos",
                    "Intente de nuevo",
                ],
            });
        }
        // Retorna la respuesta si es efectuada con éxito
        return res.status(201).json({
            success: true,
            data: ["¡Ok!"],
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
exports.sendCancelCotToMKT = sendCancelCotToMKT;
const getClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    try {
        return res.json({ success: true, data: (_j = req.authData) === null || _j === void 0 ? void 0 : _j.id });
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
exports.getClient = getClient;
const updateRF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    try {
        const { regimen_fiscal } = yield cotizacionClienteValidator_1.clientRF.validate(req.body);
        // Encuentra al cliente
        const clienteExist = yield models_1.Cliente.findOne({
            where: {
                id: (_k = req.authData) === null || _k === void 0 ? void 0 : _k.id,
            },
        });
        // Verifica que se haya encontrado el cliente
        if (!clienteExist) {
            return res.status(404).json({
                success: false,
                errors: ["No se encuentra el cliente"],
            });
        }
        yield clienteExist.update({
            regimen_fiscal,
        });
        return res.status(201).json({
            success: true,
            data: ["Se ha actualizado el régimen fiscal"],
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
exports.updateRF = updateRF;
const getClientRF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    try {
        // Encuentra al cliente
        const cliente = yield models_1.Cliente.findOne({
            where: {
                id: (_l = req.authData) === null || _l === void 0 ? void 0 : _l.id,
            },
            attributes: ["id", "regimen_fiscal"],
        });
        // Verifica que se haya encontrado el cliente
        if (!cliente) {
            return res.status(404).json({
                success: false,
                errors: ["No se encuentra el cliente"],
            });
        }
        return res.status(201).json({
            success: true,
            data: { cliente },
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
exports.getClientRF = getClientRF;
const createClientByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _m;
    try {
        const data = yield clienteArrendamiento_1.createValidateClientByAdmin.validate(req.body);
        const password = (0, generatePassword_1.generatePassword)();
        const sendCorrect = yield (0, generatePassword_1.sendEmail)({
            nombre: data.nombre_cliente,
            password,
            emailTo: data.correo_cliente,
        });
        if (!sendCorrect) {
            return res.status(404).json({
                success: false,
                errors: ["No se pudo crear el cliente: " + data.nombre_cliente],
            });
        }
        const hash = yield bcrypt_1.default.hash(password, 10);
        const [clientExist, created] = yield models_1.Cliente.findOrCreate({
            where: { email: data.correo_cliente },
            defaults: {
                nombre: data.nombre_cliente,
                email: data.correo_cliente,
                tipo_cliente: "Cliente",
                password: hash,
                who_created: (_m = req.authData) === null || _m === void 0 ? void 0 : _m.id,
            },
            attributes: ["id", "nombre", "email"],
        });
        // console.log(clientExist);
        if (created)
            return res.json({
                success: true,
                data: { msg: "El cliente se ha registrado con éxito" },
            });
        if (clientExist) {
            return res.status(401).json({
                success: false,
                errors: ["El cliente ya ha sido registrado anteriormente"],
            });
        }
    }
    catch (error) {
        const err = error;
        return res.status(400).json({
            success: false,
            errors: [err.message],
        });
    }
});
exports.createClientByAdmin = createClientByAdmin;
