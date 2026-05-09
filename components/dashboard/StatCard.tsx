import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  color: "teal" | "purple" | "orange" | "blue" | "red";
  trend?: string;
}

const colorStyles = {
  teal: "bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-900/30",
  purple: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30",
  orange: "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/30",
  blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30",
  red: "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30",
};

const iconBackgrounds = {
  teal: "bg-[#1D9E75]/10",
  purple: "bg-[#534AB7]/10",
  orange: "bg-[#EF9F27]/10",
  blue: "bg-blue-100",
  red: "bg-red-100",
};

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300",
          iconBackgrounds[color]
        )}>
          <Icon className={cn(
            "w-6 h-6",
            color === "teal" && "text-[#1D9E75]",
            color === "purple" && "text-[#534AB7]",
            color === "orange" && "text-[#EF9F27]",
            color === "blue" && "text-blue-600",
            color === "red" && "text-red-600"
          )} />
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        <p className="text-xs text-slate-400 mt-2 line-clamp-1">{description}</p>
      </div>
    </div>
  );
}
