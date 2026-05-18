"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
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
    <div className="min-h-screen bg-[#FAFAFA] selection:bg-teal selection:text-white">
      {/* Navbar Minimalis */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center group-hover:bg-teal transition-colors">
               <BrainCircuit className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg tracking-tighter">CareerLens AI</span>
          </Link>
          <Link href="/register">
             <Button className="bg-black text-white rounded-full px-6 h-10 font-bold text-sm">
                Coba Gratis Sekarang
             </Button>
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="text-center space-y-6 mb-16"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-teal/5 rounded-full text-teal font-bold text-xs uppercase tracking-widest border border-teal/10">
               <Sparkles className="w-4 h-4" />
               Hasil Analisis Karier
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight leading-tight max-w-3xl mx-auto">
               Lihat Potensi Karier <span className="text-teal">{ownerName}</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
               Berdasarkan analisis AI terpadu, inilah jalur karier yang paling sesuai untuk profil ini.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Skor Utama */}
            <motion.div 
              initial="hidden" animate="visible" variants={fadeUp}
              className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8"
            >
               <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-teal transition-all">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">TINGKAT KESIAPAN</p>
                    <h2 className="text-6xl font-black text-black group-hover:text-teal transition-colors">{analysis.overallReadiness}%</h2>
                    <p className="text-gray-500 text-sm mt-2 font-medium">Sangat Siap Kerja</p>
                  </div>
                  <div className="w-24 h-24 rounded-full border-8 border-teal/10 border-t-teal flex items-center justify-center animate-spin-slow">
                     <BrainCircuit className="w-10 h-10 text-teal" />
                  </div>
               </div>
               <div className="bg-black p-10 rounded-[40px] shadow-xl text-white flex items-center justify-between overflow-hidden relative group">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">CV SCORE</p>
                    <h2 className="text-6xl font-black">{analysis.cvScore}%</h2>
                    <p className="text-white/60 text-sm mt-2 font-medium">Optimasi Dokumen</p>
                  </div>
                  <FileText className="w-40 h-40 text-white/5 absolute -right-10 -bottom-10 group-hover:rotate-12 transition-transform duration-500" />
               </div>
            </motion.div>

            {/* Career Paths */}
            <div className="lg:col-span-2 space-y-6">
               <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4 text-teal" />
                  Rekomendasi Jalur
               </h3>
               {(result?.careerPaths || []).map((path: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial="hidden" animate="visible" variants={fadeUp}
                    className={cn(
                      "p-8 rounded-[40px] border border-gray-100 bg-white transition-all shadow-sm flex flex-col gap-6",
                      i === 0 && "ring-2 ring-teal ring-offset-4 ring-offset-[#FAFAFA]"
                    )}
                  >
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <div className="flex items-center gap-3">
                              <h4 className="text-2xl font-black text-black tracking-tight">{path.nama}</h4>
                              {i === 0 && (
                                <span className="bg-teal text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Terbaik</span>
                              )}
                           </div>
                           <p className="text-gray-500 text-sm font-medium italic">{path.deskripsi}</p>
                        </div>
                        <div className="bg-teal/10 text-teal px-4 py-2 rounded-2xl font-black text-xl">
                           {path.matchScore}%
                        </div>
                     </div>
                  </motion.div>
               ))}
               
               <div className="bg-teal rounded-[40px] p-10 text-white shadow-2xl shadow-teal/20 relative overflow-hidden group mt-12">
                  <div className="relative z-10 space-y-6">
                    <h3 className="text-3xl font-black italic tracking-tight">Ingin Tahu Karier Kamu?</h3>
                    <p className="text-white/80 font-medium max-w-md">
                       Dapatkan analisis mendalam seperti ini untuk CV kamu hanya dalam 2 menit menggunakan Gemini AI.
                    </p>
                    <Link href="/register" className="inline-block">
                       <Button className="bg-white text-teal hover:bg-black hover:text-white rounded-full px-10 h-14 font-black uppercase text-xs tracking-widest transition-all">
                          Analisis CV Saya Sekarang
                       </Button>
                    </Link>
                  </div>
                  <Sparkles className="w-48 h-48 text-white/10 absolute -right-10 -top-10 animate-pulse" />
               </div>
            </div>

            {/* Sidebar info */}
            <div className="space-y-8">
               <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center overflow-hidden">
                  <h4 className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-10 text-center">SKILL LANDSCAPE</h4>
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#F3F4F6" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 800 }} />
                        <Radar
                           name="Skill"
                           dataKey="A"
                           stroke="#1D9E75"
                           fill="#1D9E75"
                           fillOpacity={0.15}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[11px] text-gray-400 text-center mt-6 font-bold leading-relaxed">
                     Kekuatan kompetensi yang diidentifikasi oleh sistem AI CareerLens.
                  </p>
               </div>

               <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                        <User className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">DIANALISIS UNTUK</p>
                        <p className="font-bold text-black">{ownerName}</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <p className="text-sm font-medium text-gray-500 leading-relaxed italic">
                        &quot;Terima kasih telah menggunakan CareerLens AI untuk memandu langkah karier masa depanmu.&quot;
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Minimalis */}
      <footer className="py-12 border-t border-gray-100 text-center">
         <p className="text-gray-400 text-sm font-medium">© 2024 CareerLens AI — Build for SMK Indonesia</p>
      </footer>
    </div>
  );
}
