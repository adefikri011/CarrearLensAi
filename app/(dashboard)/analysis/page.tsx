"use client";

import React, { useState, useEffect } from "react";
import { 
  motion, AnimatePresence 
} from "framer-motion";
import { 
  BrainCircuit, Target, ArrowLeft, Bookmark, Sparkles,
  ChevronRight, RefreshCcw, Loader2, AlertCircle, FileText
} from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import PageLoader from "@/components/shared/PageLoader";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchLatestAnalysis();
  }, []);

  const fetchLatestAnalysis = async () => {
    try {
      const res = await fetch("/api/analyze/latest");
      const result = await res.json();
      if (result.success && result.data) {
        setAnalysis(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch analysis", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
      });
      const result = await res.json();
      if (result.success) {
        setAnalysis(result.data);
        toast.success("Analisis berhasil diperbarui!");
      } else {
        toast.error(result.error || "Gagal melakukan analisis");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <PageLoader isLoading={true} text="Memuat Analisis..." />
    );
  }

  const result = analysis?.result as any;

  const radarData = result?.skillRadar ? [
    { subject: 'Teknis', A: result.skillRadar.teknisDigital || 0 },
    { subject: 'Komunikasi', A: result.skillRadar.komunikasi || 0 },
    { subject: 'Leadership', A: result.skillRadar.kepemimpinan || 0 },
    { subject: 'Kreativitas', A: result.skillRadar.kreativitas || 0 },
    { subject: 'Analitik', A: result.skillRadar.analitis || 0 },
    { subject: 'Adaptabilitas', A: result.skillRadar.adaptabilitas || 0 },
  ] : [
    { subject: 'Teknis', A: 0 },
    { subject: 'Komunikasi', A: 0 },
    { subject: 'Leadership', A: 0 },
    { subject: 'Kreativitas', A: 0 },
    { subject: 'Analitik', A: 0 },
    { subject: 'Adaptabilitas', A: 0 },
  ];

  const handleDownloadPDF = () => {
    if (!analysis || !result) {
      toast.error("Tidak ada data analisis untuk diunduh.");
      return;
    }
    const content = `
LAPORAN HASIL ANALISIS KARIER - CAREERLENS AI
=============================================
Tanggal Analisis: ${new Date(analysis.createdAt).toLocaleDateString('id-ID')}
Overall Readiness: ${analysis.overallReadiness}%

HASIL ANALISIS:
- CV Score: ${analysis.cvScore}%
- Jalur Utama: ${analysis.selectedPath}

KOMPETENSI (Radar):
- Teknis: ${result.skillRadar?.teknisDigital || 0}%
- Komunikasi: ${result.skillRadar?.komunikasi || 0}%
- Kepemimpinan: ${result.skillRadar?.kepemimpinan || 0}%
- Kreativitas: ${result.skillRadar?.kreativitas || 0}%
- Analitis: ${result.skillRadar?.analitis || 0}%
- Adaptabilitas: ${result.skillRadar?.adaptabilitas || 0}%

JALUR KARIER DIREKOMENDASIKAN:
${result.careerPaths?.map((p: any) => 
  `- ${p.nama} (${p.matchScore}% Match): ${p.deskripsi}`
).join('\n')}

REKOMENDASI UTAMA:
${result.rekomendasiUtama?.map((r: string, i: number) => `${i+1}. ${r}`).join('\n')}
    `
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `careerlens-analysis-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Hasil analisis berhasil diunduh!");
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
         <div className="space-y-4">
            <Link href="/cv-builder" className="inline-flex items-center gap-2 text-gray-400 hover:text-black transition-colors font-bold group mb-4">
                <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-black transition-all">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                Kembali ke Analisis CV
            </Link>
            <div className="flex items-center gap-2 text-teal font-bold text-[12px] uppercase tracking-[0.15em]">
               <BrainCircuit className="w-4 h-4" />
               Deep Insight Analysis
            </div>
            <h1 className="text-3xl font-black text-black">Hasil Analisis Karier</h1>
            <p className="text-base text-gray-500 leading-relaxed max-w-xl">
               Berdasarkan kecerdasan buatan, inilah jalur karier paling potensial untuk masa depanmu.
            </p>
         </div>
         <div className="flex gap-4">
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="h-12 rounded-full px-8 bg-black text-white font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
            >
              {isAnalyzing ? <LoadingSpinner size="sm" className="mr-2" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
              {analysis ? "Analisis Ulang" : "Mulai Analisis"}
            </Button>
         </div>
      </div>

      {!analysis && !isAnalyzing ? (
        <div className="bg-white border border-gray-100 rounded-[40px] p-20 text-center flex flex-col items-center space-y-6">
           <div className="w-20 h-20 rounded-[32px] bg-gray-50 flex items-center justify-center text-gray-300">
              <AlertCircle className="w-10 h-10" />
           </div>
           <div>
              <h3 className="text-xl font-bold text-black mb-2">Belum Ada Analisis</h3>
              <p className="text-gray-500 max-w-xs mx-auto">Upload CV kamu terlebih dahulu untuk mendapatkan analisis jalur karier yang mendalam.</p>
           </div>
           <Link href="/cv-builder">
              <Button className="bg-teal hover:bg-teal-dark rounded-full px-8 h-12 font-bold text-white uppercase text-[10px] tracking-widest">
                 UPLOAD CV SEKARANG
              </Button>
           </Link>
        </div>
      ) : isAnalyzing ? (
        <div className="bg-white border border-gray-100 rounded-[40px] p-20 text-center flex flex-col items-center space-y-8">
           <div className="relative">
              <LoadingSpinner size="lg" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-teal-dark animate-pulse" />
           </div>
           <div className="space-y-2">
              <h3 className="text-2xl font-bold text-black italic">Gemini AI sedang berpikir...</h3>
              <p className="text-gray-400 max-w-md mx-auto">Kami memadukan profil kamu dengan kecocokan industri saat ini untuk hasil yang paling akurat.</p>
           </div>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1.5 bg-gray-50 w-fit rounded-2xl border border-gray-100">
             {["overview", "detail", "compare"].map((tab) => (
                <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={cn(
                      "px-8 py-2.5 rounded-xl text-[11px] font-black transition-all uppercase tracking-widest",
                      activeTab === tab ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-black"
                   )}
                >
                   {tab === "overview" ? "Ringkasan" : tab === "detail" ? "Detail Jalur" : "Perbandingan"}
                </button>
             ))}
          </div>

          <AnimatePresence mode="wait">
             {activeTab === "overview" && (
                <motion.div 
                   key="overview"
                   initial="hidden" animate="visible" variants={fadeUp}
                   className="space-y-12"
                >
                   <div className="flex flex-wrap gap-4 items-center justify-between">
                      <div className="flex gap-3">
                         <Button 
                          onClick={handleDownloadPDF}
                          variant="outline" 
                          className="h-11 px-6 rounded-xl border-gray-100 font-bold text-xs"
                         >
                            Download PDF
                         </Button>
                         <Button 
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Link hasil analisis disalin!");
                          }}
                          variant="outline" 
                          className="h-11 px-6 rounded-xl border-gray-100 font-bold text-xs"
                         >
                            Bagikan
                         </Button>
                      </div>
                      <div className="hidden sm:block">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Update Terakhir: {new Date(analysis?.createdAt || Date.now()).toLocaleDateString('id-ID')}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Career Path Cards */}
                      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {(result?.careerPaths || []).map((path: any, i: number) => (
                             <div key={i} className={cn(
                                "p-8 rounded-[40px] border border-gray-100 bg-white transition-all hover:shadow-xl hover:scale-[1.01] group",
                                i === 0 && "md:col-span-2"
                             )}>
                                <div className="flex justify-between items-start mb-10">
                                   <div className="space-y-2">
                                      <h3 className="text-2xl font-extrabold text-black group-hover:text-teal transition-colors tracking-tight">{path.nama}</h3>
                                      <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{path.deskripsi}</p>
                                   </div>
                                   <div className={cn(
                                      "w-20 h-20 rounded-3xl flex flex-col items-center justify-center shrink-0 border-4 transition-all",
                                      i === 0 ? "bg-teal-light border-white text-teal" : 
                                      i === 1 ? "bg-black/5 border-white text-black" : "bg-gray-50 border-white text-gray-400"
                                   )}>
                                      <span className="text-2xl font-black">{path.matchScore}%</span>
                                      <span className="text-[9px] font-black uppercase tracking-tighter">MATCH</span>
                                   </div>
                                </div>
                                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                                    <Link href="/roadmap" className="flex-1">
                                       <Button className="w-full bg-black text-white rounded-xl h-11 font-black text-[10px] uppercase tracking-widest hover:bg-teal transition-all">
                                          LIHAT ROADMAP
                                       </Button>
                                    </Link>
                                    <Button 
                                     onClick={() => toast.success(`${path.nama} dipilih sebagai target utama!`)}
                                     variant="ghost" 
                                     className="w-11 h-11 p-0 rounded-xl border border-gray-100 hover:bg-teal hover:text-white transition-all"
                                    >
                                       <Target className="w-5 h-5" />
                                    </Button>
                                </div>
                             </div>
                          ))}
                      </div>

                      {/* Skill Radar Chart */}
                      <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center overflow-hidden">
                         <h4 className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-10 text-center">SKILL LANDSCAPE</h4>
                         <div className="w-full h-64">
                            <ResponsiveContainer width="100%" height="100%">
                               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                  <PolarGrid stroke="#F3F4F6" />
                                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 800 }} />
                                  <Radar
                                     name="Proyeksi Skill"
                                     dataKey="A"
                                     stroke="#1D9E75"
                                     fill="#1D9E75"
                                     fillOpacity={0.15}
                                  />
                               </RadarChart>
                            </ResponsiveContainer>
                         </div>
                         <div className="mt-10 pt-6 border-t border-gray-50 w-full text-center">
                            <p className="text-[11px] text-gray-400 leading-relaxed font-bold">
                               Proyeksi kekuatan skill berdasarkan analisis AI dari CV dan profil kamu.
                            </p>
                         </div>
                      </div>
                   </div>
                </motion.div>
             )}
          </AnimatePresence>
        </>
      )}

      {/* Final Action */}
      <motion.div variants={fadeUp} className="bg-black rounded-[48px] p-12 text-center text-white relative overflow-hidden">
         <div className="relative z-10">
            <h3 className="text-3xl font-black mb-6 italic">Sudah Menentukan Pilihan?</h3>
            <p className="text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed text-sm font-medium">
               Pilih satu jalur utama untuk mengaktifkan 90 Hari Roadmap Aksi. Kamu bisa mengganti pilihan kapan saja di dashboard.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
               <Link href="/roadmap">
                  <button className="px-10 py-4 bg-teal text-white rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-teal/20">
                     AKTIFKAN ROADMAP SEKARANG
                  </button>
               </Link>
               <button 
                 onClick={() => toast.info("AI Mentor akan segera tersedia untuk kamu!")}
                 className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all"
               >
                  KONSULTASI AI MENTOR
               </button>
            </div>
         </div>
         <div className="absolute top-0 left-0 w-80 h-80 bg-teal/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
      </motion.div>
    </div>
  );
}
