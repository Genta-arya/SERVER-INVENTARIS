import express from "express";
import {
  deleteUsul,
  PostUsul,
  updateNamaBarang,
  updateStatusUsulan,
} from "../../controllers/Usulan/PostusulanController.js";
import {
  getDataUsulan,
  getSingleUsulan,
} from "../../controllers/Usulan/GetUsulanController.js";

const UsulanRouter = express.Router();
UsulanRouter.post("/usulan", PostUsul);
UsulanRouter.post("/data/usulan", getDataUsulan);
UsulanRouter.get("/usulan/:id", getSingleUsulan);
UsulanRouter.put("/usulan/:id", updateStatusUsulan);
UsulanRouter.put("/nama/usulan/:id", updateNamaBarang);
UsulanRouter.delete("/usulan/:id", deleteUsul);
export default UsulanRouter;
