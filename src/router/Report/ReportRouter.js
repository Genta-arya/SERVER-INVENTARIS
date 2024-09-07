import express from "express";
import { GetReportKIR, getReportTahunan } from "../../controllers/Report/GetReportController.js";


const ReportRouter = express.Router();

ReportRouter.post("/report/inventaris",getReportTahunan)
ReportRouter.get("/report/kir/:id",GetReportKIR)
export default ReportRouter