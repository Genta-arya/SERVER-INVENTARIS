import express from "express";
import { addRuangan } from "../../controllers/Ruangan/PostRuanganController.js";
import { GetAllRuangan, GetSingleRuangan} from "../../controllers/Ruangan/GetRuanganController.js";
import { updateNamaRuangan } from "../../controllers/Ruangan/PutRuanganController.js";
import { DeleteRuangan } from "../../controllers/Ruangan/DeleteRuanganController.js";

const RuanganRouter = express.Router();
RuanganRouter.post("/ruangan", addRuangan);
RuanganRouter.get("/ruangan", GetAllRuangan);
RuanganRouter.get("/ruangan/:id", GetSingleRuangan);
RuanganRouter.put("/ruangan/:id", updateNamaRuangan);
RuanganRouter.delete("/ruangan/:id", DeleteRuangan);
export default RuanganRouter;
