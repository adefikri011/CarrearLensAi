"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  BrainCircuit, Target, Sparkles,
  AlertCircle, ArrowRight, User, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import PageLoader from "@/components/shared/PageLoader";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
};

export default function SharedAnalysisPage({ params }: { params: { id: string } }) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedAnalysis = async () => {
      try {
        const res = await fetch(`/api/share/${params.id}`);
        const result = await res.json();
        if (result.success && result.data) {
          setAnalysis(result.data);
        } else {
          setError(result.error || "Analisis tidak ditemukan.");
        }
      } catch (error) {
        console.error("Failed to fetch shared analysis", error);
        setError("Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedAnalysis();
  }, [params.id]);

  if (loading) {
    return <PageLoader isLoading={true} text="Memuat Hasil Analisis..." />;
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[40px] shadow-sm max-w-md border border-gray-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-500 mb-8">{error || "Analisis tidak ditemukan atau sudah dihapus."}</p>
          <Link href="/">
            <Button className="bg-black text-white rounded-full px-8 h-12 font-bold w-full">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const result = analysis.result as any;
  const ownerName = analysis.user?.name || "Seseorang";

  const radarData = result?.skillRadar ? [
    { subject: 'Teknis', A: result.skillRadar.teknisDigital || 0 },
    { subject: 'Komunikasi', A: result.skillRadar.komunikasi || 0 },
    { subject: 'Leadership', A: result.skillRadar.kepemimpinan || 0 },
    { subject: 'Kreativitas', A: result.skillRadar.kreativitas || 0 },
    { subject: 'Analitik', A: result.skillRadar.analitis || 0 },
    { subject: 'Adaptabilitas', A: result.skillRadar.adaptabilitas || 0 },
  ] : [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-black selection:bg-[#1D9E75] selection:text-white transition-colors">
      {/* Navbar Minimalis */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-black/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div
              className="w-8 h-8 rounded-[10px] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #1D9E75 0%, #534AB7 100%)" }}
            >
              <BrainCircuit className="w-[17px] h-[17px] text-white" />
            </div>
            <div className="flex flex-col leading-none gap-[2px]">
              <span className="font-black text-[12px] sm:text-[14px] tracking-tighter text-zinc-900 dark:text-white uppercase leading-none">
                CareerLens
              </span>
              <span className="text-[7px] sm:text-[7.5px] font-bold tracking-[0.2em] uppercase text-[#1D9E75] leading-none">
                AI Assistant
              </span>
            </div>
          </Link>
          <Link href="/register">
             <Button className="bg-zinc-950 dark:bg-white text-white dark:text-black rounded-full px-4 sm:px-8 h-10 sm:h-12 font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-[#1D9E75] dark:hover:bg-[#1D9E75] dark:hover:text-white transition-all shadow-lg active:scale-95">
                Coba Sekarang
             </Button>
          </Link>
        </div>
      </nav>

      <main className="pt-24 sm:pt-36 pb-20 sm:pb-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-teal/5 dark:bg-teal/10 blur-[80px] sm:blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-teal/5 dark:bg-teal/10 blur-[80px] sm:blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-20"
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-1.5 sm:py-2 bg-white dark:bg-zinc-900 rounded-full text-[#1D9E75] font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] border border-zinc-100 dark:border-zinc-800 shadow-sm">
               <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
               Hasil Analisis Karier
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight max-w-3xl mx-auto uppercase italic transition-colors">
               Potensi Karier <br/> 
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1D9E75] to-[#534AB7]">{ownerName}</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto font-bold uppercase tracking-tight transition-colors">
               Berdasarkan analisis AI terpadu, inilah jalur karier yang paling sesuai untuk profil ini.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Skor Utama */}
            <motion.div 
              initial="hidden" animate="visible" variants={fadeUp}
              className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
            >
               <div className="bg-white dark:bg-zinc-900 p-6 sm:p-10 rounded-[28px] sm:rounded-[40px] border border-zinc-100 dark:border-zinc-800/80 shadow-xl shadow-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-[#1D9E75]/30 transition-all duration-300 group">
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1 sm:mb-2">TINGKAT KESIAPAN</p>
                    <h2 className="text-5xl sm:text-7xl font-black text-zinc-900 dark:text-white group-hover:text-[#1D9E75] italic transition-colors leading-none">{analysis.overallReadiness}%</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-3 sm:mt-4 font-bold uppercase tracking-tight">Sangat Siap Kerja</p>
                  </div>
                  <div className="relative shrink-0 self-end sm:self-center">
                    <div className="absolute inset-0 bg-[#1D9E75]/20 blur-2xl rounded-full" />
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[24px] sm:rounded-[32px] border-4 border-zinc-50 dark:border-zinc-800 border-t-[#1D9E75] flex items-center justify-center animate-spin-slow relative z-10 bg-white dark:bg-zinc-900">
                       <BrainCircuit className="w-8 h-8 sm:w-10 sm:h-10 text-[#1D9E75]" />
                    </div>
                  </div>
               </div>
               <div className="bg-gradient-to-br from-zinc-900 via-neutral-950 to-black dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 p-6 sm:p-10 rounded-[28px] sm:rounded-[40px] shadow-xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 overflow-hidden relative group border border-zinc-800/40">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 sm:mb-2 mr-2">CV SCORE</p>
                    <h2 className="text-5xl sm:text-7xl font-black italic text-white tracking-tighter leading-none">{analysis.cvScore}%</h2>
                    <p className="text-white/60 text-xs sm:text-sm mt-3 sm:mt-4 font-bold uppercase tracking-tight">Optimasi Dokumen</p>
                  </div>
                  <FileText className="w-32 h-32 sm:w-44 sm:h-44 text-white/5 absolute -right-6 -bottom-6 sm:-right-10 sm:-bottom-10 group-hover:rotate-12 transition-transform duration-700 pointer-events-none" />
               </div>
            </motion.div>

            {/* Career Paths */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
               <h3 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2 sm:gap-3 transition-colors">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#1D9E75]" />
                  Rekomendasi Jalur
               </h3>
               {(result?.careerPaths || []).map((path: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial="hidden" animate="visible" variants={fadeUp}
                    className={cn(
                      "p-6 sm:p-10 rounded-[28px] sm:rounded-[40px] border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all shadow-sm flex flex-col gap-6 sm:gap-8 group hover:shadow-2xl hover:shadow-[#1D9E75]/5 hover:border-[#1D9E75]/20",
                      i === 0 && "ring-4 ring-[#1D9E75]/5 dark:ring-[#1D9E75]/10"
                    )}
                  >
                     <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6">
                        <div className="space-y-3 flex-1">
                           <div className="flex items-center gap-3 flex-wrap">
                              <h4 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tighter italic uppercase group-hover:text-[#1D9E75] transition-colors">{path.nama}</h4>
                              {i === 0 && (
                                <span className="bg-[#1D9E75] text-white text-[8px] sm:text-[9px] font-black px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-[#1D9E75]/20">UTAMA</span>
                              )}
                           </div>
                           <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base font-medium leading-relaxed transition-colors">{path.deskripsi}</p>
                        </div>
                        <div className="bg-[#1D9E75]/5 dark:bg-[#1D9E75]/10 text-[#1D9E75] px-4 py-2 sm:px-6 sm:py-4 rounded-[16px] sm:rounded-[24px] font-black text-2xl sm:text-3xl italic shadow-sm self-start sm:self-center shrink-0">
                           {path.matchScore}<span className="text-xs uppercase ml-1">%</span>
                        </div>
                     </div>
                  </motion.div>
               ))}
               
               <div className="bg-gradient-to-br from-[#1D9E75] to-[#534AB7] rounded-[28px] sm:rounded-[40px] p-8 sm:p-14 text-white shadow-2xl shadow-emerald-500/10 relative overflow-hidden group mt-12 sm:mt-16 transition-transform duration-300 hover:scale-[1.01]">
                  <div className="relative z-10 space-y-6 sm:space-y-8">
                    <h3 className="text-3xl sm:text-4xl font-extrabold italic tracking-tight uppercase leading-tight">Ingin Tahu <br/> Karier Kamu?</h3>
                    <p className="text-white/80 font-bold max-w-sm uppercase text-xs sm:text-sm tracking-tight leading-relaxed">
                       Dapatkan analisis mendalam seperti ini untuk CV kamu hanya dalam 2 menit menggunakan Gemini AI.
                    </p>
                    <Link href="/register" className="inline-block relative z-20 w-full sm:w-auto">
                       <Button className="w-full sm:w-auto bg-white hover:bg-zinc-100 text-zinc-950 hover:text-black rounded-full px-10 sm:px-12 h-14 sm:h-16 font-black uppercase text-xs tracking-[0.2em] transition-all shadow-2xl">
                          Mulai Analisis Sekarang
                       </Button>
                    </Link>
                  </div>
                  <Sparkles className="w-40 h-40 sm:w-56 sm:h-56 text-white/10 absolute -right-8 -top-8 sm:-right-12 sm:-top-12 animate-pulse rotate-12 pointer-events-none" />
                  <div className="absolute top-1/2 left-0 w-1/2 h-full bg-white/5 blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
               </div>
            </div>

            {/* Sidebar info */}
            <div className="space-y-6 sm:space-y-10">
               <div className="bg-white dark:bg-zinc-900 p-6 sm:p-10 rounded-[28px] sm:rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center overflow-hidden transition-all hover:border-[#1D9E75]/30">
                  <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 tracking-[0.3em] uppercase mb-8 sm:mb-12 text-center transition-colors">SKILL LANDSCAPE</h4>
                  <div className="w-full h-64 sm:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="currentColor" className="text-zinc-100 dark:text-zinc-800/60" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 900, className: 'text-zinc-400 dark:text-zinc-500 uppercase' }} />
                        <Radar
                           name="Skill"
                           dataKey="A"
                           stroke="#1D9E75"
                           fill="#1D9E75"
                           fillOpacity={0.2}
                           strokeWidth={3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 text-center mt-6 sm:mt-8 font-bold leading-relaxed transition-colors uppercase tracking-tight">
                     Data kompetensi unik yang diidentifikasi oleh sistem CareerLens AI.
                  </p>
               </div>

               <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[28px] sm:rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:border-[#1D9E75]/30">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-50 dark:bg-zinc-800 rounded-[16px] sm:rounded-[20px] flex items-center justify-center text-zinc-300 dark:text-zinc-600 transition-colors">
                        <User className="w-6 h-6 sm:w-7 sm:h-7" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">DIANALISIS UNTUK</p>
                        <p className="font-black text-zinc-900 dark:text-white uppercase italic text-base sm:text-lg transition-colors">{ownerName}</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 leading-relaxed italic transition-colors">
                        &quot;Masa depan adalah milik mereka yang mempersiapkan diri hari ini. Teruslah tumbuh dan eksplorasi potensi unikmu.&quot;
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Minimalis */}
      <footer className="py-16 sm:py-20 border-t border-zinc-100 dark:border-zinc-900 text-center transition-colors">
         <p className="text-[10px] sm:text-[11px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em] px-4">
           © {new Date().getFullYear()} CAREERLENS AI — JUARAVIBECODING 2026 EDITION
         </p>
      </footer>
    </div>
  );
}
