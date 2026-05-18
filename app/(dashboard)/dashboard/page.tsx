"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
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
      className="space-y-12"
    >
      {/* --- Greeting Section --- */}
      <motion.section variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-1">
           <div className="flex items-center gap-2 text-teal font-black text-[10px] md:text-[12px] uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              Halo, {userName}!
           </div>
           <h1 className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tight uppercase italic leading-none transition-colors">Dashboard</h1>
           <p className="text-gray-500 dark:text-zinc-500 text-xs md:text-sm font-medium transition-colors">Pantau progres kariermu di sini.</p>
        </div>
        
        <div className="flex items-center justify-between md:justify-end gap-6 p-1.5 bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm md:min-w-[260px] transition-all">
           <div className="flex flex-col items-start md:items-end px-4 md:px-8">
              <span className="text-[8px] md:text-[10px] font-black text-gray-400 dark:text-zinc-500 tracking-widest uppercase">READINESS SCORE</span>
              <span className="text-xl md:text-3xl font-black text-black dark:text-white transition-colors">{readinessScore}%</span>
           </div>
           <div className={cn(
             "w-12 h-12 md:w-16 md:h-16 mr-1.5 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl transition-all",
             readinessScore > 75 
               ? "bg-teal shadow-teal/20" 
               : "bg-black dark:bg-white dark:text-black shadow-black/10 dark:shadow-white/5"
           )}>
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />
           </div>
        </div>
      </motion.section>

      {/* --- Stats Grid --- */}
      <motion.section variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { icon: <FileText />, label: "Analisis CV", val: analysisCount.toString(), desc: "Dokumen", c: "zinc" },
          { icon: <Target />, label: "Posisi", val: tasks.careerSelected ? "1" : "0", desc: "Target", c: "teal" },
          { icon: <CheckCircle2 />, label: "Data Profil", val: `${profileCompleteness}%`, desc: "Kelengkapan", c: "zinc" },
          { icon: <Zap />, label: "Skill Match", val: skillMatch > 0 ? `${skillMatch}%` : "-", desc: "Kecocokan", c: "teal" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-4 md:p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 md:gap-4 hover:border-teal/30 dark:hover:border-teal/40 transition-all group shadow-sm hover:shadow-xl hover:shadow-teal/5">
            <div className={cn(
              "w-11 h-11 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500",
              stat.c === "teal" 
                ? "bg-teal text-white shadow-lg shadow-teal/20" 
                : "bg-gray-50 dark:bg-zinc-800 text-black dark:text-white"
            )}>
              {React.cloneElement(stat.icon as React.ReactElement, { className: "w-5 h-5 md:w-6 md:h-6" })}
            </div>
            <div className="min-w-0">
              <p className="text-[8px] md:text-[10px] font-black text-gray-400 dark:text-zinc-500 tracking-wider uppercase mb-0.5">{stat.label}</p>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                 <span className="text-lg md:text-xl font-black text-black dark:text-white transition-colors">{stat.val}</span>
                 <span className="text-[8px] md:text-[9px] font-bold text-gray-300 dark:text-zinc-700 uppercase truncate transition-colors">{stat.desc}</span>
              </div>
            </div>
          </div>
        ))}
      </motion.section>

      {/* --- Main Content Area --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Active Mission or Empty State */}
        <div className="lg:col-span-2 space-y-8">
           {!tasks.cvUploaded ? (
             <motion.div variants={fadeUp} className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/40 rounded-[32px] md:rounded-[40px] p-8 md:p-12 text-center flex flex-col items-center space-y-6 shadow-sm transition-all group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-[20px] md:rounded-[24px] bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-center text-gray-300 dark:text-zinc-600 relative z-10 transition-colors group-hover:bg-teal/10 group-hover:text-teal">
                   <AlertCircle className="w-7 h-7 md:w-8 md:h-8" />
                </div>
                <div className="space-y-2 relative z-10">
                   <h2 className="text-xl md:text-2xl font-black text-black dark:text-white italic transition-colors">Upload CV Pertama Kamu</h2>
                   <p className="text-gray-500 dark:text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed transition-colors">Mulai perjalanan kariermu dengan mengunggah CV untuk dianalisis oleh AI kami.</p>
                </div>
                <Link href="/cv-builder" className="w-full sm:w-auto relative z-10">
                   <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-teal dark:hover:bg-teal dark:hover:text-white rounded-full px-8 md:px-10 h-12 md:h-14 font-black text-[11px] md:text-[12px] uppercase tracking-widest transition-all">
                      UPLOAD CV SEKARANG <ArrowUpRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                   </Button>
                </Link>
             </motion.div>
           ) : !tasks.analysisComplete ? (
             <motion.div variants={fadeUp} className="bg-white dark:bg-zinc-900/50 border-2 border-teal/20 dark:border-teal/30 rounded-[32px] md:rounded-[40px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-teal/5 transition-all">
                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-6">
                   <div className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] md:rounded-[28px] bg-teal flex items-center justify-center text-white shadow-lg shadow-teal/20 transition-transform hover:scale-105">
                      <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10" />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-xl md:text-2xl font-black text-black dark:text-white italic leading-tight transition-colors">CV Berhasil Diupload</h3>
                      <p className="text-gray-500 dark:text-zinc-400 text-xs md:text-sm font-medium transition-colors">{cvData.filename} • {new Date(cvData.createdAt).toLocaleDateString('id-ID')}</p>
                   </div>
                </div>
                <Link href="/cv-builder" className="w-full md:w-auto">
                   <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-teal dark:hover:bg-teal dark:hover:text-white h-14 md:h-16 px-8 md:px-10 rounded-2xl font-black text-[11px] md:text-xs uppercase tracking-widest transition-all group">
                      Analisis CV Sekarang <ArrowUpRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </Button>
                </Link>
             </motion.div>
           ) : (
             <motion.div variants={fadeUp} className="bg-black dark:bg-zinc-900 rounded-[32px] md:rounded-[40px] p-8 md:p-10 text-white relative overflow-hidden group shadow-2xl shadow-black/10 transition-all border border-transparent dark:border-zinc-800">
                <div className="relative z-10">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-12 gap-6">
                      <div className="space-y-2">
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[8px] md:text-[9px] font-black tracking-widest uppercase text-teal">
                            ANALISIS TERFAVORIT
                         </div>
                         <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter transition-colors">Kesiapan: {readinessScore}%</h2>
                         <p className="text-gray-400 dark:text-zinc-400 text-[10px] md:text-sm font-medium transition-colors">Berdasarkan data terbaru dari CV kamu.</p>
                      </div>
                      <div className="hidden sm:flex -space-x-4">
                         {(latestAnalysis?.result?.careerPaths || []).slice(0, 3).map((path: any, i: number) => (
                           <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-black dark:border-zinc-800 bg-teal flex items-center justify-center text-[9px] md:text-[10px] font-black shadow-xl" title={path.nama}>
                              {path.matchScore}%
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
                      {(latestAnalysis?.result?.careerPaths || []).slice(0, 3).map((path: any, i: number) => (
                         <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl md:rounded-2xl flex md:flex-col justify-between items-center md:items-start gap-4">
                            <p className="text-[8px] font-black text-gray-500 dark:text-zinc-600 uppercase tracking-widest md:mb-1 transition-colors">JALUR {i+1}</p>
                            <p className="text-[11px] md:text-sm font-bold truncate flex-1 transition-colors">{path.nama}</p>
                         </div>
                      ))}
                   </div>

                   <div className="flex">
                      <Link 
                        href="/analysis"
                        className="w-full sm:w-auto bg-white dark:bg-white text-black px-8 md:px-10 py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-teal hover:text-white dark:hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        Lihat Hasil Lengkap <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </Link>
                   </div>
                </div>
                
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal/10 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4" />
             </motion.div>
           )}

           {/* Quick Actions Grid */}
           <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                { t: "Analisis", icon: <FileText />, href: "/cv-builder", c: "teal" },
                { t: "Hasil", icon: <Sparkles />, href: "/analysis", c: "black" },
                { t: "Profil", icon: <CheckCircle2 />, href: "/profile", c: "teal" },
              ].map((act, i) => (
                <Link key={i} href={act.href}>
                  <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 text-center hover:border-teal/30 dark:hover:border-teal/50 hover:shadow-xl hover:shadow-teal/5 transition-all group shadow-sm flex flex-col items-center justify-center gap-2 md:gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                      act.c === 'teal' ? "bg-teal/10 text-teal" : "bg-gray-50 dark:bg-zinc-800 text-black dark:text-white"
                    )}>
                      {React.cloneElement(act.icon as React.ReactElement, { className: "w-5 h-5" })}
                    </div>
                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-black dark:text-white transition-colors">{act.t}</span>
                  </div>
                </Link>
              ))}
           </motion.div>
        </div>

        {/* Right: Task List */}
        <div className="space-y-6 md:space-y-8">
           <motion.div variants={fadeUp} className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-gray-100 dark:border-zinc-800/50 shadow-sm transition-all">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                 <h3 className="text-[10px] md:text-[11px] font-black text-gray-400 dark:text-zinc-500 tracking-widest uppercase flex items-center gap-2 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-teal" />
                    DAFTAR TUGAS
                 </h3>
                 <span className="text-[8px] md:text-[9px] font-black text-teal bg-teal/10 px-2 py-0.5 rounded-md uppercase">Wajib</span>
              </div>

              <div className="space-y-4">
                 {[
                    { t: "Lengkapi data sekolah", d: tasks.profileComplete },
                    { t: "Upload CV Terbaru", d: tasks.cvUploaded },
                    { t: "Lihat hasil analisis", d: tasks.analysisComplete },
                    { t: "Pilih target karier", d: tasks.careerSelected },
                 ].map((task, i) => (
                    <div key={i} className="flex items-center gap-3 group cursor-pointer">
                       <div className={cn(
                          "w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0",
                          task.d ? "bg-teal border-teal" : "border-gray-200 dark:border-zinc-800 group-hover:border-teal"
                       )}>
                          {task.d && <CheckCircle2 className="w-3 h-3 text-white" />}
                       </div>
                       <span className={cn(
                          "text-xs md:text-sm font-bold transition-all truncate",
                          task.d ? "text-gray-300 dark:text-zinc-700 line-through" : "text-black dark:text-white"
                       )}>{task.t}</span>
                    </div>
                 ))}
              </div>

              <button className="w-full mt-8 md:mt-10 p-4 bg-gray-50 dark:bg-zinc-800/40 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded-2xl text-[9px] md:text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest transition-all">
                LIHAT SEMUA TUGAS
              </button>
           </motion.div>

           {/* AI Insight Card */}
           <motion.div variants={fadeUp} className="bg-teal p-8 rounded-[32px] md:rounded-[40px] text-white shadow-2xl shadow-teal/20 relative overflow-hidden group transition-all">
              <div className="relative z-10">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                 </div>
                 <h3 className="text-xl font-black italic leading-tight mb-3">Saran AI Hari Ini</h3>
                 <p className="text-white/80 text-[11px] md:text-xs leading-relaxed mb-8">Berdasarkan profil kamu, posisi <span className="font-bold text-white underline italic">UI/UX Designer</span> sangat cocok dengan kreativitasmu.</p>
                 <Link href="/analysis">
                    <button className="w-full py-4 bg-black dark:bg-zinc-950 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-900 transition-all shadow-lg active:scale-95">
                       PELAJARI JALUR INI
                    </button>
                 </Link>
              </div>
           </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
