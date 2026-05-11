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
           <div className="flex items-center gap-2 text-teal font-bold text-[12px] uppercase tracking-[0.1em] mb-4">
              <Sparkles className="w-4 h-4" />
              CV ANALYTICS
           </div>
           <h1 className="text-3xl font-black text-black mb-4">Optimalkan CV-mu untuk Masa Depan.</h1>
           <p className="text-base text-gray-500 leading-relaxed max-w-xl">
             Gunakan kecerdasan buatan untuk memastikan CV kamu memenuhi standar ATS dan siap bersaing di pasar kerja global.
           </p>
        </div>
        
        {uploadedData && (
          <div className="hidden lg:flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
             <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                <CheckCircle2 className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[9px] uppercase font-black text-gray-400 leading-none mb-1">Status</p>
                <p className="text-xs font-bold text-black leading-none">Teranalisis</p>
             </div>
          </div>
        )}
      </motion.section>

      {/* Steps Indicator (Progressive) */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-12 sm:gap-24 relative px-10">
         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -translate-y-1/2 z-0 hidden sm:block" />
         
         {[
           { step: "01", label: "UPLOAD", active: true },
           { step: "02", label: "EKSTRAK", active: !!uploadedData },
           { step: "03", label: "ANALISIS", active: !!uploadedData },
         ].map((s, i) => (
           <div key={i} className="flex flex-col items-center gap-3 relative z-10">
              <div className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center font-black text-[10px] transition-all duration-500",
                s.active ? "bg-black border-black text-white shadow-xl shadow-black/10" : "bg-white border-gray-100 text-gray-300"
              )}>
                {s.step}
              </div>
              <span className={cn(
                "text-[9px] font-black tracking-[0.15em] uppercase",
                s.active ? "text-black" : "text-gray-300"
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
            <div className="mt-24 max-w-4xl mx-auto">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-black text-gray-400 tracking-widest uppercase flex items-center gap-2">
                     <History className="w-4 h-4" />
                     RIWAYAT ANALISIS
                  </h3>
                  <button className="text-[10px] font-black text-teal hover:underline tracking-widest">LIHAT SEMUA</button>
               </div>
               <div className="grid grid-cols-1 gap-3">
                  {history.map((h, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-all group shadow-sm">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                             <FileText className="w-5 h-5" />
                          </div>
                          <div>
                             <h4 className="font-bold text-black text-sm">{h.name}</h4>
                             <p className="text-[10px] text-gray-400 font-medium uppercase">{h.date}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-8">
                          <div className="text-right hidden sm:block">
                             <p className="text-[9px] font-black text-gray-400 uppercase mb-0.5">SKOR ATS</p>
                             <p className="text-lg font-black text-black">{h.score}%</p>
                          </div>
                          <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-teal group-hover:text-white transition-all border border-transparent group-hover:border-teal">
                             <ArrowRight className="w-4 h-4" />
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
