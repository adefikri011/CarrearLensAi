import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { extractTextFromPDF } from "@/lib/pdf-parser";
import { getSupabase } from "@/lib/supabase";

/**
 * POST /api/upload
 * Handles CV PDF upload, text extraction, and storage.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
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

    // 3. Extract Text from PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    const extractedText = await extractTextFromPDF(buffer);

    // 4. Upload to Supabase Storage
    const filename = `${session.user.id}_${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("cv-uploads")
      .upload(filename, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage Error:", uploadError);
      // Even if storage fails, we might want to continue if extraction succeeded,
      // but usually we want to persist the file.
      return NextResponse.json(
        { success: false, error: "Gagal mengunggah file ke storage", details: uploadError.message },
        { status: 500 }
      );
    }

    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cv-uploads/${uploadData.path}`;

    // 5. Save CVUpload Record to Database
    const cvUpload = await prisma.cVUpload.create({
      data: {
        userId: session.user.id,
        filename: file.name,
        fileUrl,
        extractedText,
        fileSize: file.size,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: cvUpload.id,
        filename: cvUpload.filename,
        extractedText,
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
