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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-colors"
        >
          <div className="flex flex-col items-center gap-4">
             {/* Logo Placeholder */}
             <div className="mb-2">
                <span className="text-xl font-black tracking-tight text-black dark:text-white italic">
                   CareerLens <span className="text-teal">AI</span>
                </span>
             </div>
             
             <LoadingSpinner size="lg" />
             
             <div className="text-center space-y-1">
                {text && (
                  <p className="text-black dark:text-white text-lg font-bold">
                    {text}
                  </p>
                )}
                {subtitle && (
                  <p className="text-gray-400 dark:text-zinc-500 text-sm font-medium animate-pulse">
                    {subtitle}
                  </p>
                )}
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
