"use client";

import React, { useState, useEffect } from "react";
import { 
  motion, AnimatePresence 
} from "framer-motion";
import { 
  Sparkles, CheckCircle2, History, FileText, 
  ArrowRight, RefreshCcw, Trash2, AlertCircle, BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";
import UploadZone from "@/components/cv/UploadZone";
import CVPreview from "@/components/cv/CVPreview";
import PageLoader from "@/components/shared/PageLoader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { performCareerAnalysis } from "@/lib/analysis-service";
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
  const router = useRouter();
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
    toast.success("CV berhasil diunggah! Klik 'Mulai Analisis' untuk melihat potensi karier kamu.");
  };

  const handleViewHistory = (item: any) => {
    setUploadedData(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success("Memuat riwayat CV: " + item.filename);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setIsProcessing(true);
    try {
      const result = await performCareerAnalysis();
      
      if (result.success) {
        toast.success("Analisis selesai! Redirecting...");
        router.push("/analysis");
      }
    } catch (error: any) {
      if (error.error === "PROFILE_MISSING") {
        toast.error(error.message);
        router.push("/profile");
      } else if (error.error === "CV_MISSING") {
        toast.error(error.message);
      } else {
        toast.error(error.message || "Analisis gagal");
      }
      setIsProcessing(false);
    } finally {
      setIsAnalyzing(false);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 space-y-10 lg:space-y-16 pb-20 transition-colors duration-300">
      <PageLoader isLoading={isProcessing} text="Sedang Menganalisis CV..." />

      {/* Header Section */}
      <motion.section variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
        <div className="max-w-2xl text-center sm:text-left">
           <div className="flex items-center justify-center sm:justify-start gap-2 text-teal font-bold text-[10px] sm:text-[12px] uppercase tracking-[0.1em] mb-3 sm:mb-4">
              <Sparkles className="w-4 h-4" />
              CV ANALYTICS
           </div>
           <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black dark:text-white mb-3 sm:mb-4 transition-colors">Optimalkan CV-mu untuk Masa Depan.</h1>
           <p className="text-sm sm:text-base text-gray-500 dark:text-zinc-500 leading-relaxed mx-auto sm:mx-0 max-w-xl transition-colors">
             Gunakan kecerdasan buatan untuk memastikan CV kamu memenuhi standar ATS dan siap bersaing di pasar kerja global.
           </p>
        </div>
        
        {uploadedData && (
          <div className="hidden sm:flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm self-center sm:self-auto transition-all">
             <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                <CheckCircle2 className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[9px] uppercase font-black text-gray-400 dark:text-zinc-600 leading-none mb-1">Status</p>
                <p className="text-xs font-bold text-black dark:text-white leading-none">Teranalisis</p>
             </div>
          </div>
        )}
      </motion.section>

      {/* Steps Indicator (Progressive) */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-center gap-4 sm:gap-8 mb-8 relative">
         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 dark:bg-zinc-800 -translate-y-1/2 z-0 hidden sm:block opacity-50" />
         
         {[
           { step: "01", label: "UPLOAD", active: !uploadedData },
           { step: "02", label: "ANALYZE", active: !!uploadedData },
         ].map((s, i) => (
           <div key={i} className="flex flex-col items-center gap-2 sm:gap-3 relative z-10 w-24">
              <div className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center font-black text-[9px] sm:text-[10px] transition-all duration-500",
                s.active 
                  ? "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-xl shadow-black/10 dark:shadow-white/5" 
                  : "bg-white dark:bg-zinc-950 border-gray-100 dark:border-zinc-800 text-gray-300 dark:text-zinc-700"
              )}>
                {s.step}
              </div>
              <span className={cn(
                "text-[8px] sm:text-[9px] font-black tracking-[0.1em] sm:tracking-[0.15em] uppercase text-center transition-colors",
                s.active ? "text-black dark:text-white" : "text-gray-300 dark:text-zinc-700"
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
                  <h3 className="text-[10px] sm:text-[11px] font-black text-gray-400 dark:text-zinc-500 tracking-widest uppercase flex items-center gap-2">
                     <History className="w-4 h-4" />
                     RIWAYAT ANALISIS
                  </h3>
               </div>
               <div className="grid grid-cols-1 gap-3">
                  {history.length > 0 ? history.map((h, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleViewHistory(h)}
                      className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all group shadow-sm cursor-pointer gap-4"
                    >
                       <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-400 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all shrink-0">
                             <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                             <h4 className="font-bold text-black dark:text-white text-sm truncate transition-colors">{h.filename}</h4>
                             <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium uppercase">
                               {new Date(h.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                             </p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto mt-2 sm:mt-0">
                          <div className="text-left sm:text-right">
                             <p className="text-[9px] font-black text-gray-400 dark:text-zinc-600 uppercase mb-0.5">EST. SCORE</p>
                             <p className="text-lg font-black text-black dark:text-white transition-colors">80%</p>
                          </div>
                          <button className="p-2 sm:p-2.5 bg-gray-50 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 rounded-xl group-hover:bg-teal group-hover:text-white transition-all border border-transparent group-hover:border-teal">
                             <ArrowRight className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  )) : (
                    <div className="bg-gray-50/50 dark:bg-zinc-900/20 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-3xl p-8 sm:p-12 text-center transition-colors">
                       <p className="text-gray-400 dark:text-zinc-600 text-sm font-medium italic">Belum ada riwayat analisis.</p>
                    </div>
                  )}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="preview" variants={fadeUp} initial="hidden" animate="visible" className="space-y-8 sm:space-y-12">
            {/* CV Details Banner */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[32px] shadow-sm overflow-hidden transition-all">
                <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto min-w-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-teal shrink-0">
                        <FileText className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-black text-black dark:text-white truncate w-full transition-colors" title={uploadedData.filename}>
                            {uploadedData.filename}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-400 dark:text-zinc-500 font-bold uppercase mt-1 tracking-wider">
                          DIUNGGAH: {new Date(uploadedData.createdAt || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                    <Button 
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      variant="outline" 
                      className="w-full sm:flex-1 md:w-auto h-12 lg:h-14 rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest border-teal bg-teal/5 dark:bg-teal/10 text-teal hover:bg-teal hover:text-white transition-all shadow-lg shadow-teal/10"
                    >
                      {isAnalyzing ? <LoadingSpinner size="sm" className="mr-2" /> : <BrainCircuit className="w-4 h-4 mr-2" />} 
                      Mulai Analisis Karier
                    </Button>
                    <Button 
                      onClick={handleResetCV}
                      className="w-full sm:w-auto h-12 lg:h-14 rounded-2xl px-6 sm:px-8 font-black text-[10px] uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-600 transition-colors"
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
        <DialogContent className="rounded-[32px] p-8 bg-white dark:bg-zinc-950 border-gray-100 dark:border-zinc-800 transition-colors">
           <DialogHeader>
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-[24px] flex items-center justify-center text-red-600 mb-6 mx-auto transition-colors">
                 <AlertCircle className="w-8 h-8" />
              </div>
              <DialogTitle className="text-2xl font-black text-center text-black dark:text-white">Ganti CV Saat Ini?</DialogTitle>
              <DialogDescription className="text-center text-gray-500 dark:text-zinc-500 pt-4 text-sm leading-relaxed">
                 CV lama dan hasil analisis sebelumnya akan diganti dengan data baru. Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
           </DialogHeader>
           <DialogFooter className="flex flex-row justify-center gap-4 mt-8 sm:justify-center">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmReplace(false)}
                className="flex-1 h-12 rounded-xl font-bold border-gray-100 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
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
