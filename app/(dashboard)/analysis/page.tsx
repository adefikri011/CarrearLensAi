"use client";

import React, { useState } from "react";
import { 
  motion, AnimatePresence 
} from "framer-motion";
import { 
  BrainCircuit, TrendingUp, Target, Briefcase, 
  ChevronRight, ArrowLeft, Bookmark, Sparkles,
  Layers, Zap, Info, BarChart3, PieChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';

const radarData = [
  { subject: 'Teknis', A: 120, fullMark: 150 },
  { subject: 'Komunikasi', A: 98, fullMark: 150 },
  { subject: 'Leadership', A: 86, fullMark: 150 },
  { subject: 'Kreativitas', A: 99, fullMark: 150 },
  { subject: 'Analitik', A: 85, fullMark: 150 },
  { subject: 'Adaptabilitas', A: 65, fullMark: 150 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
         <div className="space-y-4">
            <Link href="/cv-builder" className="inline-flex items-center gap-2 text-text-faint hover:text-text-primary transition-colors font-bold group mb-6">
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-text-primary transition-all">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                Kembali ke Analisis CV
            </Link>
            <div className="flex items-center gap-2 text-purple font-bold text-[13px] uppercase tracking-[0.15em]">
               <BrainCircuit className="w-4 h-4" />
               Deep Insight Analysis
            </div>
            <h1 className="text-h2 text-[#030712]">Hasil Analisis Karier</h1>
            <p className="text-lg text-text-secondary leading-relaxed max-w-xl">
               Berdasarkan kecerdasan buatan, inilah jalur karier paling potensial untuk masa depanmu.
            </p>
         </div>
         <div className="flex gap-4">
            <Button variant="outline" className="h-14 rounded-2xl px-10 border-[#F3F4F6] font-bold">
               Simpan Draft
            </Button>
            <Button className="h-14 rounded-2xl px-10 bg-teal hover:bg-teal-dark font-bold shadow-lg shadow-teal/10">
               Jadikan Bookmark <Bookmark className="w-4 h-4 ml-2" />
            </Button>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1.5 bg-surface-2 w-fit rounded-2xl border border-[#F3F4F6]">
         {["overview", "detail", "compare"].map((tab) => (
            <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={cn(
                  "px-8 py-3 rounded-xl text-sm font-bold transition-all uppercase tracking-widest",
                  activeTab === tab ? "bg-white text-[#030712] shadow-sm" : "text-text-faint hover:text-text-primary"
               )}
            >
               {tab === "overview" ? "Ringkasan" : tab === "detail" ? "Detail Jalur" : "Perbandingan"}
            </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
         {activeTab === "overview" && (
            <motion.div 
               key="overview"
               initial="hidden" animate="visible" variants={fadeUp}
               className="space-y-12"
            >
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Career Path Cards */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                     {[
                        { t: "Full-stack Developer", s: 94, d: "Cocok dengan skill technical dan minat teknologi kamu.", c: "teal" },
                        { t: "Technical Product Manager", s: 82, d: "Menggabungkan skill analitis dan pemahaman produk.", c: "purple" },
                        { t: "Cloud Architect", s: 71, d: "Potensi tinggi untuk pemahaman infrastruktur software.", c: "amber" },
                     ].map((path, i) => (
                        <div key={i} className={cn(
                           "p-8 rounded-[40px] border border-[#F3F4F6] bg-white transition-all hover:shadow-xl hover:scale-[1.02] group",
                           i === 0 && "md:col-span-2"
                        )}>
                           <div className="flex justify-between items-start mb-8">
                              <div className="space-y-2">
                                 <h3 className="text-2xl font-bold text-[#030712] group-hover:text-teal transition-colors">{path.t}</h3>
                                 <p className="text-text-secondary text-sm leading-relaxed max-w-xs">{path.d}</p>
                              </div>
                              <div className={cn(
                                 "w-20 h-20 rounded-3xl flex flex-col items-center justify-center shrink-0 border-4",
                                 path.c === 'teal' ? "bg-teal-light border-white text-teal" : 
                                 path.c === 'purple' ? "bg-purple-light border-white text-purple" : "bg-amber-light border-white text-amber"
                              )}>
                                 <span className="text-2xl font-black">{path.s}%</span>
                                 <span className="text-[10px] font-black uppercase tracking-tighter">MATCH</span>
                              </div>
                           </div>
                           <div className="flex items-center gap-4 pt-6 border-t border-[#F3F4F6]">
                               <Link href="/roadmap" className="flex-1">
                                 <Button className="w-full bg-[#030712] text-white rounded-xl h-12 font-bold text-xs uppercase tracking-widest hover:bg-teal">
                                    LIHAT ROADMAP
                                 </Button>
                               </Link>
                               <Button variant="ghost" className="w-12 h-12 p-0 rounded-xl border border-border">
                                  <ChevronRight className="w-5 h-5" />
                               </Button>
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Skill Radar Chart */}
                  <div className="bg-white p-10 rounded-[40px] border border-[#F3F4F6] shadow-sm flex flex-col items-center justify-center overflow-hidden">
                     <h4 className="text-xs font-black text-text-faint tracking-widest uppercase mb-10 text-center">SKILL LANDSCAPE</h4>
                     <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                           <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                              <PolarGrid stroke="#F3F4F6" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 700 }} />
                              <Radar
                                 name="Proyeksi Skill"
                                 dataKey="A"
                                 stroke="#1D9E75"
                                 fill="#1D9E75"
                                 fillOpacity={0.15}
                              />
                           </RadarChart>
                        </ResponsiveContainer>
                     </div>
                     <p className="text-xs text-text-muted mt-10 leading-relaxed text-center font-medium">
                        Kamu memiliki keunggulan kuat di <span className="text-teal font-extrabold uppercase">Technical & Kreativitas</span>. Tingkatkan <span className="text-amber font-extrabold uppercase">Leadership</span> untuk jalur Management.
                     </p>
                  </div>
               </div>
            </motion.div>
         )}

         {activeTab === "detail" && (
            <motion.div 
               key="detail"
               initial="hidden" animate="visible" variants={fadeUp}
               className="space-y-6"
            >
               {[
                  { t: "Full-stack Developer", match: 94, why: "Kombinasi React.js di sisi client dan Node.js di sisi server yang terdeteksi di CV kamu.", skills: ["React", "Express", "Postgres"], salary: "Rp 8M - 15M" },
                  { t: "Technical Product Manager", match: 82, why: "Analisis problem-solving dan kepemimpinan dalam organisasi kampus.", skills: ["Agile", "Scrum", "Product Specs"], salary: "Rp 12M - 20M" },
                  { t: "Cloud Architect", match: 71, why: "Pemahaman fundamental hardware dan jaringan sangat membantu dalam infrastruktur cloud.", skills: ["AWS", "Terraform", "Docker"], salary: "Rp 10M - 18M" },
               ].map((item, i) => (
                  <div key={i} className="bg-white border border-[#F3F4F6] rounded-3xl overflow-hidden group">
                     <div className="p-8 flex items-center justify-between cursor-pointer hover:bg-surface transition-all">
                        <div className="flex items-center gap-6">
                           <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center shrink-0">
                              <Target className="w-7 h-7 text-text-muted group-hover:text-teal transition-all" />
                           </div>
                           <div>
                              <h4 className="text-xl font-bold text-[#030712]">{item.t}</h4>
                              <p className="text-sm text-text-secondary">Estimasi Awal: <span className="font-bold text-teal">{item.salary}</span></p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="text-lg font-black text-teal">{item.match}%</span>
                           <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
                              <ChevronRight className={cn("w-5 h-5 transition-transform", i === 0 && "rotate-90")} />
                           </div>
                        </div>
                     </div>
                     <div className={cn("px-8 pb-8 space-y-6", i !== 0 && "hidden")}>
                        <div className="p-6 bg-teal-light/30 rounded-2xl border border-teal/10">
                           <h5 className="text-xs font-black text-teal uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5" /> Analisis Alasan
                           </h5>
                           <p className="text-text-secondary text-sm leading-loose font-medium">
                              {item.why}
                           </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <h5 className="text-[10px] font-black text-text-faint uppercase tracking-[0.2em] mb-4">SKILL YANG DIBUTUHKAN</h5>
                              <div className="flex flex-wrap gap-2">
                                 {item.skills.map(s => <span key={s} className="px-3 py-1 bg-surface-2 rounded-lg text-xs font-bold text-text-primary">{s}</span>)}
                              </div>
                           </div>
                           <div className="text-right">
                              <h5 className="text-[10px] font-black text-text-faint uppercase tracking-[0.2em] mb-4">DEMAND PASAR</h5>
                              <div className="flex items-center justify-end gap-1">
                                 {[1, 2, 3, 4, 5].map(s => <div key={s} className={cn("w-6 h-2 rounded-full", s <= 4 ? "bg-teal" : "bg-surface-2")} />)}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </motion.div>
         )}

         {activeTab === "compare" && (
            <motion.div 
               key="compare"
               initial="hidden" animate="visible" variants={fadeUp}
               className="bg-white border border-[#F3F4F6] rounded-[48px] overflow-hidden shadow-sm"
            >
               <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-surface border-b border-border">
                           <th className="p-8 text-[11px] font-black text-text-faint uppercase tracking-widest">Parameter Banding</th>
                           <th className="p-8 text-sm font-bold text-[#030712] border-l border-border">Full-stack Dev</th>
                           <th className="p-8 text-sm font-bold text-[#030712] border-l border-border">Product Manager</th>
                           <th className="p-8 text-sm font-bold text-[#030712] border-l border-border">Cloud Arch.</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#F3F4F6]">
                        {[
                           { p: "Matching Score", v: ["94%", "82%", "71%"], heat: [9, 7, 5] },
                           { p: "Demand Industri", v: ["Sangat Tinggi", "Tinggi", "Menengah"], heat: [10, 8, 6] },
                           { p: "Difficulty Level", v: ["Hard", "Medium", "Expert"], heat: [6, 5, 9] },
                           { p: "Remote Friendly", v: ["9/10", "6/10", "8/10"], heat: [9, 6, 8] },
                           { p: "Career Growth", v: ["Exponential", "Linear", "Steady"], heat: [10, 7, 6] },
                           { p: "Starting Salary", v: ["High", "Very High", "High"], heat: [8, 10, 9] },
                           { p: "Technical Mastery", v: ["Mandatory", "Familiar", "Master"], heat: [10, 6, 12] },
                           { p: "Soft Skill Req.", v: ["Medium", "High", "Medium"], heat: [5, 9, 5] },
                        ].map((row, i) => (
                           <tr key={i} className="hover:bg-surface/50 transition-colors">
                              <td className="p-8 text-sm font-bold text-text-secondary">{row.p}</td>
                              {row.v.map((val, idx) => {
                                 // Heatmap logic: intensity based on heat value
                                 const opacity = row.heat[idx] / 12;
                                 return (
                                    <td key={idx} className="p-8 border-l border-[#F3F4F6] relative">
                                       <div 
                                          className="absolute inset-0 z-0 pointer-events-none" 
                                          style={{ 
                                             backgroundColor: idx === 0 ? "#1D9E75" : idx === 1 ? "#534AB7" : "#EF9F27",
                                             opacity: opacity * 0.1
                                          }} 
                                       />
                                       <span className="relative z-10 font-black text-[#030712]">{val}</span>
                                    </td>
                                 );
                              })}
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Final Action */}
      <motion.div variants={fadeUp} className="bg-[#030712] rounded-[48px] p-12 text-center text-white relative overflow-hidden">
         <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-6 italic">Sudah Menentukan Pilihan?</h3>
            <p className="text-dark-muted max-w-xl mx-auto mb-10 leading-relaxed">
               Pilih satu jalur utama untuk mengaktifkan 90 Hari Roadmap Aksi. Kamu bisa mengganti pilihan kapan saja di dashboard.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
               <button className="px-10 py-5 bg-teal text-white rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-teal/20">
                  AKTIFKAN ROADMAP FULL-STACK
               </button>
               <button className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
                  BANDINGKAN DETAIL LAGI
               </button>
            </div>
         </div>
         <div className="absolute top-0 left-0 w-80 h-80 bg-teal/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
      </motion.div>
    </div>
  );
}
