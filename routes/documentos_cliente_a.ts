import { Router } from "express";
import { validarJWT } from "../middlewares/validarJWT";
import {
  acceptOrDecline,
  aceptAllDocs,
  addDocument,
  getDocuments,
  getUpdateFiles,
  updateDocument,
} from "../controllers/documentos_clientes_a";

const documentsClientARouter = Router();
documentsClientARouter.use(validarJWT);
documentsClientARouter.get("/", getDocuments);
documentsClientARouter.post("/", addDocument);
documentsClientARouter.put("/", updateDocument);
documentsClientARouter.get("/get_docs", getUpdateFiles);
documentsClientARouter.put("/update_state_doc", acceptOrDecline);
documentsClientARouter.post("/acept_docs", aceptAllDocs);

export { documentsClientARouter };
