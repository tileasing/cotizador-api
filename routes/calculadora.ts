import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import { doCalculate, meInteresaInversion } from "../controllers/calculadora";

const calculadoraRouter = Router();

calculadoraRouter.use(validarJWT);
calculadoraRouter.post("/", doCalculate);
calculadoraRouter.post("/me_interesa", meInteresaInversion);

export { calculadoraRouter };
