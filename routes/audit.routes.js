import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { createAudit, listAudits, deleteAudit } from "../controllers/audit.controller.js";

const router = Router();
router.post("/", authRequired, createAudit);
router.get("/", authRequired, listAudits);
router.delete("/:id", authRequired, deleteAudit);

export default router;
