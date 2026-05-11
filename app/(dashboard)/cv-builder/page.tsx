"use client";

import React, { useState, useEffect } from "react";
import { 
  motion, AnimatePresence 
} from "framer-motion";
import { 
  Sparkles, CheckCircle2, History, FileText, 
  ArrowRight, RefreshCcw, Trash2, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import UploadZone from "@/components/cv/UploadZone";
import CVPreview from "@/components/cv/CVPreview";
import PageLoader from "@/components/shared/PageLoader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function CVBuilderPage() {
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmReplace, setShowConfirmReplace] = useState(false);
  const [history, setHistory] = useState([
    { name: "Curriculum_Vitae_Budi.pdf", date: "12 MEI 2024", score: 84 },
    { name: "CV_Graphic_Designer.pdf", date: "05 MEI 2024", score: 72 },
  ]);

  useEffect(() => {
    fetchLatestCV();
  }, []);

  const fetchLatestCV = async () => {
    try {
      const res = await fetch("/api/upload");
      const result = await res.json();
      if (result.success && result.data) {
        setUploadedData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch latest CV", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (data: any) => {
    setUploadedData(data);
    // Add to history (mock)
    setHistory([{ name: data.filename, date: "HARI INI", score: 84 }, ...history]);
  };

  const handleReanalyze = async () => {
    if (!uploadedData) return;
    setIsProcessing(true);
    try {
      // Re-trigger analysis logic
      const res = await fetch("/api/analyze", {
        method: "POST"
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Analisis ulang berhasil!");
      } else {
        toast.error(result.error || "Gagal melakukan analisis");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetCV = () => {
    setShowConfirmReplace(true);
  };

  const confirmResetCV = () => {
    setUploadedData(null);
    setShowConfirmReplace(false);
    toast.info("Upload CV baru sekarang.");
  };

  if (isLoading) return <PageLoader isLoading={true} text="Memeriksa Data CV..." />;

  return (
    <div className="space-y-16 pb-20">
      <PageLoader isLoading={isProcessing} text="Sedang Menganalisis CV..." />

      {/* Header Section */}
      <motion.section variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-8">
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
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row items-center gap-12 sm:gap-24 relative px-10">
         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -translate-y-1/2 z-0 hidden sm:block" />
         
         {[
           { step: "01", label: "UPLOAD", active: !uploadedData },
           { step: "02", label: "ANALYZE", active: !!uploadedData },
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

      <AnimatePresence mode="wait">
        {!uploadedData ? (
          <motion.div key="upload" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }}>
            <UploadZone onUploadSuccess={handleUploadSuccess} />

            {/* History Section */}
            <div className="mt-24 max-w-4xl mx-auto">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-black text-gray-400 tracking-widest uppercase flex items-center gap-2">
                     <History className="w-4 h-4" />
                     RIWAYAT ANALISIS
                  </h3>
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
                          <div className="text-right">
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
          <motion.div key="preview" variants={fadeUp} initial="hidden" animate="visible" className="space-y-12">
            {/* CV Details Banner */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-teal">
                        <FileText className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-black">{uploadedData.filename}</h3>
                        <p className="text-xs text-gray-400 font-medium uppercase mt-1">Diunggah pada: {new Date(uploadedData.createdAt || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button 
                      onClick={handleReanalyze}
                      variant="outline" 
                      className="h-12 rounded-xl px-8 font-black text-[10px] uppercase tracking-widest border-gray-100 bg-white hover:bg-gray-50"
                    >
                      <RefreshCcw className="w-4 h-4 mr-2" /> Analisis Ulang
                    </Button>
                    <Button 
                      onClick={handleResetCV}
                      className="h-12 rounded-xl px-8 font-black text-[10px] uppercase tracking-widest bg-black text-white hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Ganti CV
                    </Button>
                </div>
            </div>

            <CVPreview data={uploadedData} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmReplace} onOpenChange={setShowConfirmReplace}>
        <DialogContent className="rounded-[32px] p-8">
           <DialogHeader>
              <div className="w-16 h-16 bg-red-50 rounded-[24px] flex items-center justify-center text-red-600 mb-6 mx-auto">
                 <AlertCircle className="w-8 h-8" />
              </div>
              <DialogTitle className="text-2xl font-black text-center text-black">Ganti CV Saat Ini?</DialogTitle>
              <DialogDescription className="text-center text-gray-500 pt-4 text-sm leading-relaxed">
                 CV lama dan hasil analisis sebelumnya akan diganti dengan data baru. Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
           </DialogHeader>
           <DialogFooter className="flex flex-row justify-center gap-4 mt-8 sm:justify-center">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmReplace(false)}
                className="flex-1 h-12 rounded-xl font-bold border-gray-100"
              >
                Batal
              </Button>
              <Button 
                onClick={confirmResetCV}
                className="flex-1 h-12 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700"
              >
                Konfirmasi
              </Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
