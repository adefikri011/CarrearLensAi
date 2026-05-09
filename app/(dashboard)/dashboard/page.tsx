"use client";

import React from "react";
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
  Calendar,
  Layers,
  ArrowUpRight
} from "lucide-react";
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
  const userName = session?.user?.name?.split(' ')[0] || "User";

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
           <div className="flex items-center gap-2 text-teal font-bold text-[13px] uppercase tracking-[0.15em] mb-3">
              <Sparkles className="w-4 h-4" />
              Selamat Pagi, {userName}!
           </div>
           <h1 className="text-h2 text-[#030712]">Overviuw Karier</h1>
           <p className="text-text-secondary mt-2">Ini yang terjadi dengan perkembangan kariermu hari ini.</p>
        </div>
        
        <div className="flex items-center gap-6 p-1 bg-white rounded-2xl border border-[#F3F4F6] shadow-sm">
           <div className="flex flex-col items-end px-6 py-2">
              <span className="text-[10px] font-black text-text-faint tracking-widest uppercase">READINESS SCORE</span>
              <span className="text-2xl font-black text-[#030712]">84%</span>
           </div>
           <div className="w-12 h-12 mr-2 rounded-xl bg-teal flex items-center justify-center text-white shadow-lg shadow-teal/10">
              <TrendingUp className="w-6 h-6" />
           </div>
        </div>
      </motion.section>

      {/* --- Stats Grid --- */}
      <motion.section variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <FileText className="text-teal" />, label: "Analisis CV", val: "12", trend: "+2", bg: "bg-teal-light" },
          { icon: <Target className="text-purple" />, label: "Target Posisi", val: "3", trend: "0", bg: "bg-purple-light" },
          { icon: <Layers className="text-amber" />, label: "Progres Roadmap", val: "65%", trend: "+5%", bg: "bg-amber-light" },
          { icon: <Zap className="text-red-500" />, label: "Skill Baru", val: "8", trend: "+1", bg: "bg-red-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-[#F3F4F6] flex items-center gap-5 hover:border-teal/20 transition-all group">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500", stat.bg)}>
              {React.cloneElement(stat.icon as React.ReactElement, { className: "w-7 h-7" })}
            </div>
            <div>
              <p className="text-xs font-bold text-text-faint tracking-wider uppercase mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-2xl font-black text-[#030712]">{stat.val}</span>
                 <span className="text-[10px] font-black text-teal">{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </motion.section>

      {/* --- Main Content Area --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left: Active Mission & Quick Actions */}
        <div className="lg:col-span-2 space-y-10">
           {/* Active Mission Card */}
           <motion.div variants={fadeUp} className="bg-[#030712] rounded-[40px] p-10 text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="flex justify-between items-start mb-16">
                    <div className="space-y-3">
                       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-black tracking-widest uppercase">
                          MISI AKTIF • MINGGU KE-3
                       </div>
                       <h2 className="text-3xl font-bold max-w-sm">Optimalisasi Portofolio & LinkedIn</h2>
                       <p className="text-dark-muted max-w-xs text-sm">Persiapkan aset digitalmu agar siap dinilai oleh rekruter profesional.</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-teal flex items-center justify-center shadow-2xl shadow-teal/40">
                       <BrainCircuit className="w-7 h-7 text-white" />
                    </div>
                 </div>

                 <div className="space-y-4 mb-10">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                       <span className="text-dark-muted">Progres Keseluruhan</span>
                       <span className="text-teal">65% Selesai</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-teal rounded-full" 
                       />
                    </div>
                 </div>

                 <div className="flex flex-wrap gap-4">
                    <Link 
                      href="/roadmap"
                      className="bg-white text-[#030712] px-8 py-3.5 rounded-full text-sm font-bold hover:bg-teal hover:text-white transition-all flex items-center gap-2"
                    >
                      Lanjutkan Misi <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <Link 
                      href="/roadmap"
                      className="bg-white/5 text-white border border-white/10 px-8 py-3.5 rounded-full text-sm font-bold hover:bg-white/10 transition-all"
                    >
                      Lihat Detail Roadmap
                    </Link>
                 </div>
              </div>
              
              <div className="absolute top-0 right-0 w-80 h-80 bg-teal/10 blur-[100px] rounded-full translate-x-1/4 -translate-y-1/4" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple/10 blur-[80px] rounded-full -translate-x-1/4 translate-y-1/4" />
           </motion.div>

           {/* Quick Actions Grid */}
           <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { t: "Analisis CV", icon: <FileText className="text-teal" />, href: "/cv-builder", c: "teal" },
                { t: "Cari Lowongan", icon: <ExploreIcon className="text-purple" />, href: "/explore", c: "purple" },
                { t: "Tips & Trik", icon: <Sparkles className="text-amber" />, href: "/blog", c: "amber" },
              ].map((act, i) => (
                <Link key={i} href={act.href}>
                  <div className="bg-white p-6 rounded-[32px] border border-[#F3F4F6] text-center hover:border-teal/30 hover:shadow-xl hover:shadow-teal/5 transition-all group">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                      act.c === 'teal' ? "bg-teal-light" : act.c === 'purple' ? "bg-purple-light" : "bg-amber-light"
                    )}>
                      {React.cloneElement(act.icon as React.ReactElement, { className: "w-6 h-6" })}
                    </div>
                    <span className="text-sm font-bold text-[#030712]">{act.t}</span>
                  </div>
                </Link>
              ))}
           </motion.div>
        </div>

        {/* Right: Task List & Mentor Card */}
        <div className="space-y-10">
           {/* Task List */}
           <motion.div variants={fadeUp} className="bg-white p-8 rounded-[40px] border border-[#F3F4F6] shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[13px] font-black text-text-faint tracking-widest uppercase flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal" />
                    DAFTAR TUGAS
                 </h3>
                 <span className="text-[10px] font-bold text-teal bg-teal-light px-2 py-0.5 rounded-md">2 LAGI</span>
              </div>

              <div className="space-y-5">
                 {[
                    { t: "Update Headline LinkedIn", d: true },
                    { t: "Ekstrak CV Baru", d: true },
                    { t: "Simulasi Interview AI", d: false },
                    { t: "Pilih 3 Minat Industri", d: false },
                 ].map((task, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer">
                       <div className={cn(
                          "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                          task.d ? "bg-teal border-teal" : "border-[#E5E7EB] group-hover:border-teal"
                       )}>
                          {task.d && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                       </div>
                       <span className={cn(
                          "text-[15px] font-medium transition-all",
                          task.d ? "text-text-faint line-through" : "text-[#030712]"
                       )}>{task.t}</span>
                    </div>
                 ))}
              </div>

              <button className="w-full mt-10 p-4 border border-[#F3F4F6] rounded-2xl text-xs font-bold text-text-faint hover:bg-surface hover:text-[#030712] transition-all">
                LIHAT SEMUA TUGAS
              </button>
           </motion.div>

           {/* Upgrade / Mentor Card */}
           <motion.div variants={fadeUp} className="bg-gradient-to-br from-purple to-[#8E87EB] p-8 rounded-[40px] text-white shadow-2xl shadow-purple/20 relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8">
                    <Target className="w-7 h-7 text-white" />
                 </div>
                 <h3 className="text-2xl font-bold leading-tight mb-3">Konsultasi Khusus dengan AI Mentor</h3>
                 <p className="text-white/70 text-sm leading-relaxed mb-8">Dapatkan feedback mendalam secara real-time untuk setiap keraguan kariermu.</p>
                 <button className="w-full py-4 bg-white text-purple text-sm font-bold rounded-2xl shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all">
                    Jadwalkan Sekarang
                 </button>
              </div>
              
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full transition-transform group-hover:scale-150 duration-700" />
           </motion.div>
        </div>

      </div>
    </motion.div>
  );
}

const ExploreIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);
