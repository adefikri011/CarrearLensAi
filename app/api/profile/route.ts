import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
    
    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        usia: body.age,
        schoolName: body.schoolName,
        sekolah: body.education,
        jurusan: body.major,
        lulusan: body.gradYear,
        hardSkills: body.skills,
        minat: body.interests,
        targetGaji: body.salary,
        targetPosisi: body.targetPos,
        preferensiKerja: body.workPref,
        bio: body.bio,
        experienceLevel: body.experienceLevel,
        softSkills: body.softSkills || [],
        kotaTarget: body.city ? [body.city] : [],
      },
      create: {
        userId: session.user.id,
        usia: body.age,
        schoolName: body.schoolName,
        sekolah: body.education,
        jurusan: body.major,
        lulusan: body.gradYear,
        hardSkills: body.skills,
        minat: body.interests,
        targetGaji: body.salary,
        targetPosisi: body.targetPos,
        preferensiKerja: body.workPref,
        bio: body.bio,
        experienceLevel: body.experienceLevel,
        softSkills: body.softSkills || [],
        kotaTarget: body.city ? [body.city] : [],
      },
    });

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * GET /api/profile
 * Fetches the user's profile.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
