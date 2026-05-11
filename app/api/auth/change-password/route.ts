import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: "Password lama dan baru wajib diisi" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.password) {
      // If user signed in with Google, they might not have a password
      return NextResponse.json({ 
        success: false, 
        error: "Akun ini menggunakan Google Login. Tidak dapat mengubah password." 
      }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: "Password lama tidak sesuai" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true, message: "Password berhasil diperbarui" });
  } catch (error) {
    console.error("Change Password Error:", error);
    return NextResponse.json({ success: false, error: "Gagal memperbarui password" }, { status: 500 });
  }
}
