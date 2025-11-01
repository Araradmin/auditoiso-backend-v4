import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { getReportPdf } from "../controllers/report.controller.js";

const router = Router();
router.get("/:id/pdf", authRequired, getReportPdf);

export default router;
