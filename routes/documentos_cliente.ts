import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import {
  acceptOrDecline,
  addDocument,
  getDocuments,
  getUpdateFiles,
  updateDocument,
} from "../controllers/documentos_cliente";

const documentsClientRouter = Router();
documentsClientRouter.use(validarJWT);
documentsClientRouter.get("/", getDocuments);
documentsClientRouter.post("/", addDocument);
documentsClientRouter.put("/", updateDocument);
documentsClientRouter.get("/get_docs", getUpdateFiles);
documentsClientRouter.put("/update_state_doc", acceptOrDecline);

export { documentsClientRouter };
