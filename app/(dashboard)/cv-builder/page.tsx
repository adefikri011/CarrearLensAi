"use client";

import React, { useState } from "react";
import UploadZone from "@/components/cv/UploadZone";
import CVPreview from "@/components/cv/CVPreview";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, History, ArrowRight, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.05 } }
};

export default function CVBuilderPage() {
  const [uploadedData, setUploadedData] = useState<{
    id: string;
    filename: string;
    extractedText: string;
  } | null>(null);

  const handleUploadSuccess = (data: { id: string; filename: string; extractedText: string }) => {
    setUploadedData(data);
  };

  const handleReset = () => {
    setUploadedData(null);
  };

  const history = [
    { date: "2 Mei 2024", name: "CV_Project_Manager.pdf", score: 88 },
    { date: "28 April 2024", name: "CV_Fullstack_Dev.pdf", score: 76 },
    { date: "15 April 2024", name: "CV_Draft_Final.pdf", score: 82 },
  ];

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={stagger}
      className="space-y-16"
    >
      {/* Header Section */}
      <motion.section variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
           <div className="flex items-center gap-2 text-teal font-bold text-[13px] uppercase tracking-[0.15em] mb-3">
              <Sparkles className="w-4 h-4" />
              CV ANALYTICS
           </div>
           <h1 className="text-h2 text-[#030712] mb-4">Optimalkan CV-mu untuk Masa Depan.</h1>
           <p className="text-lg text-text-secondary leading-relaxed">
             Gunakan kecerdasan buatan untuk memastikan CV kamu memenuhi standar ATS dan siap bersaing di pasar kerja global.
           </p>
        </div>
        
        {uploadedData && (
          <div className="hidden lg:flex items-center gap-4 bg-white p-4 rounded-3xl border border-[#F3F4F6] shadow-sm">
             <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                <CheckCircle2 className="w-6 h-6" />
             </div>
             <div>
                <p className="text-[10px] uppercase font-black text-text-faint leading-none mb-1">Status</p>
                <p className="text-sm font-bold text-[#030712] leading-none">Teranalisis</p>
             </div>
          </div>
        )}
      </motion.section>

      {/* Steps Indicator (Progressive) */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-12 sm:gap-24 relative px-10">
         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#F3F4F6] -translate-y-1/2 z-0 hidden sm:block" />
         
         {[
           { step: "01", label: "UPLOAD", active: true },
           { step: "02", label: "EKSTRAK", active: !!uploadedData },
           { step: "03", label: "ANALISIS", active: !!uploadedData },
         ].map((s, i) => (
           <div key={i} className="flex flex-col items-center gap-3 relative z-10">
              <div className={cn(
                "w-12 h-12 rounded-full border-4 flex items-center justify-center font-black text-xs transition-all duration-500",
                s.active ? "bg-teal border-white text-white shadow-xl shadow-teal/20" : "bg-white border-[#F3F4F6] text-text-faint"
              )}>
                {s.step}
              </div>
              <span className={cn(
                "text-[10px] font-black tracking-widest uppercase",
                s.active ? "text-teal" : "text-text-faint"
              )}>{s.label}</span>
           </div>
         ))}
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {!uploadedData ? (
          <motion.div
            key="upload-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <UploadZone onUploadSuccess={handleUploadSuccess} />

            {/* History Section */}
            <div className="mt-32 max-w-4xl mx-auto">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-text-faint tracking-widest uppercase flex items-center gap-2">
                     <History className="w-4 h-4" />
                     RIWAYAT ANALISIS
                  </h3>
                  <button className="text-[10px] font-black text-teal hover:underline tracking-widest">LIHAT SEMUA</button>
               </div>
               <div className="grid grid-cols-1 gap-4">
                  {history.map((h, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-[#F3F4F6] flex items-center justify-between hover:bg-surface transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center text-text-faint group-hover:bg-teal group-hover:text-white transition-all">
                             <FileText className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="font-bold text-[#030712] text-sm md:text-base">{h.name}</h4>
                             <p className="text-xs text-text-faint font-medium">{h.date}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-8">
                          <div className="text-right hidden sm:block">
                             <p className="text-[10px] font-black text-text-faint uppercase mb-1">SKOR ATS</p>
                             <p className="text-lg font-black text-teal">{h.score}%</p>
                          </div>
                          <button className="p-3 bg-surface-2 text-text-faint rounded-xl group-hover:bg-teal-light group-hover:text-teal transition-all">
                             <ArrowRight className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <CVPreview data={uploadedData} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
