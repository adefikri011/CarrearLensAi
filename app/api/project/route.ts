import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

/**
 * API Route for Portfolio Projects
 */

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, rawDescription, refinedDescription, thumbnailUrl, tools, tags, metrics } = body;

    const slug = `${title.toLowerCase().replace(/ /g, "-")}-${nanoid(5)}`;

    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        title,
        slug,
        thumbnailUrl,
        rawDescription,
        refinedDescription,
        tools: tools || [],
        tags: tags || [],
        metrics,
        isPublic: true
      }
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    console.error("Project Creation Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
