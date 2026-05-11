import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGeminiModel, buildAnalysisPrompt } from "@/lib/gemini";
import prisma from "@/lib/prisma";
import { AnalysisResult } from "@/types/analysis";

/**
 * POST /api/analyze
 * Main endpoint for career analysis using Gemini AI.
 * Always fetches fresh data from database and synchronizes Profile + CV.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Always fetch fresh data from database
    const [profile, cvUpload] = await Promise.all([
      prisma.profile.findUnique({ where: { userId: session.user.id } }),
      prisma.cVUpload.findFirst({ 
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: 'PROFILE_MISSING',
        message: 'Lengkapi profil karier terlebih dahulu'
      }, { status: 400 });
    }

    if (!cvUpload) {
      return NextResponse.json({ 
        success: false,
        error: 'CV_MISSING', 
        message: 'Upload CV terlebih dahulu'
      }, { status: 400 });
    }

    // Build Gemini prompt with BOTH profile AND cv data
    const prompt = buildAnalysisPrompt(profile, cvUpload.extractedText || "");
    
    // Call Gemini API
    const geminiModel = getGeminiModel();
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean potential markdown blocks from AI response
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const analysisResult: AnalysisResult = JSON.parse(cleanJson);
    
    // Find latest analysis to upsert or just create a new one
    // The user suggested using findFirst to get the ID then upsert
    const latestAnalysis = await prisma.analysis.findFirst({ 
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    const savedAnalysis = await prisma.analysis.upsert({
      where: { 
        id: latestAnalysis?.id || 'new_placeholder_id'
      },
      create: {
        userId: session.user.id,
        cvUploadId: cvUpload.id,
        result: analysisResult as any,
        overallReadiness: analysisResult.overallReadiness,
        cvScore: analysisResult.cvScore.total,
        selectedPath: analysisResult.careerPaths[0]?.nama || null,
      },
      update: {
        result: analysisResult as any,
        overallReadiness: analysisResult.overallReadiness,
        cvScore: analysisResult.cvScore.total,
        cvUploadId: cvUpload.id,
        selectedPath: analysisResult.careerPaths[0]?.nama || null,
      }
    });

    return NextResponse.json({ success: true, data: analysisResult });

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
