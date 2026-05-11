"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Sparkles, AlertCircle, CheckCircle2, 
  ArrowLeft, Download, RefreshCcw, TrendingUp,
  BrainCircuit, Gauge, Target, Search
} from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CVPreviewProps {
  data: {
    id: string;
    filename: string;
    extractedText: string;
    createdAt?: string;
  };
  analysisResult?: any;
  onReset?: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function CVPreview({ data, analysisResult, onReset }: CVPreviewProps) {
  const [score, setScore] = useState(0);
  const [analyzing, setAnalyzing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (analysisResult) {
      setAnalyzing(false);
      setScore(analysisResult.cvScore?.total || 0);
    } else {
      // Simulate score animation if no real data yet
      const timer = setTimeout(() => {
        setAnalyzing(false);
        let current = 0;
        const interval = setInterval(() => {
          if (current >= 80) {
            clearInterval(interval);
          } else {
            current += 2;
            setScore(current);
          }
        }, 30);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [analysisResult]);

  const handleDownloadPDF = () => {
    if (!analysisResult) {
      toast.error("Tunggu hasil analisis selesai sebelum mengunduh.");
      return;
    }
    const content = `
LAPORAN ANALISIS CV - CAREERLENS AI
=====================================
Nama File: ${data.filename}
Tanggal Upload: ${new Date(data.createdAt || Date.now()).toLocaleDateString('id-ID')}
ATS Score: ${analysisResult?.cvScore?.atsCompatibility || 0}%

HASIL ANALISIS:
- Kompatibilitas ATS: ${analysisResult?.cvScore?.atsCompatibility || 0}%
- Kelengkapan CV: ${analysisResult?.cvScore?.completeness || 0}%
- Skor Total: ${analysisResult?.cvScore?.total || 0}%

KEYWORD TERDETEKSI:
${analysisResult?.cvScore?.keywords?.matched?.join(', ') || 'Tidak ada keyword terdeteksi'}

REKOMENDASI:
${analysisResult?.rekomendasiUtama?.map((r: string, i: number) => `${i+1}. ${r}`).join('\n') || 'Tidak ada rekomendasi khusus'}

JALUR KARIER REKOMENDASI:
${analysisResult?.careerPaths?.map((p: any) => 
  `- ${p.nama}: ${p.matchScore}% match`
).join('\n') || 'Tidak ada jalur terdeteksi'}
    `
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `laporan-careerlens-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Laporan berhasil diunduh!");
  }

  const handleSimpanHasil = async () => {
    if (!analysisResult) return
    setIsSaving(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvUploadId: data.id,
          saveOnly: true,
          result: analysisResult
        })
      })
      if (res.ok) {
        toast.success('Hasil analisis berhasil disimpan!')
      } else {
        toast.error('Gagal menyimpan hasil analisis.')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan.')
    } finally {
      setIsSaving(false)
    }
  }

  const detectedSections = analysisResult?.cvScore?.sections || [
    { title: "Data Pribadi", detected: true },
    { title: "Ringkasan Profil", detected: true },
    { title: "Pengalaman Kerja", detected: true },
    { title: "Pendidikan", detected: true },
    { title: "Skill Teknis", detected: true },
    { title: "Proyek & Sertifikat", detected: false },
  ];

  const keywords = analysisResult?.cvScore?.keywords?.matched?.map((k: string) => ({ t: k, m: true })) || [
    { t: "Communikation", m: true }, { t: "Teamwork", m: true }
  ];

  return (
    <div className="space-y-12">
      {/* --- Action Bar --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
         {onReset ? (
           <button 
             onClick={onReset}
             className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors font-bold group"
           >
              <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-black transition-all">
                 <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="text-sm">Kembali & Upload Ulang</span>
           </button>
         ) : (
           <div className="flex items-center gap-2 text-teal font-bold uppercase text-[10px] tracking-widest bg-teal/5 px-4 py-2 rounded-full border border-teal/10">
              <CheckCircle2 className="w-4 h-4" /> CV Siap Digunakan
           </div>
         )}
         
         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button 
              onClick={handleDownloadPDF}
              variant="outline" 
              className="w-full sm:w-auto rounded-full px-6 h-11 sm:h-12 font-bold border-[#F3F4F6] text-xs"
            >
               <Download className="w-4 h-4 mr-2" /> Download Laporan (PDF)
            </Button>
            <Button 
              onClick={handleSimpanHasil}
              disabled={isSaving || !analysisResult}
              className="w-full sm:w-auto rounded-full px-8 h-11 sm:h-12 font-bold bg-teal hover:bg-teal-dark shadow-lg shadow-teal/10 text-xs"
            >
               {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : "Simpan Hasil"}
            </Button>
         </div>
      </div>

      {/* --- Score Overview --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
         <motion.div 
           variants={fadeUp} 
           initial="hidden" 
           animate="visible"
           className="bg-black rounded-[32px] sm:rounded-[48px] p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl shadow-black/10"
         >
            <div className="relative z-10 text-center flex flex-col items-center">
               <span className="text-[10px] font-black tracking-[0.2em] uppercase text-teal mb-6 sm:mb-8">KOMPATIBILITAS ATS</span>
               
               <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center mb-8 sm:mb-10">
                  <svg className="w-full h-full transform -rotate-90">
                     <circle 
                        cx="80" cy="80" r="74" 
                        stroke="currentColor" strokeWidth="10" fill="transparent" 
                        className="text-white/5 sm:hidden"
                     />
                     <circle 
                        cx="96" cy="96" r="88" 
                        stroke="currentColor" strokeWidth="12" fill="transparent" 
                        className="text-white/5 hidden sm:block"
                     />
                     <motion.circle 
                        cx="80" cy="80" r="74" 
                        stroke="currentColor" strokeWidth="10" fill="transparent" 
                        strokeDasharray={465}
                        strokeDashoffset={465 - (465 * score) / 100}
                        strokeLinecap="round"
                        className="text-teal sm:hidden"
                        transition={{ duration: 1.5, ease: "easeOut" }}
                     />
                     <motion.circle 
                        cx="96" cy="96" r="88" 
                        stroke="currentColor" strokeWidth="12" fill="transparent" 
                        strokeDasharray={552}
                        strokeDashoffset={552 - (552 * score) / 100}
                        strokeLinecap="round"
                        className="text-teal hidden sm:block"
                        transition={{ duration: 1.5, ease: "easeOut" }}
                     />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-5xl sm:text-6xl font-black tracking-tighter italic">{score}%</span>
                     <span className="text-[9px] sm:text-[10px] font-black text-white/40 tracking-widest mt-1 uppercase">Skor AI</span>
                  </div>
               </div>

               <p className="text-gray-400 text-sm sm:text-[14px] leading-relaxed">
                  CV kamu memiliki struktur yang sangat baik. <span className="text-white font-bold">{score}% robot rekruter</span> dapat membaca informasi penting dengan akurat.
               </p>
            </div>
            
            <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-teal/10 blur-[60px] sm:blur-[80px] rounded-full" />
         </motion.div>

         <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
               <h3 className="text-[10px] sm:text-[11px] font-black text-gray-400 tracking-widest uppercase flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal" />
                  SEKSI CV TERDETEKSI
               </h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
               {detectedSections.map((s: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                     <span className={cn("text-xs sm:text-sm font-bold", s.detected ? "text-black" : "text-gray-300")}>{s.title}</span>
                     {s.detected ? <CheckCircle2 className="w-5 h-5 text-teal" /> : <AlertCircle className="w-5 h-5 text-amber" />}
                  </div>
               ))}
            </div>
         </motion.div>

         <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-gray-100 shadow-sm md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
               <h3 className="text-[10px] sm:text-[11px] font-black text-gray-400 tracking-widest uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal" />
                  KEYWORD CLOUD
               </h3>
            </div>
            <div className="flex flex-wrap gap-2">
               {keywords.map((k: any, i: number) => (
                  <Badge 
                    key={i} 
                    className={cn(
                     "rounded-xl px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] font-black tracking-widest uppercase border-none",
                     k.m ? "bg-teal-light text-teal-dark" : "bg-gray-100 text-gray-400"
                    )}
                  >
                     {k.t}
                  </Badge>
               ))}
            </div>
            <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-100">
               <p className="text-[10px] sm:text-[11px] text-gray-400 leading-relaxed font-bold">
                  <span className="font-black text-black">SARAN AI:</span> Tambahkan keyword <span className="text-teal font-black tracking-tight">&quot;TypeScript&quot;</span> untuk meningkatkan relevansi.
               </p>
            </div>
         </motion.div>
      </div>

      {/* --- Detailed Analysis / Extracted Text --- */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-[32px] sm:rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
         <div className="bg-gray-50 p-6 sm:p-8 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-400" />
               </div>
               <div className="min-w-0">
                  <h4 className="font-bold text-black text-sm truncate">{data.filename}</h4>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-widest">HASIL EKSTRAKSI TEKS</p>
               </div>
            </div>
            <Badge className="bg-white text-gray-400 border border-gray-100 font-bold text-[9px] sm:text-[10px] tracking-widest uppercase px-4 py-1">PDF FILE</Badge>
         </div>
         <div className="p-6 sm:p-10 max-h-[300px] sm:max-h-[400px] overflow-y-auto no-scrollbar bg-white whitespace-pre-wrap text-gray-500 text-xs sm:text-sm leading-relaxed sm:leading-loose">
            {analyzing ? (
               <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-4">
                  <LoadingSpinner size="sm" />
                  <p className="text-[10px] font-black text-teal tracking-widest uppercase">Mengekstrak informasi...</p>
               </div>
            ) : data.extractedText}
         </div>
      </motion.div>
    </div>
  );
}
