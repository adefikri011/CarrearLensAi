"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import LoadingSpinner from "./LoadingSpinner";
import { BrainCircuit } from "lucide-react";

interface PageLoaderProps {
  isLoading: boolean;
  text?: string;
  subtitle?: string;
}

export default function PageLoader({ 
  isLoading, 
  text = "Memuat...",
  subtitle
}: PageLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          id="page-loader-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-colors duration-500"
        >
          {/* Enhanced Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.02] pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(currentColor 1.5px, transparent 1.5px)', 
              backgroundSize: '40px 40px' 
            }} 
          />
          
          <div className="flex flex-col items-center relative z-10">
             {/* Icon/Logo area */}
             <motion.div 
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 0.6, ease: "easeOut" }}
               className="flex items-center gap-3 mb-10"
             >
                <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-lg">
                  <BrainCircuit className="text-[#1D9E75] w-6 h-6" />
                </div>
                <span className="text-2xl font-black tracking-[-1px] text-black dark:text-white uppercase italic">
                   CareerLens <span className="text-[#1D9E75]">AI</span>
                </span>
             </motion.div>
             
             {/* Spinner with Glow */}
             <div className="relative mb-8">
                <div className="absolute inset-0 bg-[#1D9E75]/20 blur-2xl rounded-full" />
                <LoadingSpinner size="lg" className="relative z-10" />
             </div>
             
             {/* Text area */}
             <div className="text-center">
                <motion.div
                   initial={{ y: 10, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.2, duration: 0.5 }}
                >
                   <p className="text-black dark:text-white text-lg font-bold tracking-tight mb-2">
                     {text}
                   </p>
                   {subtitle ? (
                     <p className="text-gray-400 dark:text-zinc-600 text-[11px] font-bold uppercase tracking-[0.2em]">
                       {subtitle}
                     </p>
                   ) : (
                     <div className="flex justify-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              opacity: [0.2, 1, 0.2],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                            className="w-1 h-1 rounded-full bg-[#1D9E75]"
                          />
                        ))}
                     </div>
                   )}
                </motion.div>
             </div>
          </div>

          {/* Footer badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-12 flex flex-col items-center gap-3"
          >
             <div className="h-[1px] w-12 bg-gray-100 dark:bg-zinc-800" />
             <div className="text-[10px] font-black text-gray-400 dark:text-zinc-700 tracking-[0.3em] uppercase">
                JuaraVibeCoding 2026 Edition
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

