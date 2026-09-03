import { NextResponse } from "next/server";
import { getAuthorizedDocument } from "@/lib/documents";
import { getFileStorage } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const document = await getAuthorizedDocument(id);
  if (!document) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  try {
    const bytes = await getFileStorage().get(document.storageKey);
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": document.mimeType,
        "Content-Disposition": `attachment; filename="${document.fileName.replace(/"/g, "")}"`,
        "Content-Length": String(bytes.byteLength),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "The file is not in storage. Upload a new copy — seed records only store metadata." },
      { status: 404 },
    );
  }
}
