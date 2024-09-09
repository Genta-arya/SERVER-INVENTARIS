import express from "express";
import { getReportBarangKeluar, GetReportKIR, getReportTahunan } from "../../controllers/Report/GetReportController.js";


const ReportRouter = express.Router();

ReportRouter.post("/report/inventaris",getReportTahunan)
ReportRouter.get("/report/kir/:id",GetReportKIR)
ReportRouter.get("/report/barangkeluar",getReportBarangKeluar)
export default ReportRouter