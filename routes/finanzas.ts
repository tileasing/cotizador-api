import { Router } from "express";
import { errorAdmin } from "../middlewares/errorResponse";
import { validarJWT } from "../middlewares/validarJWT";
import { getFinanzas, updateFinanzas } from "../controllers/finanzas";

const finanzasRouter = Router();

finanzasRouter.use(validarJWT);
finanzasRouter.use(errorAdmin);
finanzasRouter.get("/get_pagos", getFinanzas);
finanzasRouter.put("/update_pagos", updateFinanzas);

export { finanzasRouter };
