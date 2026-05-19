"use client";

import React from "react";
import { motion } from "motion/react";
import { 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Briefcase,
  ChevronRight,
  DollarSign,
  Clock
} from "lucide-react";
import { CareerPath } from "@/types/analysis";
import { cn, formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CareerPathCardProps {
  path: CareerPath;
  onDetail?: (id: string) => void;
}

export default function CareerPathCard({ path, onDetail }: CareerPathCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 stroke-emerald-500";
    if (score >= 60) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  const getBgColor = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-100 text-emerald-700";
    if (score >= 60) return "bg-amber-50 border-amber-100 text-amber-700";
    return "bg-rose-50 border-rose-100 text-rose-700";
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", getBgColor(path.matchScore))}>
              {path.matchScore}% Match
            </div>
            {path.jobDemand === "tinggi" && (
              <div className="bg-blue-50 border-blue-100 text-blue-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border">
                High Demand 📈
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#1D9E75] transition-colors">
            {path.nama}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {path.deskripsi}
          </p>
        </div>
        
        {/* Match Score Circle */}
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-slate-100"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={175.9}
              initial={{ strokeDashoffset: 175.9 }}
              animate={{ strokeDashoffset: 175.9 - (175.9 * path.matchScore) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={getScoreColor(path.matchScore)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn("text-xs font-black", getScoreColor(path.matchScore))}>
              {path.matchScore}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-600 shadow-sm border border-slate-100">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Estimasi Gaji</p>
            <p className="text-sm font-bold text-slate-800">{formatRupiah(path.estimasiGajiMin)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-600 shadow-sm border border-slate-100">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Waktu Siap</p>
            <p className="text-sm font-bold text-slate-800">~{path.waktuSiapBulan} Bulan</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Top Skills & Gap</p>
        <div className="flex flex-wrap gap-2">
          {path.requiredSkills.map((skill, idx) => (
            <div 
              key={idx}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border",
                skill.userHas 
                  ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                  : "bg-rose-50 border-rose-100 text-rose-700"
              )}
            >
              {skill.userHas ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {skill.skill}
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={() => onDetail && onDetail(path.id)}
        className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-2xl h-12 font-bold flex items-center justify-center gap-2 group/btn"
      >
        Lihat Analisis Detail
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
      </Button>

      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1D9E75]/5 to-[#534AB7]/5 -z-10 blur-2xl rounded-full" />
    </motion.div>
  );
}
