import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyRecaptcha } from "@/lib/recaptcha";

/**
 * POST /api/auth/reset-password
 * Handles secure user password reset with reCAPTCHA verification.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, newPassword, captchaToken } = body;

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Email dan password baru wajib diisi" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password baru minimal harus 8 karakter" },
        { status: 400 }
      );
    }

    // Verify CAPTCHA
    const isCaptchaValid = await verifyRecaptcha(captchaToken);
    if (!isCaptchaValid) {
      return NextResponse.json(
        { success: false, error: "Verifikasi CAPTCHA gagal. Silakan coba lagi." },
        { status: 400 }
      );
    }

    const formattedEmail = email.toLowerCase().trim();

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: formattedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Akun dengan email tersebut tidak terdaftar" },
        { status: 404 }
      );
    }

    // Encrypt new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { email: formattedEmail },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Password Anda berhasil diperbarui. Silakan login kembali.",
    });
  } catch (error) {
    console.error("Reset Password Route Error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal ketika memperbarui password" },
      { status: 500 }
    );
  }
}
