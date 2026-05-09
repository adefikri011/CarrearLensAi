"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Sparkles, AlertCircle, CheckCircle2, 
  ArrowLeft, Download, RefreshCcw, TrendingUp,
  BrainCircuit, Gauge, Target, Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CVPreviewProps {
  data: {
    id: string;
    filename: string;
    extractedText: string;
  };
  onReset: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function CVPreview({ data, onReset }: CVPreviewProps) {
  const [score, setScore] = useState(0);
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    // Simulate score animation
    const timer = setTimeout(() => {
      setAnalyzing(false);
      let current = 0;
      const interval = setInterval(() => {
        if (current >= 84) {
          clearInterval(interval);
        } else {
          current += 2;
          setScore(current);
        }
      }, 30);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-12">
      {/* --- Action Bar --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
         <button 
           onClick={onReset}
           className="flex items-center gap-2 text-text-faint hover:text-text-primary transition-colors font-bold group"
         >
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-text-primary transition-all">
               <ArrowLeft className="w-4 h-4" />
            </div>
            Kembali & Upload Ulang
         </button>
         
         <div className="flex gap-4">
            <Button variant="outline" className="rounded-full px-6 h-12 font-bold border-[#F3F4F6] hover:bg-surface">
               <Download className="w-4 h-4 mr-2" /> Download Laporan (PDF)
            </Button>
            <Button className="rounded-full px-8 h-12 font-bold bg-teal hover:bg-teal-dark shadow-lg shadow-teal/10">
               Simpan Hasil
            </Button>
         </div>
      </div>

      {/* --- Score Overview --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <motion.div 
           variants={fadeUp} 
           initial="hidden" 
           animate="visible"
           className="lg:col-span-1 bg-[#030712] rounded-[48px] p-10 text-white relative overflow-hidden"
         >
            <div className="relative z-10 text-center flex flex-col items-center">
               <span className="text-[10px] font-black tracking-[0.2em] uppercase text-teal mb-8">KOMPATIBILITAS ATS</span>
               
               <div className="relative w-48 h-48 flex items-center justify-center mb-10">
                  <svg className="w-full h-full transform -rotate-90">
                     <circle 
                        cx="96" cy="96" r="88" 
                        stroke="currentColor" strokeWidth="12" fill="transparent" 
                        className="text-white/5"
                     />
                     <motion.circle 
                        cx="96" cy="96" r="88" 
                        stroke="currentColor" strokeWidth="12" fill="transparent" 
                        strokeDasharray={552}
                        strokeDashoffset={552 - (552 * score) / 100}
                        strokeLinecap="round"
                        className="text-teal"
                        transition={{ duration: 1.5, ease: "easeOut" }}
                     />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-6xl font-black tracking-tighter">{score}%</span>
                     <span className="text-[10px] font-black text-white/40 tracking-widest mt-1">SIAP KERJA</span>
                  </div>
               </div>

               <p className="text-dark-muted text-[15px] leading-relaxed">
                  CV kamu memiliki struktur yang sangat baik. <span className="text-white font-bold">84% robot rekruter</span> dapat membaca informasi penting dengan akurat.
               </p>
            </div>
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-teal/10 blur-[80px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple/10 blur-[60px] rounded-full" />
         </motion.div>

         <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white p-10 rounded-[40px] border border-[#F3F4F6] shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-text-faint tracking-widest uppercase flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4 text-teal" />
                     SEKSI CV TERDETEKSI
                  </h3>
               </div>
               <div className="space-y-4">
                  {[
                     { t: "Data Pribadi", d: true },
                     { t: "Ringkasan Profil", d: true },
                     { t: "Pengalaman Kerja", d: true },
                     { t: "Pendidikan", d: true },
                     { t: "Skill Teknis", d: true },
                     { t: "Proyek & Sertifikat", d: false },
                  ].map((s, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface/50 border border-transparent hover:border-border transition-all">
                        <span className={cn("text-sm font-bold", s.d ? "text-text-primary" : "text-text-faint")}>{s.t}</span>
                        {s.d ? <CheckCircle2 className="w-5 h-5 text-teal" /> : <AlertCircle className="w-5 h-5 text-amber" />}
                     </div>
                  ))}
               </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white p-10 rounded-[40px] border border-[#F3F4F6] shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-text-faint tracking-widest uppercase flex items-center gap-2">
                     <Sparkles className="w-4 h-4 text-purple" />
                     KEYWORD CLOUD
                  </h3>
               </div>
               <div className="flex flex-wrap gap-2">
                  {[
                     { t: "React", m: true }, { t: "Next.js", m: true }, { t: "TypeScript", m: false },
                     { t: "UI/UX", m: true }, { t: "Tailwind", m: true }, { t: "Prisma", m: false },
                     { t: "Agile", m: true }, { t: "Scrum", m: false }, { t: "Git", m: true },
                     { t: "Node.js", m: true }, { t: "Postgres", m: false }, { t: "Docker", m: false }
                  ].map((k, i) => (
                     <Badge 
                       key={i} 
                       className={cn(
                        "rounded-full px-4 py-1.5 text-xs font-bold border-none",
                        k.m ? "bg-teal-light text-teal-dark" : "bg-red-50 text-red-600"
                       )}
                     >
                        {k.t}
                     </Badge>
                  ))}
               </div>
               <div className="mt-10 pt-6 border-t border-[#F3F4F6]">
                  <p className="text-xs text-text-muted leading-relaxed">
                     <span className="font-bold text-[#030712]">Saran AI:</span> Tambahkan keyword <span className="text-red-500 font-black">&quot;TypeScript&quot;</span> dan <span className="text-red-500 font-black">&quot;Prisma&quot;</span> untuk meningkatkan relevansi dengan lowongan Front-end modern.
                  </p>
               </div>
            </motion.div>
         </div>
      </div>

      {/* --- Detailed Analysis / Extracted Text --- */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-[48px] border border-[#F3F4F6] shadow-sm overflow-hidden">
         <div className="bg-surface p-8 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center">
                  <FileText className="w-5 h-5 text-text-muted" />
               </div>
               <div>
                  <h4 className="font-bold text-[#030712]">{data.filename}</h4>
                  <p className="text-xs text-text-faint font-bold uppercase tracking-widest">HASIL EKSTRAKSI TEKS</p>
               </div>
            </div>
            <Badge className="bg-white text-text-secondary border border-border font-bold">PDF FILE</Badge>
         </div>
         <div className="p-10 max-h-[400px] overflow-y-auto no-scrollbar bg-white whitespace-pre-wrap text-text-secondary text-sm leading-loose">
            {analyzing ? (
               <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <RefreshCcw className="w-8 h-8 text-teal animate-spin" />
                  <p className="text-[13px] font-black text-teal tracking-widest uppercase">Mengekstrak informasi...</p>
               </div>
            ) : data.extractedText}
         </div>
      </motion.div>
    </div>
  );
}
