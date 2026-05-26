import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendResetPasswordEmail } from "@/lib/resend";

/**
 * POST /api/auth/reset-password/send
 * Instigates a password reset process by issuing a secure token to the user email using Resend.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, captchaToken } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email wajib dimasukkan." },
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

    // Verify user exists in the database
    const user = await prisma.user.findUnique({
      where: { email: formattedEmail },
    });

    // To prevent email enumeration hacking, we return a successful response even if the email doesn't exist.
    // However, we only actually send the email if the account exists.
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Instruksi pemulihan atur ulang password telah dikirim ke email tersebut jika terdaftar.",
      });
    }

    // Generate secure random reset token
    const token = crypto.randomBytes(32).toString("hex");
    
    // Set expiry to 1 hour from now
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    // Save token to DB
    await prisma.user.update({
      where: { email: formattedEmail },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    // Retrieve active domain dynamically or fallback to config
    const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${origin}/reset-password?token=${token}`;

    // Send the beautiful formatted branding email using Resend service
    const emailResult = await sendResetPasswordEmail(formattedEmail, resetLink);

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: "Gagal mengirim email reset. Mohon hubungi administrator." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tautan atur ulang kata sandi berhasil dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam.",
    });
  } catch (error) {
    console.error("Request Reset Password Route Error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal ketika memproses permintaan." },
      { status: 500 }
    );
  }
}
