import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AnalysisResult } from "@/types/analysis";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { result, cvUploadId } = await req.json();
    const analysisResult = result as AnalysisResult;

    if (!analysisResult) {
      return NextResponse.json({ success: false, error: "Data analisis tidak valid" }, { status: 400 });
    }

    const savedAnalysis = await db.analysis.create(session.user.id, {
      cvUploadId: cvUploadId,
      result: analysisResult as any,
      overallReadiness: analysisResult.overallReadiness,
      cvScore: analysisResult.cvScore.total,
      selectedPath: analysisResult.careerPaths[0]?.nama || null,
    });

    return NextResponse.json({ success: true, data: savedAnalysis });
  } catch (error) {
    console.error("Save Analysis Error:", error);
    return NextResponse.json({ success: false, error: "Gagal menyimpan hasil analisis" }, { status: 500 });
  }
}
