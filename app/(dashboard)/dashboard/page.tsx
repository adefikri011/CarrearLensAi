"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  BrainCircuit, 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  FileText,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import PageLoader from "@/components/shared/PageLoader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } }
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [cvData, setCvData] = useState<any>(null);
  const [latestAnalysis, setLatestAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState({
    profileComplete: false,
    cvUploaded: false,
    analysisComplete: false,
    careerSelected: false
  });
  
  const userName = session?.user?.name?.split(' ')[0] || "User";

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [profileRes, cvRes, analysisRes, statsRes] = await Promise.all([
        fetch('/api/profile').then(r => r.json()),
        fetch('/api/upload/history').then(r => r.json()),
        fetch('/api/analyze/latest').then(r => r.json()),
        fetch('/api/dashboard/stats').then(r => r.json()),
      ]);

      setProfileData(profileRes.data);
      setCvData(cvRes.cv);
      setLatestAnalysis(analysisRes.data);
      setStats(statsRes.data);

      setTasks({
        profileComplete: !!profileRes.data?.id,
        cvUploaded: !!cvRes.cv,
        analysisComplete: !!analysisRes.data,
        careerSelected: !!analysisRes.data?.selectedPath
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLoader isLoading={true} text="Memuat Dashboard..." />
    );
  }

  const readinessScore = latestAnalysis?.overallReadiness || 0;
  const analysisCount = stats?.analysisCount || 0;
  const profileCompleteness = stats?.profileCompleteness || 0;
  const skillMatch = latestAnalysis?.result?.careerPaths?.[0]?.matchScore || 0;

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={stagger}
      className="space-y-10"
    >
      {/* --- Greeting Section --- */}
      <motion.section variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5 text-left">
           <div className="flex items-center gap-2 text-[#1D9E75] font-black text-xs uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Selamat Datang Kembali, {userName}!
           </div>
           <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight uppercase italic leading-none transition-colors">
             Dashboard
           </h1>
           <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-semibold transition-colors">
             Pantau dan kelola akselerasi karier mu di sini.
           </p>
        </div>
        
        {/* Dynamic score box widget */}
        <div className="flex items-center justify-between md:justify-end gap-6 p-2 bg-white dark:bg-[#111111] rounded-[2rem] border border-zinc-200 dark:border-zinc-800/80 shadow-sm md:min-w-[280px] transition-all hover:border-[#1D9E75]/30">
           <div className="flex flex-col items-start md:items-end px-4 leading-normal">
              <span className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest uppercase block">READINESS SCORE</span>
              <span className="text-2xl md:text-3xl font-black font-mono text-zinc-900 dark:text-white transition-colors">{readinessScore}%</span>
           </div>
           <div className={cn(
             "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all mr-1",
             readinessScore > 75 
               ? "bg-[#1D9E75] shadow-[#1D9E75]/15" 
               : "bg-zinc-900 dark:bg-white dark:text-black shadow-zinc-900/10"
           )}>
              <TrendingUp className="w-5.5 h-5.5" />
           </div>
        </div>
      </motion.section>

      {/* --- Stats Cards Grid --- */}
      <motion.section variants={fadeUp}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { 
              icon: <FileText />, 
              label: "Analisis CV", 
              val: analysisCount.toString(), 
              desc: "Dokumen", 
              color: "text-zinc-800 dark:text-white",
              bg: "bg-zinc-100 dark:bg-zinc-800/60",
              border: "border-zinc-200 dark:border-zinc-800/80"
            },
            { 
              icon: <Target />, 
              label: "Posisi", 
              val: tasks.careerSelected ? "1" : "0", 
              desc: "Target", 
              color: "text-[#1D9E75]",
              bg: "bg-[#1D9E75]/10 dark:bg-[#1D9E75]/20",
              border: "border-[#1D9E75]/20 dark:border-[#1D9E75]/30"
            },
            { 
              icon: <CheckCircle2 />, 
              label: "Data Profil", 
              val: `${profileCompleteness}%`, 
              desc: "Kelengkapan", 
              color: "text-zinc-800 dark:text-white",
              bg: "bg-zinc-100 dark:bg-zinc-800/60",
              border: "border-zinc-200 dark:border-zinc-800/80"
            },
            { 
              icon: <Zap />, 
              label: "Skill Match", 
              val: skillMatch > 0 ? `${skillMatch}%` : "-", 
              desc: "Kecocokan", 
              color: "text-[#1D9E75]",
              bg: "bg-[#1D9E75]/10 dark:bg-[#1D9E75]/20",
              border: "border-[#1D9E75]/20 dark:border-[#1D9E75]/30"
            },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -3 }}
              className={cn(
                "p-5 md:p-6 rounded-[28px] border transition-all duration-350 group relative overflow-hidden",
                "bg-white dark:bg-[#111111]",
                stat.border,
                "hover:shadow-lg hover:shadow-[#1D9E75]/5"
              )}
            >
              <div className="relative z-10 flex flex-col gap-4 text-left">
                <div className={cn(
                  "w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                  stat.bg,
                  stat.color
                )}>
                  {React.cloneElement(stat.icon as React.ReactElement, { className: "w-5.5 h-5.5" })}
                </div>
                <div>
                  <p className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest uppercase block mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-1.5 leading-none">
                     <span className="text-2xl md:text-3xl font-black font-mono text-zinc-900 dark:text-white italic transition-colors">{stat.val}</span>
                     <span className="text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{stat.desc}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* --- Main Content Split Layout --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left main area columns */}
        <div className="lg:col-span-2 space-y-8 text-left">
           {!tasks.cvUploaded ? (
             <motion.div variants={fadeUp} className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800/80 rounded-[32px] p-8 md:p-12 text-center flex flex-col items-center space-y-6 shadow-sm transition-all group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1D9E75]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none" />
                
                <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-400 group-hover:bg-[#1D9E75]/10 group-hover:text-[#1D9E75] transition-all">
                   <AlertCircle className="w-7 h-7" />
                </div>
                
                <div className="space-y-2">
                   <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase italic">Upload CV Pertama Kamu</h2>
                   <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">Masa depan kariermu dimulai di sini. Unggah resume CV (PDF) untuk dianalisis oleh Gemini AI model teratas kami.</p>
                </div>
                
                <Link href="/cv-builder" className="w-full sm:w-auto relative z-10 block">
                   <Button className="w-full bg-[#1D9E75] hover:bg-[#15825f] text-white rounded-full px-8 h-12 font-black text-xs uppercase tracking-widest transition-transform duration-250 hover:scale-102 active:scale-95">
                      UPLOAD CV SEKARANG <ArrowUpRight className="ml-1.5 w-4 h-4" />
                   </Button>
                </Link>
             </motion.div>
           ) : !tasks.analysisComplete ? (
             <motion.div variants={fadeUp} className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800/80 rounded-[32px] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md shadow-[#1D9E75]/5">
                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-[#1D9E75] flex items-center justify-center text-white shadow-lg shadow-[#1D9E75]/15">
                      <CheckCircle2 className="w-7 h-7" />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase italic">CV Berhasil Diupload</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-xs font-mono font-semibold">{cvData.filename} • {new Date(cvData.createdAt).toLocaleDateString('id-ID')}</p>
                   </div>
                </div>
                <Link href="/cv-builder" className="w-full md:w-auto block">
                   <Button className="w-full bg-[#1D9E75] hover:bg-[#15825f] text-white h-12 px-6 rounded-full font-black text-[11px] uppercase tracking-widest transition-all">
                      Analisis CV Sekarang <ArrowUpRight className="ml-1.5 w-4 h-4" />
                   </Button>
                </Link>
             </motion.div>
           ) : (
             <motion.div variants={fadeUp} className="bg-[#111111] dark:bg-[#111111] text-white border border-zinc-900 dark:border-[#1F1F1F] rounded-[32px] p-8 md:p-10 relative overflow-hidden group shadow-2xl transition-all">
                {/* Visual mesh gradient top corner decorative overlay */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#1D9E75]/10 blur-[130px] rounded-full translate-x-1/4 -translate-y-1/4 select-none pointer-events-none" />

                <div className="relative z-10">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                      <div className="space-y-2">
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-black tracking-widest uppercase text-emerald-400">
                            ANALISIS TERBARU
                         </div>
                         <h2 className="text-2xl md:text-3xl font-extrabold italic tracking-tight text-white leading-tight uppercase font-sans">
                            Kesiapan Kerja: <span className="text-emerald-400 font-black font-mono">{readinessScore}%</span>
                          </h2>
                         <p className="text-zinc-400 text-xs font-medium font-mono uppercase tracking-wide">Berdasarkan draf asisten AI untuk CV kamu.</p>
                      </div>
                      
                      <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm self-center">
                         <span className="text-[9px] font-mono font-black uppercase tracking-wider text-zinc-400">Match:</span>
                         <div className="flex -space-x-2.5">
                            {(latestAnalysis?.result?.careerPaths || []).slice(0, 3).map((path: any, i: number) => (
                              <div 
                                key={i} 
                                className="w-7 h-7 rounded-full border-2 border-zinc-900 bg-gradient-to-br from-[#1D9E75] to-[#127b5b] flex items-center justify-center text-[8px] font-extrabold text-white shadow-md select-none transition-transform hover:scale-110 cursor-help" 
                                title={`${path.nama}: ${path.matchScore}%`}
                              >
                                 {path.matchScore}%
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {(latestAnalysis?.result?.careerPaths || []).slice(0, 3).map((path: any, i: number) => (
                         <div 
                           key={i} 
                           className="bg-zinc-950/80 hover:bg-zinc-900/40 border border-zinc-800 hover:border-[#1D9E75]/45 p-5 md:p-6 rounded-2xl flex flex-col justify-between items-start gap-4 transition-all duration-300 group/card cursor-pointer hover:-translate-y-0.5"
                         >
                            <div className="flex items-center justify-between w-full">
                               <span className="text-[9px] font-mono font-black text-zinc-400 uppercase tracking-wider">
                                  LINTASAN 0{i + 1}
                               </span>
                               <span className="text-[9px] font-mono font-black py-0.5 px-2 rounded-md bg-[#1D9E75]/10 text-[#1D9E75] uppercase tracking-wider">
                                  {path.matchScore}% Match
                               </span>
                            </div>
                            <p className="text-[13px] font-bold leading-snug text-zinc-200 group-hover/card:text-white transition-colors line-clamp-2">
                               {path.nama}
                            </p>
                         </div>
                      ))}
                   </div>

                   <div className="flex">
                      <Link 
                        href="/analysis"
                        className="w-full sm:w-auto bg-white hover:bg-emerald-500 hover:text-white text-[#0A0A0A] px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-transform hover:scale-102 flex items-center justify-center gap-1 shadow-lg active:scale-95 group/btn"
                      >
                        Lihat Hasil Lengkap <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </Link>
                   </div>
                </div>
             </motion.div>
           )}

           {/* Quick Actions Grid */}
           <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { t: "Analisis", icon: <FileText />, href: "/cv-builder", c: "teal" },
                { t: "Hasil", icon: <Sparkles />, href: "/analysis", c: "zinc" },
                { t: "Interview", icon: <Zap />, href: "/interview", c: "teal" },
                { t: "Profil", icon: <CheckCircle2 />, href: "/profile", c: "zinc" },
              ].map((act, i) => (
                <Link key={i} href={act.href} className="block">
                  <div className="bg-white dark:bg-[#111111] p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 text-center hover:border-[#1D9E75]/45 hover:shadow-lg hover:shadow-[#1D9E75]/5 transition-all group flex flex-col items-center justify-center gap-2.5">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                      act.c === 'teal' ? "bg-emerald-50 dark:bg-emerald-950/20 text-[#1D9E75]" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-white"
                    )}>
                      {React.cloneElement(act.icon as React.ReactElement, { className: "w-5 h-5" })}
                    </div>
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-808 dark:text-white truncate">{act.t}</span>
                  </div>
                </Link>
              ))}
           </motion.div>
        </div>

        {/* Right column elements (Tasks, AI Daily advice) */}
        <div className="space-y-6 sm:space-y-8 text-left">
           
           {/* Agenda/Task List Block */}
           <motion.div variants={fadeUp} className="bg-white dark:bg-[#111111] p-6 sm:p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-[10px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest uppercase flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1D9E75]" />
                    Misi Aktif Kamu
                 </h3>
                 <span className="text-[8px] font-mono font-black text-[#1D9E75] bg-[#1D9E75]/10 dark:bg-[#1D9E75]/20 px-2.5 py-0.5 rounded uppercase font-sans">SMK TARGET</span>
              </div>

              <div className="space-y-3.5">
                 {[
                    { t: "Lengkapi data sekolah", d: tasks.profileComplete },
                    { t: "Upload CV Terbaru", d: tasks.cvUploaded },
                    { t: "Lihat hasil analisis", d: tasks.analysisComplete },
                    { t: "Pilih target karier", d: tasks.careerSelected },
                 ].map((task, i) => (
                    <div key={i} className="flex items-center gap-2.5 group">
                       <div className={cn(
                          "w-[18px] h-[18px] rounded-md border flex items-center justify-center transition-all shrink-0",
                          task.d ? "bg-[#1D9E75] border-[#1D9E75]" : "border-zinc-250 dark:border-zinc-700"
                       )}>
                          {task.d && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                       </div>
                       <span className={cn(
                          "text-xs font-bold truncate tracking-tight transition-colors",
                          task.d ? "text-zinc-400 dark:text-zinc-650 line-through" : "text-zinc-800 dark:text-zinc-200"
                       )}>{task.t}</span>
                    </div>
                 ))}
              </div>

              <button className="w-full mt-8 p-3.5 bg-zinc-50 dark:bg-zinc-800/40 hover:bg-[#1D9E75] dark:hover:bg-[#1D9E75] hover:text-white dark:hover:text-black rounded-xl text-[9px] font-mono font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest transition-colors">
                LIHAT DETAIL TUGAS
              </button>
           </motion.div>

           {/* AI Insight Advisory dynamic card */}
           <motion.div variants={fadeUp} className="bg-gradient-to-tr from-[#1D9E75] to-[#534AB7] p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none" />
              
              <div className="relative z-10 text-left">
                 <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
                    <TrendingUp className="w-5 h-5 text-white" />
                 </div>
                 <h3 className="text-xl font-black italic uppercase leading-none mb-2">Rekomendasi Hari Ini</h3>
                 <p className="text-white/80 text-[11px] sm:text-xs leading-relaxed mb-6 font-sans">
                   Berdasarkan analisis portofolio, kompetensi <span className="font-bold underline italic text-white">Fullstack TS</span> sangat diminati bursa industri minggu ini. Tingkatkan roadmap sekarang!
                 </p>
                 <Link href="/analysis" className="block">
                    <button className="w-full py-3.5 bg-black/40 hover:bg-black/60 border border-white/10 text-white text-[9px] font-mono font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg">
                       PELAJARI SEKARANG
                    </button>
                 </Link>
              </div>
           </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
