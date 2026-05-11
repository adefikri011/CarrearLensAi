"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({ 
  size = "md", 
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-3",
    lg: "w-10 h-10 border-4",
  };

  return (
    <div
      id="loading-spinner"
      className={cn(
        "rounded-full border-gray-100 border-t-[#1D9E75] animate-spin",
        sizeClasses[size],
        className
      )}
    />
  );
}
