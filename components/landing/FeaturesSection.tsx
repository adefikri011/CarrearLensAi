"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Target, BrainCircuit, Sparkles, Map } from "lucide-react";
import { cn } from "@/lib/utils";

const CVScoreVisual = () => (
  <div className="w-full max-w-[480px] p-6 lg:p-10 rounded-[32px] lg:rounded-[48px] bg-[#F8F8F8] border border-[#EFEFEF] relative overflow-hidden group">
    <div className="relative z-10 flex flex-col items-center gap-6">
       <div className="w-24 h-24 lg:w-40 lg:h-40 rounded-full border-[6px] lg:border-[10px] border-white flex items-center justify-center relative bg-white shadow-xl">
          <div className="flex flex-col items-center">
            <span className="text-xl lg:text-4xl font-bold tracking-tighter">82%</span>
            <span className="text-[8px] lg:text-[10px] font-bold text-[#888888] uppercase tracking-widest mt-0.5 lg:mt-1">Excellent</span>
          </div>
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
             <circle 
                cx="50%" cy="50%" r="45%" 
                fill="none" 
                stroke="#1D9E75" 
                strokeWidth="10" 
                strokeDasharray="471" 
                strokeDashoffset="84" 
                className="lg:stroke-[10] stroke-[6]"
             />
          </svg>
       </div>
       <div className="space-y-3 lg:space-y-4 w-full">
          <div className="h-2 w-full bg-white rounded-full overflow-hidden">
            <div className="h-full w-[82%] bg-[#1D9E75]" />
          </div>
          <div className="flex justify-between">
            <div className="h-2 w-16 lg:w-20 bg-white rounded-full" />
            <div className="h-2 w-10 lg:w-12 bg-white rounded-full opacity-50" />
          </div>
       </div>
    </div>
    <Sparkles className="absolute top-6 right-6 lg:top-10 lg:right-10 text-[#1D9E75]/20 w-12 h-12 lg:w-20 lg:h-20" />
  </div>
);

const CareerPathVisual = () => (
  <div className="w-full max-w-[480px] p-6 lg:p-10 rounded-[32px] lg:rounded-[48px] bg-white border border-[#EFEFEF] relative overflow-hidden flex flex-col gap-5 lg:gap-6">
    {[
      { l: "Frontend Engineer", p: 94, c: "#1D9E75" },
      { l: "Mobile Developer", p: 78, c: "#888888" },
      { l: "UI Designer", p: 65, c: "#888888" }
    ].map((item, i) => (
      <div key={i} className="flex flex-col gap-2 lg:gap-3">
        <div className="flex justify-between items-end">
           <span className="text-[12px] lg:text-[14px] font-bold text-[#0A0A0A]">{item.l}</span>
           <span className="text-[10px] lg:text-[12px] font-bold text-[#1D9E75]">{item.p}% Match</span>
        </div>
        <div className="h-2.5 lg:h-3 w-full bg-[#F8F8F8] rounded-full overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             whileInView={{ width: `${item.p}%` }}
             transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
             className={cn("h-full rounded-full", i === 0 ? "bg-[#1D9E75]" : "bg-[#0A0A0A]")} 
           />
        </div>
      </div>
    ))}
    <Map className="absolute -bottom-6 -right-6 lg:-bottom-10 lg:-right-10 text-[#0A0A0A]/5 w-32 h-32 lg:w-40 lg:h-40" />
  </div>
);

