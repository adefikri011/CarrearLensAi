"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Map as RoadmapIcon, 
  Search as ExploreIcon, 
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Zap,
  LogOut,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: User, label: "Profil Karier", href: "/profile" },
  { icon: FileText, label: "Analisis CV", href: "/cv-builder" },
  { icon: RoadmapIcon, label: "Roadmap Karier", href: "/roadmap" },
  { icon: ExploreIcon, label: "Eksplorasi", href: "/explore" },
  { icon: SettingsIcon, label: "Pengaturan", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isSidebarOpen, toggleSidebar } = useAppStore();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 260 : 72,
          x: (typeof window !== "undefined" && window.innerWidth < 1024) 
            ? (isSidebarOpen ? 0 : -300) 
            : 0
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed left-0 top-0 h-screen z-50 bg-white border-r border-[#F3F4F6] flex flex-col",
          "lg:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-4 border-b border-[#F3F4F6]">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-teal flex items-center justify-center shadow-lg shadow-teal/10">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="flex flex-col"
              >
                <span className="font-bold text-[#030712] tracking-tight whitespace-nowrap">CareerLens AI</span>
                <span className="text-[10px] text-teal font-black tracking-widest uppercase leading-none">PREMIUM</span>
              </motion.div>
            )}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-8 px-3 space-y-1.5 no-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.href} className="relative">
                <Link 
                  href={item.href}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                    isActive 
                      ? "bg-teal-light text-teal border border-teal-mid/20" 
                      : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                  )}
                >
                  <item.icon className={cn("w-6 h-6 shrink-0", isActive ? "text-teal" : "text-text-muted group-hover:text-text-primary")} />
                  {isSidebarOpen && (
                    <span className="font-medium text-[15px] whitespace-nowrap overflow-hidden hidden lg:inline">
                        {item.label}
                    </span>
                  )}
                  {/* Tooltip for collapsed state */}
                  {!isSidebarOpen && hoveredItem === item.label && (
                    <div className="absolute left-16 bg-[#030712] text-white text-xs font-bold py-2 px-4 rounded-lg whitespace-nowrap z-50 shadow-xl">
                      {item.label}
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Footer / User Section */}
        <div className="p-4 space-y-4 border-t border-[#F3F4F6]">
          {isSidebarOpen && (
             <div className="p-4 bg-purple-light rounded-2xl border border-purple/10 group overflow-hidden relative">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-purple/10 blur-xl rounded-full" />
                <div className="flex items-center gap-2 text-[10px] font-black text-purple uppercase tracking-widest mb-1">
                   <Zap className="w-3 h-3 fill-current" />
                   Edisi Pro
                </div>
                <p className="text-[11px] text-purple/70 font-medium leading-tight mb-3">Analisis unlimitied & roadmap 90 hari.</p>
                <button className="w-full h-8 flex items-center justify-center bg-purple text-white text-[11px] font-bold rounded-lg hover:bg-purple/90 transition-all">
                  Upgrade
                </button>
             </div>
          )}

          <div className={cn(
            "flex items-center gap-3 p-3 rounded-2xl border border-[#F3F4F6] bg-surface",
            !isSidebarOpen && "justify-center"
          )}>
            <div className="w-10 h-10 shrink-0 rounded-full bg-white border border-[#E5E7EB] overflow-hidden flex items-center justify-center">
              {session?.user?.image ? (
                 <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-text-muted" />
              )}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-primary truncate leading-none mb-1">{session?.user?.name || "User"}</p>
                <div className="flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                   <span className="text-[10px] font-bold text-teal tracking-wide uppercase">Free Tier</span>
                </div>
              </div>
            )}
            {isSidebarOpen && (
              <button 
                onClick={() => signOut()}
                className="p-1.5 text-text-faint hover:text-red-500 transition-colors"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <button 
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center h-10 rounded-xl border border-[#F3F4F6] text-text-faint hover:text-teal hover:bg-teal-light/50 transition-all"
          >
             {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
