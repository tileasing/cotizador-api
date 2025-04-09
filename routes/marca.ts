import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import {
  getMarca,
  registerMarca,
  updateMarca,
  showMarca,
  deleteMarca,
} from "../controllers/marca";

const marcaRouter = Router();
marcaRouter.use(validarJWT);
marcaRouter.get("/", getMarca);
marcaRouter.post("/", registerMarca);
marcaRouter.put("/", updateMarca);
marcaRouter.get("/show_all_marca", showMarca);
marcaRouter.put("/delete_marca", deleteMarca);

export { marcaRouter };
