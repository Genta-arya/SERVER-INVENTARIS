import express from "express";
import { addPermintaan } from "../../controllers/Permintaan/PostPermintaanController.js";
import { getPermintaan } from "../../controllers/Permintaan/GetPermintaanController.js";
import {
  RejectPermintaan,
  updatePermintaan,
} from "../../controllers/Permintaan/UpdatePermintaanController.js";

const PermintaanRouter = express.Router();
PermintaanRouter.post("/permintaan", addPermintaan);
PermintaanRouter.post("/filter/permintaan", getPermintaan);
PermintaanRouter.put("/permintaan/:id", updatePermintaan);
PermintaanRouter.put("/reject/permintaan/:id", RejectPermintaan);
export default PermintaanRouter;
