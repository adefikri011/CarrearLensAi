"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle2, 
  XSquare, 
  ShieldCheck, 
  Lock,
  ChevronRight
} from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { useToast } from "@/hooks/use-toast";

export default function ResetPasswordPage() {
  return (
    <div id="reset-password-page-container" className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center items-center p-4">
      <Suspense fallback={
        <div className="flex items-center gap-2 text-zinc-500 font-medium">
          <Loader2 className="w-5 h-5 animate-spin text-[#1D9E75]" />
          <span>Memuat Halaman...</span>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const token = searchParams.get("token");

  // Form states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Captcha states
  const [showCaptcha, setShowCaptcha] = useState(false);
  const recaptchaRef = React.useRef<ReCAPTCHA>(null);

  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-8 max-w-md w-full shadow-[0_15px_45px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.25)] text-center space-y-6"
      >
        <div className="mx-auto size-16 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 flex items-center justify-center border border-red-100 dark:border-red-900/60">
          <XSquare size={32} className="stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Tautan Tidak Valid</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Token pengubahan password tidak diidentifikasi. Harap mintalah tautan atur ulang kata sandi yang baru lewat halaman login.
          </p>
        </div>
        <Link 
          href="/login" 
          className="w-full text-xs font-bold text-white bg-[#534AB7] hover:bg-[#463e9c] h-11 rounded-xl transition-all flex items-center justify-center shadow-sm"
        >
          Kembali ke Halaman Masuk
        </Link>
      </motion.div>
    );
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast({
        title: "Kolom Kosong",
        description: "Mohon isi password baru Anda dan konfirmasikan.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password Terlalu Lemah",
        description: "Password baru minimal diisi sebanyak 8 karakter.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Tidak Cocok",
        description: "Konfirmasi kata sandi tidak sama dengan kata sandi baru Anda.",
        variant: "destructive",
      });
      return;
    }

    // Trigger recaptcha verification next
    setShowCaptcha(true);
  };

  const handleCaptchaAndSubmit = async (captchaToken: string | null) => {
    if (!captchaToken) {
      setIsLoading(false);
      return;
    }

    setShowCaptcha(false);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
          captchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Token telah kedaluwarsa atau terjadi kendala sistem.");
      }

      toast({
        title: "Password Berhasil Diperbarui",
        description: "Kata sandi Anda sudah berhasil diganti. Silakan masuk menggunakan kata sandi baru Anda.",
      });

      setIsCompleted(true);
    } catch (error) {
      toast({
        title: "Gagal Mengubah Password",
        description: error instanceof Error ? error.message : "Terjadi kesalahan koneksi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative">
      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key="reset-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-8 w-full shadow-[0_15px_45px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.25)] space-y-6"
          >
            {/* Header branding info */}
            <div className="text-center space-y-2">
              <div className="mx-auto size-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#534AB7] dark:text-purple-300 flex items-center justify-center border border-purple-100 dark:border-purple-900/60 mb-2">
                <Lock size={22} className="stroke-[1.75]" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Buat Password Baru</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[280px] mx-auto leading-relaxed">
                Silakan isi password baru Anda di bawah ini secara aman untuk mengamankan kembali akun CareerLens AI Anda.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 ml-1">Password Baru</label>
                <div id="new-password-wrapper" className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Minimal 8 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 pr-10 text-xs font-semibold dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1D9E75]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 ml-1">Konfirmasi Password Baru</label>
                <div id="confirm-password-wrapper" className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Ulangi password di atas"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 pr-10 text-xs font-semibold dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1D9E75]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-xs font-bold text-white bg-[#1D9E75] hover:bg-[#168562] h-11 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Sedang Menyimpan...
                    </>
                  ) : (
                    "Simpan Password Baru"
                  )}
                </button>
              </div>
            </form>

            <div className="text-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Link 
                href="/login" 
                className="text-xs font-bold text-[#534AB7] hover:text-[#463e9c] inline-flex items-center gap-1 hover:underline"
              >
                Batal dan kembali ke halaman login
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805/40 rounded-2xl p-8 w-full shadow-[0_15px_45px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.25)] text-center space-y-6"
          >
            <div className="mx-auto size-16 rounded-full bg-[#ecfdf5] dark:bg-[#064e3b] text-[#115e59] dark:text-[#a7f3d0] flex items-center justify-center border border-emerald-100 dark:border-emerald-950">
              <CheckCircle2 size={32} className="stroke-[1.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Atur Ulang Berhasil!</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[280px] mx-auto">
                Password Anda telah berhasil diperbarui dan disinkronkan. Silakan login kembali dengan menggunakan password baru Anda.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full text-xs font-bold text-white bg-[#1D9E75] hover:bg-[#168562] h-11 rounded-xl transition-all flex items-center justify-center shadow-sm"
            >
              Masuk Sekarang
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CAPTCHA Overlay Component */}
      <AnimatePresence>
        {showCaptcha && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[4px] p-4 h-full"
          >
            <motion.div
              initial={{ scale: 0.98, y: 4 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 4 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805/40 rounded-2xl p-6 max-w-sm w-full shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-center space-y-4 relative"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="size-10 rounded-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                  <ShieldCheck size={20} className="stroke-[1.75]" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  Verifikasi Keamanan
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[240px] mx-auto leading-relaxed">
                  Selesaikan CAPTCHA di bawah ini untuk mengonfirmasi pembaruan password secara aman.
                </p>
              </div>

              <div className="flex justify-center py-1.5 h-[80px] items-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                  onChange={(token) => {
                    if (token) {
                      setShowCaptcha(false);
                      handleCaptchaAndSubmit(token);
                    }
                  }}
                  onExpired={() => {
                    setShowCaptcha(false);
                  }}
                  onErrored={() => {
                    setShowCaptcha(false);
                    toast({
                      title: "Gagal memuat reCAPTCHA",
                      description: "Terjadi kesalahan koneksi reCAPTCHA.",
                      variant: "destructive",
                    });
                  }}
                  size="normal"
                  theme="light"
                  className="transition-all"
                />
              </div>

              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowCaptcha(false);
                  }}
                  className="text-xs font-semibold text-zinc-400 hover:text-zinc-650 dark:text-zinc-500 dark:hover:text-zinc-450 hover:underline cursor-pointer"
                >
                  Batalkan Verifikasi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
