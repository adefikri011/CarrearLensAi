"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UploadZoneProps {
  onUploadSuccess: (data: { id: string; filename: string; extractedText: string }) => void;
}

export default function UploadZone({ onUploadSuccess }: UploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Hanya file PDF yang diperbolehkan.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Gagal mengunggah CV");

      const result = await response.json();
      
      setUploadProgress(100);
      setTimeout(() => {
        onUploadSuccess({
          id: result.data.id,
          filename: result.data.filename,
          extractedText: result.data.extractedText,
        });
        toast.success("CV Berhasil Unggah & Ekstrak!");
      }, 500);

    } catch (error) {
      toast.error("Gagal mengunggah CV. Silakan coba lagi.");
      setIsUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-1 sm:px-0">
      <div 
        {...getRootProps()} 
        className={cn(
          "relative group cursor-pointer transition-all duration-500",
          "min-h-[260px] sm:min-h-[320px] lg:min-h-[400px]",
          "rounded-[32px] sm:rounded-[48px] border-4 border-dashed p-8 sm:p-12 lg:p-20 flex flex-col items-center justify-center text-center",
          isDragActive ? "border-teal bg-teal-light/30 scale-[1.01] sm:scale-[1.02]" : "border-[#F3F4F6] bg-white hover:border-teal/30 hover:bg-surface",
          isUploading && "pointer-events-none opacity-80"
        )}
      >
        <input {...getInputProps()} />

        <div className="relative mb-6 sm:mb-10 shrink-0">
           <div className={cn(
             "w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-[20px] sm:rounded-[32px] flex items-center justify-center transition-all duration-500",
             isDragActive ? "bg-teal text-white scale-110" : "bg-teal-light text-teal group-hover:scale-110 group-hover:bg-teal group-hover:text-white"
           )}>
             {isUploading ? (
               <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 animate-spin" />
             ) : (
               <Upload className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
             )}
           </div>
           
           {/* Animated Pulse Ring */}
           <div className="absolute inset-0 rounded-[20px] sm:rounded-[32px] border-4 border-teal animate-ping opacity-20 scale-125" />
        </div>

        <div className="space-y-3 sm:space-y-4 max-w-sm sm:max-w-md">
           <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#030712] tracking-tight leading-tight">
             {isDragActive ? "Lepaskan File Sekarang" : "Tarik & Lepas CV Kamu"}
           </h3>
           <p className="text-xs sm:text-sm lg:text-base text-text-secondary font-medium leading-relaxed">
             Seret file PDF kamu ke sini, atau <span className="text-teal font-bold underline cursor-pointer">pilih dari folder</span>. AI kami akan menganalisisnya secara instan.
           </p>
        </div>

        <div className="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-[8px] sm:text-[10px] font-black text-text-faint uppercase tracking-widest sm:tracking-[0.2em]">
           <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-teal" /> MAX 5MB</div>
           <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-teal" /> PDF ONLY</div>
           <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-teal" /> ATS FRIENDLY</div>
        </div>

        {/* Progress Overlay */}
        <AnimatePresence>
          {isUploading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-[44px] z-20 flex flex-col items-center justify-center px-12"
            >
               <div className="w-full max-w-sm space-y-6">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-xs font-black text-teal uppercase tracking-widest mb-1">MENGANALISIS CV</p>
                        <h4 className="text-xl font-bold text-[#030712]">Sabar ya, AI sedang bekerja...</h4>
                     </div>
                     <span className="text-2xl font-black text-teal">{uploadProgress}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-teal-light rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-teal rounded-full"
                     />
                  </div>
                  <p className="text-center text-text-muted text-sm italic">&quot;Did you know? Gemini AI can understand 100+ languages in your CV.&quot;</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Extra Info */}
      <div className="mt-10 p-6 bg-white rounded-3xl border border-[#F3F4F6] flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-light flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-amber" />
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          <span className="font-bold text-[#030712]">Tips:</span> Gunakan template CV yang bersih dan minimalis untuk mendapatkan skor ATS (Applicant Tracking System) yang lebih tinggi.
        </p>
      </div>
    </div>
  );
}
