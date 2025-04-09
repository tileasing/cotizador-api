import { Router } from "express";
import { loginUser, getUserSession } from "../controllers/usuario";
import { validarJWT } from '../middlewares/validarJWT';

const usuarioRouter = Router();

usuarioRouter.post("/login", loginUser);
usuarioRouter.use(validarJWT);
usuarioRouter.get("/get_data_session", getUserSession);

export { usuarioRouter };
