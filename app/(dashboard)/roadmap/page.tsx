"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, Target, 
  Map as RoadmapIcon, ChevronRight, Sparkles,
  ArrowUpRight, Info, Layers, Trophy, Calendar,
  Clock, Link as LinkIcon, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import PageLoader from "@/components/shared/PageLoader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";
import { generateRoadmapForPath } from "@/lib/analysis-service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

const phases = [
  { id: "fondasi", title: "Fase 1: Fondasi", range: "Minggu 1-4", desc: "Membangun identitas dan pemetaan kompetensi dasar." },
  { id: "pengembangan", title: "Fase 2: Pengembangan", range: "Minggu 5-8", desc: "Akselerasi skill teknis dan pembangunan portofolio." },
  { id: "persiapan", title: "Fase 3: Persiapan", range: "Minggu 9-12", desc: "Simulasi dunia kerja dan strategi melamar." }
];

export default function RoadmapPage() {
  const router = useRouter();
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [roadmapContent, setRoadmapContent] = useState<any[]>([]);
  const [pathName, setPathName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const init = async () => {
      await fetchRoadmap();
      await fetchProgress();
      setIsLoading(false);
    };
    init();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const res = await fetch("/api/roadmap/content");
      const result = await res.json();
      if (result.success && result.data) {
        const rawRoadmap = result.data.roadmap || [];
        
        // Normalize roadmap data (handles potential AI property name variations)
        const normalizedRoadmap = rawRoadmap.map((item: any) => ({
          ...item,
          minggu: item.minggu || item.week || 0,
          fase: item.fase || item.phase || "Lainnya",
          title: item.title || item.judul || "Tanpa Judul",
          tasks: item.tasks || item.tugas || []
        }));

        setPathName(result.data.pathName);
        
        if (normalizedRoadmap.length === 0) {
          // If empty, try to generate it now
          setIsGenerating(true);
          try {
            const genResult = await generateRoadmapForPath(result.data.pathName);
            if (genResult.success) {
              const genRoadmap = genResult.data.map((item: any) => ({
                ...item,
                minggu: item.minggu || item.week || 0,
                fase: item.fase || item.phase || "Lainnya",
                tasks: item.tasks || item.tugas || []
              }));
              setRoadmapContent(genRoadmap);
              toast.success("Roadmap detail berhasil dibuat!");
            }
          } catch (err) {
            console.error("Auto generation failed", err);
            setRoadmapContent([]);
          } finally {
            setIsGenerating(false);
          }
        } else {
          setRoadmapContent(normalizedRoadmap);
        }
      }
    } catch (error) {
      console.error("Failed to fetch roadmap content", error);
      toast.error("Gagal memuat detail roadmap.");
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await fetch("/api/roadmap/progress");
      const result = await res.json();
      if (result.success && result.data) {
        const progressMap: Record<string, boolean> = {};
        result.data.forEach((item: any) => {
          progressMap[item.taskId] = item.completed;
        });
        setCompletedTasks(progressMap);
      }
    } catch (error) {
      console.error("Failed to fetch progress", error);
    }
  };

  const toggleTask = async (week: number, taskIdx: number) => {
    const taskId = `w${week}-t${taskIdx}`;
    const newStatus = !completedTasks[taskId];
    
    setCompletedTasks(prev => ({ ...prev, [taskId]: newStatus }));

    try {
      const res = await fetch("/api/roadmap/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, completed: newStatus })
      });
      const result = await res.json();
      if (!result.success) {
        setCompletedTasks(prev => ({ ...prev, [taskId]: !newStatus }));
        toast.error("Gagal menyimpan progres.");
      }
    } catch (error) {
      setCompletedTasks(prev => ({ ...prev, [taskId]: !newStatus }));
      toast.error("Kesalahan jaringan.");
    }
  };

  const totalTasks = roadmapContent.reduce((acc, r) => acc + (r.tasks?.length || 0), 0);
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const completedWeeks = roadmapContent.filter(w => 
    w.tasks?.every((_: any, i: number) => completedTasks[`w${w.minggu}-t${i}`])
  ).length;

  if (isLoading) return <PageLoader isLoading={true} text="Menyiapkan Roadmap..." />;
  if (isGenerating) return <PageLoader isLoading={true} text="Membangun Roadmap Detail Kamu..." subtitle="Gemini AI sedang menyusun strategi 90 hari terbaik untukmu." />;

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Progress Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-4 px-6 md:px-10">
        <div className="max-w-3xl mx-auto w-full">
           <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal">
                    <RoadmapIcon className="w-4 h-4" />
                 </div>
                 <h2 className="text-sm font-black text-black uppercase tracking-widest italic">{pathName || "Roadmap Karier 90 Hari"}</h2>
              </div>
              <span className="text-xs font-black text-teal">{progressPercent}%</span>
           </div>
           
           <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-teal" 
              />
           </div>
           
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2">
              {completedWeeks} DARI 12 MINGGU SELESAI
           </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-16">
         {phases.map((phase) => (
           <section key={phase.id} className="space-y-8">
              <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100">
                 <div className="flex items-center gap-4 mb-3">
                    <h2 className="text-xl font-black text-black">{phase.title}</h2>
                    <span className="px-3 py-1 rounded-full bg-teal/10 text-teal text-[10px] font-black uppercase tracking-widest border border-teal/10">
                       {phase.range}
                    </span>
                 </div>
                 <p className="text-gray-500 text-sm leading-relaxed font-medium">
                    {phase.desc}
                 </p>
              </div>

                 <div className="space-y-6">
                   {roadmapContent.filter(w => {
                      const weekFase = (w.fase || "").toLowerCase();
                      const targetPhase = phase.id.toLowerCase();
                      const weekNum = w.minggu || 0;
                      
                      // Fallback: match by week number if phase text is missing or generic
                      if (targetPhase === "fondasi" && weekNum >= 1 && weekNum <= 4) return true;
                      if (targetPhase === "pengembangan" && weekNum >= 5 && weekNum <= 8) return true;
                      if (targetPhase === "persiapan" && weekNum >= 9 && weekNum <= 12) return true;

                      return weekFase.includes(targetPhase) || targetPhase.includes(weekFase);
                   }).map((weekData) => {
                      const tasks = weekData.tasks || [];
                      const isFullyCompleted = tasks.length > 0 && tasks.every((_: any, i: number) => completedTasks[`w${weekData.minggu}-t${i}`]);
                      
                      return (
                         <motion.div 
                           key={weekData.minggu}
                           variants={fadeUp}
                           initial="hidden"
                           whileInView="visible"
                           viewport={{ once: true }}
                           className={cn(
                             "bg-white border rounded-[32px] p-6 md:p-8 transition-all duration-500 group",
                             isFullyCompleted 
                              ? "border-teal/30 bg-[#ECFDF5] shadow-lg shadow-teal/5" 
                              : "border-gray-100 hover:border-gray-200 shadow-sm"
                           )}
                         >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                               <div className="flex items-center gap-4">
                                  <div className={cn(
                                     "px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-colors",
                                     isFullyCompleted ? "bg-teal text-white" : "bg-gray-100 text-gray-400"
                                  )}>
                                     MGG {weekData.minggu}
                                  </div>
                                  <h3 className="text-lg font-black text-black">{weekData.title}</h3>
                               </div>
                               
                               {isFullyCompleted && (
                                  <div className="flex items-center gap-2 text-teal font-black text-[10px] uppercase tracking-widest">
                                     <CheckCircle2 className="w-4 h-4" /> SELESAI
                                  </div>
                               )}
                            </div>

                            <div className="space-y-3">
                               {tasks.length > 0 ? tasks.map((task: string, tidx: number) => {
                                  const taskId = `w${weekData.minggu}-t${tidx}`;
                                  const isDone = completedTasks[taskId];
                                  
                                  return (
                                     <div 
                                       key={tidx}
                                       onClick={() => toggleTask(weekData.minggu, tidx)}
                                       className={cn(
                                         "flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer",
                                         isDone 
                                           ? "bg-white/50 border-teal/20" 
                                           : "bg-surface border-transparent hover:border-teal/20"
                                       )}
                                     >
                                        <div className={cn(
                                           "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0",
                                           isDone ? "bg-teal border-teal" : "border-gray-200 bg-white"
                                        )}>
                                           {isDone && <CheckCircle2 className="w-4 h-4 text-white" />}
                                        </div>
                                        <span className={cn(
                                           "text-sm font-bold flex-1 transition-all",
                                           isDone ? "italic line-through opacity-40 text-gray-400" : "text-black"
                                        )}>{task}</span>
                                     </div>
                                  );
                               }) : (
                                 <p className="text-xs text-gray-400 italic">Tidak ada tugas spesifik minggu ini.</p>
                               )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100/50 flex flex-wrap items-center gap-6">
                               {weekData.resource && (
                                  <button 
                                    onClick={() => setSelectedResource(weekData)}
                                    className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-teal transition-all"
                                  >
                                     <LinkIcon className="w-3.5 h-3.5" /> Resource: {weekData.resource}
                                  </button>
                               )}
                               <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                  <Clock className="w-3.5 h-3.5" /> EST: {weekData.hours}
                                </div>
                             </div>
                          </motion.div>
                       );
                    })}

                    {roadmapContent.filter(w => {
                      const weekFase = (w.fase || "").toLowerCase();
                      const targetPhase = phase.id.toLowerCase();
                      const weekNum = w.minggu || 0;
                      
                      if (targetPhase === "fondasi" && weekNum >= 1 && weekNum <= 4) return true;
                      if (targetPhase === "pengembangan" && weekNum >= 5 && weekNum <= 8) return true;
                      if (targetPhase === "persiapan" && weekNum >= 9 && weekNum <= 12) return true;

                      return weekFase.includes(targetPhase) || targetPhase.includes(weekFase);
                    }).length === 0 && (
                      <div className="p-12 border-2 border-dashed border-gray-100 rounded-[32px] text-center bg-gray-50/50">
                         <p className="text-gray-400 text-sm italic font-medium">
                            {roadmapContent.length === 0 
                              ? "Kamu perlu melakukan analisis CV ulang atau tunggu sebentar selagi kami membangun roadmap ini."
                              : `Detail langkah untuk ${phase.title} belum tersedia. Silakan klik "Analisis Ulang" di dashboard jika ini terus terjadi.`}
                         </p>
                         {roadmapContent.length === 0 && !isGenerating && (
                           <div className="flex flex-col items-center gap-4 mt-6">
                              <Button 
                                variant="default"
                                onClick={() => fetchRoadmap()}
                                className="bg-teal text-white rounded-xl h-11 px-8 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-teal/10"
                              >
                                Coba Muat Ulang Detail
                              </Button>
                              <Button 
                                variant="link" 
                                onClick={() => router.push('/analysis')}
                                className="text-teal font-black text-xs uppercase tracking-widest"
                              >
                                Ke Halaman Analisis →
                              </Button>
                           </div>
                         )}
                      </div>
                    )}
                 </div>
           </section>
         ))}

         <motion.div 
           variants={fadeUp}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           className="bg-black rounded-[48px] p-12 text-center space-y-6 relative overflow-hidden"
         >
            <div className="absolute top-0 right-0 p-12 opacity-5">
               <Trophy className="w-32 h-32 text-white" />
            </div>
            <div className="w-16 h-16 bg-teal rounded-[24px] flex items-center justify-center text-white mx-auto shadow-2xl shadow-teal/40">
               <Trophy className="w-8 h-8" />
            </div>
            <div className="space-y-3">
               <h3 className="text-2xl font-black text-white italic tracking-tight">Karier Impian Menantimu</h3>
               <p className="text-gray-400 text-sm font-medium max-w-sm mx-auto">
                  Selesaikan roadmap ini dan jadilah talenta SMK yang paling dicari oleh industri.
               </p>
            </div>
            <button 
              onClick={() => toast.success("Selamat! Kamu dalam jalur yang benar. Tetap konsisten!")}
              className="h-14 px-10 bg-teal text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all shadow-xl shadow-teal/20"
            >
               LIHAT CAPAIAN SAYA
            </button>
         </motion.div>
      </main>

      <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent className="rounded-[32px] p-8 max-w-md">
           <DialogHeader>
              <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center text-teal mb-4">
                 <LinkIcon className="w-6 h-6" />
              </div>
              <DialogTitle className="text-xl font-black text-black">Materi Pendukung</DialogTitle>
            <DialogDescription className="pt-2 text-gray-500 font-medium">
               Klik tombol di bawah untuk membuka materi <span className="text-black font-bold">&quot;{selectedResource?.resource}&quot;</span> guna membantu kamu menyelesaikan Minggu {selectedResource?.minggu}.
            </DialogDescription>
           </DialogHeader>
           <div className="mt-8 space-y-4">
              <a 
                href={selectedResource?.resourceLink || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full h-14 bg-black text-white rounded-2xl flex items-center justify-center font-black uppercase text-[10px] tracking-widest hover:bg-teal transition-all"
              >
                BUKA SUMBER MATERI <ArrowUpRight className="ml-2 w-4 h-4" />
              </a>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedResource(null)}
                className="w-full h-12 text-gray-400 font-bold"
              >
                Tutup
              </Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
