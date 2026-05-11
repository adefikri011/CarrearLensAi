import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGeminiModel, buildCareerAnalysisPrompt } from "@/lib/gemini";
import prisma from "@/lib/prisma";
import { ProfileSchema } from "@/lib/validations";
import { AnalysisResult } from "@/types/analysis";

/**
 * POST /api/analyze
 * Main endpoint for career analysis using Gemini AI.
 */
export async function POST(req: NextRequest) {
  try {
    const geminiModel = getGeminiModel();
    // 1. Session Validation
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Request Body Parsing
    let body: any = {};
    try {
      body = await req.json();
    } catch (e) {
      // Body might be empty, that's fine if we have data in DB
    }
    
    let { profile, cvText, cvUploadId } = body;

    // 3. Fallback to latest data if not provided
    if (!profile) {
      const dbProfile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
      });
      if (dbProfile) {
        profile = dbProfile;
      } else {
        return NextResponse.json({ success: false, error: "Profil belum lengkap. Silakan isi profil terlebih dahulu." }, { status: 400 });
      }
    }

    if (!cvText || !cvUploadId) {
      const latestCV = await prisma.cVUpload.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
      if (latestCV) {
        cvText = cvText || latestCV.extractedText;
        cvUploadId = cvUploadId || latestCV.id;
      } else {
        return NextResponse.json({ success: false, error: "CV belum diunggah. Silakan unggah CV terlebih dahulu." }, { status: 400 });
      }
    }

    // 4. Validation
    const validation = ProfileSchema.safeParse(profile);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid profile data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // 4. Generate Prompt
    const prompt = buildCareerAnalysisPrompt(validation.data, cvText || "Tidak ada data CV yang diunggah.");

    // 5. Call Gemini AI
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean potential markdown blocks from AI response
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const analysisResult: AnalysisResult = JSON.parse(cleanJson);

    // 6. Save to Database
    const savedAnalysis = await prisma.analysis.create({
      data: {
        userId: session.user.id,
        cvUploadId: cvUploadId || null,
        result: analysisResult as any,
        overallReadiness: analysisResult.overallReadiness,
        cvScore: analysisResult.cvScore.total,
        selectedPath: analysisResult.careerPaths[0]?.nama || null,
      },
    });

    // Sync profile to database if it's the first time or if updated info is provided
    await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        usia: validation.data.usia,
        lulusan: validation.data.lulusan,
        jurusan: validation.data.jurusan,
        hardSkills: validation.data.hardSkills,
        softSkills: validation.data.softSkills,
        minat: validation.data.minat,
        targetGaji: validation.data.targetGaji,
        targetPosisi: validation.data.targetPosisi as any,
        preferensiKerja: validation.data.preferensiKerja,
        kotaTarget: validation.data.kotaTarget,
        sertifikasi: validation.data.sertifikasi,
        pengalaman: validation.data.pengalaman || undefined,
      },
      create: {
        userId: session.user.id,
        usia: validation.data.usia,
        lulusan: validation.data.lulusan,
        jurusan: validation.data.jurusan,
        hardSkills: validation.data.hardSkills,
        softSkills: validation.data.softSkills,
        minat: validation.data.minat,
        targetGaji: validation.data.targetGaji,
        targetPosisi: validation.data.targetPosisi as any,
        preferensiKerja: validation.data.preferensiKerja,
        kotaTarget: validation.data.kotaTarget,
        sertifikasi: validation.data.sertifikasi,
        pengalaman: validation.data.pengalaman || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: savedAnalysis.id,
        result: analysisResult,
      },
    });

  } catch (error: any) {
    console.error("Analysis API Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Gagal menganalisis profil. Silakan coba lagi nanti.",
        details: error instanceof Error ? error.message : "Kesalahan tidak diketahui"
      },
      { status: 500 }
    );
  }
}
