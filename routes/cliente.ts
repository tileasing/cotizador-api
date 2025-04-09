import { Router } from "express";
import {
  changePassword,
  cotCliente,
  getCliente,
  registerCliente,
  testCreateClientes,
  updatePhoneNumber,
  sendCotizacionToMKT,
  sendCancelCotToMKT,
  getClient,
  updateRF,
  getClientRF,
  createClientByAdmin,
  // loginCliente,
} from "../controllers/cliente";
import { validarJWT } from "../middlewares/validarJWT";

const clienteRouter = Router();

// clienteRouter.post("/login", loginCliente);
clienteRouter.post("/test", testCreateClientes);
clienteRouter.post("/", registerCliente);
clienteRouter.use(validarJWT);
clienteRouter.get("/", getCliente);
clienteRouter.post("/cot_cliente", cotCliente);
clienteRouter.post("/change_password", changePassword);
clienteRouter.post("/update_phone_number", updatePhoneNumber);
clienteRouter.post("/send_cotizacion_mkt", sendCotizacionToMKT);
clienteRouter.post("/send_cancel_cotizacion_mkt", sendCancelCotToMKT);
clienteRouter.get("/get_client_id", getClient);
clienteRouter.put("/update_regimen_f", updateRF);
clienteRouter.get("/get_regimen_f", getClientRF);
clienteRouter.post("/create_client_by_admin", createClientByAdmin);

export { clienteRouter };
