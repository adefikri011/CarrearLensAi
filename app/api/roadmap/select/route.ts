import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { pathName, fullResult } = await req.json();
    if (!pathName) {
      return NextResponse.json({ success: false, error: "Path name required" }, { status: 400 });
    }

    const updateData: any = { selectedPath: pathName };
    if (fullResult) {
      updateData.result = fullResult;
    }

    await db.analysis.upsertLatest(session.user.id, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Select Roadmap Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
