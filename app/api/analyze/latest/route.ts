import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const analysis = await db.analysis.getLatest(session.user.id);

    return NextResponse.json({ 
      success: true, 
      data: analysis ? {
        ...analysis,
        result: analysis.result
      } : null 
    });
  } catch (error) {
    console.error("Latest Analysis API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
