import { Audit } from "../models/audit.model.js";

export async function createAudit(req, res){
  try{
    const { standard, results, score, comments } = req.body || {};
    const audit = await Audit.create({
      userId: req.user?.id || "unknown",
      standard: standard || "ISO 9001",
      results: Array.isArray(results) ? results : [],
      score: typeof score === "number" ? score : 0,
      comments: comments || ""
    });
    console.log("🧾 Auditoría registrada:", audit.standard, "/ Score", audit.score, "por", req.user?.email || "desconocido");
    return res.json(audit);
  }catch(e){
    console.error("❌ Error creando auditoría:", e.message);
    return res.status(500).json({ error: e.message });
  }
}

export async function listAudits(req, res){
  const query = (req.user?.role === "admin") ? {} : { userId: req.user?.id };
  const audits = await Audit.find(query).sort({ createdAt: -1 }).limit(1000);
  return res.json(audits);
}

export async function deleteAudit(req, res){
  try{
    const id = req.params.id;
    await Audit.findByIdAndDelete(id);
    console.log("🗑️ Auditoría eliminada:", id);
    return res.json({ message: "Auditoría eliminada" });
  }catch(e){
    console.error("❌ Error eliminando auditoría:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
