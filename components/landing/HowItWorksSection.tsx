"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { BrainCircuit, Upload, Target, Check, FileText, Sparkles, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

// Visual 1: CV Upload Mockup
const UploadMockup = () => (
  <div className="w-full h-full p-6 lg:p-8 flex flex-col items-center justify-center">
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
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-full bg-[#1D9E75]" 
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="h-8 rounded-lg bg-[#0A0A0A] text-white text-[10px] flex items-center justify-center font-bold">Simpan</div>
        <div className="h-8 rounded-lg border border-[#EFEFEF] text-[#888888] text-[10px] flex items-center justify-center font-bold">Batal</div>
      </div>
    </div>
  </div>
);

// Visual 2: AI Analysis Mockup
const AnalysisMockup = () => (
  <div className="w-full h-full p-6 lg:p-8 flex items-center justify-center relative">
     <div className="w-full max-w-[300px] bg-white rounded-[32px] border border-[#EFEFEF] shadow-2xl p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
           <div className="w-10 h-10 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75]">
             <BrainCircuit size={20} />
           </div>
           <div className="flex gap-1">
             {[...Array(3)].map((_, i) => (
               <motion.div
                 key={i}
                 animate={{ opacity: [0.2, 1, 0.2] }}
                 transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                 className="w-1 h-1 rounded-full bg-[#1D9E75]"
               />
             ))}
           </div>
        </div>
        <div className="space-y-4">
           <div className="h-3 w-32 bg-[#F8F8F8] rounded-full" />
           <div className="flex flex-wrap gap-2">
              {["Fullstack", "Tailwind", "React", "NodeJS"].map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="px-3 py-1 rounded-full bg-[#1D9E75]/10 text-[#1D9E75] text-[10px] font-bold"
                >
                  {skill}
                </motion.div>
              ))}
           </div>
           <div className="space-y-2 mt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-2 w-full bg-[#F8F8F8] rounded-full" style={{ width: `${100 - i * 15}%` }} />
              ))}
           </div>
        </div>
        <Sparkles className="absolute -bottom-4 -right-4 text-[#1D9E75]/5 w-24 h-24" />
     </div>
  </div>
);

// Visual 3: Roadmap Mockup
const TimelineMockup = () => (
  <div className="w-full h-full p-6 lg:p-8 flex items-center justify-center">
     <div className="w-full max-w-[280px] space-y-3">
        {[
          { t: "Minggu 1: Fundamental", s: true },
          { t: "Minggu 2: Project Kecil", s: true },
          { t: "Minggu 3: Portofolio", s: false },
          { t: "Minggu 4: Interview", s: false }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-4 rounded-xl border flex items-center gap-4 bg-white",
              item.s ? "border-[#1D9E75] shadow-sm" : "border-[#EFEFEF]"
            )}
          >
             <div className={cn(
               "w-5 h-5 rounded-md flex items-center justify-center shrink-0 border",
               item.s ? "bg-[#1D9E75] border-[#1D9E75] text-white" : "border-[#EFEFEF] bg-[#F8F8F8]"
             )}>
                {item.s && <Check size={12} strokeWidth={3} />}
             </div>
             <span className={cn("text-[13px] font-bold", item.s ? "text-[#0A0A0A]" : "text-[#888888]")}>{item.t}</span>
          </motion.div>
        ))}
     </div>
  </div>
);

const StepVisual = ({ index }: { index: number }) => {
  return (
    <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center">
       {/* Background Decoration */}
       <div className="absolute inset-0 bg-gradient-to-br from-[#1D9E75]/5 to-transparent rounded-full blur-3xl opacity-50" />
       
       <div className="relative z-10 w-full h-full">
          {index === 0 && <UploadMockup />}
          {index === 1 && <AnalysisMockup />}
          {index === 2 && <TimelineMockup />}
       </div>

       {/* Floating Particles */}
       {[...Array(4)].map((_, i) => (
         <motion.div
           key={i}
           className="absolute w-1 h-1 rounded-full bg-[#1D9E75]/40"
           animate={{
              x: [0, Math.cos(i) * 100, 0],
              y: [0, Math.sin(i) * 100, 0],
           }}
           transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut"
           }}
         />
       ))}
    </div>
  );
};

