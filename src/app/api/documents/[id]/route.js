//src/app/api/documents/[id]/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Document from "@/models/Document";

export async function GET(request, { params }) {
  await dbConnect();
  const doc = await Document.findById(params.id).lean();
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(doc);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  await Document.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted" });
}
