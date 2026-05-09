"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah Amanda",
    role: "Digital Talent Graduate",
    text: "Analisisnya sangat mendalam. Saya jadi tahu kalau skill desain saya lebih cocok di UI/UX daripada desain grafis biasa. Roadmap 90 harinya sangat membantu langkah awal saya.",
    avatar: "SA"
  },
  {
    name: "Rizky Fauzi",
    role: "Junior Web Developer",
    text: "Platform ini luar biasa! Skor ATS yang diberikan benar-benar akurat. Setelah memperbaiki CV sesuai saran AI, saya langsung dipanggil interview di 3 perusahaan dalam seminggu.",
    avatar: "RF"
  },
  {
    name: "Budi Santoso",
    role: "Tech Career Seeker",
    text: "Analysis CV-nya membantu banget, skor saya naik pesat setelah mengikuti saran perbaikan dari AI. Platform yang wajib dimiliki setiap pencari kerja di Indonesia.",
    avatar: "BS"
  }
];

export const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="testimoni" className="py-20 lg:py-60 bg-[#F8F8F8] px-5 md:px-10 overflow-hidden">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 lg:gap-12 mb-16 lg:mb-24">
           <div className="max-w-2xl">
              <span className="text-[10px] lg:text-[12px] font-bold tracking-[3px] uppercase text-[#888888] mb-4 lg:mb-6 block">03 / TESTIMONI</span>
              <h3 className="text-4xl lg:text-7xl font-bold tracking-[-2px] lg:tracking-[-3px] text-[#0A0A0A] leading-[1]">
                Kisah Mereka yang Menemukan Jalannya.
              </h3>
           </div>
           
           <div className="flex gap-4">
              <button 
                onClick={prev}
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#EFEFEF] bg-white flex items-center justify-center hover:bg-[#0A0A0A] hover:text-white transition-all shadow-sm"
              >
                 <ChevronLeft size={20} className="lg:w-6 lg:h-6" />
              </button>
              <button 
                onClick={next}
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#EFEFEF] bg-white flex items-center justify-center hover:bg-[#0A0A0A] hover:text-white transition-all shadow-sm"
              >
                 <ChevronRight size={20} className="lg:w-6 lg:h-6" />
              </button>
           </div>
        </div>

        <div className="relative h-[440px] lg:h-[400px]">
           <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.98, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98, x: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col items-start lg:items-center text-left lg:text-center max-w-4xl mx-auto"
              >
                 <div className="flex gap-1 text-[#1D9E75] mb-8 lg:mb-10">
                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#1D9E75" className="lg:w-5 lg:h-5" />)}
                 </div>

                 <p className="text-xl lg:text-4xl font-normal text-[#0A0A0A] italic tracking-tight leading-[1.5] mb-8 lg:mb-12">
                   &quot;{testimonials[index].text}&quot;
                 </p>

                 <div className="flex items-center gap-4 lg:gap-6 text-left">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#1D9E75] flex items-center justify-center text-white text-lg font-bold">
                       {testimonials[index].avatar}
                    </div>
                    <div>
                       <h4 className="text-[15px] lg:text-[17px] font-bold text-[#0A0A0A]">{testimonials[index].name}</h4>
                       <p className="text-[13px] lg:text-[14px] text-[#888888] font-medium">{testimonials[index].role}</p>
                    </div>
                 </div>
              </motion.div>
           </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-start lg:justify-center gap-2 mt-8 lg:mt-12">
           {testimonials.map((_, i) => (
             <button
               key={i}
               onClick={() => setIndex(i)}
               className={cn(
                 "h-1 rounded-full transition-all duration-300",
                 index === i ? "w-6 bg-[#1D9E75]" : "w-3 bg-[#EFEFEF]"
               )}
             />
           ))}
        </div>
      </div>
    </section>
  );
};
