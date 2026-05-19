"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="bg-[#0A0A0A] py-24 lg:py-48 px-5 lg:px-6 overflow-hidden">
      <div className="container max-w-7xl mx-auto flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="relative z-10 w-full"
        >
          <span className="text-[10px] lg:text-[12px] font-bold tracking-[4px] lg:tracking-[6px] uppercase text-[#1D9E75] mb-6 lg:mb-8 block">MULAI SEKARANG</span>
          <h2 className="text-[44px] sm:text-6xl lg:text-9xl font-bold tracking-[-2px] sm:tracking-[-5px] text-white leading-[1] lg:leading-[0.8] mb-12 lg:mb-16">
            Siapkan Diri.<br />
            Luncurkan Karier.
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center">
             <button className="h-16 lg:h-20 px-10 lg:px-16 bg-[#1D9E75] text-[#0A0A0A] rounded-full font-bold text-[14px] lg:text-[16px] tracking-tight hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-95">
                Daftar Gratis Sekarang
                <ArrowRight size={20} />
             </button>
             <button className="h-16 lg:h-20 px-10 lg:px-16 bg-white/5 text-white border border-white/10 rounded-full font-bold text-[14px] lg:text-[16px] tracking-tight hover:bg-white/10 transition-all active:scale-95">
                Lihat Demo AI
             </button>
          </div>
        </motion.div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-white/10 to-transparent" />
           <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-white/10 to-transparent" />
        </div>
      </div>
    </section>
  );
};
