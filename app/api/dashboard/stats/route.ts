import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Get latest analysis
    const latestAnalysis = await db.analysis.getLatest(userId);

    // 2. Counts
    const analyses = await db.analysis.getAll(userId);
    const analysisCount = analyses.length;

    // 3. Profile completeness
    const profile = await db.profile.get(userId);
    
    let completeness = 0;
    if (profile) {
      const fields = [
        profile.usia, profile.jurusan, 
        profile.lulusan, profile.targetPosisi, profile.targetGaji
      ];
      const filled = fields.filter(f => f !== null && f !== undefined && f !== "").length;
      completeness = Math.round((filled / fields.length) * 100);
    }

    return NextResponse.json({
      success: true,
      data: {
        latestAnalysis,
        analysisCount,
        profileCompleteness: completeness,
      }
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
