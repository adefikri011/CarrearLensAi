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
          { icon: <Target className="text-teal" />, label: "Target Posisi", val: tasks.careerSelected ? "1" : "0", desc: "Posisi utama", bg: "bg-teal-light/30" },
          { icon: <CheckCircle2 className="text-black" />, label: "Data Profil", val: `${profileCompleteness}%`, desc: "Kelengkapan data", bg: "bg-gray-50" },
          { icon: <Zap className="text-teal" />, label: "Skill Match", val: skillMatch > 0 ? `${skillMatch}%` : "-", desc: "Kecocokan industri", bg: "bg-teal-light/30" },
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
           {!tasks.cvUploaded ? (
             <motion.div variants={fadeUp} className="bg-white border border-gray-100 rounded-[40px] p-12 text-center flex flex-col items-center space-y-6 shadow-sm">
                <div className="w-16 h-16 rounded-[24px] bg-gray-50 flex items-center justify-center text-gray-300">
                   <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                   <h2 className="text-2xl font-black text-black italic">Upload CV Pertama Kamu</h2>
                   <p className="text-gray-500 max-w-sm mx-auto">Mulai perjalanan kariermu dengan mengunggah CV untuk dianalisis oleh AI kami.</p>
                </div>
                <Link href="/cv-builder">
                   <Button className="bg-black text-white hover:bg-teal rounded-full px-10 h-14 font-black text-[12px] uppercase tracking-widest transition-all">
                      UPLOAD CV SEKARANG <ArrowUpRight className="ml-2 w-5 h-5" />
                   </Button>
                </Link>
             </motion.div>
           ) : !tasks.analysisComplete ? (
             <motion.div variants={fadeUp} className="bg-white border-2 border-teal/20 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-teal/5">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 rounded-[28px] bg-teal flex items-center justify-center text-white shadow-lg shadow-teal/20">
                      <CheckCircle2 className="w-10 h-10" />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-2xl font-black text-black italic">CV Berhasil Diupload</h3>
                      <p className="text-gray-500 font-medium">{cvData.filename} • {new Date(cvData.createdAt).toLocaleDateString('id-ID')}</p>
                   </div>
                </div>
                <Link href="/cv-builder">
                   <Button className="bg-black text-white hover:bg-teal h-16 px-10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group">
                      Analisis CV Sekarang <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </Button>
                </Link>
             </motion.div>
           ) : (
             <motion.div variants={fadeUp} className="bg-black rounded-[40px] p-10 text-white relative overflow-hidden group">
                <div className="relative z-10">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                      <div className="space-y-1">
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[9px] font-black tracking-widest uppercase text-teal">
                            ANALISIS TERFAVORIT
                         </div>
                         <h2 className="text-3xl font-black italic">Kesiapan Kerja: {readinessScore}%</h2>
                         <p className="text-gray-400 text-sm">Berdasarkan data terbaru dari CV kamu.</p>
                      </div>
                      <div className="flex -space-x-4">
                         {(latestAnalysis?.result?.careerPaths || []).slice(0, 3).map((path: any, i: number) => (
                           <div key={i} className="w-12 h-12 rounded-full border-4 border-black bg-teal flex items-center justify-center text-[10px] font-black shadow-xl" title={path.nama}>
                              {path.matchScore}%
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                      {(latestAnalysis?.result?.careerPaths || []).slice(0, 3).map((path: any, i: number) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                           <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">JALUR {i+1}</p>
                           <p className="text-sm font-bold truncate">{path.nama}</p>
                        </div>
                      ))}
                   </div>

                   <div className="flex flex-wrap gap-4">
                      <Link 
                        href="/analysis"
                        className="bg-white text-black px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal hover:text-white transition-all flex items-center gap-2"
                      >
                        Lihat Hasil Lengkap <ArrowUpRight className="w-4 h-4" />
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
                    { t: "Lengkapi data sekolah", d: tasks.profileComplete },
                    { t: "Upload CV Terbaru", d: tasks.cvUploaded },
                    { t: "Lihat hasil analisis", d: tasks.analysisComplete },
                    { t: "Pilih target karier", d: tasks.careerSelected },
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
