"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
}

export default function LoadingSpinner({ 
  size = "md", 
  className,
  color = "#1D9E75"
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-14 h-14",
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      {/* Background Track */}
      <div 
        className="absolute inset-0 rounded-full border-[3px] border-gray-100 dark:border-zinc-800" 
      />
      
      {/* Animated Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          borderTopColor: color,
          borderRightColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: "transparent",
        }}
        className="absolute inset-0 rounded-full border-[3px] z-10"
      />
      
      {/* Inner Pulse for extra "AI" vibe */}
      <motion.div
        animate={{ 
          scale: [0.8, 1.1, 0.8],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ backgroundColor: color }}
        className="w-1 h-1 rounded-full blur-[2px]"
      />
    </div>
  );
}

