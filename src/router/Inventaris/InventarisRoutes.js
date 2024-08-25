import express from "express";
import { GetAllInventaris } from "../../controllers/Inventaris/GetInventarisController.js";



const InventarisRouter = express.Router();
InventarisRouter.get("/inventaris", GetAllInventaris);
export default InventarisRouter;
