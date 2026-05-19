"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { BrainCircuit, Upload, Target, Check, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const UploadMockup = () => (
  <div className="w-full h-full p-4 lg:p-8 flex flex-col items-center justify-center">
    <div className="w-full max-w-[280px] bg-white rounded-2xl border border-[#EFEFEF] shadow-xl p-5 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-[#F8F8F8] flex items-center justify-center text-[#1D9E75]">
          <FileText size={24} />
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-3 w-24 bg-[#F8F8F8] rounded-full" />
          <div className="h-2 w-16 bg-[#F8F8F8] rounded-full opacity-50" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="flex justify-between text-[10px] font-bold text-[#888888] uppercase tracking-widest">
           <span>Uploading...</span>
           <span>75%</span>
        </div>
        <div className="h-1.5 w-full bg-[#F8F8F8] rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: "75%" }} transition={{ duration: 1.5, repeat: Infinity }} className="h-full bg-[#1D9E75]" />
        </div>
      </div>
    </div>
  </div>
);

const AnalysisMockup = () => (
  <div className="w-full h-full p-4 lg:p-8 flex items-center justify-center relative">
     <div className="w-full max-w-[300px] bg-white rounded-[32px] border border-[#EFEFEF] shadow-2xl p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
           <div className="w-10 h-10 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75]"><BrainCircuit size={20} /></div>
           <div className="flex gap-1">
             {[...Array(3)].map((_, i) => (
               <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }} className="w-1 h-1 rounded-full bg-[#1D9E75]" />
             ))}
           </div>
        </div>
        <div className="space-y-4">
           <div className="h-3 w-32 bg-[#F8F8F8] rounded-full" />
           <div className="flex flex-wrap gap-2">
              {["Fullstack", "Tailwind", "React", "NodeJS"].map((skill, i) => (
                <motion.div key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.2 }} className="px-3 py-1 rounded-full bg-[#1D9E75]/10 text-[#1D9E75] text-[10px] font-bold">{skill}</motion.div>
              ))}
           </div>
        </div>
     </div>
  </div>
);

const TimelineMockup = () => (
  <div className="w-full h-full p-4 lg:p-8 flex items-center justify-center">
     <div className="w-full max-w-[280px] space-y-3">
        {[
          { t: "Minggu 1: Fundamental", s: true },
          { t: "Minggu 2: Project Kecil", s: true },
          { t: "Minggu 3: Portofolio", s: false },
          { t: "Minggu 4: Interview", s: false }
        ].map((item, i) => (
          <div key={i} className={cn("p-4 rounded-xl border flex items-center gap-4 bg-white", item.s ? "border-[#1D9E75] shadow-sm" : "border-[#EFEFEF]")}>
             <div className={cn("w-5 h-5 rounded-md flex items-center justify-center shrink-0 border", item.s ? "bg-[#1D9E75] border-[#1D9E75] text-white" : "border-[#EFEFEF] bg-[#F8F8F8]")}>
                {item.s && <Check size={12} strokeWidth={3} />}
             </div>
             <span className={cn("text-[13px] font-bold", item.s ? "text-[#0A0A0A]" : "text-[#888888]")}>{item.t}</span>
          </div>
        ))}
     </div>
  </div>
);

const StepVisual = ({ index }: { index: number }) => (
  <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center">
     <div className="absolute inset-0 bg-gradient-to-br from-[#1D9E75]/5 to-transparent rounded-full blur-3xl opacity-50" />
     <div className="relative z-10 w-full h-full flex items-center justify-center">
        {index === 0 && <UploadMockup />}
        {index === 1 && <AnalysisMockup />}
        {index === 2 && <TimelineMockup />}
     </div>
  </div>
);

