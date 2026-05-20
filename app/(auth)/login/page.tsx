"use client";

import React, { useState } from "react";
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
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const formSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

const VisualPanel = ({ headline, subtext }: { headline: string, subtext: string }) => {
  return (
    <div className="hidden lg:flex flex-col w-[55%] bg-[#1D9E75] p-12 text-white relative overflow-hidden justify-center items-center h-full">
      <div className="relative z-10 max-w-md text-center mb-10">
        <h2 className="text-4xl font-black leading-[1.1] mb-4 whitespace-pre-line">
          {headline}
        </h2>
        <p className="text-white/80 text-base font-medium leading-relaxed">
          {subtext}
        </p>
      </div>

      {/* Floating Dashboard Card */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-[1.5rem] border border-white/20 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest mb-1">Status Analisis</p>
            <h4 className="text-lg font-bold">Skor Kesiapan Karier</h4>
          </div>
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="50%" cy="50%" r="22" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
              <circle cx="50%" cy="50%" r="22" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeDasharray="138" strokeDashoffset="30" strokeLinecap="round" />
            </svg>
            <span className="absolute text-[10px] font-bold">78%</span>
          </div>
        </div>

        <div className="space-y-4">
           {[
             { name: "Frontend Developer", match: "92%" },
             { name: "UI/UX Designer", match: "85%" },
             { name: "Data Analyst", match: "71%" }
           ].map((job, i) => (
             <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
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
      <div className="mt-12 flex flex-wrap justify-center gap-2 relative z-10">
         {["Analisis CV", "Roadmap 90 Hari", "Career Match"].map((chip) => (
           <div key={chip} className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white text-[10px] font-semibold border border-white/10 flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-white/60" />
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#1D9E75]" />
          <p className="text-sm font-medium text-gray-500 animate-pulse">Menyiapkan halaman masuk...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [pendingValues, setPendingValues] = useState<z.infer<typeof formSchema> | null>(null);
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const recaptchaRef = React.useRef<ReCAPTCHA>(null);

  React.useEffect(() => {
    const error = searchParams.get("error");
    if (error === "OAuthAccountNotLinked") {
      toast({
        title: "Akun Sudah Terdaftar",
        description: "Email ini sudah terdaftar dengan metode lain (Email/Password). Silakan masuk menggunakan password atau hubungi dukungan.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
          description: "Gagal masuk dengan Google.",
          variant: "destructive",
        });
      }
      return;
    }

    if (pendingValues) {
      const values = pendingValues;
      setPendingValues(null);

      try {
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          captchaToken: token,
          redirect: false,
        });

        if (result?.error) {
          let errorMessage = "Email atau password salah. Silakan coba lagi.";
          
          if (result.error === "CAPTCHA_FAILED") {
            errorMessage = "Verifikasi CAPTCHA gagal. Silakan coba lagi.";
          } else if (result.error === "USER_NOT_FOUND") {
            errorMessage = "Email tidak terdaftar. Silakan daftar terlebih dahulu.";
          } else if (result.error === "OAUTH_ONLY_ACCOUNT") {
            errorMessage = "Akun ini dibuat melalui Google. Silakan masuk menggunakan Google.";
          } else if (result.error === "INVALID_PASSWORD") {
            errorMessage = "Password salah. Silakan coba lagi.";
          }

          toast({
            title: "Gagal Masuk",
            description: errorMessage,
            variant: "destructive",
          });
          recaptchaRef.current?.reset();
          setCaptchaToken(null);
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      } catch (error) {
        toast({
          title: "Terjadi Kesalahan",
          description: "Gagal menghubungkan ke server.",
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

  const handleGoogleLogin = async () => {
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
      <div className="w-full lg:w-[45%] bg-white dark:bg-zinc-950 flex flex-col p-8 md:p-12 overflow-y-auto h-full transition-colors duration-300">
        <div className="max-w-md w-full mx-auto flex flex-col min-h-full pb-8">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center transition-transform group-hover:scale-105">
                <BrainCircuit className="text-[#1D9E75] w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-black dark:text-white">
                CareerLens <span className="text-[#1D9E75]">AI</span>
              </span>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-black tracking-tight text-black dark:text-white mb-1">Selamat Datang Kembali!</h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Masuk untuk melanjutkan perjalanan kariermu.</p>
          </div>

          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-bold text-gray-700 dark:text-zinc-300 ml-1">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="nama@email.com" 
                        {...field} 
                        className="h-12 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-xl px-5 focus:ring-2 focus:ring-[#1D9E75] focus:border-[#1D9E75] dark:text-white transition-all text-sm font-medium"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <div className="flex items-center justify-between ml-1">
                      <FormLabel className="text-xs font-bold text-gray-700 dark:text-zinc-300">Password</FormLabel>
                      <Link href="#" className="text-[10px] font-bold text-[#1D9E75] hover:underline">Lupa Password?</Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                          className="h-12 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-xl px-5 pr-12 focus:ring-2 focus:ring-[#1D9E75] focus:border-[#1D9E75] dark:text-white transition-all text-sm font-medium"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full h-12 bg-black dark:bg-white hover:bg-gray-900 dark:hover:bg-zinc-200 text-white dark:text-black rounded-xl font-bold text-base shadow-lg shadow-black/10 transition-all active:scale-[0.98] mt-4"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Masuk"}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[2px] font-bold">
              <span className="bg-white dark:bg-zinc-950 px-3 text-gray-400 dark:text-zinc-500">Atau masuk dengan</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-12 rounded-xl border-gray-200 dark:border-zinc-800 font-bold flex gap-3 hover:bg-gray-50 dark:hover:bg-zinc-900 dark:text-white transition-all text-sm mb-8"
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
            Masuk dengan Google
          </Button>

          <p className="text-center text-gray-500 dark:text-zinc-400 font-medium pb-4 text-sm mt-auto">
            Belum punya akun?{" "}
            <Link href="/register" className="text-[#1D9E75] font-black hover:underline inline-flex items-center gap-1">
              Daftar Sekarang <ChevronRight size={14} />
            </Link>
          </p>
        </div>
      </div>

      {/* Visual Panel Section */}
      <VisualPanel 
        headline={"Temukan Karier\nImpianmu."} 
        subtext="Analisis potensi diri dengan kecerdasan buatan dan raih masa depan yang lebih cerah bersama CareerLens AI."
      />

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
                  {isGooglePending 
                    ? "Selesaikan CAPTCHA untuk melanjutkan ke Google." 
                    : "Silakan centang CAPTCHA di bawah untuk memproses masuk."}
                </p>
              </div>

              <div className="flex justify-center py-1.5 h-[80px] items-center">
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
                  className="transition-all"
                />
              </div>

              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowCaptcha(false);
                    setIsLoading(false);
                    setPendingValues(null);
                    setIsGooglePending(false);
                  }}
                  className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-400 hover:underline cursor-pointer"
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
