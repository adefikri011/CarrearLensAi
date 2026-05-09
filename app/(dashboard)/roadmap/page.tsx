"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, Lock, Zap, Target, 
  Map as RoadmapIcon, ChevronRight, Sparkles,
  ArrowUpRight, Info, Layers, Trophy, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const phases = [
  { id: "fondasi", title: "Fondasi", desc: "Membangun identitas dan pemetaan kompetensi dasar." },
  { id: "pengembangan", title: "Pengembangan", desc: "Akselerasi skill teknis dan pembangunan portofolio." },
  { id: "persiapan", title: "Persiapan", desc: "Simulasi dunia kerja dan strategi melamar." }
];

const initialRoadmapData = [
  { week: 1, phase: "fondasi", title: "Self-Discovery & Goal Setting", tasks: ["Lengkapi Profil CareerLens", "Analisis Potensi Karier via AI", "Pilih Jalur Karier Utama"], completed: [true, true, false] },
  { week: 2, phase: "fondasi", title: "CV & Portfolio Bootcamp", tasks: ["Upload Audit CV Pertama", "Revisi Deskripsi Pengalaman", "Buat Link Portfolio"], completed: [false, false, false] },
  { week: 3, phase: "fondasi", title: "Digital Presence (LinkedIn)", tasks: ["Update Foto Profesional", "Tulis Summary Menarik", "Connect 10 Alumni"], completed: [false, false, false] },
  { week: 4, phase: "fondasi", title: "Market Research", tasks: ["Cek Gaji Rata-rata", "List 5 Perusahaan Target", "Pelajari Job Desks"], completed: [false, false, false] },
  { week: 5, phase: "pengembangan", title: "Skill Hardening Phase 1", tasks: ["Ikuti Kursus Rekomendasi", "Kerjakan Mini Project", "Sertifikasi Kompetensi"], completed: [false, false, false] },
  { week: 6, phase: "pengembangan", title: "Real World Simulation", tasks: ["Handle Brief Proyek Nyata", "Networking Industry", "Review Mentoring"], completed: [false, false, false] },
  { week: 7, phase: "pengembangan", title: "Technical Deep Dive", tasks: ["Advanced Frameworks", "Algorithm Mastery", "Code Review Session"], completed: [false, false, false] },
  { week: 8, phase: "pengembangan", title: "Portfolio Polish", tasks: ["Case Study Writing", "Visual Design Refine", "Project Deployment"], completed: [false, false, false] },
  { week: 9, phase: "persiapan", title: "The Interview Game", tasks: ["STAR Method Mastery", "Mock Interview AI", "Body Language Training"], completed: [false, false, false] },
  { week: 10, phase: "persiapan", title: "Application Strategy", tasks: ["Custom CV per Job", "Cover Letter Automation", "Application Tracker Setup"], completed: [false, false, false] },
  { week: 11, phase: "persiapan", title: "Salary Negotiation", tasks: ["Benefit Comparison", "Contract Reading Tips", "Psychological Prep"], completed: [false, false, false] },
  { week: 12, phase: "persiapan", title: "Closing the Deal", tasks: ["First Day Prep", "Equipment Setup", "Mental Shift to Office"], completed: [false, false, false] },
];

