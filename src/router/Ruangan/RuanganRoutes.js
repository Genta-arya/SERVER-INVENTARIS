import express from "express";
import { addRuangan } from "../../controllers/Ruangan/PostRuanganController.js";
import { GetAllRuangan, GetSingleRuangan} from "../../controllers/Ruangan/GetRuanganController.js";
import { updateNamaRuangan } from "../../controllers/Ruangan/PutRuanganController.js";
import { DeleteRuangan } from "../../controllers/Ruangan/DeleteRuanganController.js";
import { AccesEndpoint } from "../../Midleware/Midleware.js";
const RuanganRouter = express.Router();
RuanganRouter.post("/ruangan", AccesEndpoint,addRuangan);
RuanganRouter.get("/ruangan",  AccesEndpoint,GetAllRuangan);
RuanganRouter.get("/ruangan/:id",AccesEndpoint, GetSingleRuangan);
RuanganRouter.put("/ruangan/:id",AccesEndpoint, updateNamaRuangan);
RuanganRouter.delete("/ruangan/:id", AccesEndpoint,DeleteRuangan);
export default RuanganRouter;
