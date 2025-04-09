import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import {
  getYears,
  registerYears,
  updateYears,
  showYears,
  deleteYears,
} from "../controllers/years";

const yearsRouter = Router();
yearsRouter.use(validarJWT);
yearsRouter.get("/", getYears);
yearsRouter.post("/", registerYears);
yearsRouter.put("/", updateYears);
yearsRouter.get("/show_all_years", showYears);
yearsRouter.put("/delete_year", deleteYears);

export { yearsRouter };
