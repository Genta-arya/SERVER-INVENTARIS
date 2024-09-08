import express from "express";
import {
  CountPengeluaran,
  RekapData,
} from "../../controllers/Dashboard/DashboardController.js";

const DashboardRouter = express.Router();

DashboardRouter.get("/dashboard", RekapData);
DashboardRouter.get("/pengeluaran/tahunan", CountPengeluaran);
export default DashboardRouter;