const RoadmapVisual = () => (
  <div className="w-full max-w-[480px] p-6 lg:p-8 rounded-[32px] lg:rounded-[48px] bg-[#0A0A0A] border border-[#222] relative overflow-hidden">
    <div className="flex flex-col gap-3 lg:gap-4">
       {[
         { w: "Minggu 1", t: "Logika & Fundamental", d: "Penguasaan dasar teknis industri." },
         { w: "Minggu 4", t: "Membangun Proyek", d: "Pembuatan portofolio berstandar kerja." },
         { w: "Minggu 9", t: "Interview & Offer", d: "Persiapan wawancara & optimasi CV." }
       ].map((item, i) => (
         <div key={i} className="p-4 lg:p-5 rounded-2xl lg:rounded-3xl bg-white/5 border border-white/10 flex gap-4 lg:gap-5 group hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-[#1D9E75]">
               <Check size={18} />
            </div>
            <div>
               <span className="text-[9px] lg:text-[10px] font-bold text-[#1D9E75] uppercase tracking-widest">{item.w}</span>
               <h4 className="text-[14px] lg:text-[16px] font-bold text-white mb-0.5 lg:mb-1">{item.t}</h4>
               <p className="text-[11px] lg:text-[12px] text-white/50">{item.d}</p>
            </div>
         </div>
       ))}
    </div>
    <Target className="absolute top-1/2 -right-8 -translate-y-1/2 text-white/[0.03] w-32 h-32 lg:w-48 lg:h-48" />
  </div>
);

export const FeaturesSection = () => {
  const features = [
    {
      label: "INTELLIGENT SCAN",
      title: "Analisis CV Cerdas Berbasis ATS.",
      desc: "Kami membedah kualifikasimu menggunakan algoritma yang menyesuaikan dengan standar sistem rekrutmen perusahaan global terkini.",
      visual: <CVScoreVisual />,
      align: "left"
    },
    {
      label: "PATH FINDER",
      title: "Temukan Jalur Karier Paling Pas.",
      desc: "Tidak lagi menebak-nebak. AI kami menyocokkan kompetensimu dengan data ribuan posisi pekerjaan di pasar saat ini secara akurat.",
      visual: <CareerPathVisual />,
      align: "right"
    },
    {
      label: "90-DAY SUCCESS",
      title: "Rencana Aksi Menuju Pekerjaan Impian.",
      desc: "Dapatkan instruksi mingguan yang mendetail. Mulai dari mengasah keahlian baru hingga strategi memenangkan proses rekrutmen.",
      visual: <RoadmapVisual />,
      align: "left"
    }
  ];

  return (
    <section id="fitur" className="py-20 lg:py-48 px-5 md:px-10 bg-white overflow-hidden">
      <div className="container max-w-7xl mx-auto space-y-24 lg:space-y-60">
        
        {/* Header Section */}
        <div className="max-w-3xl">
           <span className="text-[10px] lg:text-[12px] font-bold tracking-[3px] uppercase text-[#1D9E75] mb-4 lg:mb-6 block">02 / FITUR UTAMA</span>
           <h2 className="text-4xl lg:text-7xl font-bold tracking-[-2px] lg:tracking-[-3px] text-[#0A0A0A] leading-[1]">
             Setiap Detail <br />Dirancang untuk Suksesmu.
           </h2>
        </div>

        {/* Feature List */}
        {features.map((feature, i) => (
          <div 
            key={i} 
            className={cn(
              "flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-32",
              feature.align === "right" && "lg:flex-row-reverse"
            )}
          >
            {/* Text Side */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 space-y-6 lg:space-y-8"
            >
              <div className="space-y-3 lg:space-y-4">
                 <span className="text-[10px] lg:text-[12px] font-bold tracking-[2px] uppercase text-[#888888]">{feature.label}</span>
                 <h3 className="text-3xl lg:text-5xl font-bold tracking-[-1px] lg:tracking-[-2px] text-[#0A0A0A] leading-[1.1]">
                   {feature.title}
                 </h3>
              </div>
              <p className="text-[16px] lg:text-[18px] text-[#888888] leading-relaxed font-medium max-w-md">
                {feature.desc}
              </p>
              <div className="pt-2 lg:pt-4">
                 <button className="flex items-center gap-3 text-[13px] lg:text-[14px] font-bold text-[#0A0A0A] group tracking-tight">
                    Lihat detail fitur
                    <div className="w-8 h-8 rounded-full border border-[#EFEFEF] flex items-center justify-center group-hover:bg-[#0A0A0A] group-hover:text-white transition-all">
                       <Target size={14} className="group-hover:rotate-45 transition-transform" />
                    </div>
                 </button>
              </div>
            </motion.div>

            {/* Visual Side */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex justify-center w-full"
            >
               {feature.visual}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};
