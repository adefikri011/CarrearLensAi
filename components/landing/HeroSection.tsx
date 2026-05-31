"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent } from "motion/react";
import { Check, Target, Layout, BrainCircuit, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Ticker = ({ value }: { value: any }) => {
  const [display, setDisplay] = useState(0);
  useMotionValueEvent(value, "change", (v: any) => setDisplay(Math.round(v)));
  
  // Initialize with the current value
  useEffect(() => {
    if (typeof value.get === 'function') {
      setDisplay(Math.round(value.get()));
    }
  }, [value]);

  return <>{display}</>;
};

const DashboardMockup = ({ 
  progress, 
  highlightScoreValue, 
  isMobile = false 
}: { 
  progress: any, 
  highlightScoreValue: any, 
  isMobile?: boolean 
}) => {
  // We use motion.div and style props to ensure reactivity with MotionValues
  const scoreBorder = useTransform(highlightScoreValue, [0, 1], ["rgba(239, 239, 239, 1)", "rgba(29, 158, 117, 1)"]);
  const scoreShadow = useTransform(highlightScoreValue, [0, 1], ["0 0 0 0 rgba(0,0,0,0)", "0 0 40px -10px rgba(29, 158, 117, 0.4)"]);
  
  const strokeOffset = useTransform(progress, (v: number) => 282.6 - (282.6 * v) / 100);

  return (
    <div className={cn(
      "w-full max-w-[1000px] aspect-[16/10] bg-white dark:bg-zinc-950 rounded-[24px] lg:rounded-[32px] border border-gray-100 dark:border-zinc-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-none overflow-hidden relative transition-colors",
      isMobile && "max-w-[90vw] mx-auto"
    )}>
      {/* Sidebar */}
      <div className="absolute left-0 top-0 bottom-0 w-12 lg:w-16 border-r border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 hidden sm:flex flex-col items-center py-6 gap-6 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center transition-colors">
            <BrainCircuit className="text-teal w-5 h-5" />
        </div>
        {[Layout, Target, Sparkles].map((Icon, i) => (
          <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-zinc-600">
            <Icon size={20} />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={cn(
        "absolute top-0 right-0 bottom-0 p-4 lg:p-8 flex flex-col gap-4 lg:gap-8 bg-white dark:bg-zinc-950 transition-colors",
        "left-0 sm:left-12 lg:left-16"
      )}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-4 w-24 lg:w-32 bg-gray-50 dark:bg-zinc-900 rounded-full" />
            <div className="h-2 w-16 lg:w-20 bg-gray-50 dark:bg-zinc-900 rounded-full" />
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-50 dark:bg-zinc-900" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <motion.div 
            style={{ borderColor: scoreBorder, boxShadow: scoreShadow }}
            className="p-6 lg:p-8 rounded-2xl lg:rounded-3xl border transition-all duration-300 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900"
          >
            <div className="relative w-20 h-20 lg:w-32 lg:h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-gray-50 dark:text-zinc-800"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="#1D9E75"
                  strokeWidth="8"
                  strokeDasharray="282.6"
                  style={{ 
                    strokeDashoffset: strokeOffset
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl lg:text-3xl font-black tracking-tighter text-black dark:text-white uppercase italic">
                  <Ticker value={progress} />%
                </span>
                <span className="text-[8px] lg:text-[10px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest">ATS Score</span>
              </div>
            </div>
            <p className="mt-4 text-[10px] lg:text-xs font-bold text-gray-400 dark:text-zinc-500 max-w-[120px] uppercase tracking-tight">Kesiapan Industri</p>
          </motion.div>


          <div className="p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800/50 bg-gray-50 dark:bg-zinc-900/40 space-y-4">
             <div className="h-3 w-16 lg:w-24 bg-white dark:bg-black rounded-full" />
             <div className="space-y-2">
                {[
                  { label: "Frontend Developer", percent: 92 },
                  { label: "UI/UX Designer", percent: 85 },
                  { label: "QA Engineer", percent: 64 }
                ].map((path, i) => (
                  <div key={i} className="p-2 lg:p-3 bg-white dark:bg-zinc-900 rounded-lg lg:rounded-xl border border-gray-100 dark:border-zinc-800/80 flex items-center justify-between shadow-sm">
                    <span className="text-[10px] lg:text-xs font-black text-black dark:text-white uppercase italic">{path.label}</span>
                    <span className="text-[9px] lg:text-[10px] font-black text-teal">{path.percent}%</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hidden sm:block">
           <div className="flex items-center gap-4 mb-4 lg:mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                <Target size={18} />
              </div>
              <div className="space-y-1">
                 <div className="h-3 w-20 lg:w-32 bg-gray-50 dark:bg-zinc-800 rounded-full" />
                 <div className="h-2 w-16 lg:w-20 bg-gray-50 dark:bg-zinc-800 rounded-full opacity-50" />
              </div>
           </div>
           <div className="grid grid-cols-4 gap-2 lg:gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 lg:h-20 bg-gray-50 dark:bg-zinc-800 rounded-xl lg:rounded-2xl border border-dashed border-gray-100 dark:border-zinc-800 flex items-center justify-center">
                  <Check className="text-gray-100 dark:text-zinc-800 w-4 h-4 lg:w-5 lg:h-5" />
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export const HeroSection = () => {
  const { data: session } = useSession();
  const authenticated = !!session;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 70, 
    damping: 30, 
    restDelta: 0.001 
  });
  
  // Overlapping ranges to prevent blank gaps
  const h1Opacity = useTransform(smoothProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const h1Y = useTransform(smoothProgress, [0, 0.1], [0, -30]);
  
  const h2Opacity = useTransform(smoothProgress, [0.15, 0.25, 0.4], [0, 1, 0]);
  
  const h3Opacity = useTransform(smoothProgress, [0.35, 0.55, 0.72], [0, 1, 0]);
  const h3X = useTransform(smoothProgress, [0.4, 0.55], [-40, 0]);
  
  const h4Opacity = useTransform(smoothProgress, [0.68, 0.85, 1], [0, 1, 1]);
  
  const mockupScale = useTransform(smoothProgress, [0, 0.15], [0.85, 1]);
  const mockupX = useTransform(smoothProgress, [0, 0.4, 0.55, 0.7, 0.85], ["0%", "0%", "28%", "28%", "0%"]);
  const mockupY = useTransform(smoothProgress, [0, 0.1], [100, 0]);

  const progressBarValue = useTransform(smoothProgress, [0, 0.35, 0.5], [0, 0, 78]);
  const scoreHighlightValue = useTransform(smoothProgress, [0, 0.4, 0.55], [0, 0, 1]);
  const ctaOpacity = useTransform(smoothProgress, [0, 0.05, 0.1], [1, 1, 0]);

  // Mobile persistent values
  const mobileProgress = useMotionValue(78);
  const mobileHighlight = useMotionValue(1);

  if (!isMounted) return <div className="h-screen bg-white dark:bg-black transition-colors" />;

  if (isMobile) {
    return (
      <section className="bg-white dark:bg-black px-5 pt-32 pb-20 overflow-hidden flex flex-col items-center relative transition-colors">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <div className="text-center mb-16 z-10 w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(36px,10vw,56px)] font-black tracking-[-2px] leading-[1.1] text-black dark:text-white mb-6 uppercase italic"
          >
            Karier Impianmu.<br />
            Dimulai dari Sini.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[15px] sm:text-[16px] text-gray-500 dark:text-zinc-500 font-bold max-w-sm mx-auto mb-10 leading-relaxed uppercase tracking-tight"
          >
            AI yang membantu kamu membangun masa depan yang terarah dengan presisi tingkat tinggi.
          </motion.p>
          <Link href={authenticated ? "/dashboard/cv" : "/register"} className="w-full flex justify-center">
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              aria-label="Analisis CV Sekarang secara gratis"
              className="h-16 w-full max-w-[300px] bg-black dark:bg-white text-white dark:text-black rounded-full font-black text-[11px] tracking-[2px] uppercase hover:bg-[#1D9E75] dark:hover:bg-[#1D9E75] dark:hover:text-white transition-all shadow-xl active:scale-95 cursor-pointer"
            >
               Analisis CV Sekarang
             </motion.button>
          </Link>
        </div>
        
        <div className="w-full max-w-[90vw] z-0">
          <DashboardMockup progress={mobileProgress} highlightScoreValue={mobileHighlight} isMobile={true} />
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="h-[400vh] relative bg-white dark:bg-black transition-colors">
       <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center px-6">
        
        {/* Texts */}
        <motion.div style={{ opacity: h1Opacity, y: h1Y, zIndex: 10 }} className="absolute top-[18%] text-center pointer-events-none w-full px-10">
          <h1 className="text-[90px] font-black tracking-[-4px] leading-[0.95] text-black dark:text-white mb-6 uppercase italic">Karier Impianmu.</h1>
          <p className="text-[19px] text-gray-400 dark:text-zinc-500 font-bold max-w-lg mx-auto uppercase tracking-tight">AI yang membantu kamu membangun masa depan yang terarah dengan presisi tingkat tinggi.</p>
        </motion.div>

        <motion.div style={{ opacity: h2Opacity, zIndex: 11 }} className="absolute top-[18%] text-center pointer-events-none w-full">
          <h2 className="text-[90px] font-black tracking-[-4px] leading-[0.95] text-black dark:text-white uppercase italic">Dimulai dari Sini.</h2>
        </motion.div>

        <motion.div style={{ opacity: h3Opacity, x: h3X, zIndex: 12 }} className="absolute left-[12%] top-1/2 -translate-y-1/2 max-w-md pointer-events-none">
          <span className="text-[13px] font-black tracking-[4px] uppercase text-teal mb-8 block">01 / ANALISIS PRESISI</span>
          <h3 className="text-6xl font-black tracking-[-3px] leading-[1.05] text-black dark:text-white mb-10 uppercase italic">Analisis CV <br /> dalam Detik.</h3>
          <ul className="space-y-6">
            {["Skor standar ATS industri.", "Rekomendasi keyword relevan.", "Optimasi profil profesional."].map((t, i) => (
              <li key={i} className="flex items-center gap-4 text-[19px] text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-tighter">
                <div className="w-2 h-2 rounded-full bg-teal shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div style={{ opacity: h4Opacity, zIndex: 13 }} className="absolute top-[18%] text-center pointer-events-none w-full">
          <h2 className="text-[90px] font-black tracking-[-4px] leading-[0.95] text-black dark:text-white uppercase italic">
            Roadmap 90 Hari.<br />
            <span className="text-teal italic">Langkah Pasti.</span>
          </h2>
        </motion.div>

        {/* Mockup Container */}
        <motion.div 
          style={{ 
            scale: mockupScale, 
            x: mockupX, 
            y: mockupY,
            willChange: "transform, opacity", 
            zIndex: 5 
          }} 
          className="relative w-full max-w-[1100px] flex justify-center mt-20"
        >
            <DashboardMockup progress={progressBarValue} highlightScoreValue={scoreHighlightValue} />
        </motion.div>

        {/* Floating CTA */}
        <motion.div style={{ opacity: ctaOpacity, zIndex: 15 }} className="absolute bottom-[8%]">
          <Link href={authenticated ? "/dashboard/cv" : "/register"}>
             <button 
               aria-label="Analisis CV Sekarang secara gratis"
               className="h-20 px-14 bg-black dark:bg-white text-white dark:text-black rounded-full font-black text-[12px] tracking-[2px] uppercase hover:bg-[#1D9E75] dark:hover:bg-[#1D9E75] dark:hover:text-white transition-all shadow-2xl active:scale-95 cursor-pointer animate-bounce"
             >
               Analisis CV Sekarang
             </button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

