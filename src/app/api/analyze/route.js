//src/app/api/analyze/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Document from "@/models/Document";
import { extractKeywords } from "@/lib/keywordExtractor";

// POST /api/analyze
// Body: { documentId: "..." }
export async function POST(request) {
  await dbConnect();
  const { documentId } = await request.json();

  const doc = await Document.findById(documentId);
  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const keywords = extractKeywords(doc.content, 15);

  doc.keywords = keywords;
  doc.analyzedAt = new Date();
  await doc.save();

  return NextResponse.json({
    message: "Analysis complete",
    keywords: doc.keywords,
  });
}
