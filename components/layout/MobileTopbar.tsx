"use client";

import React from "react";
import { Menu, BrainCircuit, Bell, User } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useSession } from "next-auth/react";

export default function MobileTopbar() {
  const { toggleSidebar } = useAppStore();
  const { data: session } = useSession();

  return (
    <div className="lg:hidden h-16 bg-white/80 backdrop-blur-xl border-b border-[#F3F4F6] flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center shadow-lg shadow-teal/10">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-[#030712] tracking-tight text-sm sm:text-base truncate">
          CareerLens <span className="text-teal">AI</span>
        </span>
      </div>
      
      <div className="flex items-center gap-3">
         <button className="p-2 text-text-muted hover:text-text-primary transition-colors">
            <Bell className="w-5 h-5" />
         </button>
         <button 
           onClick={toggleSidebar}
           className="p-2 text-text-primary bg-surface rounded-xl"
         >
           <Menu className="w-6 h-6" />
         </button>
      </div>
    </div>
  );
}
