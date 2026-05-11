import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const progress = await db.roadmap.getProgress(session.user.id);

    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    console.error("Roadmap Progress GET Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Internal Server Error" 
    }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { taskId, completed, weekId } = body;

    if (!taskId) {
      return NextResponse.json({ success: false, error: "Task ID is required" }, { status: 400 });
    }

    const progress = await db.roadmap.upsertProgress(
      session.user.id, 
      taskId, 
      weekId || "w1", 
      completed
    );

    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    console.error("Roadmap Progress PATCH Error:", error);
    return NextResponse.json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Internal Server Error" 
    }, { status: 500 });
  }
}
