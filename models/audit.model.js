import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  standard: { type: String, required: true },
  results: { type: Array, default: [] },
  score: { type: Number, default: 0 },
  comments: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export const Audit = mongoose.model("Audit", auditSchema);
