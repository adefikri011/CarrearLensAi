import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { db } from "@/lib/db";

/**
 * POST /api/profile
 * Updates the user's career profile information.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Update user name if provided
    if (body.name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: body.name }
      });
    }

    const profile = await db.profile.upsert(session.user.id, {
        usia: body.age,
        jurusan: body.major,
        lulusan: body.gradYear,
        hardSkills: body.skills,
        minat: body.interests,
        targetGaji: body.salary,
        targetPosisi: body.targetPos as any,
        preferensiKerja: body.workPref,
        softSkills: body.softSkills || [],
        kotaTarget: body.kotaTarget || (body.city ? [body.city] : []),
        sertifikasi: body.sertifikasi || [],
        pengalaman: body.pengalaman || null,
    });

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * GET /api/profile
 * Fetches the user's profile including user name.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.profile.get(session.user.id);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true }
    });

    if (!profile) {
      // Return empty profile but with name from user if available
      return NextResponse.json({ 
        success: true, 
        data: { 
          name: user?.name || session.user.name 
        } 
      });
    }

    // Flatten name 
    const data = {
      ...profile,
      name: user?.name || "",
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Profile GET Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
