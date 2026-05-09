"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Rocket, 
  User, 
  Mail, 
  Lock, 
  ChevronRight, 
  Loader2,
  ArrowLeft,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Akun kamu berhasil dibuat! Silakan masuk.");
      router.push("/login");
    }, 2000);
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
                 <div className="w-12 h-12 rounded-2xl bg-[#534AB7] flex items-center justify-center mb-6 mx-auto md:mx-0">
                    <Rocket className="w-6 h-6 text-white" />
                 </div>
                 <h1 className="text-3xl font-black text-slate-900 italic">Mulai Perjalananmu.</h1>
                 <p className="text-slate-500 font-medium">Gabung dengan ribuan siswa SMK lainnya di CareerLens AI.</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                 <div className="space-y-2">
                    <Label className="font-bold text-slate-700 ml-1">Nama Lengkap</Label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                       <Input required placeholder="Budi Setiawan" className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 focus:ring-[#534AB7] font-medium" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="font-bold text-slate-700 ml-1">Nama SMK & Jurusan</Label>
                    <div className="relative">
                       <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                       <Input required placeholder="SMKN 1 Jakarta - RPL" className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 focus:ring-[#534AB7] font-medium" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="font-bold text-slate-700 ml-1">Email</Label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                       <Input required type="email" placeholder="budi@student.sch.id" className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 focus:ring-[#534AB7] font-medium" />
                    </div>
                 </div>

                 <div className="space-y-2 pb-2">
                    <Label className="font-bold text-slate-700 ml-1">Password</Label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                       <Input required type="password" placeholder="••••••••" className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 focus:ring-[#534AB7]" />
                    </div>
                 </div>

                 <Button 
                   disabled={isLoading}
                   className="w-full h-14 bg-[#534AB7] hover:bg-[#534AB7]/90 rounded-2xl text-lg font-black italic shadow-lg shadow-[#534AB7]/20"
                 >
                   {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Daftar Akun
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                   )}
                 </Button>
              </form>

              <p className="text-center text-sm font-medium text-slate-500">
                 Sudah punya akun? <Link href="/login" className="text-[#534AB7] font-black hover:underline">Masuk Disini</Link>
              </p>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