export const HowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  const steps = [
    {
      title: "Upload CV atau Deskripsikan Dirimu",
      desc: "Unggah file CV PDF atau ceritakan pengalaman dan minat yang kamu miliki. AI kami akan menganalisis profilmu secara instan.",
      icon: Upload
    },
    {
      title: "AI Menganalisis Potensi Terbaik",
      desc: "Lensa cerdas kami membedah setiap baris pengalamanmu untuk menemukan 'hidden gems' dan kecocokan industri yang paling tepat.",
      icon: BrainCircuit
    },
    {
      title: "Jalankan Roadmap Suksesmu",
      desc: "Terima 3 opsi jalur karier terbaik serta rencana aksi mendetail selama 90 hari untuk mendapatkan pekerjaan yang kamu impikan.",
      icon: Target
    }
  ];

  const opacity1 = useTransform(smoothProgress, [0, 0.25, 0.33], [1, 1, 0]);
  const opacity2 = useTransform(smoothProgress, [0.33, 0.4, 0.6, 0.66], [0, 1, 1, 0]);
  const opacity3 = useTransform(smoothProgress, [0.66, 0.75, 1], [0, 1, 1]);

  const y1 = useTransform(smoothProgress, [0, 0.33], [0, -100]);
  const y2 = useTransform(smoothProgress, [0.33, 0.4, 0.6, 0.66], [100, 0, 0, -100]);
  const y3 = useTransform(smoothProgress, [0.66, 1], [100, 0]);

  const lineProgress = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="h-[200vh] lg:h-[300vh] relative bg-white selection:bg-[#1D9E75]/10 space-y-12">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#888 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center px-5 md:px-10">
        <div className="container max-w-7xl mx-auto h-full flex items-center">
          
          <div className="flex flex-col lg:flex-row items-center justify-between w-full h-full lg:h-auto gap-8 lg:gap-20">
            {/* Left/Top: Text Content with Progress Rail */}
            <div className="relative pl-8 lg:pl-12 max-w-xl order-1 lg:order-none py-10 lg:py-0">
               <div className="absolute left-0 top-10 bottom-10 w-[2px] bg-[#EFEFEF]">
                  <motion.div 
                    style={{ height: lineProgress }}
                    className="w-full bg-[#1D9E75]"
                  />
               </div>

               <div className="relative h-[240px] lg:h-[300px] flex items-center">
                  {steps.map((step, i) => {
                    const opacity = i === 0 ? opacity1 : i === 1 ? opacity2 : opacity3;
                    const y = i === 0 ? y1 : i === 1 ? y2 : y3;
                    
                    return (
                      <motion.div
                        key={i}
                        style={{ opacity, y, position: "absolute" }}
                        className="pointer-events-none"
                      >
                         <span className="text-[10px] lg:text-[12px] font-bold tracking-[3px] uppercase text-[#1D9E75] mb-4 lg:mb-6 block">0{i + 1} / CARA KERJA</span>
                         <h3 className="text-3xl lg:text-5xl font-bold tracking-[-2px] leading-[1.1] text-[#0A0A0A] mb-4 lg:mb-8">
                           {step.title}
                         </h3>
                         <p className="text-[14px] lg:text-[17px] text-[#888888] leading-relaxed font-medium">
                           {step.desc}
                         </p>
                      </motion.div>
                    );
                  })}
               </div>
            </div>

            {/* Right/Bottom: Visual Content */}
            <div className="flex-1 flex justify-center lg:justify-end order-2 lg:order-none w-full">
               <div className="relative w-full max-w-[320px] lg:max-w-[440px] aspect-square">
                  {steps.map((step, i) => (
                    <StepItem 
                      key={i} 
                      index={i} 
                      progress={smoothProgress} 
                    />
                  ))}
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const StepItem = ({ index, progress }: { index: number, progress: any }) => {
  const isFirst = index === 0;
  const isSecond = index === 1;
  const isThird = index === 2;

  const opacity = useTransform(
    progress, 
    isFirst ? [0, 0.25, 0.33] : isSecond ? [0.33, 0.4, 0.6, 0.66] : [0.66, 0.75, 1],
    isFirst ? [1, 1, 0] : isSecond ? [0, 1, 1, 0] : [0, 1, 1]
  );

  const scale = useTransform(
    progress,
    isFirst ? [0, 0.33] : isSecond ? [0.33, 0.4, 0.6, 0.66] : [0.66, 1],
    isFirst ? [1, 0.8] : isSecond ? [0.8, 1, 1, 0.8] : [0.8, 1]
  );

  return (
    <motion.div
      style={{ opacity, scale, position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      className="flex items-center justify-center"
    >
      <StepVisual index={index} />
    </motion.div>
  );
};
