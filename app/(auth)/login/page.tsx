"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import { 
  BrainCircuit, 
  Loader2, 
  CheckCircle2, 
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Gagal Masuk",
          description: "Email atau password salah. Silakan coba lagi.",
          variant: "destructive",
        });
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
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        html, body { overflow: hidden; height: 100%; }
      `}} />
      {/* Form Section */}
      <div className="w-full lg:w-[45%] bg-white flex flex-col p-8 md:p-12 overflow-y-auto h-full scrollbar-hide">
        <div className="max-w-md w-full mx-auto flex flex-col min-h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 w-fit group">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center transition-transform group-hover:scale-105">
              <BrainCircuit className="text-[#1D9E75] w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-black">
              CareerLens <span className="text-[#1D9E75]">AI</span>
            </span>
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl font-black tracking-tight text-black mb-1">Selamat Datang Kembali!</h1>
            <p className="text-sm text-gray-500 font-medium">Masuk untuk melanjutkan perjalanan kariermu.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-bold text-gray-700 ml-1">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="nama@email.com" 
                        {...field} 
                        className="h-12 bg-white border-gray-200 rounded-xl px-5 focus:ring-2 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition-all text-sm font-medium"
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
                      <FormLabel className="text-xs font-bold text-gray-700">Password</FormLabel>
                      <Link href="#" className="text-[10px] font-bold text-[#1D9E75] hover:underline">Lupa Password?</Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                          className="h-12 bg-white border-gray-200 rounded-xl px-5 pr-12 focus:ring-2 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition-all text-sm font-medium"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
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
                className="w-full h-12 bg-black hover:bg-gray-900 text-white rounded-xl font-bold text-base shadow-lg shadow-black/10 transition-all active:scale-[0.98] mt-2"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Masuk"}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[2px] font-bold">
              <span className="bg-white px-3 text-gray-400">Atau masuk dengan</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full h-12 rounded-xl border-gray-200 font-bold flex gap-3 hover:bg-gray-50 transition-all text-sm"
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

          <p className="text-center text-gray-500 font-medium pb-4 mt-auto text-sm">
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
    </div>
  );
}
