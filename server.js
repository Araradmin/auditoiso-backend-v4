import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import reportRoutes from "./routes/report.routes.js";
import { User } from "./models/user.model.js";

dotenv.config();

const app = express();
app.use(express.json());

// --- CORS extendido ---
const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map(o => o.trim()).filter(Boolean);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.length && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else if (!allowedOrigins.length) {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Health y raíz
app.get("/", (req, res) => res.json({ ok: true, msg: "✅ API AuditoIso v4.1 activa" }));
app.get("/health", (req, res) => res.json({ ok: true }));

// Rutas
app.use("/auth", authRoutes);
app.use("/audits", auditRoutes);
app.use("/reports", reportRoutes);

// Conectar DB y seed admin
const start = async () => {
  try {
    await connectDB();
    const count = await User.countDocuments();
    if (count === 0) {
      const hashed = await bcrypt.hash("password", 10);
      await User.create({ name: "Administrador", email: "admin@example.com", password: hashed, role: "admin" });
      console.log("👑 Usuario admin creado automáticamente (admin@example.com / password)");
    } else {
      const admin = await User.findOne({ email: "admin@example.com" });
      if (admin) console.log("👑 Usuario admin detectado:", admin.email);
    }
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`🚀 AuditoIso Backend v4.1 en puerto ${PORT}`));
  } catch (e) {
    console.error("❌ Falló la conexión a MongoDB. Abortando arranque.");
    process.exit(1);
  }
};

start();
