"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

interface PageLoaderProps {
  isLoading: boolean;
  text?: string;
}

export default function PageLoader({ 
  isLoading, 
  text = "Memuat..." 
}: PageLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          id="page-loader-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
        >
          <div className="flex flex-col items-center gap-4">
             {/* Logo Placeholder */}
             <div className="mb-2">
                <span className="text-xl font-black tracking-tight text-black italic">
                   CareerLens <span className="text-teal">AI</span>
                </span>
             </div>
             
             <LoadingSpinner size="lg" />
             
             {text && (
               <p className="text-gray-400 text-sm font-medium animate-pulse">
                 {text}
               </p>
             )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
