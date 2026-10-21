import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Document from "@/models/Document";

export async function GET() {
  await dbConnect();
  const docs = await Document.find({}).sort({ createdAt: -1 }).limit(50).lean();
  return NextResponse.json(docs);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const { title, content, domain, sourceType } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required." },
      { status: 400 },
    );
  }

  const doc = await Document.create({
    title: title.trim(),
    content: content.trim(),
    domain: domain?.trim(),
    sourceType: sourceType?.trim(),
  });

  return NextResponse.json(doc, { status: 201 });
}
