import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    domain: { type: String },
    sourceType: { type: String },
    sourceId: { type: String },
    keywords: [
      {
        keyword: String,
        score: Number,
      },
    ],
    analyzedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Document ||
  mongoose.model("Document", DocumentSchema);