export const HowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const steps = [
    { title: "Upload CV atau Deskripsikan Dirimu", desc: "Unggah file CV PDF atau ceritakan pengalaman dan minat yang kamu miliki. AI kami akan menganalisis profilmu secara instan." },
    { title: "AI Menganalisis Potensi Terbaik", desc: "Lensa cerdas kami membedah setiap baris pengalamanmu untuk menemukan 'hidden gems' dan kecocokan industri yang paling tepat." },
    { title: "Jalankan Roadmap Suksesmu", desc: "Terima 3 opsi jalur karier terbaik serta rencana aksi mendetail selama 90 hari untuk mendapatkan pekerjaan yang kamu impikan." }
  ];

  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"]
  });
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });
  
  const opacity1 = useTransform(smoothProgress, [0, 0.3, 0.42], [1, 1, 0]);
  const opacity2 = useTransform(smoothProgress, [0.35, 0.45, 0.65, 0.75], [0, 1, 1, 0]);
  const opacity3 = useTransform(smoothProgress, [0.68, 0.78, 1], [0, 1, 1]);
  
  const y1 = useTransform(smoothProgress, [0.3, 0.42], [0, -50]);
  const y2 = useTransform(smoothProgress, [0.35, 0.45, 0.65, 0.75], [50, 0, 0, -50]);
  const y3 = useTransform(smoothProgress, [0.68, 0.78], [50, 0]);
  
  const lineProgress = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  if (!isMounted) return <div className="h-[300vh] bg-white" />;

  if (isMobile) {
    return (
      <section id="cara-kerja" className="py-24 px-5 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#888 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container max-w-7xl mx-auto space-y-20">
          <div className="text-center">
            <span className="text-[12px] font-bold tracking-[3px] uppercase text-[#1D9E75] mb-4 block">BAGAIMANA INI BEKERJA</span>
            <h3 className="text-[clamp(32px,8vw,48px)] font-bold tracking-[-1px] leading-[1.1] text-[#0A0A0A]">Tiga Langkah Menuju <br />Masa Depanmu.</h3>
          </div>
          <div className="space-y-12">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col gap-8">
                <div className="space-y-4">
                   <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] text-white flex items-center justify-center font-bold text-xl">{i + 1}</div>
                   <h4 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">{step.title}</h4>
                   <p className="text-[15px] text-[#888888] leading-relaxed">{step.desc}</p>
                </div>
                <div className="bg-[#F8F8F8] rounded-3xl border border-[#EFEFEF] overflow-hidden"><StepVisual index={i} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} id="cara-kerja" className="h-[300vh] relative bg-white">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#888 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center px-10">
        <div className="container max-w-7xl mx-auto h-full flex items-center">
          <div className="flex items-center justify-between w-full gap-20">
            <div className="relative pl-12 max-w-xl">
               <div className="absolute left-0 top-10 bottom-10 w-[2px] bg-[#EFEFEF]"><motion.div style={{ height: lineProgress }} className="w-full bg-[#1D9E75]" /></div>
               <div className="relative h-[300px] flex items-center">
                  {steps.map((step, i) => {
                    const opacity = i === 0 ? opacity1 : i === 1 ? opacity2 : opacity3;
                    const y = i === 0 ? y1 : i === 1 ? y2 : y3;
                    return (
                      <motion.div key={i} style={{ opacity, y, position: "absolute" }} className="pointer-events-none">
                         <span className="text-[12px] font-bold tracking-[3px] uppercase text-[#1D9E75] mb-6 block">0{i + 1} / CARA KERJA</span>
                         <h3 className="text-5xl font-bold tracking-[-2px] leading-[1.1] text-[#0A0A0A] mb-8">{step.title}</h3>
                         <p className="text-[17px] text-[#888888] leading-relaxed font-medium">{step.desc}</p>
                      </motion.div>
                    );
                  })}
               </div>
            </div>
            <div className="flex-1 flex justify-end">
               <div className="relative w-full max-w-[440px] aspect-square">
                  {steps.map((_, i) => (
                    <StepItemDesktop key={i} index={i} progress={smoothProgress} />
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StepItemDesktop = ({ index, progress }: { index: number, progress: any }) => {
  const isFirst = index === 0; const isSecond = index === 1;
  const o = useTransform(progress, isFirst ? [0, 0.25, 0.33] : isSecond ? [0.33, 0.4, 0.6, 0.66] : [0.66, 0.75, 1], isFirst ? [1, 1, 0] : isSecond ? [0, 1, 1, 0] : [0, 1, 1]);
  return <motion.div style={{ opacity: o, position: "absolute", inset: 0 }} className="flex items-center justify-center"><StepVisual index={index} /></motion.div>;
};
