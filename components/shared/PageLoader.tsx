"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

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
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-colors"
        >
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.01] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          
          <div className="flex flex-col items-center gap-10 relative z-10">
             {/* Logo */}
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.1 }}
               className="mb-2"
             >
                <span className="text-3xl font-black tracking-[-2px] text-black dark:text-white uppercase italic">
                   CareerLens <span className="text-teal">AI</span>
                </span>
             </motion.div>
             
             <div className="relative">
                <div className="absolute inset-0 bg-teal/10 blur-3xl rounded-full" />
                <LoadingSpinner size="lg" className="w-16 h-16 relative z-10" />
             </div>
             
             <div className="text-center space-y-3">
                {text && (
                  <motion.p 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-black dark:text-white text-xl font-black lowercase tracking-tighter italic"
                  >
                    / {text} /
                  </motion.p>
                )}
                {subtitle && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-400 dark:text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse"
                  >
                    {subtitle}
                  </motion.p>
                )}
             </div>
          </div>

          <div className="absolute bottom-12 text-[10px] font-black text-gray-300 dark:text-zinc-800 tracking-[0.4em] uppercase">
             VibeCoding 2026 Edition
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
