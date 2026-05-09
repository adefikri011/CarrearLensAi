"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { 
  Rocket, 
  Mail, 
  Lock, 
  ChevronRight, 
  Loader2,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo, we use specific credentials
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error("Login gagal. Periksa kembali email dan password kamu.");
      } else {
        toast.success("Selamat datang kembali!");
        router.push("/dashboard");
      }
    } catch (error) {
       toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-8 font-bold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
           <div className="relative z-10 space-y-8">
              <div className="space-y-2 text-center md:text-left">
                 <div className="w-12 h-12 rounded-2xl bg-[#1D9E75] flex items-center justify-center mb-6 mx-auto md:mx-0">
                    <Rocket className="w-6 h-6 text-white" />
                 </div>
                 <h1 className="text-3xl font-black text-slate-900 italic">Selamat Datang Kembali!</h1>
                 <p className="text-slate-500 font-medium">Lanjutkan langkah karier SMK-mu bersama AI.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                 <div className="space-y-2">
                    <Label className="font-bold text-slate-700 ml-1">Email Sekolah / Pribadi</Label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                       <Input 
                         required
                         type="email" 
                         placeholder="budi@student.sch.id" 
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 focus:ring-[#1D9E75] focus:border-[#1D9E75] font-medium"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="font-bold text-slate-700 ml-1">Password</Label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                       <Input 
                         required
                         type="password" 
                         placeholder="••••••••" 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 focus:ring-[#1D9E75] focus:border-[#1D9E75]"
                       />
                    </div>
                    <div className="text-right">
                       <Link href="/forgot-password"  className="text-xs font-bold text-[#1D9E75] hover:underline">Lupa Password?</Link>
                    </div>
                 </div>

                 <Button 
                   disabled={isLoading}
                   className="w-full h-14 bg-[#1D9E75] hover:bg-[#1D9E75]/90 rounded-2xl text-lg font-black italic shadow-lg shadow-[#1D9E75]/20"
                 >
                   {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Masuk Ke Akun
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                   )}
                 </Button>
              </form>

              <div className="relative py-4">
                 <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100" />
                 </div>
                 <div className="relative flex justify-center text-xs uppercase font-black text-slate-400">
                    <span className="bg-white px-4">Atau Lewat</span>
                 </div>
              </div>

              <Button 
                variant="outline" 
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full h-14 rounded-2xl border-slate-100 hover:bg-slate-50 flex items-center justify-center gap-3 font-bold"
              >
                 <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                 Lanjut dengan Google
              </Button>

              <p className="text-center text-sm font-medium text-slate-500">
                 Belum punya akun? <Link href="/register" className="text-[#1D9E75] font-black hover:underline">Daftar Sekarang</Link>
              </p>
           </div>
           
           {/* Decorative elements */}
           <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#1D9E75]/5 rounded-full blur-2xl" />
        </div>
      </motion.div>
    </div>
  );
}
