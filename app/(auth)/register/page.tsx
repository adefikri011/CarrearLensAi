"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { 
  BrainCircuit, 
  Loader2, 
  CheckCircle2, 
  ChevronRight,
  Eye,
  EyeOff,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Suspense } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

const VisualPanel = ({ headline, subtext }: { headline: string, subtext: string }) => {
  return (
    <div className="hidden lg:flex flex-col w-[55%] bg-[#1D9E75] p-12 text-white relative overflow-hidden justify-center items-center h-full">
      <div className="relative z-10 max-w-sm text-center mb-8">
        <h2 className="text-4xl font-black leading-[1.1] mb-3 whitespace-pre-line">
          {headline}
        </h2>
        <p className="text-white/80 text-sm font-medium leading-relaxed">
          {subtext}
        </p>
      </div>

      {/* Floating Dashboard Card */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-[320px] bg-white/10 backdrop-blur-xl rounded-[1.5rem] border border-white/20 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/60 text-[8px] font-bold uppercase tracking-widest mb-1">Status Analisis</p>
            <h4 className="text-base font-bold">Skor Kesiapan Karier</h4>
          </div>
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="50%" cy="50%" r="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle cx="50%" cy="50%" r="18" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="113" strokeDashoffset="25" strokeLinecap="round" />
            </svg>
            <span className="absolute text-[9px] font-bold">78%</span>
          </div>
        </div>

        <div className="space-y-3.5">
           {[
             { name: "Frontend Developer", match: "92%" },
             { name: "UI/UX Designer", match: "85%" },
             { name: "Data Analyst", match: "71%" }
           ].map((job, i) => (
             <div key={i} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-white/90">{job.name}</span>
                  <span className="text-white">{job.match}</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: job.match }}
                    transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                    className="h-full bg-white/40" 
                   />
                </div>
             </div>
           ))}
        </div>
      </motion.div>

      {/* Feature Chips */}
      <div className="mt-10 flex flex-wrap justify-center gap-2 relative z-10">
         {["Analisis CV", "Roadmap 90 Hari", "Career Match"].map((chip) => (
           <div key={chip} className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 text-white text-[9px] font-semibold border border-white/10 flex items-center gap-1">
              <CheckCircle2 size={10} className="text-white/60" />
              {chip}
           </div>
         ))}
      </div>

      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
    </div>
  );
};

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#1D9E75]" />
          <p className="text-sm font-medium text-gray-500 animate-pulse">Menyiapkan halaman pendaftaran...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [pendingValues, setPendingValues] = useState<z.infer<typeof formSchema> | null>(null);
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const recaptchaRef = React.useRef<ReCAPTCHA>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");
  
  useEffect(() => {
    let score = 0;
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    setPasswordStrength(score);
  }, [password]);

  const handleCaptchaChange = async (token: string | null) => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    setCaptchaToken(token);

    if (isGooglePending) {
      setIsGooglePending(false);
      try {
        await signIn("google", { callbackUrl: "/dashboard" });
      } catch (error) {
        setIsLoading(false);
        toast({
          title: "Terjadi Kesalahan",
          description: "Gagal daftar dengan Google.",
          variant: "destructive",
        });
      }
      return;
    }

    if (pendingValues) {
      const values = pendingValues;
      setPendingValues(null);

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
            captchaToken: token,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Gagal melakukan registrasi");
        }

        toast({
          title: "Pendaftaran Berhasil!",
          description: "Silakan masuk menggunakan akun barumu.",
        });
        
        router.push("/login");
      } catch (error) {
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
        toast({
          title: "Gagal Mendaftar",
          description: error instanceof Error ? error.message : "Terjadi kesalahan sistem.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setPendingValues(values);
    setIsGooglePending(false);
    setShowCaptcha(true);
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setIsGooglePending(true);
    setPendingValues(null);
    setShowCaptcha(true);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        html, body { overflow: hidden; height: 100%; }
      `}} />
      {/* Form Section */}
      <div className="w-full lg:w-[45%] bg-white dark:bg-zinc-950 flex flex-col p-6 md:p-8 overflow-y-auto h-full px-4 transition-colors duration-300">
        <div className="max-w-md w-full mx-auto flex flex-col min-h-full pb-10">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2 w-fit group">
              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center transition-transform group-hover:scale-105">
                <BrainCircuit className="text-[#1D9E75] w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-black dark:text-white">
                CareerLens <span className="text-[#1D9E75]">AI</span>
              </span>
            </Link>
          </div>

          <div className="mb-4">
            <h1 className="text-2xl font-black tracking-tight text-black dark:text-white mb-1">Buat Akun Baru</h1>
            <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium">Lengkapi langkah awal menuju cerahnya masa depanmu.</p>
          </div>

          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-3"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 ml-1">Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        {...field} 
                        className="h-10 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-xl px-4 focus:ring-2 focus:ring-[#1D9E75] focus:border-[#1D9E75] dark:text-white transition-all text-sm font-medium"
                      />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 ml-1">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="nama@email.com" 
                        {...field} 
                        className="h-10 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-xl px-4 focus:ring-2 focus:ring-[#1D9E75] focus:border-[#1D9E75] dark:text-white transition-all text-sm font-medium"
                      />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 ml-1">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                          className="h-10 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-xl px-4 pr-12 focus:ring-2 focus:ring-[#1D9E75] focus:border-[#1D9E75] dark:text-white transition-all text-sm font-medium"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <div className="mt-1 flex gap-1 h-0.5">
                       <div className={`h-full rounded-full flex-1 transition-all ${passwordStrength >= 25 ? (passwordStrength >= 75 ? "bg-[#1D9E75]" : "bg-yellow-400") : "bg-gray-100 dark:bg-zinc-800"}`} />
                       <div className={`h-full rounded-full flex-1 transition-all ${passwordStrength >= 50 ? (passwordStrength >= 75 ? "bg-[#1D9E75]" : "bg-yellow-400") : "bg-gray-100 dark:bg-zinc-800"}`} />
                       <div className={`h-full rounded-full flex-1 transition-all ${passwordStrength >= 75 ? "bg-[#1D9E75]" : "bg-gray-100 dark:bg-zinc-800"}`} />
                       <div className={`h-full rounded-full flex-1 transition-all ${passwordStrength >= 100 ? "bg-[#1D9E75]" : "bg-gray-100 dark:bg-zinc-800"}`} />
                    </div>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 ml-1">Konfirmasi Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="h-10 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-xl px-4 focus:ring-2 focus:ring-[#1D9E75] focus:border-[#1D9E75] dark:text-white transition-all text-sm font-medium"
                      />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-[#1D9E75] hover:bg-[#168562] text-white rounded-xl font-bold text-base shadow-lg shadow-[#1D9E75]/20 transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Buat Akun"}
                </Button>
              </div>
            </form>
          </Form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-[8px] uppercase tracking-[2px] font-bold">
              <span className="bg-white dark:bg-zinc-950 px-3 text-gray-400 dark:text-zinc-500">Atau daftar dengan</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full h-11 rounded-xl border-gray-200 dark:border-zinc-800 font-bold flex gap-3 hover:bg-gray-50 dark:hover:bg-zinc-900 dark:text-zinc-300 transition-all text-[13px] mb-8"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Daftar dengan Google
          </Button>

          <p className="text-center text-gray-500 dark:text-zinc-400 font-medium pb-4 text-[13px] mt-auto">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-[#1D9E75] font-black hover:underline inline-flex items-center gap-1">
              Masuk di sini <ChevronRight size={14} />
            </Link>
          </p>
        </div>
      </div>

      {/* Visual Panel Section */}
      <VisualPanel 
        headline={"Mulai Perjalanan\nKariermu Hari Ini."} 
        subtext="Bergabunglah dengan ribuan pelajar SMK lainnya yang telah menemukan jalur karier terbaik mereka."
      />

      <AnimatePresence>
        {showCaptcha && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-md p-4 h-full"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/60 rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] text-center space-y-6 relative overflow-hidden ring-1 ring-black/5 dark:ring-white/5"
            >
              <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-teal/10 via-teal/5 to-transparent dark:from-teal/20 dark:via-teal/5 dark:to-transparent pointer-events-none opacity-65" />
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-dark via-teal to-purple-600" />
              
              <div className="relative mx-auto size-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-teal/10 dark:bg-teal/20 animate-pulse" />
                <div className="relative size-12 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-teal">
                  <ShieldCheck size={24} className="stroke-[2.25]" />
                </div>
              </div>
              
              <div className="space-y-2 relative">
                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
                  Verifikasi Keamanan
                </h3>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-[240px] mx-auto">
                  {isGooglePending 
                    ? "Selesaikan CAPTCHA di bawah untuk melanjutkan mendaftar menggunakan Google." 
                    : "Silakan verifikasi bahwa Anda bukan robot untuk membuat akun baru."}
                </p>
              </div>

              <div className="flex justify-center p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 shadow-inner min-h-[102px] items-center relative overflow-hidden">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                  onChange={(token) => {
                    if (token) {
                      setShowCaptcha(false);
                      handleCaptchaChange(token);
                    }
                  }}
                  onExpired={() => {
                    setShowCaptcha(false);
                    setIsLoading(false);
                  }}
                  onErrored={() => {
                    setShowCaptcha(false);
                    setIsLoading(false);
                    toast({
                      title: "Gagal memuat reCAPTCHA",
                      description: "Terjadi kesalahan koneksi reCAPTCHA.",
                      variant: "destructive",
                    });
                  }}
                  size="normal"
                  theme="light"
                  className="dark:invert dark:brightness-[0.8] transition-all duration-350"
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowCaptcha(false);
                  setIsLoading(false);
                  setPendingValues(null);
                  setIsGooglePending(false);
                }}
                className="w-full text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 dark:hover:text-rose-400 h-12 bg-zinc-50 dark:bg-zinc-900 hover:bg-red-50/50 dark:hover:bg-red-950/10 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl transition-all duration-300"
              >
                Batal & Kembali
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
