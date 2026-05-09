"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  const tiers = [
    {
      name: "Free",
      price: "0",
      desc: "Cocok untuk eksplorasi awal karier kamu.",
      features: ["1 Analisis CV / Bulan", "Skor ATS Dasar", "Roadmap 30 Hari", "Bantuan AI Dasar"],
      cta: "Pilih Gratis",
      featured: false
    },
    {
      name: "Pro",
      price: isYearly ? "39" : "49",
      desc: "Pilihan terbaik untuk persiapan kerja serius.",
      features: ["Unlimited Analisis CV", "Skor ATS Mendalam", "Roadmap 90 Hari", "Priority AI Support"],
      cta: "Mulai Pro",
      featured: true
    },
    {
      name: "Team",
      price: "Custom",
      desc: "Solusi untuk instansi pendidikan dan batch besar.",
      features: ["Dashboard untuk Admin", "Analisis Masal", "Career Tracking", "Custom Integration"],
      cta: "Hubungi Kami",
      featured: false
    }
  ];

  return (
    <section id="harga" className="py-20 lg:py-60 px-5 md:px-10 bg-white">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-16 lg:mb-24 max-w-3xl mx-auto">
           <span className="text-[10px] lg:text-[12px] font-bold tracking-[3px] uppercase text-[#1D9E75] mb-4 lg:mb-6 block">04 / HARGA</span>
           <h3 className="text-4xl lg:text-7xl font-bold tracking-[-2px] lg:tracking-[-3px] text-[#0A0A0A] leading-[1] mb-10">
             Pilih Langkah <br />Karier Selanjutnya.
           </h3>
           
           {/* Toggle */}
           <div className="inline-flex items-center p-1 bg-[#F8F8F8] rounded-full border border-[#EFEFEF]">
              <button 
                onClick={() => setIsYearly(false)}
                className={cn(
                  "px-6 lg:px-8 py-2.5 lg:py-3 rounded-full text-[12px] lg:text-[13px] font-bold tracking-tight transition-all",
                  !isYearly ? "bg-white text-[#0A0A0A] shadow-sm" : "text-[#888888] hover:text-[#0A0A0A]"
                )}
              >
                Bulanan
              </button>
              <button 
                onClick={() => setIsYearly(true)}
                className={cn(
                  "px-6 lg:px-8 py-2.5 lg:py-3 rounded-full text-[12px] lg:text-[13px] font-bold tracking-tight transition-all flex items-center gap-2",
                  isYearly ? "bg-white text-[#0A0A0A] shadow-sm" : "text-[#888888] hover:text-[#0A0A0A]"
                )}
              >
                Tahunan
                <span className="text-[9px] bg-[#1D9E75]/10 text-[#1D9E75] px-1.5 py-0.5 rounded-full">-20%</span>
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
           {tiers.map((tier, i) => (
             <motion.div
               key={tier.name}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
               className={cn(
                 "p-8 lg:p-12 rounded-[32px] lg:rounded-[48px] border flex flex-col transition-all duration-500",
                 tier.featured 
                   ? "bg-[#0A0A0A] text-white border-[#0A0A0A] lg:scale-105 shadow-2xl z-10" 
                   : "bg-white text-[#0A0A0A] border-[#EFEFEF]"
               )}
             >
                {tier.featured && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D9E75] text-white text-[9px] font-bold tracking-widest uppercase mb-6 lg:mb-8 self-start">
                    <Sparkles size={12} />
                    Paling Populer
                  </div>
                )}
                <span className={cn("text-[10px] lg:text-[12px] font-bold tracking-[2px] uppercase mb-2", tier.featured ? "text-[#1D9E75]" : "text-[#888888]")}>
                  {tier.name}
                </span>
                
                <div className="flex items-baseline gap-1 mb-4 lg:mb-6">
                   <h4 className="text-4xl lg:text-5xl font-bold tracking-tighter">
                     {tier.price !== "Custom" ? `Rp${tier.price}k` : tier.price}
                   </h4>
                   {tier.price !== "Custom" && (
                     <span className={cn("text-[13px] lg:text-[14px] font-medium opacity-50", tier.featured ? "text-white" : "text-[#0A0A0A]")}>
                       /bulan
                     </span>
                   )}
                </div>

                <p className={cn("text-[14px] lg:text-[15px] font-medium leading-relaxed mb-8 lg:mb-10", tier.featured ? "text-white/60" : "text-[#888888]")}>
                  {tier.desc}
                </p>

                <div className="space-y-4 mb-10 lg:mb-12 flex-1">
                   {tier.features.map((f, i) => (
                     <div key={i} className="flex items-center gap-4 text-[13px] lg:text-[14px] font-medium">
                        <Check size={18} className="text-[#1D9E75] shrink-0" />
                        <span className={tier.featured ? "text-white/90" : "text-[#0A0A0A]"}>{f}</span>
                     </div>
                   ))}
                </div>

                <button className={cn(
                  "w-full py-4 lg:py-5 rounded-2xl lg:rounded-[24px] text-[12px] lg:text-[14px] font-bold tracking-widest uppercase transition-all active:scale-[0.98]",
                  tier.featured 
                    ? "bg-[#1D9E75] text-[#0A0A0A] hover:bg-[#1D9E75]/90" 
                    : "bg-[#F8F8F8] text-[#0A0A0A] border border-[#EFEFEF] hover:bg-[#0A0A0A] hover:text-white"
                )}>
                  {tier.cta}
                </button>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};
