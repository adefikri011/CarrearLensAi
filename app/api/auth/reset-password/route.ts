import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyRecaptcha } from "@/lib/recaptcha";

/**
 * POST /api/auth/reset-password
 * Resets the password using a secure token that was sent via email.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, newPassword, captchaToken } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Token dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password baru minimal harus 8 karakter." },
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

    // Check if user exists with the valid, non-expired reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Token atur ulang tidak valid, salah, atau telah kedaluwarsa." },
        { status: 400 }
      );
    }

    // Encrypt new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password inside user and clear out resetToken fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password Anda berhasil diperbarui. Silakan login kembali.",
    });
  } catch (error) {
    console.error("Reset Password Route Error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal ketika memperbarui password." },
      { status: 500 }
    );
  }
}
