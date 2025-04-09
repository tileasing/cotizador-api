import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import { errorAdmin } from "../middlewares/errorResponse";
import {
  getContrato,
  getLegal,
  updateContrato,
  updateLegal,
} from "../controllers/legal";

const legalRouter = Router();

legalRouter.use(validarJWT);
legalRouter.use(errorAdmin);
legalRouter.get("/get_legal", getLegal);
legalRouter.put("/update_pagos", updateLegal);
legalRouter.post("/get_contrato", getContrato);
legalRouter.post("/update_archivo", updateContrato);

export { legalRouter };
