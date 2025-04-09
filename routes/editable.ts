import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import {
    getEditable,
    registerEditable,
    updateEditable,
    testEditable
} from "../controllers/editable";

const editableRouter = Router();
editableRouter.use(validarJWT);
editableRouter.get("/", getEditable);
editableRouter.post("/", registerEditable);
editableRouter.put("/", updateEditable);
editableRouter.post("/test_editable", testEditable)

export { editableRouter };
