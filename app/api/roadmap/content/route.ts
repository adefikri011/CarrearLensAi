import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AnalysisResult } from "@/types/analysis";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const analysis = await db.analysis.getLatest(session.user.id);

    if (!analysis) {
      return NextResponse.json({ success: false, error: "Analysis not found" }, { status: 404 });
    }

    const result = analysis.result as unknown as AnalysisResult;
    const selectedPath = analysis.selectedPath;

    // Find the career path matching selectedPath
    const path = result.careerPaths.find(p => p.nama === selectedPath) || result.careerPaths[0];

    return NextResponse.json({ 
      success: true, 
      data: {
        pathName: path.nama,
        roadmap: path.roadmap || []
      }
    });
  } catch (error) {
    console.error("Roadmap Content API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
