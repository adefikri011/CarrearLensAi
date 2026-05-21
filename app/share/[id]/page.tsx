"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  BrainCircuit, Target, Sparkles,
  AlertCircle, ArrowRight, User, FileText, CheckCircle2, TrendingUp, ShieldCheck
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
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
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
          setError(result.error || "Hasil analisis luar biasa ini tidak ditemukan.");
        }
      } catch (error) {
        console.error("Failed to fetch shared analysis", error);
        setError("Koneksi gagal. Silakan muat ulang halaman.");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedAnalysis();
  }, [params.id]);

  if (loading) {
    return <PageLoader isLoading={true} text="Membaca Hasil Analisis Karier..." />;
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center justify-center p-4">
        {/* Decorative background grids */}
        <div 
          className="absolute inset-0 pointer-events-none select-none z-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(29, 158, 117, 0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(29, 158, 117, 0.03) 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
          }}
        />

        <div className="bg-white dark:bg-[#111111] p-8 sm:p-12 rounded-[32px] shadow-2xl max-w-md w-full border border-zinc-200 dark:border-zinc-805/80 relative z-10 text-center">
          <div className="w-16 h-16 bg-rose-500/10 dark:bg-rose-500/15 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-3">
            Analisis Tidak Tersedia
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 leading-relaxed font-sans">
            {error || "Tautan analisis tidak lagi berlaku atau berkas aslinya diprivasi oleh pemilik."}
          </p>
          <Link href="/" className="block">
            <Button className="bg-[#1D9E75] hover:bg-[#15825f] text-white rounded-full px-8 h-12 font-black uppercase tracking-wider text-xs w-full transition-transform active:scale-95">
              Hubungkan Karier Baru
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const result = analysis.result as any;
  const ownerName = analysis.user?.name || "Rekan SMK";

  const radarData = result?.skillRadar ? [
    { subject: 'Teknis', A: result.skillRadar.teknisDigital || 0 },
    { subject: 'Komunikasi', A: result.skillRadar.komunikasi || 0 },
    { subject: 'Leadership', A: result.skillRadar.kepemimpinan || 0 },
    { subject: 'Kreativitas', A: result.skillRadar.kreativitas || 0 },
    { subject: 'Analitik', A: result.skillRadar.analitis || 0 },
    { subject: 'Adaptabilitas', A: result.skillRadar.adaptabilitas || 0 },
  ] : [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0A0A] text-zinc-900 dark:text-zinc-100 selection:bg-[#1D9E75] selection:text-white transition-colors relative">
      
      {/* Subtle Daytona Grid Background Line Effects */}
      <div 
        className="absolute inset-0 pointer-events-none select-none z-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(29, 158, 117, 0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(29, 158, 117, 0.02) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }}
      />

      {/* Modern High-Fidelity Floating Header */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900/80 transition-all">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-[#111] flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
              <BrainCircuit className="w-4.5 h-4.5 text-[#1D9E75]" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-mono font-bold text-xs tracking-tight text-zinc-900 dark:text-white uppercase">
                CareerLens <span className="text-[#1D9E75] font-black">AI</span>
              </span>
              <span className="text-[7px] font-bold tracking-widest uppercase text-zinc-400 mt-0.5">PUBLIC REPORT</span>
            </div>
          </Link>
          <Link href="/register">
             <Button className="bg-[#1D9E75] hover:bg-[#15825f] text-white rounded-full px-5 sm:px-6 h-10 font-bold text-[10px] uppercase tracking-wider transition-all shadow-lg shadow-[#1D9E75]/10 hover:scale-105 active:scale-95">
                Coba Gratis
             </Button>
          </Link>
        </div>
      </nav>

      <main className="pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-8 relative z-10">
        
        {/* Radiant Orbs behind content */}
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#1D9E75]/5 dark:bg-[#1D9E75]/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#534AB7]/5 dark:bg-[#534AB7]/8 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
          
          {/* Headline Report Sheet card */}
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="text-center space-y-4 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-150 dark:border-emerald-900/40 rounded-full font-mono text-[9px] font-black tracking-wider uppercase text-[#1D9E75]">
               <Sparkles className="w-3.5 h-3.5" /> Hasil Analisis Publik Terverifikasi
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none">
               POTENSI KARIER <span className="text-zinc-500 dark:text-zinc-400 block sm:inline italic font-serif">&quot;{ownerName}&quot;</span>
            </h1>
            <p className="font-mono text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
               Hasil pemetaan kualifikasi kompetensi terhadap bursa kerja aktif oleh model Gemini 2.5.
            </p>
          </motion.div>

          {/* Scores Overview Grid (Daytona Tech Cards Row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Score 1 */}
            <motion.div 
              initial="hidden" animate="visible" variants={fadeUp}
              className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-[#1F1F1F] rounded-3xl p-6 sm:p-8 hover:border-[#1D9E75] transition-all group overflow-hidden relative shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <span className="font-mono text-[9px] font-black tracking-widest text-zinc-400 uppercase block">Kesiapan Kerja / Readiness Score</span>
                  <h2 className="text-5xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-white italic font-mono uppercase group-hover:text-[#1D9E75] transition-colors">
                    {analysis.overallReadiness}%
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-[#1D9E75] shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-zinc-400 uppercase">STATUS REPORT</span>
                <span className="text-[#1D9E75] font-bold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SANGAT LAYAK INDUSTRI
                </span>
              </div>
            </motion.div>

            {/* Score 2 */}
            <motion.div 
              initial="hidden" animate="visible" variants={fadeUp}
              className="bg-[#111111] dark:bg-[#111111] text-white border border-zinc-900/90 dark:border-[#1F1F1F] rounded-3xl p-6 sm:p-8 hover:border-[#1D9E75] transition-all group overflow-hidden relative shadow-xl"
            >
              {/* Background accent sheet */}
              <div className="absolute inset-0 pointer-events-none select-none z-0 opacity-30 bg-gradient-to-tr from-[#1D9E75]/10 to-transparent" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4">
                  <span className="font-mono text-[9px] font-black tracking-widest text-[#1D9E75] uppercase block">Standarisasi CV / ATS optimization</span>
                  <h2 className="text-5xl sm:text-6xl font-black tracking-tight text-[#1D9E75] italic font-mono uppercase">
                    {analysis.cvScore}%
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-xl bg-zinc-800 dark:bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white shrink-0">
                  <FileText className="w-5 h-5 text-[#1D9E75]" />
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono relative z-10">
                <span className="text-zinc-500 uppercase">ENGINE SCANNER</span>
                <span className="text-white font-extrabold uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1D9E75]" /> OPTIMASI PRIMA
                </span>
              </div>
            </motion.div>

          </div>

          {/* Core Insights & Pathways Map Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Recommendations (Spans 2 columns) */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
               
               <div className="flex items-center gap-2 pb-2">
                  <Target className="w-4 h-4 text-[#1D9E75]" />
                  <h3 className="font-mono text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                     Rekomendasi Lintasan Karier SMK
                  </h3>
               </div>

               <motion.div 
                 variants={staggerContainer} initial="hidden" animate="visible"
                 className="space-y-5"
               >
                 {(result?.careerPaths || []).map((path: any, i: number) => (
                    <motion.div 
                      key={i}
                      variants={fadeUp}
                      className={cn(
                        "p-6 sm:p-8 rounded-[24px] border transition-all flex flex-col justify-between gap-6 hover:shadow-lg hover:border-[#1D9E75]/30",
                        i === 0 
                          ? "bg-white dark:bg-[#111111] border-zinc-200 dark:border-[#1D9E75] ring-1 ring-[#1D9E75]/10 dark:ring-[#1D9E75]/25" 
                          : "bg-white dark:bg-[#111111] border-zinc-150 dark:border-zinc-850"
                      )}
                    >
                       <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6">
                          <div className="space-y-3 flex-1 text-left">
                             <div className="flex items-center gap-3 flex-wrap">
                                <h4 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase font-mono">{path.nama}</h4>
                                {i === 0 && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 font-mono text-[8px] font-black uppercase tracking-widest text-emerald-600 dark:text-[#1D9E75]">
                                    <Sparkles className="w-2.5 h-2.5" /> REKOMENDASI UTAMA
                                  </span>
                                )}
                             </div>
                             <p className="text-zinc-550 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed transition-colors font-sans">{path.deskripsi}</p>
                          </div>
                          
                          <div className="bg-zinc-50 dark:bg-zinc-800/40 text-zinc-800 dark:text-emerald-400 px-4 py-2 rounded-xl font-mono text-xl sm:text-2xl font-black italic border border-zinc-150 dark:border-zinc-800 self-start sm:self-center shrink-0">
                             {path.matchScore}% <span className="text-[10px] font-black not-italic text-zinc-400 block sm:inline">MATCH</span>
                          </div>
                       </div>
                    </motion.div>
                 ))}
               </motion.div>

               {/* Banner Call To Action sheet within report */}
               <div className="bg-gradient-to-tr from-[#1D9E75] to-[#534AB7] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute inset-0 pointer-events-none select-none z-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-black to-black" />
                  
                  <div className="relative z-10 space-y-6 text-left">
                    <span className="font-mono text-[9px] font-black uppercase tracking-widest text-white/50 block">READY TO START YOUR ACCELERATION?</span>
                    <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase leading-none">
                      INGIN SCAN CARA KERJA & HASIL CV ANDA SENDIRI?
                    </h3>
                    <p className="text-white/85 text-xs sm:text-sm max-w-xl font-mono leading-relaxed uppercase">
                      Unggah portofolio atau resume CV format PDF versi Anda, dapatkan draf analisis komprehensif instan ditenagai model Gemini AI.
                    </p>
                    <div className="pt-2">
                      <Link href="/register" className="inline-block w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-white hover:bg-zinc-100 text-[#0A0A0A] hover:text-black rounded-full px-8 h-12 font-black uppercase text-[10px] tracking-widest transition-transform duration-200 active:scale-95 shadow-lg">
                          Mulai Analisis Gratis <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <Sparkles className="w-40 h-40 text-white/5 absolute -right-8 -top-8 animate-pulse pointer-events-none select-none" />
               </div>

            </div>

            {/* Right Column: Skill Landscape Representation & Bio Cards */}
            <div className="space-y-6 sm:space-y-8">
               
               <div className="bg-white dark:bg-[#111111] p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-[#1F1F1F] text-center shadow-sm">
                  <span className="font-mono text-[9px] font-black text-zinc-400 dark:text-zinc-500 tracking-[0.2em] uppercase mb-6 block">SKILL DYNAMICS MOP</span>
                  
                  <div className="w-full h-64 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="currentColor" className="text-zinc-150 dark:text-zinc-800/40" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 900, className: 'text-zinc-400 dark:text-zinc-500 uppercase font-mono' }} />
                        <Radar
                           name="Competence"
                           dataKey="A"
                           stroke="#1D9E75"
                           fill="#1D9E75"
                           fillOpacity={0.12}
                           strokeWidth={2.5}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <p className="text-[10px] text-zinc-500 dark:text-zinc-405 leading-relaxed mt-6 uppercase tracking-wider font-mono">
                     Tingkat korelasi antar keterampilan keras dan kognitif berdasarkan isi portofolio.
                  </p>
               </div>

               {/* Bio description Card */}
               <div className="bg-white dark:bg-[#111111] p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-[#1F1F1F] shadow-sm text-left relative overflow-hidden group">
                  <div className="flex items-center gap-4 mb-5">
                     <div className="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 flex items-center justify-center text-orange-500 shrink-0 border border-orange-500/20">
                        <User className="w-5 h-5" />
                     </div>
                     <div>
                        <span className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">NAMA REKAN</span>
                        <h4 className="font-black text-zinc-900 dark:text-white uppercase font-mono tracking-tight leading-none mt-1">{ownerName}</h4>
                     </div>
                  </div>
                  <blockquote className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed italic font-sans font-medium">
                     &quot;Masa depan karier cerdas adalah tentang kolaborasi prima dengan data kualiti tinggi. Lembaran portofolio ini merepresentasikan dedikasi nyata lulusan SMK unggulan kementerian.&quot;
                  </blockquote>
               </div>

            </div>

          </div>

        </div>
      </main>

      {/* Modern Compact Monospace Footer */}
      <footer className="py-12 border-t border-zinc-200 dark:border-[#1F1F1F] text-center relative z-10 bg-zinc-50 dark:bg-black/80">
         <p className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-650 uppercase tracking-widest px-4">
           © 2026 CAREERLENS AI · VERIFIED ENCRYPTED SHARED REPORT
         </p>
      </footer>
    </div>
  );
}
