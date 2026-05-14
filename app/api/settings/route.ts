import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        image: true,
        username: true,
        bio: true,
        linkedin: true,
        github: true,
        twitter: true
      }
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, image, username, bio, linkedin, github, twitter } = body;

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        name,
        image,
        username,
        bio,
        linkedin,
        github,
        twitter
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Profil berhasil diperbarui",
      data: {
        name: updatedUser.name,
        image: updatedUser.image,
        username: updatedUser.username,
        bio: updatedUser.bio,
        linkedin: updatedUser.linkedin,
        github: updatedUser.github,
        twitter: updatedUser.twitter
      }
    });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ success: false, error: "Gagal memperbarui profil" }, { status: 500 });
  }
}
