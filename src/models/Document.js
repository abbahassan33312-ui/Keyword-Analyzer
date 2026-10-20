//src/models/Document.js

import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    keywords: [
      {
        keyword: String,
        score: Number,
      },
    ],
    analyzedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.Document ||
  mongoose.model("Document", DocumentSchema);
