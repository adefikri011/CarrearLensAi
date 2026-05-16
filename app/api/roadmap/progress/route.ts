import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * API to handle roadmap progress tracking.
 * GET: Fetch all completed tasks for the current user.
 * PATCH: Toggle status of a specific task.
 */

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const progress = await db.roadmap.getProgress(session.user.id);
    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    console.error("Roadmap GET Error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil data progres" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { taskId, weekId, completed } = body;

    if (!taskId || !weekId) {
      return NextResponse.json({ success: false, error: "Data tidak lengkap" }, { status: 400 });
    }

    const updated = await db.roadmap.upsertProgress(
      session.user.id,
      taskId,
      weekId,
      completed
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Roadmap PATCH Error:", error);
    return NextResponse.json({ success: false, error: "Gagal memperbarui progres" }, { status: 500 });
  }
}
