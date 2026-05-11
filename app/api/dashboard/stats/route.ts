import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get latest analysis
    const latestAnalysis = await prisma.analysis.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    // 2. Counts
    const analysisCount = await prisma.analysis.count({
      where: { userId: session.user.id },
    });

    // 3. Profile completeness
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });
    
    let completeness = 0;
    if (profile) {
      const fields = [
        profile.usia, profile.sekolah, profile.jurusan, 
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
