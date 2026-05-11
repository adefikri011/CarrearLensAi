import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!prisma.roadmapProgress) {
      console.error("Prisma model 'roadmapProgress' is not defined. Checking Prisma Client...");
      return NextResponse.json({ success: false, error: "Database model not initialized" }, { status: 500 });
    }

    const progress = await prisma.roadmapProgress.findMany({
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

    const { taskId, completed } = await req.json();

    if (!taskId) {
      return NextResponse.json({ success: false, error: "Task ID is required" }, { status: 400 });
    }

    if (!prisma.roadmapProgress) {
        return NextResponse.json({ success: false, error: "Database model not initialized" }, { status: 500 });
    }

    const progress = await prisma.roadmapProgress.upsert({
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
