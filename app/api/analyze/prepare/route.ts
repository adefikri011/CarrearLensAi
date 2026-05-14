import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const [profile, cvUpload, analysis] = await Promise.all([
      db.profile.get(session.user.id),
      db.cvUpload.getLatest(session.user.id),
      db.analysis.getLatest(session.user.id)
    ]);

    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: "PROFILE_MISSING" 
      }, { status: 400 });
    }

    if (!cvUpload) {
      return NextResponse.json({ 
        success: false, 
        error: "CV_MISSING" 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      data: { profile, cvUpload, analysis } 
    });
  } catch (error) {
    console.error("Prepare Analysis Data Error:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan internal" }, { status: 500 });
  }
}
