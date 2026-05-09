import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";

/**
 * API Route for PDF extraction
 * Uses pdf-parse to extract text from CV uploads.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const data = await pdf(buffer);

    return NextResponse.json({
      success: true,
      data: {
        text: data.text,
        info: data.info,
        metadata: data.metadata,
        numpages: data.numpages,
      },
    });
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengekstraksi file PDF" },
      { status: 500 }
    );
  }
}
