import express from "express";
import { getReportTahunan } from "../../controllers/Report/GetReportController.js";


const ReportRouter = express.Router();

ReportRouter.post("/report/inventaris",getReportTahunan)
export default ReportRouter