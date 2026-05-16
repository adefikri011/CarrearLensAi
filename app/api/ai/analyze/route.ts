import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getAI, GEMINI_MODEL, buildAnalysisPrompt } from "@/lib/gemini";
import { AnalysisResult } from "@/types/analysis";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get profile and CV
    const [profile, cvUpload] = await Promise.all([
      db.profile.get(session.user.id),
      db.cvUpload.getLatest(session.user.id)
    ]);

    if (!profile) {
      return NextResponse.json({ success: false, error: "PROFILE_MISSING" }, { status: 400 });
    }
    if (!cvUpload) {
      return NextResponse.json({ success: false, error: "CV_MISSING" }, { status: 400 });
    }

    // 2. Call Gemini AI
    const ai = getAI();
    const prompt = buildAnalysisPrompt(profile, cvUpload.extractedText || "");
    
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 4096,
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text;
    if (!responseText) {
      return NextResponse.json({ success: false, error: "AI memberikan respon kosong" }, { status: 500 });
    }

    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    let analysisResult: AnalysisResult;
    try {
      analysisResult = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse Gemini response:", cleanJson);
      return NextResponse.json({ success: false, error: "Format respon AI tidak valid" }, { status: 500 });
    }

    // 3. Save to DB
    const savedAnalysis = await db.analysis.create(session.user.id, {
      cvUploadId: cvUpload.id,
      result: analysisResult as any,
      overallReadiness: analysisResult.overallReadiness,
      cvScore: analysisResult.cvScore.total,
      selectedPath: analysisResult.careerPaths[0]?.nama || null,
    });

    return NextResponse.json({ 
      success: true, 
      data: savedAnalysis,
      analysisResult 
    });
  } catch (error: any) {
    console.error("API Analyze Execute Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Gagal melakukan analisis karier" 
    }, { status: 500 });
  }
}
