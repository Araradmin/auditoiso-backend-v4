import { Router } from "express";
import { login, register, listUsers, logout } from "../controllers/auth.controller.js";
import { authRequired, adminOnly } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authRequired, logout);
router.get("/users", authRequired, adminOnly, listUsers);

export default router;
