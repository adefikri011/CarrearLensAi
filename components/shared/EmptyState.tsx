import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-6">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
        <Icon className="w-10 h-10 text-slate-300" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-slate-500 max-w-sm mx-auto">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <Button asChild className="bg-[#1D9E75] hover:bg-[#1D9E75]/90 rounded-xl px-8 font-semibold">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
