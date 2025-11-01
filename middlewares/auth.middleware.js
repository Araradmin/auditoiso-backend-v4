import jwt from "jsonwebtoken";

export function authRequired(req, res, next){
  const header = req.headers["authorization"] || "";
  const token = header.replace("Bearer ","").trim();
  if(!token) return res.status(401).json({ error: "Token requerido" });
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    req.user = decoded;
    next();
  }catch(e){
    return res.status(401).json({ error: "Token inválido" });
  }
}

export function adminOnly(req, res, next){
  if(!req.user || req.user.role !== "admin"){
    return res.status(403).json({ error: "Solo administrador" });
  }
  next();
}
