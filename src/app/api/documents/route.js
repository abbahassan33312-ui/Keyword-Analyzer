//src/app/api/documents/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Document from "@/models/Document";

// GET /api/documents
export async function GET() {
  await dbConnect();
  const docs = await Document.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(docs);
}

// POST /api/documents
export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const { title, content } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required." },
      { status: 400 },
    );
  }

  const doc = await Document.create({ title, content });
  return NextResponse.json(doc, { status: 201 });
}
