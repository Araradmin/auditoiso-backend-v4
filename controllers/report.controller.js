import PDFDocument from "pdfkit";
import { Audit } from "../models/audit.model.js";

export async function getReportPdf(req, res){
  const audit = await Audit.findById(req.params.id);
  if(!audit) return res.status(404).json({ error: "No encontrado" });

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="reporte-${audit._id}.pdf"`);

  doc.fontSize(18).text("Informe de Auditoría ISO", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Norma: ${audit.standard}`);
  doc.text(`Puntaje: ${audit.score}%`);
  doc.text(`Fecha: ${new Date(audit.date || audit.createdAt).toLocaleString()}`);
  doc.moveDown();
  doc.text("Resultados:", { underline: true });
  (audit.results || []).forEach((r, i) => {
    const line = typeof r === "string" ? r : `${r.text || 'Item'} — ${r.status || ''}`;
    doc.text(`${i+1}. ${line}`);
  });
  doc.end();
  doc.pipe(res);
}
