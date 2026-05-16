import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getAI, GEMINI_MODEL, buildRoadmapGenerationPrompt } from "@/lib/gemini";
import { AnalysisResult } from "@/types/analysis";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { pathName } = await req.json();
    if (!pathName) {
      return NextResponse.json({ success: false, error: "Path name is required" }, { status: 400 });
    }

    // 1. Get profile, CV, and existing analysis
    const [profile, cvUpload, analysis] = await Promise.all([
      db.profile.get(session.user.id),
      db.cvUpload.getLatest(session.user.id),
      db.analysis.getLatest(session.user.id)
    ]);

    if (!profile || !cvUpload || !analysis) {
      return NextResponse.json({ success: false, error: "DATA_MISSING" }, { status: 400 });
    }

    const analysisResult = analysis.result as unknown as AnalysisResult;
    const path = analysisResult.careerPaths.find((p: any) => p.nama === pathName);
    if (!path) {
      return NextResponse.json({ success: false, error: "PATH_NOT_FOUND" }, { status: 404 });
    }

    // 2. Call Gemini
    const ai = getAI();
    const prompt = buildRoadmapGenerationPrompt(profile, cvUpload.extractedText || "", path);

    const roadmapResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const roadmapResponseText = roadmapResponse.text;
    if (!roadmapResponseText) {
      return NextResponse.json({ success: false, error: "AI memberikan respon kosong" }, { status: 500 });
    }

    let roadmapRaw;
    try {
      const cleanJson = roadmapResponseText.replace(/```json|```/g, "").trim();
      roadmapRaw = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse roadmap JSON:", roadmapResponseText);
      return NextResponse.json({ success: false, error: "Format roadmap dari AI tidak valid" }, { status: 500 });
    }

    if (!Array.isArray(roadmapRaw) && roadmapRaw.roadmap) {
      roadmapRaw = roadmapRaw.roadmap;
    }
    
    if (!Array.isArray(roadmapRaw)) {
      return NextResponse.json({ success: false, error: "Format roadmap dari AI bukan array" }, { status: 500 });
    }

    // Normalize
    const roadmap = roadmapRaw.map((item: any) => ({
      minggu: item.minggu || item.week || 0,
      fase: (item.fase || item.phase || "Fondasi").toLowerCase(),
      title: item.title || item.judul || "Langkah Mingguan",
      tasks: Array.isArray(item.tasks) ? item.tasks : (Array.isArray(item.tugas) ? item.tugas : []),
      hours: item.hours || item.jam || "10-15",
      resource: item.resource || item.sumber || "-",
      resourceLink: item.resourceLink || item.resource_link || item.link || "#"
    }));

    // 3. Save back to analysis result
    const updatedPaths = analysisResult.careerPaths.map(p => {
      if (p.nama === pathName) return { ...p, roadmap };
      return p;
    });

    const updatedResult = { ...analysisResult, careerPaths: updatedPaths };

    // Update in database
    await db.analysis.update(analysis.id, {
      result: updatedResult as any,
      selectedPath: pathName
    });

    return NextResponse.json({ success: true, data: roadmap });
  } catch (error: any) {
    console.error("API AI Roadmap Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Gagal membangun roadmap" 
    }, { status: 500 });
  }
}
