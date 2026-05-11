// NOTE: Run "npx prisma generate && npx prisma db push" 
// if you see "Cannot read properties of undefined" error

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const prismaAny = prisma as any;
    const progress = await prismaAny.roadmapProgress.findMany({
      where: { userId: session.user.id },
    });

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

    const prismaAny = prisma as any;
    const progress = await prismaAny.roadmapProgress.upsert({
      where: {
        userId_taskId: {
          userId: session.user.id,
          taskId,
        },
      },
      update: {
        completed,
      },
      create: {
        userId: session.user.id,
        taskId,
        completed,
        weekId: weekId || "w1", // Default to w1 if missing
      },
    });

    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    console.error("Roadmap Progress PATCH Error:", error);
    return NextResponse.json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Internal Server Error" 
    }, { status: 500 });
  }
}
