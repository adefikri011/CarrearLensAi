import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * PUT /api/profile
 * Updates the user's career profile information.
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bio, location, school, major, graduationYear, experienceLevel, skills } = body;

    // We store profile data in the Profile table linked to User
    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        bio,
        schoolName: school,
        jurusan: major,
        hardSkills: skills.split(",").map((s: string) => s.trim()),
        experienceLevel,
      },
      create: {
        userId: session.user.id,
        bio,
        schoolName: school,
        jurusan: major,
        hardSkills: skills.split(",").map((s: string) => s.trim()),
        experienceLevel,
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
