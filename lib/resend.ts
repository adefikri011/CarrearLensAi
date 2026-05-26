import { Resend } from "resend";

let resendInstance: Resend | null = null;

/**
 * Lazy-initializes the Resend client to avoid crashes if API key is not yet set.
 */
export function getResendClient(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not defined in the environment variables.");
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

/**
 * Sends a highly polished, professional password reset email.
 * Uses CareerLens AI theme (#1D9E75 Teal and #534AB7 Purple).
 */
export async function sendResetPasswordEmail(email: string, resetLink: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const resend = getResendClient();

    const emailHtmlOutput = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Atur Ulang Password - CareerLens AI</title>
          <style>
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #f8fafc;
              margin: 0;
              padding: 0;
              -webkit-font-smoothing: antialiased;
            }
            .wrapper {
              width: 100%;
              table-layout: fixed;
              background-color: #f8fafc;
              padding-top: 40px;
              padding-bottom: 40px;
            }
            .container {
              max-width: 580px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 16px;
              border: 1px solid #e2e8f0;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
            }
            .header {
              background-color: #0f172a;
              padding: 32px;
              text-align: center;
              position: relative;
            }
            .logo-text {
              font-size: 22px;
              font-weight: 800;
              color: #ffffff;
              letter-spacing: -0.5px;
              margin: 0;
              display: inline-block;
            }
            .logo-accent {
              color: #1D9E75;
            }
            .tagline {
              font-size: 11px;
              color: #94a3b8;
              margin-top: 4px;
              margin-bottom: 0;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              font-weight: 650;
            }
            .content {
              padding: 40px 32px;
            }
            .title {
              font-size: 20px;
              font-weight: 700;
              color: #0f172a;
              margin-top: 0;
              margin-bottom: 16px;
              letter-spacing: -0.2px;
            }
            .text {
              font-size: 14px;
              line-height: 1.6;
              color: #475569;
              margin-top: 0;
              margin-bottom: 24px;
            }
            .btn-container {
              text-align: center;
              margin-bottom: 28px;
              margin-top: 28px;
            }
            .btn {
              display: inline-block;
              background-color: #1D9E75;
              color: #ffffff !important;
              text-decoration: none;
              font-size: 14px;
              font-weight: 700;
              padding: 14px 28px;
              border-radius: 12px;
              box-shadow: 0 4px 10px rgba(29, 158, 117, 0.2);
              transition: all 0.2s ease;
            }
            .divider {
              border-top: 1px solid #f1f5f9;
              margin-top: 28px;
              margin-bottom: 28px;
            }
            .warning-box {
              background-color: #faf5ff;
              border: 1px dashed #d8b4fe;
              border-radius: 10px;
              padding: 14px 16px;
              margin-bottom: 16px;
            }
            .warning-title {
              font-size: 12px;
              font-weight: 700;
              color: #534AB7;
              margin-top: 0;
              margin-bottom: 6px;
            }
            .warning-text {
              font-size: 11.5px;
              line-height: 1.5;
              color: #6b21a8;
              margin: 0;
            }
            .alt-link-text {
              font-size: 11px;
              color: #94a3b8;
              word-break: break-all;
              line-height: 1.4;
            }
            .alt-link {
              color: #534AB7;
              text-decoration: none;
            }
            .footer {
              background-color: #f8fafc;
              padding: 24px 32px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .footer-text {
              font-size: 11px;
              color: #64748b;
              margin: 0 0 8px 0;
              line-height: 1.5;
            }
            .footer-copyright {
              font-size: 10px;
              color: #94a3b8;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <div class="logo-text">CAREERLENS <span class="logo-accent">AI</span></div>
                <div class="tagline">Lihat Potensi Kariermu, Mulai Dari Sekarang.</div>
              </div>
              <div class="content">
                <h1 class="title">Atur Ulang Password Anda</h1>
                <p class="text">
                  Kami menerima permintaan untuk menyetel ulang kata sandi bagi akun Anda di <strong>CareerLens AI</strong>.
                  Jika Anda tidak meminta ini, silakan abaikan email ini secara aman. Akun Anda akan tetap aman.
                </p>
                
                <div class="warning-box">
                  <div class="warning-title">Batas Waktu Aktivasi</div>
                  <p class="warning-text">
                    Tautan di bawah ini hanya akan aktif selama <strong>1 jam</strong> untuk menjaga privasi keamanan akun Anda secara optimal.
                  </p>
                </div>

                <div class="btn-container">
                  <a href="${resetLink}" class="btn" target="_blank">Atur Ulang Password</a>
                </div>

                <p class="text" style="margin-bottom: 12px;">
                  Jika tombol di atas tidak berfungsi, Anda bisa menyalin tautan lengkap berikut ke browser Anda:
                </p>
                <div class="alt-link-text">
                  <a href="${resetLink}" class="alt-link" target="_blank">${resetLink}</a>
                </div>

                <div class="divider"></div>
                
                <p class="text" style="font-size: 12.5px; color: #64748b; margin-bottom: 0;">
                  Terima kasih,<br>
                  <strong>Tim Dukungan CareerLens AI</strong>
                </p>
              </div>
              
              <div class="footer">
                <p class="footer-text">
                  Email ini dikirimkan otomatis oleh sistem keamanan kami. Tolong jangan balas email ini secara langsung.
                </p>
                <p class="footer-copyright">
                  &copy; ${new Date().getFullYear()} CareerLens AI · Portal Kesiapan Kerja SMK Indonesia
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send the email using resend config
    // Note: If the domain is not verified, Resend allows sending emails from "onboarding@resend.dev" to verified email accounts
    const data = await resend.emails.send({
      from: "CareerLens AI <onboarding@resend.dev>",
      to: email,
      subject: "Atur Ulang Password Akun CareerLens AI",
      html: emailHtmlOutput,
    });

    return { success: true, data };
  } catch (error: any) {
    console.error("sendResetPasswordEmail error:", error);
    return { success: false, error: error.message || "Gagal mengirim email reset" };
  }
}
