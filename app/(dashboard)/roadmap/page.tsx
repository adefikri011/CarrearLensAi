"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, Target, 
  Map as RoadmapIcon, ChevronRight, Sparkles,
  ArrowUpRight, Info, Layers, Trophy, Calendar,
  Clock, Link as LinkIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import PageLoader from "@/components/shared/PageLoader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

const phases = [
  { id: "fondasi", title: "Fase 1: Fondasi", range: "Minggu 1-4", desc: "Membangun identitas dan pemetaan kompetensi dasar." },
  { id: "pengembangan", title: "Fase 2: Pengembangan", range: "Minggu 5-8", desc: "Akselerasi skill teknis dan pembangunan portofolio." },
  { id: "persiapan", title: "Fase 3: Persiapan", range: "Minggu 9-12", desc: "Simulasi dunia kerja dan strategi melamar." }
];

const roadmapContent = [
  { week: 1, phase: "fondasi", title: "Self-Discovery & Goal Setting", tasks: ["Lengkapi Profil CareerLens", "Analisis Potensi Karier via AI", "Pilih Jalur Karier Utama"], hours: "4-6h", resource: "Panduan Karier SMK" },
  { week: 2, phase: "fondasi", title: "CV & Portfolio Bootcamp", tasks: ["Upload Audit CV Pertama", "Revisi Deskripsi Pengalaman", "Buat Link Portfolio"], hours: "5-8h", resource: "Template CV ATS" },
  { week: 3, phase: "fondasi", title: "Digital Presence (LinkedIn)", tasks: ["Update Foto Profesional", "Tulis Summary Menarik", "Connect 10 Alumni"], hours: "3-5h", resource: "LinkedIn Checklist" },
  { week: 4, phase: "fondasi", title: "Market Research", tasks: ["Cek Gaji Rata-rata", "List 5 Perusahaan Target", "Pelajari Job Desks"], hours: "4h", resource: "Portal Kerja" },
  { week: 5, phase: "pengembangan", title: "Skill Hardening Phase 1", tasks: ["Ikuti Kursus Rekomendasi", "Kerjakan Mini Project", "Sertifikasi Kompetensi"], hours: "10-15h", resource: "List Kursus Gratis" },
  { week: 6, phase: "pengembangan", title: "Real World Simulation", tasks: ["Handle Brief Proyek Nyata", "Networking Industry", "Review Mentoring"], hours: "8-10h", resource: "Case Study Guide" },
  { week: 7, phase: "pengembangan", title: "Technical Deep Dive", tasks: ["Advanced Frameworks", "Algorithm Mastery", "Code Review Session"], hours: "12h", resource: "Advanced Docs" },
  { week: 8, phase: "pengembangan", title: "Portfolio Polish", tasks: ["Case Study Writing", "Visual Design Refine", "Project Deployment"], hours: "8h", resource: "Deployment Guide" },
  { week: 9, phase: "persiapan", title: "The Interview Game", tasks: ["STAR Method Mastery", "Mock Interview AI", "Body Language Training"], hours: "6h", resource: "Interview Questions" },
  { week: 10, phase: "persiapan", title: "Application Strategy", tasks: ["Custom CV per Job", "Cover Letter Automation", "Application Tracker Setup"], hours: "5h", resource: "Tracker Template" },
  { week: 11, phase: "persiapan", title: "Salary Negotiation", tasks: ["Benefit Comparison", "Contract Reading Tips", "Psychological Prep"], hours: "4h", resource: "Negotiation Script" },
  { week: 12, phase: "persiapan", title: "Closing the Deal", tasks: ["First Day Prep", "Equipment Setup", "Mental Shift to Office"], hours: "3h", resource: "Onboarding Kit" },
];

export default function RoadmapPage() {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchProgress();
  }, []);

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
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (week: number, taskIdx: number) => {
    const taskId = `w${week}-t${taskIdx}`;
    const newStatus = !completedTasks[taskId];
    
    // Optimistic update
    setCompletedTasks(prev => ({ ...prev, [taskId]: newStatus }));

    try {
      const res = await fetch("/api/roadmap/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, completed: newStatus })
      });
      const result = await res.json();
      if (!result.success) {
        // Revert on failure
        setCompletedTasks(prev => ({ ...prev, [taskId]: !newStatus }));
        toast.error("Gagal menyimpan progres.");
      }
    } catch (error) {
      setCompletedTasks(prev => ({ ...prev, [taskId]: !newStatus }));
      toast.error("Kesalahan jaringan.");
    }
  };

  const totalTasks = roadmapContent.reduce((acc, r) => acc + r.tasks.length, 0);
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const completedWeeks = roadmapContent.filter(w => 
    w.tasks.every((_, i) => completedTasks[`w${w.week}-t${i}`])
  ).length;

  if (isLoading) return <PageLoader isLoading={true} text="Menyiapkan Roadmap..." />;

  return (
    <div className="min-h-screen bg-white">
      {/* --- Sticky Progress Header --- */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-4 px-6 md:px-10">
        <div className="max-w-3xl mx-auto w-full">
           <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal">
                    <RoadmapIcon className="w-4 h-4" />
                 </div>
                 <h2 className="text-sm font-black text-black uppercase tracking-widest italic">Roadmap Karier 90 Hari</h2>
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

      {/* --- Main Content --- */}
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-16">
         
         {/* Phase Sections */}
         {phases.map((phase) => (
           <section key={phase.id} className="space-y-8">
              {/* Phase Header */}
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

              {/* Weeks in Phase */}
              <div className="space-y-6">
                 {roadmapContent.filter(w => w.phase === phase.id).map((weekData) => {
                    const isFullyCompleted = weekData.tasks.every((_, i) => completedTasks[`w${weekData.week}-t${i}`]);
                    
                    return (
                       <motion.div 
                         key={weekData.week}
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
                                   MGG {weekData.week}
                                </div>
                                <h3 className="text-lg font-black text-black">{weekData.title}</h3>
                             </div>
                             
                             {isFullyCompleted && (
                                <div className="flex items-center gap-2 text-teal font-black text-[10px] uppercase tracking-widest">
                                   <CheckCircle2 className="w-4 h-4" /> SELESAI
                                </div>
                             )}
                          </div>

                          {/* Task List */}
                          <div className="space-y-3">
                             {weekData.tasks.map((task, tidx) => {
                                const taskId = `w${weekData.week}-t${tidx}`;
                                const isDone = completedTasks[taskId];
                                
                                return (
                                   <div 
                                     key={tidx}
                                     onClick={() => toggleTask(weekData.week, tidx)}
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
                             })}
                          </div>

                          {/* Footer Info */}
                          <div className="mt-8 pt-6 border-t border-gray-100/50 flex flex-wrap items-center gap-6">
                             {weekData.resource && (
                                <button className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-teal transition-all">
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
              </div>
           </section>
         ))}

         {/* Final Destination */}
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
            <button className="h-14 px-10 bg-teal text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all shadow-xl shadow-teal/20">
               LIHAT CAPAIAN SAYA
            </button>
         </motion.div>

      </main>
    </div>
  );
}