export default function RoadmapPage() {
  const [activePhase, setActivePhase] = useState("fondasi");
  const [roadmap, setRoadmap] = useState(initialRoadmapData);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 150);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalTasks = roadmap.reduce((acc, r) => acc + r.tasks.length, 0);
  const completedCount = roadmap.reduce((acc, r) => acc + r.completed.filter(Boolean).length, 0);
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const toggleTask = (weekIdx: number, taskIdx: number) => {
    const updated = [...roadmap];
    updated[weekIdx].completed[taskIdx] = !updated[weekIdx].completed[taskIdx];
    setRoadmap(updated);
  };

  const filteredWeeks = roadmap.filter(w => w.phase === activePhase);

  return (
    <div className="space-y-12 pb-20">
      {/* --- Sticky Progress Bar --- */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-20 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#F3F4F6] py-4 px-10 flex items-center justify-between lg:pl-[300px]"
          >
             <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center text-teal">
                      <RoadmapIcon className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-text-faint uppercase tracking-widest leading-none mb-1">PROGRES ROADMAP</p>
                      <p className="text-sm font-bold text-[#030712] leading-none">{progressPercent}% Selesai</p>
                   </div>
                </div>
                <div className="w-64 h-2 bg-surface-2 rounded-full overflow-hidden hidden md:block">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-teal" 
                   />
                </div>
                <button className="bg-[#030712] text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-teal transition-all">
                  LIHAT CAPAIAN
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Header --- */}
      <motion.section variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
           <div className="flex items-center gap-2 text-teal font-bold text-[13px] uppercase tracking-[0.15em] mb-3">
              <Layers className="w-4 h-4" />
              90-DAY ACTION PLAN
           </div>
           <h1 className="text-h2 text-[#030712] mb-4">Peta Jalan Menuju Sukses</h1>
           <p className="text-lg text-text-secondary leading-relaxed">
             Jangan memaksakan diri. Selesaikan misi mingguan secara bertahap dan raih karier idamanmu dalam 3 bulan.
           </p>
        </div>
        
        <div className="flex items-center gap-6 p-1 bg-white rounded-[32px] border border-[#F3F4F6] shadow-sm">
           <div className="flex flex-col items-end px-8 py-3">
              <span className="text-[10px] font-black text-text-faint tracking-widest uppercase">OVERALL PROGRESS</span>
              <span className="text-3xl font-black text-[#030712]">{progressPercent}%</span>
           </div>
           <div className="w-16 h-16 mr-2 rounded-2xl bg-[#030712] flex items-center justify-center text-white shadow-xl shadow-black/10">
              <Trophy className="w-8 h-8" />
           </div>
        </div>
      </motion.section>

      {/* --- Phase Tabs --- */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row items-center gap-4 bg-white p-2 rounded-[32px] border border-[#F3F4F6]">
         {phases.map((phase) => (
            <button
               key={phase.id}
               onClick={() => setActivePhase(phase.id)}
               className={cn(
                  "flex-1 w-full md:w-auto px-8 py-5 rounded-2xl text-left transition-all group",
                  activePhase === phase.id ? "bg-[#030712] text-white shadow-xl" : "hover:bg-surface text-text-secondary"
               )}
            >
               <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest mb-1 block",
                  activePhase === phase.id ? "text-teal" : "text-text-faint group-hover:text-text-primary"
               )}>PHASE {phase.id === "fondasi" ? "01" : phase.id === "pengembangan" ? "02" : "03"}</span>
               <h4 className="font-bold text-lg">{phase.title}</h4>
            </button>
         ))}
      </motion.div>

      {/* --- Main Roadmap Content --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
         {/* Phase Info Sidebar */}
         <motion.div variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[40px] border border-[#F3F4F6] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Sparkles className="w-12 h-12 text-teal" />
               </div>
               <h3 className="text-xl font-bold text-[#030712] mb-4">Misi {phases.find(p => p.id === activePhase)?.title}</h3>
               <p className="text-sm text-text-secondary leading-relaxed mb-8">
                  {phases.find(p => p.id === activePhase)?.desc}
               </p>
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                     <span className="text-text-faint">Progres Fase</span>
                     <span className="text-teal">
                        {Math.round((filteredWeeks.reduce((acc, w) => acc + w.completed.filter(Boolean).length, 0) / (filteredWeeks.length * 3)) * 100)}%
                     </span>
                  </div>
                  <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
                     <div className="h-full bg-teal transition-all" style={{ width: `${(filteredWeeks.reduce((acc, w) => acc + w.completed.filter(Boolean).length, 0) / (filteredWeeks.length * 3)) * 100}%` }} />
                  </div>
               </div>
            </div>

            <div className="p-8 bg-teal text-white rounded-[40px] shadow-2xl shadow-teal/20">
               <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-white" />
               </div>
               <h4 className="text-lg font-bold mb-2">Butuh Akselerasi?</h4>
               <p className="text-white/70 text-xs leading-relaxed mb-6">Paket Pro memberikan akses 1-on-1 dengan mentor untuk bimbingan setiap minggunya.</p>
               <button className="w-full h-12 bg-white text-teal rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all">
                  UPGRADE SEKARANG
               </button>
            </div>
         </motion.div>

         {/* Timeline Content */}
         <div className="lg:col-span-3 space-y-8 relative">
            {/* Timeline Vertical Line Overlay */}
            <div className="absolute top-0 bottom-0 left-6 sm:left-12 w-[1px] bg-[#F3F4F6] z-0" />

            <AnimatePresence mode="wait">
               <motion.div 
                 key={activePhase}
                 initial="hidden" animate="visible" variants={stagger}
                 className="space-y-10 relative z-10"
               >
                  {filteredWeeks.map((weekData, widx) => {
                     const realIdx = roadmap.findIndex(w => w.week === weekData.week);
                     return (
                        <motion.div 
                          key={weekData.week} 
                          variants={fadeUp}
                          className="flex gap-8 sm:gap-14 items-start group"
                        >
                           {/* Week Dot/Icon */}
                           <div className={cn(
                              "w-12 sm:w-24 h-12 sm:h-24 rounded-full border-8 border-[#F9FAFB] flex flex-col items-center justify-center shrink-0 transition-all duration-500",
                              weekData.completed.every(Boolean) ? "bg-teal text-white scale-110" : "bg-white text-text-faint border-white shadow-xl hover:scale-110 hover:border-teal/20"
                           )}>
                              <span className="text-[10px] sm:text-xs font-black leading-none mb-1">MGG</span>
                              <span className="text-lg sm:text-3xl font-black leading-none">{weekData.week}</span>
                           </div>

                           {/* Week Card */}
                           <div className="flex-1 bg-white p-8 sm:p-10 rounded-[48px] border border-[#F3F4F6] shadow-sm hover:shadow-xl hover:border-teal/20 transition-all group/card">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                                 <div>
                                    <h3 className="text-2xl font-bold text-[#030712] group-hover/card:text-teal transition-colors mb-2">{weekData.title}</h3>
                                    <div className="flex items-center gap-2">
                                       <Calendar className="w-3.5 h-3.5 text-text-faint" />
                                       <span className="text-xs font-bold text-text-faint uppercase tracking-widest">7 Hari Tersisa</span>
                                    </div>
                                 </div>
                                 <button className="flex items-center gap-2 text-[10px] font-black text-teal tracking-widest uppercase hover:underline">
                                    PELAJARI RESOURCE <ArrowUpRight className="w-3 h-3" />
                                 </button>
                              </div>

                              <div className="space-y-4">
                                 {weekData.tasks.map((task, tidx) => (
                                    <div 
                                      key={tidx}
                                      onClick={() => toggleTask(realIdx, tidx)}
                                      className={cn(
                                        "flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer",
                                        weekData.completed[tidx] 
                                          ? "bg-teal-light/30 border-teal/10 text-teal-dark" 
                                          : "bg-surface border-transparent hover:border-teal/30 hover:bg-white"
                                      )}
                                    >
                                       <div className={cn(
                                          "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                          weekData.completed[tidx] ? "bg-teal border-teal scale-110 shadow-lg shadow-teal/20" : "border-border bg-white"
                                       )}>
                                          {weekData.completed[tidx] && <CheckCircle2 className="w-4 h-4 text-white" />}
                                       </div>
                                       <span className={cn(
                                          "text-[15px] font-bold flex-1",
                                          weekData.completed[tidx] && "italic line-through opacity-70"
                                       )}>{task}</span>
                                    </div>
                                 ))}
                              </div>

                              {/* Motivational Quote or Hint */}
                              <div className="mt-10 pt-6 border-t border-[#F3F4F6] flex items-center gap-3">
                                 <Info className="w-4 h-4 text-text-faint" />
                                 <p className="text-xs text-text-faint italic font-medium">Tips: &quot;Poles bagian LinkedIn Summary kamu dengan setidaknya 3 keyword utama industri.&quot;</p>
                              </div>
                           </div>
                        </motion.div>
                     );
                  })}
               </motion.div>
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};
