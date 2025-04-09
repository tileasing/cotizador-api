//configuración de las variables de entorno
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import {
  administradorRouter,
  clienteRouter,
  cotizacionRouter,
  estadoActivoRouter,
  marcaRouter,
  tipoActivoRouter,
  usuarioRouter,
  valorOtrosGastosRouter,
  valorResidualRouter,
  valorTasasRouter,
  yearsRouter,
  editableRouter,
  forgottenPasswordRouter,
  inversionAmortizableRouter,
  inversionFijaRouter,
  calculadoraRouter,
  logRouter,
  logClienteRouter,
  tipoArchivoRouter,
  documentsClientRouter,
  documentsClientARouter,
  tipoArchivoARouter,
  clientArrendamientoRouter,
} from "./routes";
import { exit } from "process";
import { db } from "./config";
import { administradorCRouter } from "./routes/administrador_contrato";
import { finanzasRouter } from "./routes/finanzas";
import { legalRouter } from "./routes/legal";
import { gestoriaRouter } from "./routes/gestoria";

//variable para el puerto
const PORT = process.env.PORT;

//servidor
const app = express();

//middlewares
app.use(express.json());
app.use(cors());

//custom module for auth data
declare module "express" {
  export interface Request {
    authData?: {
      id?: string;
      iat?: any;
    };
  }
}
//endpoints
app.use("/api/administrador", administradorRouter);
app.use("/api/cliente", clienteRouter);
app.use("/api/cotizacion", cotizacionRouter);
app.use("/api/estado_activo", estadoActivoRouter);
app.use("/api/marca", marcaRouter);
app.use("/api/tipo_activo", tipoActivoRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/valores_otros_gastos", valorOtrosGastosRouter);
app.use("/api/valores_residuales", valorResidualRouter);
app.use("/api/valores_tasas", valorTasasRouter);
app.use("/api/years", yearsRouter);
app.use("/api/editable", editableRouter);
app.use("/api/forgotten_password", forgottenPasswordRouter);
app.use("/api/inversion_fija", inversionFijaRouter);
app.use("/api/inversion_amortizable", inversionAmortizableRouter);
app.use("/api/calculadora", calculadoraRouter);
app.use("/api/log", logRouter);
app.use("/api/log_cliente", logClienteRouter);
app.use("/api/tipo_archivo", tipoArchivoRouter);
app.use("/api/documentos_cliente", documentsClientRouter);
app.use("/api/tipo_archivo_a", tipoArchivoARouter);
app.use("/api/documentos_cliente_a", documentsClientARouter);
app.use("/api/cliente_arrend", clientArrendamientoRouter);
app.use("/api/administrador_contrato", administradorCRouter);
app.use("/api/finanzas", finanzasRouter);
app.use("/api/legal", legalRouter);
app.use("/api/gestoria", gestoriaRouter);

//función de inicialización del server
const startServer = async () => {
  try {
    await db.sync({ force: false, alter: true });
    app.listen(PORT, () => {
      console.log(`[SERVER]: server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

//inicializacióñ del server
startServer();
