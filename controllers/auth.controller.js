import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export async function register(req, res){
  try{
    const { name, email, password, role } = req.body || {};
    if(!email || !password) return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    const exists = await User.findOne({ email });
    if(exists) return res.status(409).json({ error: "Usuario ya existe" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role === "admin" ? "admin" : "user" });
    console.log("👤 Usuario creado:", email);
    return res.json({ message: "Usuario creado", id: user._id });
  }catch(e){
    console.error("❌ Error creando usuario:", e.message);
    return res.status(500).json({ error: e.message });
  }
}

export async function login(req, res){
  const { email, password } = req.body || {};
  if(!email || !password) return res.status(400).json({ error: "Faltan datos" });
  const user = await User.findOne({ email });
  if(!user) return res.status(404).json({ error: "Usuario no encontrado" });
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(401).json({ error: "Credenciales inválidas" });
  const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET || "devsecret", { expiresIn: "8h" });
  console.log("🔐 Login exitoso:", email, "—", new Date().toLocaleString());
  return res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name || "" } });
}

export async function logout(req, res){
  const email = req.user?.email || "desconocido";
  console.log("🚪 Logout de usuario:", email, "—", new Date().toLocaleString());
  return res.json({ ok: true });
}

export async function listUsers(req, res){
  const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 }).limit(500);
  return res.json(users);
}
