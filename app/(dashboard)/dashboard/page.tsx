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
  const [loading, setLoading] = useState(true);
  
  const userName = session?.user?.name?.split(' ')[0] || "User";

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      const result = await res.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLoader isLoading={true} text="Memuat Dashboard..." />
    );
  }

  const readinessScore = stats?.latestAnalysis?.overallReadiness || 0;
  const analysisCount = stats?.analysisCount || 0;
  const profileCompleteness = stats?.profileCompleteness || 0;

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={stagger}
      className="space-y-12"
    >
      {/* --- Greeting Section --- */}
      <motion.section variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-2 text-teal font-bold text-[12px] uppercase tracking-[0.1em] mb-4">
              <Sparkles className="w-4 h-4" />
              Selamat Datang, {userName}!
           </div>
           <h1 className="text-3xl font-black text-black">Dashboard Overview</h1>
           <p className="text-gray-500 mt-2">Ini perkembangan kariermu berdasarkan data terbaru.</p>
        </div>
        
        <div className="flex items-center gap-6 p-1 bg-white rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex flex-col items-end px-6 py-2">
              <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">READINESS SCORE</span>
              <span className="text-2xl font-black text-black">{readinessScore}%</span>
           </div>
           <div className={cn(
             "w-12 h-12 mr-2 rounded-xl flex items-center justify-center text-white shadow-lg transition-all",
             readinessScore > 75 ? "bg-teal shadow-teal/10" : "bg-black shadow-black/10"
           )}>
              <TrendingUp className="w-6 h-6" />
           </div>
        </div>
      </motion.section>

      {/* --- Stats Grid --- */}
      <motion.section variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <FileText className="text-black" />, label: "Analisis CV", val: analysisCount.toString(), desc: "Total dokumen", bg: "bg-gray-50" },
          { icon: <Target className="text-teal" />, label: "Target Posisi", val: "1", desc: "Posisi utama", bg: "bg-teal-light/30" },
          { icon: <CheckCircle2 className="text-black" />, label: "Data Profil", val: `${profileCompleteness}%`, desc: "Kelengkapan data", bg: "bg-gray-50" },
          { icon: <Zap className="text-teal" />, label: "Skill Match", val: analysisCount > 0 ? "Bagus" : "-", desc: "Kecocokan industri", bg: "bg-teal-light/30" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 hover:border-black/5 transition-all group shadow-sm">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-500", stat.bg)}>
              {React.cloneElement(stat.icon as React.ReactElement, { className: "w-6 h-6" })}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 tracking-wider uppercase mb-0.5">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-xl font-black text-black">{stat.val}</span>
                 <span className="text-[9px] font-bold text-gray-300 uppercase">{stat.desc}</span>
              </div>
            </div>
          </div>
        ))}
      </motion.section>

      {/* --- Main Content Area --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Active Mission or Empty State */}
        <div className="lg:col-span-2 space-y-8">
           {analysisCount === 0 ? (
             <motion.div variants={fadeUp} className="bg-white border border-gray-100 rounded-[40px] p-12 text-center flex flex-col items-center space-y-6 shadow-sm">
                <div className="w-16 h-16 rounded-[24px] bg-gray-50 flex items-center justify-center text-gray-300">
                   <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                   <h2 className="text-2xl font-black text-black italic">Mulai Perjalanan Kariermu</h2>
                   <p className="text-gray-500 max-w-sm mx-auto">Upload CV kamu sekarang untuk melihat potensi karier dan roadmap aksi 90 hari.</p>
                </div>
                <Link href="/cv-builder">
                   <Button className="bg-black text-white hover:bg-teal rounded-full px-10 h-14 font-black text-[12px] uppercase tracking-widest transition-all">
                      UPLOAD CV PERTAMA <ArrowUpRight className="ml-2 w-5 h-5" />
                   </Button>
                </Link>
             </motion.div>
           ) : (
             <motion.div variants={fadeUp} className="bg-black rounded-[40px] p-10 text-white relative overflow-hidden group">
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-16">
                      <div className="space-y-3">
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[9px] font-black tracking-widest uppercase">
                            MISI AKTIF • MINGGU KE-1
                         </div>
                         <h2 className="text-3xl font-black italic max-w-sm">Perkuat Portofolio Tech</h2>
                         <p className="text-gray-400 max-w-xs text-sm">Target minggu ini: Selesaikan analisis skill gap berdasarkan CV kamu.</p>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-teal flex items-center justify-center shadow-2xl shadow-teal/40">
                         <BrainCircuit className="w-7 h-7 text-white" />
                      </div>
                   </div>

                   <div className="space-y-4 mb-10">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span className="text-gray-500">Progres Misi</span>
                         <span className="text-teal">20% Selesai</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                         <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "20%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-teal rounded-full" 
                         />
                      </div>
                   </div>

                   <div className="flex flex-wrap gap-4">
                      <Link 
                        href="/analysis"
                        className="bg-white text-black px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-teal hover:text-white transition-all flex items-center gap-2"
                      >
                        Hasil Analisis <ArrowUpRight className="w-4 h-4" />
                      </Link>
                      <Link 
                        href="/profile"
                        className="bg-white/5 text-white border border-white/10 px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                      >
                        Update Profil
                      </Link>
                   </div>
                </div>
                
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal/5 blur-[100px] rounded-full translate-x-1/4 -translate-y-1/4" />
             </motion.div>
           )}

           {/* Quick Actions Grid */}
           <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { t: "Analisis CV", icon: <FileText />, href: "/cv-builder", c: "teal" },
                { t: "Hasil Karier", icon: <Sparkles />, href: "/analysis", c: "black" },
                { t: "Profil Saya", icon: <CheckCircle2 />, href: "/profile", c: "teal" },
              ].map((act, i) => (
                <Link key={i} href={act.href}>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center hover:border-teal/30 hover:shadow-xl hover:shadow-teal/5 transition-all group shadow-sm">
                    <div className={cn(
                      "w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-3 transition-transform group-hover:scale-110",
                      act.c === 'teal' ? "bg-teal-light text-teal" : "bg-gray-50 text-black"
                    )}>
                      {React.cloneElement(act.icon as React.ReactElement, { className: "w-5 h-5" })}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-black">{act.t}</span>
                  </div>
                </Link>
              ))}
           </motion.div>
        </div>

        {/* Right: Task List */}
        <div className="space-y-8">
           <motion.div variants={fadeUp} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[11px] font-black text-gray-400 tracking-widest uppercase flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal" />
                    DAFTAR TUGAS
                 </h3>
                 <span className="text-[9px] font-black text-teal bg-teal-light px-2 py-0.5 rounded-md uppercase">Wajib</span>
              </div>

              <div className="space-y-4">
                 {[
                    { t: "Lengkapi data sekolah", d: !!stats?.profileCompleteness && stats.profileCompleteness > 50 },
                    { t: "Upload CV Terbaru", d: analysisCount > 0 },
                    { t: "Lihat hasil analisis", d: analysisCount > 0 },
                    { t: "Pilih target karier", d: false },
                 ].map((task, i) => (
                    <div key={i} className="flex items-center gap-3 group cursor-pointer">
                       <div className={cn(
                          "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                          task.d ? "bg-teal border-teal" : "border-gray-200 group-hover:border-teal"
                       )}>
                          {task.d && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                       </div>
                       <span className={cn(
                          "text-sm font-bold transition-all",
                          task.d ? "text-gray-300 line-through" : "text-black"
                       )}>{task.t}</span>
                    </div>
                 ))}
              </div>

              <button className="w-full mt-10 p-4 bg-gray-50 hover:bg-black hover:text-white rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest transition-all">
                LIHAT SEMUA TUGAS
              </button>
           </motion.div>

           {/* AI Insight Card */}
           <motion.div variants={fadeUp} className="bg-teal p-8 rounded-[40px] text-white shadow-2xl shadow-teal/20 relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
                    <TrendingUp className="w-6 h-6 text-white" />
                 </div>
                 <h3 className="text-xl font-black italic leading-tight mb-3">Saran AI Hari Ini</h3>
                 <p className="text-white/80 text-xs leading-relaxed mb-8">Berdasarkan profil kamu, posisi <span className="font-bold text-white underline">UI/UX Designer</span> sangat cocok dengan kreativitasmu.</p>
                 <Link href="/analysis">
                    <button className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-900 transition-all">
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
