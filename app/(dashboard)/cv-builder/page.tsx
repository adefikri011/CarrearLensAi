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
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmReplace, setShowConfirmReplace] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchLatestCV();
    fetchHistory();
    fetchLatestAnalysis();
  }, []);

  const fetchLatestAnalysis = async () => {
    try {
      const res = await fetch("/api/analyze/latest");
      const result = await res.json();
      if (result.success && result.data?.result) {
        setAnalysisResult(result.data.result);
      }
    } catch (error) {
      console.error("Failed to fetch latest analysis", error);
    }
  };

  const fetchLatestCV = async () => {
    try {
      const res = await fetch("/api/upload/history");
      const result = await res.json();
      if (result.success && result.cv) {
        setUploadedData(result.cv);
      }
    } catch (error) {
      console.error("Failed to fetch latest CV", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      // In real app, /api/upload/history returns a list, here we use the same endpoint but it might need adjustment if real history is needed
      const res = await fetch("/api/upload/history");
      const result = await res.json();
      if (result.success && result.cv) {
        setHistory([result.cv]);
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  };

  const handleUploadSuccess = async (data: any) => {
    setUploadedData(data);
    fetchHistory();
    
    // Automatically trigger analysis
    toast.promise(
      fetch("/api/analyze", { method: "POST" }).then(async res => {
        if (!res.ok) throw new Error('Analysis failed');
        const result = await res.json();
        if (result.success && result.data?.result) {
          setAnalysisResult(result.data.result);
        }
        return result;
      }),
      {
        loading: 'Mencerahkan potensi karier kamu...',
        success: 'Analisis selesai! Silakan lihat hasil karier kamu.',
        error: 'Gagal menganalisis secara otomatis. Silakan klik "Analisis CV" secara manual.',
      }
    );
  };

  const handleViewHistory = (item: any) => {
    setUploadedData(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success("Memuat riwayat CV: " + item.filename);
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
        if (result.data?.result) {
          setAnalysisResult(result.data.result);
        }
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 space-y-10 lg:space-y-16 pb-20">
      <PageLoader isLoading={isProcessing} text="Sedang Menganalisis CV..." />

      {/* Header Section */}
      <motion.section variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
        <div className="max-w-2xl text-center sm:text-left">
           <div className="flex items-center justify-center sm:justify-start gap-2 text-teal font-bold text-[10px] sm:text-[12px] uppercase tracking-[0.1em] mb-3 sm:mb-4">
              <Sparkles className="w-4 h-4" />
              CV ANALYTICS
           </div>
           <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-3 sm:mb-4">Optimalkan CV-mu untuk Masa Depan.</h1>
           <p className="text-sm sm:text-base text-gray-500 leading-relaxed mx-auto sm:mx-0 max-w-xl">
             Gunakan kecerdasan buatan untuk memastikan CV kamu memenuhi standar ATS dan siap bersaing di pasar kerja global.
           </p>
        </div>
        
        {uploadedData && (
          <div className="hidden sm:flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm self-center sm:self-auto">
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
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-center gap-4 sm:gap-8 mb-8 relative">
         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -translate-y-1/2 z-0 hidden sm:block opacity-50" />
         
         {[
           { step: "01", label: "UPLOAD", active: !uploadedData },
           { step: "02", label: "ANALYZE", active: !!uploadedData },
         ].map((s, i) => (
           <div key={i} className="flex flex-col items-center gap-2 sm:gap-3 relative z-10 w-24">
              <div className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center font-black text-[9px] sm:text-[10px] transition-all duration-500",
                s.active ? "bg-black border-black text-white shadow-xl shadow-black/10" : "bg-white border-gray-100 text-gray-300"
              )}>
                {s.step}
              </div>
              <span className={cn(
                "text-[8px] sm:text-[9px] font-black tracking-[0.1em] sm:tracking-[0.15em] uppercase text-center",
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
            <div className="mt-16 lg:mt-24 w-full">
               <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h3 className="text-[10px] sm:text-[11px] font-black text-gray-400 tracking-widest uppercase flex items-center gap-2">
                     <History className="w-4 h-4" />
                     RIWAYAT ANALISIS
                  </h3>
               </div>
               <div className="grid grid-cols-1 gap-3">
                  {history.length > 0 ? history.map((h, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleViewHistory(h)}
                      className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50 transition-all group shadow-sm cursor-pointer gap-4"
                    >
                       <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all shrink-0">
                             <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                             <h4 className="font-bold text-black text-sm truncate">{h.filename}</h4>
                             <p className="text-[10px] text-gray-400 font-medium uppercase">
                               {new Date(h.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                             </p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto mt-2 sm:mt-0">
                          <div className="text-left sm:text-right">
                             <p className="text-[9px] font-black text-gray-400 uppercase mb-0.5">EST. SCORE</p>
                             <p className="text-lg font-black text-black">80%</p>
                          </div>
                          <button className="p-2 sm:p-2.5 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-teal group-hover:text-white transition-all border border-transparent group-hover:border-teal">
                             <ArrowRight className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  )) : (
                    <div className="bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-3xl p-8 sm:p-12 text-center">
                       <p className="text-gray-400 text-sm font-medium italic">Belum ada riwayat analisis.</p>
                    </div>
                  )}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="preview" variants={fadeUp} initial="hidden" animate="visible" className="space-y-8 sm:space-y-12">
            {/* CV Details Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-teal shrink-0">
                        <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-black truncate">{uploadedData.filename}</h3>
                        <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase mt-1">Diunggah: {new Date(uploadedData.createdAt || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button 
                      onClick={handleReanalyze}
                      variant="outline" 
                      className="w-full sm:w-auto h-11 sm:h-12 rounded-xl px-6 sm:px-8 font-black text-[10px] uppercase tracking-widest border-gray-100 bg-white hover:bg-gray-50"
                    >
                      <RefreshCcw className="w-4 h-4 mr-2" /> Analisis Ulang
                    </Button>
                    <Button 
                      onClick={handleResetCV}
                      className="w-full sm:w-auto h-11 sm:h-12 rounded-xl px-6 sm:px-8 font-black text-[10px] uppercase tracking-widest bg-black text-white hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Ganti CV
                    </Button>
                </div>
            </div>

            <CVPreview data={uploadedData} analysisResult={analysisResult} />
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
