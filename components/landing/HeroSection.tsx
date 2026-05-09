"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Check, Target, Layout, BrainCircuit, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const DashboardMockup = ({ progress, highlightScore }: { progress: number, highlightScore: boolean }) => {
  return (
    <div className="w-full max-w-[1000px] aspect-[16/10] bg-white rounded-[24px] lg:rounded-[32px] border border-[#EFEFEF] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden relative">
      {/* Sidebar */}
      <div className="absolute left-0 top-0 bottom-0 w-12 lg:w-16 border-r border-[#EFEFEF] bg-[#F8F8F8] hidden sm:flex flex-col items-center py-6 gap-6">
        <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
            <BrainCircuit className="text-[#1D9E75] w-5 h-5" />
        </div>
        {[Layout, Target, Sparkles].map((Icon, i) => (
          <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#888888]">
            <Icon size={20} />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="absolute left-0 sm:left-12 lg:left-16 top-0 right-0 bottom-0 p-4 lg:p-8 flex flex-col gap-6 lg:gap-8 bg-white">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-4 w-24 lg:w-32 bg-[#F8F8F8] rounded-full" />
            <div className="h-2 w-16 lg:w-20 bg-[#F8F8F8] rounded-full" />
          </div>
          <div className="h-8 w-8 rounded-full bg-[#F8F8F8]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {/* Left Card: Score */}
          <div className={cn(
            "p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-[#EFEFEF] transition-all duration-500 flex flex-col items-center justify-center text-center",
            highlightScore ? "border-[#1D9E75] shadow-[0_0_40px_-10px_rgba(29,158,117,0.2)]" : "bg-white"
          )}>
            <div className="relative w-24 h-24 lg:w-32 lg:h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="#F8F8F8"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="#1D9E75"
                  strokeWidth="8"
                  strokeDasharray="282.6"
                  animate={{ strokeDashoffset: 282.6 - (282.6 * progress) / 100 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl lg:text-3xl font-bold tracking-tighter text-[#0A0A0A]">{Math.round(progress)}%</span>
                <span className="text-[8px] lg:text-[10px] font-bold text-[#888888] uppercase tracking-widest">ATS Score</span>
              </div>
            </div>
            <p className="mt-4 text-[10px] lg:text-xs font-medium text-[#888888] max-w-[120px]">CV kamu sudah cukup baik untuk industri modern.</p>
          </div>

          {/* Right Card: Career Mapping */}
          <div className="p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-[#EFEFEF] bg-[#F8F8F8] space-y-4">
             <div className="h-3 w-20 lg:w-24 bg-white rounded-full" />
             <div className="space-y-2">
                {[
                  { label: "Frontend Developer", percent: 92 },
                  { label: "UI/UX Designer", percent: 85 },
                  { label: "QA Engineer", percent: 64 }
                ].map((path, i) => (
                  <div key={i} className="p-2 lg:p-3 bg-white rounded-lg lg:rounded-xl border border-[#EFEFEF] flex items-center justify-between">
                    <span className="text-[10px] lg:text-xs font-bold text-[#0A0A0A]">{path.label}</span>
                    <span className="text-[9px] lg:text-[10px] font-bold text-[#1D9E75]">{path.percent}%</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Bottom Timeline Mockup */}
        <div className="flex-1 p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-[#EFEFEF] bg-white hidden sm:block">
           <div className="flex items-center gap-4 mb-4 lg:mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75]">
                <Target size={20} />
              </div>
              <div className="space-y-1">
                 <div className="h-3 w-24 lg:w-32 bg-[#F8F8F8] rounded-full" />
                 <div className="h-2 w-16 lg:w-20 bg-[#F8F8F8] rounded-full opacity-50" />
              </div>
           </div>
           <div className="grid grid-cols-4 gap-3 lg:gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 lg:h-20 bg-[#F8F8F8] rounded-xl lg:rounded-2xl border border-dashed border-[#EFEFEF] flex items-center justify-center">
                  <Check className="text-[#EFEFEF] w-4 h-4 lg:w-5 lg:h-5" />
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth transitions
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  // Phase transformations - Strictly non-overlapping range steps
  // P1: 0 - 0.2
  // P2: 0.25 - 0.45
  // P3: 0.55 - 0.75
  // P4: 0.85 - 1.0

  // Phase 1 (0-0.2)
  const h1Opacity = useTransform(smoothProgress, [0, 0.15, 0.2], [0, 1, 0]);
  const h1Y = useTransform(smoothProgress, [0, 0.1], [40, 0]);
  
  // Phase 2 (0.25-0.45)
  const h2Opacity = useTransform(smoothProgress, [0.25, 0.35, 0.45], [0, 1, 0]);
  
  // Phase 3 (0.55-0.75)
  const h3Opacity = useTransform(smoothProgress, [0.55, 0.65, 0.75], [0, 1, 0]);
  const h3X = useTransform(smoothProgress, [0.55, 0.65], [-30, 0]);

  // Phase 4 (0.85-1.0)
  const h4Opacity = useTransform(smoothProgress, [0.85, 0.95], [0, 1]);

  // Mockup Animations
  const mockupScale = useTransform(smoothProgress, [0, 0.15], [0.75, 1]);
  const mockupX = useTransform(smoothProgress, [0.5, 0.65, 0.8, 0.95], ["0%", "28%", "28%", "0%"]);
  
  const progressBarValue = useTransform(smoothProgress, [0.25, 0.4], [0, 78]);
  const scoreHighlight = useTransform(smoothProgress, [0.3, 0.45], [false, true] as any);

  return (
    <section ref={containerRef} className="h-[250vh] lg:h-[300vh] relative bg-white">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center px-4 md:px-6">
        
        {/* Phase 1: Welcome Headline */}
        <motion.div 
          style={{ opacity: h1Opacity, y: h1Y, zIndex: 10 }}
          className="absolute top-[18%] lg:top-[15%] text-center pointer-events-none w-full px-6"
        >
          <h1 className="text-[44px] lg:text-[80px] font-bold tracking-[-2px] lg:tracking-[-3px] leading-[1] text-[#0A0A0A] mb-4">
            Karier Impianmu.
          </h1>
          <p className="text-[15px] lg:text-[17px] text-[#888888] font-medium max-w-sm lg:max-w-lg mx-auto">
            AI yang membantu kamu membangun masa depan yang terarah dengan presisi tingkat tinggi.
          </p>
        </motion.div>

        {/* Phase 2: Morph Headline */}
        <motion.div 
          style={{ opacity: h2Opacity, zIndex: 11 }}
          className="absolute top-[18%] lg:top-[15%] text-center pointer-events-none w-full"
        >
          <h2 className="text-[44px] lg:text-[80px] font-bold tracking-[-2px] lg:tracking-[-3px] leading-[1] text-[#0A0A0A]">
            Dimulai dari Sini.
          </h2>
        </motion.div>

        {/* Phase 3: Feature Detail Text */}
        <motion.div 
          style={{ opacity: h3Opacity, x: h3X, zIndex: 12 }}
          className="absolute left-6 lg:left-[15%] top-[15%] lg:top-1/2 lg:-translate-y-1/2 max-w-sm pointer-events-none"
        >
          <span className="text-[10px] lg:text-[12px] font-bold tracking-[2px] lg:tracking-[3px] uppercase text-[#1D9E75] mb-4 block">01 / ANALISIS PREISI</span>
          <h3 className="text-3xl lg:text-5xl font-bold tracking-[-1px] lg:tracking-[-2px] leading-[1.1] text-[#0A0A0A] mb-6">
            Analisis CV <br className="hidden lg:block" /> dalam Detik.
          </h3>
          <ul className="space-y-4">
            {["Skor standar ATS industri.", "Rekomendasi keyword relevan.", "Optimasi profil profesional."].map((t, i) => (
              <li key={i} className="flex items-center gap-3 text-[14px] lg:text-[17px] text-[#888888]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1D9E75]" />
                {t}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Phase 4: Final Roadmap Headline */}
        <motion.div 
          style={{ opacity: h4Opacity, zIndex: 13 }}
          className="absolute top-[18%] lg:top-[15%] text-center pointer-events-none w-full"
        >
          <h2 className="text-[44px] lg:text-[80px] font-bold tracking-[-2px] lg:tracking-[-3px] leading-[1] text-[#0A0A0A]">
            Roadmap 90 Hari.<br />
            <span className="text-[#1D9E75] italic">Langkah Pasti.</span>
          </h2>
        </motion.div>

        {/* Central Visual: Mockup */}
        <motion.div 
          style={{ 
            scale: mockupScale, 
            x: mockupX,
            willChange: "transform",
            zIndex: 5
          }}
          className="relative w-full flex justify-center px-4"
        >
            <DashboardMockup 
              progress={progressBarValue.get()} 
              highlightScore={scoreHighlight.get() as boolean} 
            />
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          style={{ 
            opacity: h1Opacity, 
            zIndex: 15,
            display: useTransform(smoothProgress, (v) => v > 0.2 ? "none" : "block")
          }}
          className="absolute bottom-[12%] lg:bottom-[10%]"
        >
           <button className="h-14 lg:h-16 px-8 lg:px-12 bg-[#0A0A0A] text-white rounded-full font-bold text-[12px] lg:text-[14px] tracking-[1px] lg:tracking-[2px] uppercase hover:bg-[#1D9E75] transition-all shadow-xl active:scale-95">
             Analisis CV Sekarang
           </button>
        </motion.div>
      </div>
    </section>
  );
};
