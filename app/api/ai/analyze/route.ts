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
    
    const model = ai.getGenerativeModel({ 
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      }
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    if (!responseText) {
      return NextResponse.json({ success: false, error: "AI memberikan respon kosong" }, { status: 500 });
    }

    let analysisResult: AnalysisResult;
    let cleanJson = responseText.trim();
    
    // Robust search for the exact JSON bounds to skip conversational slop or outer markdown text
    const firstBrace = cleanJson.indexOf('{');
    const firstBracket = cleanJson.indexOf('[');
    let startIdx = -1;
    let endChar = '';
    
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIdx = firstBrace;
      endChar = '}';
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
      endChar = ']';
    }
    
    if (startIdx !== -1) {
      const lastIdx = cleanJson.lastIndexOf(endChar);
      if (lastIdx !== -1 && lastIdx > startIdx) {
        cleanJson = cleanJson.substring(startIdx, lastIdx + 1);
      }
    }

    // Strip markdown code block boundaries if they remain
    cleanJson = cleanJson.replace(/```json|```/gi, "").trim();

    try {
      analysisResult = JSON.parse(cleanJson);
    } catch (e: any) {
      console.error("[Gemini parse fail] Standard parse failed. Attempting deep cleanup. Raw:", responseText);
      try {
        // Strip out single-line & multi-line comments that may have sneaked in
        const commentless = cleanJson
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/(?:^|[^:])\/\/.*$/gm, "")
          .trim();
        analysisResult = JSON.parse(commentless);
      } catch (e2: any) {
        console.error("[Gemini parse fail] Deep cleanup also failed. Clean text attempted:", cleanJson);
        return NextResponse.json({ success: false, error: "Format respon AI tidak valid" }, { status: 500 });
      }
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
