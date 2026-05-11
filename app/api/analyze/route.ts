import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGeminiModel, buildAnalysisPrompt } from "@/lib/gemini";
import { db } from "@/lib/db";
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

    // Always fetch fresh data from database using helper
    const [profile, cvUpload] = await Promise.all([
      db.profile.get(session.user.id),
      db.cvUpload.getLatest(session.user.id)
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
    
    await db.analysis.create(session.user.id, {
        cvUploadId: cvUpload.id,
        result: analysisResult as any,
        overallReadiness: analysisResult.overallReadiness,
        cvScore: analysisResult.cvScore.total,
        selectedPath: analysisResult.careerPaths[0]?.nama || null,
    });

    return NextResponse.json({ success: true, data: analysisResult });

  } catch (error: any) {
    console.error("Analysis API Error:", error);
    return NextResponse.json({ success: false, error: "Gagal menganalisis profil dan CV" }, { status: 500 });
  }
}
