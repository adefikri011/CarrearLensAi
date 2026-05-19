import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const [analysis, progress] = await Promise.all([
      db.analysis.getLatest(session.user.id),
      db.roadmap.getProgress(session.user.id)
    ]);

    if (!analysis) {
      return NextResponse.json({ 
        success: true, 
        isAvailable: false, 
        reason: "Lakukan analisis CV terlebih dahulu." 
      });
    }

    const roadmapData = (analysis.result as any)?.roadmap90Hari || [];
    const totalTasks = roadmapData.flatMap((w: any) => w.tugas || []).length;
    const completedTasksCount = progress.filter(p => p.completed).length;

    // Is it 100% complete?
    const isRoadmapCompleted = totalTasks > 0 && completedTasksCount >= totalTasks;

    return NextResponse.json({
      success: true,
      isAvailable: isRoadmapCompleted,
      stats: {
        completed: completedTasksCount,
        total: totalTasks,
        percentage: totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0
      },
      role: analysis.selectedPath || "Lulusan SMK Profesional"
    });
  } catch (error) {
    console.error("Interview Status API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
