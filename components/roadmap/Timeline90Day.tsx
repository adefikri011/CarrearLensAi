"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  Youtube, 
  Link as LinkIcon, 
  BookOpen, 
  Code, 
  Users, 
  Briefcase 
} from "lucide-react";
import { RoadmapItem } from "@/types/analysis";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Timeline90DayProps {
  items: RoadmapItem[];
}

const categoryIcons = {
  belajar: BookOpen,
  praktek: Code,
  networking: Users,
  portofolio: Briefcase,
};

const categoryColors = {
  belajar: "bg-blue-50 text-blue-600 border-blue-100",
  praktek: "bg-[#1D9E75]/10 text-[#1D9E75] border-[#1D9E75]/20",
  networking: "bg-[#534AB7]/10 text-[#534AB7] border-[#534AB7]/20",
  portofolio: "bg-amber-50 text-amber-600 border-amber-100",
};

export default function Timeline90Day({ items }: Timeline90DayProps) {
  return (
    <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
      {items.map((item, index) => {
        // Fallback or heuristic for icons if category is missing
        const Icon = BookOpen;
        const colorClass = "bg-teal-light text-teal border-teal/10";

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[37px] top-0 w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10">
              <Circle className="w-3 h-3 text-slate-300" />
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0">
                    W{item.minggu}
                  </div>
                  <div>
                    <Badge variant="outline" className={cn("uppercase tracking-wider text-[10px] font-bold py-0.5", colorClass)}>
                      {item.fase}
                    </Badge>
                    <h4 className="text-lg font-bold text-slate-800">{item.title}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                    ~{item.hours}
                  </span>
                </div>
              </div>

              {item.tasks && item.tasks.length > 0 && (
                <div className="space-y-2 mb-4">
                  {item.tasks.map((task, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal mt-1.5 shrink-0" />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              )}

              {item.resource && (
                <div className="flex items-center gap-4 pt-4 border-t border-slate-50 mt-4">
                  <a 
                    href={item.resourceLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] group-hover:bg-[#1D9E75] group-hover:text-white transition-colors">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-0.5">Resources</p>
                      <p className="text-sm font-bold text-slate-700 group-hover:text-[#1D9E75] transition-colors">{item.resource}</p>
                    </div>
                  </a>
                </div>
              )}

              {/* Action Checkbox (Visual Only for now) */}
              <button className="absolute top-6 right-6 w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-200 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-all">
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
