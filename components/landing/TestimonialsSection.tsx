"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
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
    <section id="testimoni" className="py-24 lg:py-60 bg-[#F8F8F8] px-5 lg:px-10 overflow-hidden">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 lg:gap-12 mb-16 lg:mb-24">
           <div className="max-w-2xl">
              <span className="text-[12px] font-bold tracking-[3px] uppercase text-[#4D4D4D] mb-4 block">03 / TESTIMONI</span>
              <h3 className="text-[clamp(32px,8vw,64px)] font-bold tracking-[-1px] lg:tracking-[-3px] text-[#0A0A0A] leading-[1.1]">
                Kisah Mereka yang Menemukan Jalannya.
              </h3>
           </div>
           
           <div className="flex gap-4">
              <button 
                onClick={prev}
                aria-label="Testimoni sebelumnya"
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#EFEFEF] bg-white flex items-center justify-center hover:bg-[#0A0A0A] hover:text-white transition-all shadow-sm active:scale-90"
              >
                 <ChevronLeft size={20} />
              </button>
              <button 
                onClick={next}
                aria-label="Testimoni berikutnya"
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#EFEFEF] bg-white flex items-center justify-center hover:bg-[#0A0A0A] hover:text-white transition-all shadow-sm active:scale-90"
              >
                 <ChevronRight size={20} />
              </button>
           </div>
        </div>

        <div className="relative h-[480px] sm:h-[400px] lg:h-[300px]">
           <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-start lg:items-center text-left lg:text-center max-w-4xl mx-auto"
              >
                 <div className="flex gap-1 text-[#1D9E75] mb-8">
                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#1D9E75" />)}
                 </div>

                 <p className="text-[clamp(18px,4vw,32px)] font-normal text-[#0A0A0A] italic tracking-tight leading-[1.6] mb-10">
                   &quot;{testimonials[index].text}&quot;
                 </p>

                 <div className="flex items-center gap-4 lg:gap-6 text-left mt-auto lg:mt-0">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#1D9E75] flex items-center justify-center text-white text-lg font-bold">
                       {testimonials[index].avatar}
                    </div>
                    <div>
                       <h4 className="text-[17px] font-bold text-[#0A0A0A]">{testimonials[index].name}</h4>
                       <p className="text-[14px] text-[#4D4D4D] font-medium">{testimonials[index].role}</p>
                    </div>
                 </div>
              </motion.div>
           </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-start lg:justify-center gap-3 mt-12">
           {testimonials.map((_, i) => (
             <button
               key={i}
               onClick={() => setIndex(i)}
               aria-label={`Lihat testimoni ke-${i + 1}`}
               className={cn(
                 "h-1.5 rounded-full transition-all duration-300",
                 index === i ? "w-8 bg-[#1D9E75]" : "w-3 bg-[#EFEFEF]"
               )}
             />
           ))}
        </div>
      </div>
    </section>
  );
};
