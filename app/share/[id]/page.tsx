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
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-black selection:bg-teal selection:text-white transition-colors">
      {/* Navbar Minimalis */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center group-hover:bg-teal transition-all">
               <BrainCircuit className="w-4 h-4 text-white dark:text-black" />
            </div>
            <span className="font-black text-lg tracking-tighter text-black dark:text-white uppercase italic">CareerLens <span className="text-teal">AI</span></span>
          </Link>
          <Link href="/register">
             <Button className="bg-black dark:bg-white text-white dark:text-black rounded-full px-8 h-12 font-black text-xs uppercase tracking-widest hover:bg-teal dark:hover:bg-teal dark:hover:text-white transition-all shadow-xl shadow-black/10">
                Coba Sekarang
             </Button>
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal/5 dark:bg-teal/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal/5 dark:bg-teal/10 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="text-center space-y-6 mb-20"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white dark:bg-zinc-900 rounded-full text-teal font-black text-[10px] uppercase tracking-[0.2em] border border-gray-100 dark:border-zinc-800 shadow-sm">
               <Sparkles className="w-4 h-4 animate-pulse" />
               Hasil Analisis Karier
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white tracking-tighter leading-tight max-w-3xl mx-auto uppercase italic transition-colors">
               Potensi Karier <br/> <span className="text-teal">{ownerName}</span>
            </h1>
            <p className="text-gray-500 dark:text-zinc-500 text-lg max-w-2xl mx-auto font-bold uppercase tracking-tight transition-colors">
               Berdasarkan analisis AI terpadu, inilah jalur karier yang paling sesuai untuk profil ini.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Skor Utama */}
            <motion.div 
              initial="hidden" animate="visible" variants={fadeUp}
              className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8"
            >
               <div className="bg-white dark:bg-zinc-900 p-10 rounded-[48px] border border-gray-100 dark:border-zinc-800 shadow-xl shadow-black/5 flex items-center justify-between group hover:border-teal/50 transition-all">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-2">TINGKAT KESIAPAN</p>
                    <h2 className="text-7xl font-black text-black dark:text-white group-hover:text-teal italic transition-colors leading-none">{analysis.overallReadiness}%</h2>
                    <p className="text-gray-500 dark:text-zinc-500 text-sm mt-4 font-bold uppercase tracking-tight">Sangat Siap Kerja</p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-teal/20 blur-2xl rounded-full" />
                    <div className="w-24 h-24 rounded-[32px] border-4 border-gray-50 dark:border-zinc-800 border-t-teal flex items-center justify-center animate-spin-slow relative z-10 bg-white dark:bg-zinc-900">
                       <BrainCircuit className="w-10 h-10 text-teal" />
                    </div>
                  </div>
               </div>
               <div className="bg-black dark:bg-zinc-950 p-10 rounded-[48px] shadow-2xl text-white flex items-center justify-between overflow-hidden relative group border border-transparent dark:border-zinc-800">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">CV SCORE</p>
                    <h2 className="text-7xl font-black italic">{analysis.cvScore}%</h2>
                    <p className="text-white/60 text-sm mt-4 font-bold uppercase tracking-tight">Optimasi Dokumen</p>
                  </div>
                  <FileText className="w-44 h-44 text-white/5 absolute -right-10 -bottom-10 group-hover:rotate-12 transition-transform duration-700" />
               </div>
            </motion.div>

            {/* Career Paths */}
            <div className="lg:col-span-2 space-y-8">
               <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-[0.2em] flex items-center gap-3 transition-colors">
                  <Target className="w-5 h-5 text-teal" />
                  Rekomendasi Jalur
               </h3>
               {(result?.careerPaths || []).map((path: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial="hidden" animate="visible" variants={fadeUp}
                    className={cn(
                      "p-10 rounded-[48px] border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all shadow-sm flex flex-col gap-8 group hover:shadow-2xl hover:shadow-teal/5 hover:border-teal/20",
                      i === 0 && "ring-4 ring-teal/5 dark:ring-teal/10"
                    )}
                  >
                     <div className="flex justify-between items-start gap-6">
                        <div className="space-y-3">
                           <div className="flex items-center gap-3 flex-wrap">
                              <h4 className="text-3xl font-black text-black dark:text-white tracking-tighter italic uppercase group-hover:text-teal transition-colors">{path.nama}</h4>
                              {i === 0 && (
                                <span className="bg-teal text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-teal/20">UTAMA</span>
                              )}
                           </div>
                           <p className="text-gray-500 dark:text-zinc-500 text-base font-medium leading-relaxed transition-colors">{path.deskripsi}</p>
                        </div>
                        <div className="bg-teal/5 dark:bg-teal/10 text-teal px-6 py-4 rounded-[24px] font-black text-3xl italic shadow-sm">
                           {path.matchScore}<span className="text-xs uppercase ml-1">%</span>
                        </div>
                     </div>
                  </motion.div>
               ))}
               
               <div className="bg-teal rounded-[48px] p-12 text-white shadow-2xl shadow-teal-500/20 relative overflow-hidden group mt-16 transition-transform hover:scale-[1.01]">
                  <div className="relative z-10 space-y-8">
                    <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-tight">Ingin Tahu <br/> Karier Kamu?</h3>
                    <p className="text-white/80 font-bold max-w-sm uppercase text-sm tracking-tight">
                       Dapatkan analisis mendalam seperti ini untuk CV kamu hanya dalam 2 menit menggunakan Gemini AI.
                    </p>
                    <Link href="/register" className="inline-block relative z-20">
                       <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white rounded-full px-12 h-16 font-black uppercase text-xs tracking-[0.2em] transition-all shadow-2xl">
                          Mulai Analisis Sekarang
                       </Button>
                    </Link>
                  </div>
                  <Sparkles className="w-56 h-56 text-white/10 absolute -right-12 -top-12 animate-pulse rotate-12" />
                  <div className="absolute top-1/2 left-0 w-1/2 h-full bg-white/5 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
               </div>
            </div>

            {/* Sidebar info */}
            <div className="space-y-10">
               <div className="bg-white dark:bg-zinc-900 p-10 rounded-[48px] border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center overflow-hidden transition-all hover:border-teal/30">
                  <h4 className="text-[10px] font-black text-gray-400 dark:text-zinc-600 tracking-[0.3em] uppercase mb-12 text-center transition-colors">SKILL LANDSCAPE</h4>
                  <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="currentColor" className="text-gray-100 dark:text-zinc-800" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 900, className: 'text-gray-400 dark:text-zinc-600 uppercase' }} />
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
                  <p className="text-[11px] text-gray-400 dark:text-zinc-500 text-center mt-8 font-bold leading-relaxed transition-colors uppercase tracking-tight">
                     Data kompetensi unik yang diidentifikasi oleh sistem CareerLens AI.
                  </p>
               </div>

               <div className="bg-white dark:bg-zinc-900 p-8 rounded-[48px] border border-gray-100 dark:border-zinc-800 shadow-sm transition-all hover:border-teal/30">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-14 h-14 bg-gray-50 dark:bg-zinc-800 rounded-[20px] flex items-center justify-center text-gray-300 dark:text-zinc-600 transition-colors">
                        <User className="w-7 h-7" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest transition-colors">DIANALISIS UNTUK</p>
                        <p className="font-black text-black dark:text-white uppercase italic text-lg transition-colors">{ownerName}</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <p className="text-sm font-bold text-gray-500 dark:text-zinc-500 leading-relaxed italic transition-colors">
                        &quot;Masa depan adalah milik mereka yang mempersiapkan diri hari ini. Teruslah tumbuh dan eksplorasi potensi unikmu.&quot;
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Minimalis */}
      <footer className="py-20 border-t border-gray-100 dark:border-zinc-900 text-center transition-colors">
         <p className="text-[11px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-[0.3em]">
           © {new Date().getFullYear()} CAREERLENS AI — JUARAVIBECODING 2026 EDITION
         </p>
      </footer>
    </div>
  );
}
