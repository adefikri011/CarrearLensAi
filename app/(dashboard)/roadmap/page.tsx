"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, Target, 
  Map as RoadmapIcon, ChevronRight, Sparkles,
  ArrowUpRight, Info, Layers, Trophy, Calendar,
  Clock, Link as LinkIcon, X, RefreshCcw
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
  { id: "fondasi", title: "Fase 1: Eksplorasi & Fondasi", range: "Minggu 1-4", desc: "Membangun identitas profesional dan pemetaan kompetensi dasar untuk role ini.", icon: Target },
  { id: "pengembangan", title: "Fase 2: Pemantapan & Aksi", range: "Minggu 5-8", desc: "Akselerasi skill teknis spesifik dan pembangunan portofolio yang memikat rekruter.", icon: Layers },
  { id: "persiapan", title: "Fase 3: Strategi & Penaklukan", range: "Minggu 9-12", desc: "Simulasi dunia kerja, optimalisasi CV/LinkedIn, dan strategi memenangkan interview.", icon: Trophy }
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
          fase: (item.fase || item.phase || "Fondasi").toLowerCase(),
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

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      // If pathName is missing, the service will fall back to the first available path
      const genResult = await generateRoadmapForPath(pathName);
      if (genResult.success) {
        // Data is now normalized in the service, but we double check here
        const genRoadmap = genResult.data.map((item: any) => ({
          ...item,
          minggu: item.minggu || item.week || 0,
          fase: (item.fase || item.phase || "Fondasi").toLowerCase(),
          tasks: item.tasks || item.tugas || []
        }));
        setRoadmapContent(genRoadmap);
        
        // If we didn't have a pathName, let's try to fetch it now that it's updated
        if (!pathName) {
           await fetchRoadmap();
        }
        
        toast.success("Roadmap berhasil diperbarui dengan Gemini AI!");
      }
    } catch (err: any) {
      console.error("Regeneration failed", err);
      const errorMessage = err.message || "Gagal memperbarui roadmap detail.";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const totalTasks = roadmapContent.reduce((acc, r) => acc + (r.tasks?.length || 0), 0);
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const completedWeeks = roadmapContent.filter(w => 
    w.tasks?.length > 0 && w.tasks.every((_: any, i: number) => completedTasks[`w${w.minggu}-t${i}`])
  ).length;

  if (isLoading) return <PageLoader isLoading={true} text="Menyiapkan Roadmap..." />;
  if (isGenerating) return <PageLoader isLoading={true} text="Membangun Roadmap Detail Kamu..." subtitle="Gemini AI sedang menyusun strategi 90 hari terbaik untukmu." />;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sticky Progress Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-5 px-6 md:px-10">
        <div className="max-w-4xl mx-auto w-full">
           <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center text-teal shadow-sm border border-teal/5">
                    <RoadmapIcon className="w-6 h-6" />
                 </div>
                 <div>
                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] mb-1">Target Roadmap Karier</h2>
                    <h1 className="text-lg font-black text-black uppercase tracking-widest italic leading-tight">
                       {pathName || "Membangun Karier Impian"}
                    </h1>
                 </div>
              </div>
              <div className="text-right hidden sm:block">
                 <div className="text-2xl font-black text-teal mb-0.5">{progressPercent}%</div>
                 <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">MASTERED</div>
              </div>
           </div>
           
           <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.2, ease: "circOut" }}
                className="h-full bg-gradient-to-r from-teal via-emerald-500 to-teal relative overflow-hidden" 
              >
                <motion.div 
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full"
                />
              </motion.div>
           </div>
           
           <div className="flex items-center justify-between mt-3 text-[10px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-2 text-gray-400">
                 <Calendar className="w-3 h-3" />
                 <span>{completedWeeks} DARI 12 MINGGU SELESAI</span>
              </div>
              <button 
                onClick={handleRegenerate}
                className="text-teal hover:text-teal/80 transition-all flex items-center gap-2 bg-teal/5 px-3 py-1.5 rounded-full border border-teal/10 hover:border-teal/30"
              >
                <RefreshCcw className={cn("w-3 h-3", isGenerating && "animate-spin")} />
                <span>{isGenerating ? "GENERATING..." : "GENERATE ULANG"}</span>
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-16 pb-24">
        {phases.map((phase) => (
          <motion.div 
            key={phase.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-gray-100 pb-6">
              <div className="space-y-2">
                 <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-md">
                       {phase.range}
                    </div>
                    <span className="text-teal font-black text-[10px] uppercase tracking-widest">
                       {phase.id === 'fondasi' ? 'Start journey' : phase.id === 'pengembangan' ? 'Gaining momentum' : 'Ready to fly'}
                    </span>
                 </div>
                 <h2 className="text-3xl font-black text-black tracking-tighter uppercase italic">{phase.title}</h2>
                 <p className="text-gray-500 text-sm max-w-xl font-medium leading-relaxed">{phase.desc}</p>
              </div>
              <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center overflow-hidden">
                       <div className="w-full h-full bg-teal/5" />
                    </div>
                 ))}
              </div>
            </div>

            <div className="space-y-6">
              {roadmapContent.filter(w => {
                const weekFase = (w.fase || "").toLowerCase();
                const targetPhase = phase.id.toLowerCase();
                const weekNum = w.minggu || 0;
                
                if (targetPhase === "fondasi" && weekNum >= 1 && weekNum <= 4) return true;
                if (targetPhase === "pengembangan" && weekNum >= 5 && weekNum <= 8) return true;
                if (targetPhase === "persiapan" && weekNum >= 9 && weekNum <= 12) return true;

                return weekFase.includes(targetPhase) || targetPhase.includes(weekFase);
              }).map((weekData, idx) => {
                 const tasks = weekData.tasks || [];
                 const isFullyCompleted = tasks.length > 0 && tasks.every((_: any, i: number) => completedTasks[`w${weekData.minggu}-t${i}`]);
                 
                 return (
                    <motion.div 
                      key={weekData.minggu}
                      variants={fadeUp}
                      className={cn(
                        "group relative bg-white border border-gray-100 rounded-[32px] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-teal/5 hover:-translate-y-1",
                        isFullyCompleted && "border-teal/20 bg-teal/[0.01]"
                      )}
                    >
                       <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform">
                          <Sparkles className="w-4 h-4" />
                       </div>
                       
                       <div className="flex items-start gap-6">
                          <div className="flex flex-col items-center">
                             <div className={cn(
                               "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-500 shadow-sm",
                               isFullyCompleted ? "bg-teal text-white rotate-6" : "bg-gray-100 text-gray-400 group-hover:bg-black group-hover:text-white"
                             )}>
                               {weekData.minggu}
                             </div>
                             <div className="w-0.5 h-full min-h-[40px] bg-gray-100 mt-4 rounded-full" />
                          </div>

                          <div className="flex-1 space-y-6">
                             <div>
                                <h3 className="text-xl font-black text-black tracking-tight mb-2 group-hover:text-teal transition-colors">
                                   {weekData.title}
                                </h3>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                   <div className="flex items-center gap-1.5">
                                      <Clock className="w-3 h-3" />
                                      <span>Est. {weekData.hours || "10-15"} Jam / Minggu</span>
                                   </div>
                                   <div className="w-1 h-1 rounded-full bg-gray-200" />
                                   <div className="flex items-center gap-1.5">
                                      <Calendar className="w-3 h-3" />
                                      <span>Minggu {weekData.minggu}</span>
                                   </div>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {tasks.length > 0 ? tasks.map((task: string, tidx: number) => {
                                   const taskId = `w${weekData.minggu}-t${tidx}`;
                                   const isDone = completedTasks[taskId];
                                   
                                   return (
                                      <div 
                                        key={tidx}
                                        onClick={() => toggleTask(weekData.minggu, tidx)}
                                        className={cn(
                                          "flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border group/task",
                                          isDone 
                                            ? "bg-teal/5 border-teal/10 text-teal/70" 
                                            : "bg-gray-50/50 border-transparent hover:border-teal/30 hover:bg-white"
                                        )}
                                      >
                                         <div className={cn(
                                            "w-5 h-5 rounded-md flex items-center justify-center transition-all",
                                            isDone ? "bg-teal text-white" : "border-2 border-gray-200 bg-white"
                                         )}>
                                            {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                                         </div>
                                         <span className={cn(
                                            "text-xs font-bold transition-all",
                                            isDone ? "line-through opacity-50" : "text-gray-700 font-medium"
                                         )}>{task}</span>
                                      </div>
                                   );
                                }) : (
                                  <p className="text-xs text-gray-400 italic">Tidak ada tugas spesifik minggu ini.</p>
                                )}
                             </div>

                             <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                   <button 
                                      onClick={() => weekData.resource && setSelectedResource({
                                        title: weekData.resource,
                                        link: weekData.resourceLink || weekData.link
                                      })}
                                      className="flex items-center gap-2 text-[10px] font-black text-black hover:text-teal uppercase tracking-widest transition-colors"
                                   >
                                      <LinkIcon className="w-3 h-3" />
                                      <span>Resource: {weekData.resource}</span>
                                   </button>
                                </div>
                                
                                {isFullyCompleted && (
                                   <div className="flex items-center gap-2 px-3 py-1.5 bg-teal/10 text-teal rounded-full text-[9px] font-black uppercase tracking-widest animate-in fade-in zoom-in duration-500">
                                      <Trophy className="w-3 h-3" />
                                      Completed Week {weekData.minggu}!
                                   </div>
                                )}
                             </div>
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
                <div className="group p-16 border-2 border-dashed border-gray-100 rounded-[48px] text-center bg-gray-50/30 transition-all hover:bg-white hover:border-teal/20">
                   <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-6 group-hover:scale-110 group-hover:bg-teal/5 group-hover:text-teal transition-all duration-500">
                      <Sparkles className="w-8 h-8" />
                   </div>
                   <p className="text-gray-400 text-sm font-medium italic max-w-sm mx-auto">
                      {roadmapContent.length === 0 
                        ? "Roadmap detail sedang disiapkan. Klik tombol di bawah untuk meminta Gemini AI menyusun strategi 90 hari terbaik untukmu."
                        : `Detail langkah untuk fase ini masih dalam proses sinkronisasi.`}
                   </p>
                   {roadmapContent.length === 0 && !isGenerating && (
                     <div className="flex flex-col items-center gap-6 mt-10">
                        <Button 
                          variant="default"
                          onClick={() => handleRegenerate()}
                          className="bg-black hover:bg-teal text-white rounded-2xl h-14 px-10 font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/10 transition-all hover:-translate-y-1 active:scale-95"
                        >
                          Bangun Roadmap Dengan Gemini AI
                        </Button>
                        <Button 
                          variant="link" 
                          onClick={() => router.push('/analysis')}
                          className="text-gray-400 hover:text-black font-black text-[10px] uppercase tracking-widest"
                        >
                          ← Kembali Ke Analisis
                        </Button>
                     </div>
                   )}
                   {isGenerating && (
                      <div className="mt-8 flex flex-col items-center gap-4">
                         <LoadingSpinner size="lg" />
                         <p className="text-teal font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Consulting Gemini AI...</p>
                      </div>
                   )}
                </div>
              )}
            </div>
          </motion.div>
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
           <div className="w-16 h-16 bg-teal rounded-[24px] flex items-center justify-center text-white mx-auto shadow-2xl shadow-teal/40 transition-transform hover:scale-110 duration-500">
              <Trophy className="w-8 h-8" />
           </div>
           <div className="space-y-3">
              <h3 className="text-2xl font-black text-white italic tracking-tight uppercase">Karier Impian Menantimu</h3>
              <p className="text-gray-400 text-sm font-medium max-w-sm mx-auto">
                 Selesaikan roadmap 90 hari ini dan jadilah talenta yang paling dicari oleh industri global. Konsistensi adalah kunci.
              </p>
           </div>
           <button 
             onClick={() => toast.success("Selamat! Kamu dalam jalur yang benar. Tetap konsisten!")}
             className="h-14 px-10 bg-teal text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-teal/20"
           >
              CEK PROGRES KESELURUHAN
           </button>
        </motion.div>
      </div>

      <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent className="rounded-[40px] p-10 max-w-md border-none shadow-2xl">
           <DialogHeader>
              <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center text-teal mb-6 shadow-inner">
                 <LinkIcon className="w-8 h-8" />
              </div>
              <DialogTitle className="text-2xl font-black text-black tracking-tight uppercase italic leading-none">Materi Pendukung</DialogTitle>
            <DialogDescription className="pt-4 text-gray-500 font-medium leading-relaxed">
               Gunakan referensi ini untuk memperdalam pemahamanmu tentang <span className="text-black font-bold italic underline decoration-teal/30 underline-offset-4">&quot;{selectedResource?.title}&quot;</span>.
            </DialogDescription>
           </DialogHeader>
           <div className="mt-10 space-y-4">
              <a 
                href={selectedResource?.link || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full h-16 bg-black text-white rounded-2xl flex items-center justify-center font-black uppercase text-[10px] tracking-[0.2em] hover:bg-teal transition-all group shadow-xl shadow-black/10"
              >
                BUKA RESOURCE <ArrowUpRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedResource(null)}
                className="w-full h-12 text-gray-400 font-black uppercase tracking-widest text-[9px] hover:text-black transition-colors"
              >
                Kembali Ke Roadmap
              </Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
