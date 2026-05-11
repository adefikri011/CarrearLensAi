import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { extractTextFromPDF } from "@/lib/pdf-parser";
import fs from "fs";
import path from "path";

/**
 * POST /api/upload
 * Handles CV PDF upload, text extraction, and storage.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Session Validation
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Hanya file PDF yang diperbolehkan" },
        { status: 400 }
      );
    }

    // 3. Save File Locally (/tmp/) and Extract Text
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempFilename = `${session.user.id}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const tempPath = path.join("/tmp", tempFilename);

    // Save to /tmp
    fs.writeFileSync(tempPath, buffer);

    // Extract Text from PDF
    const rawExtractedText = await extractTextFromPDF(buffer);

    // Sanitize extracted text to prevent UTF8 encoding errors in PostgreSQL
    const sanitizedText = rawExtractedText
      .replace(/\0/g, '')           // remove null bytes
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // remove control chars
      .replace(/\uFFFD/g, '')       // remove replacement chars
      .trim();
    
    const finalText = sanitizedText.slice(0, 50000);

    // 4. Save CVUpload Record to Database
    // Note: Since we're not using remote storage, fileUrl is the temp path or a placeholder
    const cvUpload = await prisma.cVUpload.create({
      data: {
        userId: session.user.id,
        filename: file.name,
        fileUrl: tempPath, // Storing temp path for reference
        extractedText: finalText,
        fileSize: file.size,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: cvUpload.id,
        filename: cvUpload.filename,
        extractedText: finalText,
      },
    });

  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Gagal memproses file. Silakan coba lagi.",
        details: error instanceof Error ? error.message : "Kesalahan tidak diketahui"
      },
      { status: 500 }
    );
  }
}
