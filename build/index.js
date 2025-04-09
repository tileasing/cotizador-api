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
//configuración de las variables de entorno
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const process_1 = require("process");
const config_1 = require("./config");
const administrador_contrato_1 = require("./routes/administrador_contrato");
const finanzas_1 = require("./routes/finanzas");
const legal_1 = require("./routes/legal");
const gestoria_1 = require("./routes/gestoria");
//variable para el puerto
const PORT = process.env.PORT;
//servidor
const app = (0, express_1.default)();
//middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//endpoints
app.use("/api/administrador", routes_1.administradorRouter);
app.use("/api/cliente", routes_1.clienteRouter);
app.use("/api/cotizacion", routes_1.cotizacionRouter);
app.use("/api/estado_activo", routes_1.estadoActivoRouter);
app.use("/api/marca", routes_1.marcaRouter);
app.use("/api/tipo_activo", routes_1.tipoActivoRouter);
app.use("/api/usuarios", routes_1.usuarioRouter);
app.use("/api/valores_otros_gastos", routes_1.valorOtrosGastosRouter);
app.use("/api/valores_residuales", routes_1.valorResidualRouter);
app.use("/api/valores_tasas", routes_1.valorTasasRouter);
app.use("/api/years", routes_1.yearsRouter);
app.use("/api/editable", routes_1.editableRouter);
app.use("/api/forgotten_password", routes_1.forgottenPasswordRouter);
app.use("/api/inversion_fija", routes_1.inversionFijaRouter);
app.use("/api/inversion_amortizable", routes_1.inversionAmortizableRouter);
app.use("/api/calculadora", routes_1.calculadoraRouter);
app.use("/api/log", routes_1.logRouter);
app.use("/api/log_cliente", routes_1.logClienteRouter);
app.use("/api/tipo_archivo", routes_1.tipoArchivoRouter);
app.use("/api/documentos_cliente", routes_1.documentsClientRouter);
app.use("/api/tipo_archivo_a", routes_1.tipoArchivoARouter);
app.use("/api/documentos_cliente_a", routes_1.documentsClientARouter);
app.use("/api/cliente_arrend", routes_1.clientArrendamientoRouter);
app.use("/api/administrador_contrato", administrador_contrato_1.administradorCRouter);
app.use("/api/finanzas", finanzas_1.finanzasRouter);
app.use("/api/legal", legal_1.legalRouter);
app.use("/api/gestoria", gestoria_1.gestoriaRouter);
//función de inicialización del server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield config_1.db.sync({ force: false, alter: true });
        app.listen(PORT, () => {
            console.log(`[SERVER]: server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.log(error);
        (0, process_1.exit)(1);
    }
});
//inicializacióñ del server
startServer();
