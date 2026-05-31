import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyRecaptcha } from "@/lib/recaptcha";

/**
 * POST /api/auth/reset-password
 * Direct password reset by providing email, new password, and reCAPTCHA token.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, newPassword, captchaToken } = body;

    const targetPassword = password || newPassword;

    if (!email || !targetPassword) {
      return NextResponse.json(
        { success: false, error: "Email dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    if (targetPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password baru minimal harus 8 karakter." },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA
    const isCaptchaValid = await verifyRecaptcha(captchaToken);
    if (!isCaptchaValid) {
      return NextResponse.json(
        { success: false, error: "Verifikasi CAPTCHA gagal. Silakan coba lagi." },
        { status: 400 }
      );
    }

    const formattedEmail = email.toLowerCase().trim();

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: formattedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Pengguna dengan email tersebut tidak ditemukan." },
        { status: 404 }
      );
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(targetPassword, 10);

    // Update password inside user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password Anda berhasil diperbarui. Silakan login kembali.",
    });
  } catch (error) {
    console.error("Direct Reset Password Route Error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal ketika memperbarui password." },
      { status: 500 }
    );
  }
}
