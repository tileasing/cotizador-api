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
const express_1 = __importDefault(require("express"));
const usuario_1 = __importDefault(require("../routes/usuario"));
const cliente_1 = __importDefault(require("../routes/cliente"));
const cotizacion_1 = __importDefault(require("../routes/cotizacion"));
const valor_residual_1 = __importDefault(require("../routes/valor_residual"));
const administrador_1 = __importDefault(require("../routes/administrador"));
const valor_tasas_1 = __importDefault(require("../routes/valor_tasas"));
const valor_otros_gastos_1 = __importDefault(require("../routes/valor_otros_gastos"));
const years_1 = __importDefault(require("../routes/years"));
const marca_1 = __importDefault(require("../routes/marca"));
const estado_activo_1 = __importDefault(require("../routes/estado_activo"));
const tipo_activo_1 = __importDefault(require("../routes/tipo_activo"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = __importDefault(require("../db/connection"));
class Server {
    constructor() {
        this.apiPaths = {
            usuarios: '/api/usuarios',
            administradores: '/api/administrador',
            cliente: '/api/cliente',
            cotizacion: '/api/cotizacion',
            valores_residuales: '/api/valores_residuales',
            valores_tasas: '/api/valores_tasas',
            valores_otros_gastos: '/api/valores_otros_gastos',
            years: '/api/years',
            marca: '/api/marca',
            estado_activo: '/api/estado_activo',
            tipo_activo: '/api/tipo_activo'
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '8000';
        //metodos iniciales
        this.dbConnection();
        this.middlewares();
        this.routes();
        //Conectar base de datos
    }
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.authenticate();
                console.log('DB online');
            }
            catch (error) {
                throw new Error();
            }
        });
    }
    middlewares() {
        //cors
        this.app.use((0, cors_1.default)());
        //lectura body
        this.app.use(express_1.default.json());
        //carpeta publica
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        this.app.use(this.apiPaths.usuarios, usuario_1.default);
        this.app.use(this.apiPaths.cliente, cliente_1.default);
        this.app.use(this.apiPaths.cotizacion, cotizacion_1.default);
        this.app.use(this.apiPaths.valores_residuales, valor_residual_1.default);
        this.app.use(this.apiPaths.administradores, administrador_1.default);
        this.app.use(this.apiPaths.valores_tasas, valor_tasas_1.default);
        this.app.use(this.apiPaths.valores_otros_gastos, valor_otros_gastos_1.default);
        this.app.use(this.apiPaths.years, years_1.default);
        this.app.use(this.apiPaths.marca, marca_1.default);
        this.app.use(this.apiPaths.estado_activo, estado_activo_1.default);
        this.app.use(this.apiPaths.tipo_activo, tipo_activo_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto ' + this.port);
        });
    }
}
exports.default = Server;
