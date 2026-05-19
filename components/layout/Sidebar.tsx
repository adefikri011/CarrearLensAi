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
  User,
  Mic
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "motion/react";
import UserAvatar from "@/components/shared/UserAvatar";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: User, label: "Profil Karier", href: "/profile" },
  { icon: Mic, label: "Simulasi Wawancara", href: "/interview" },
  { icon: FileText, label: "Analisis CV", href: "/cv-builder" },
  { icon: RoadmapIcon, label: "Roadmap Karier", href: "/roadmap" },
  { icon: SettingsIcon, label: "Pengaturan", href: "/settings" },
];

export default function Sidebar({ 
  inDrawer = false, 
  onClose 
}: { 
  inDrawer?: boolean; 
  onClose?: () => void; 
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isSidebarOpen, toggleSidebar, clearUserData } = useAppStore();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleLogout = async () => {
    clearUserData();
    await signOut({ callbackUrl: "/" });
  };

  const sidebarContent = (
    <div className={cn(
      "h-full bg-white dark:bg-zinc-950 flex flex-col transition-colors duration-300",
      !inDrawer && "border-r border-gray-100 dark:border-zinc-800",
      inDrawer && "w-full"
    )}>
      {/* Logo Section */}
      <div className="h-24 flex items-center px-8 border-b border-gray-100/50 dark:border-white/5">
        <Link href="/dashboard" className="flex items-center gap-4 overflow-hidden group">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-teal flex items-center justify-center shadow-[0_12px_24px_-8px_rgba(29,158,117,0.4)] transition-all group-hover:scale-110 group-hover:rotate-3">
            <BrainCircuit className="w-7 h-7 text-white" />
          </div>
          {(isSidebarOpen || inDrawer) && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex flex-col"
            >
              <span className="font-black text-xl text-zinc-900 dark:text-white tracking-tighter leading-none -mb-0.5">CareerLens</span>
              <span className="font-black text-[10px] text-teal tracking-[0.3em] uppercase">AI Assistant</span>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-10 px-4 space-y-2 no-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <div key={item.href} className="relative px-2">
              <Link 
                href={item.href}
                onClick={onClose}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  "flex items-center gap-4 px-4 py-4 rounded-[1.25rem] transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-teal text-white shadow-[0_16px_32px_-12px_rgba(29,158,117,0.3)]" 
                    : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0 transition-all", isActive ? "scale-110" : "group-hover:scale-110")} />
                {(isSidebarOpen || inDrawer) && (
                  <span className={cn(
                    "font-bold text-[13px] tracking-tight whitespace-nowrap transition-colors",
                    isActive ? "text-white" : "group-hover:text-zinc-900 dark:group-hover:text-white"
                  )}>
                      {item.label}
                  </span>
                )}
                {/* Tooltip for collapsed state */}
                {!isSidebarOpen && !inDrawer && hoveredItem === item.label && (
                  <div className="absolute left-[calc(100%+1rem)] py-2.5 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-black uppercase tracking-widest rounded-xl whitespace-nowrap z-50 shadow-2xl border border-white/10 dark:border-zinc-200">
                    {item.label}
                  </div>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Footer / User Section */}
      <div className="p-6 space-y-4 border-t border-gray-100/50 dark:border-white/5">
        <div className={cn(
          "flex items-center gap-3 p-4 rounded-[1.5rem] border border-gray-100 dark:border-white/5 glass transition-all",
          !isSidebarOpen && !inDrawer && "justify-center"
        )}>
          <div className="relative">
            <UserAvatar size="sm" className="ring-2 ring-teal/20" />
            <div className="absolute -bottom-1 -right-1 size-3 bg-teal border-2 border-white dark:border-zinc-950 rounded-full" />
          </div>
          {(isSidebarOpen || inDrawer) && (
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 truncate leading-none mb-1">{session?.user?.name || "User"}</p>
              <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">Pro Level</p>
            </div>
          )}
          {(isSidebarOpen || inDrawer) && (
            <button 
              onClick={handleLogout}
              className="size-8 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-90"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {!inDrawer && (
          <div className="flex items-center gap-3">
            <ThemeToggle className="flex-1 h-12 rounded-[1.25rem]" />
            <button 
              onClick={toggleSidebar}
              className="size-12 rounded-[1.25rem] border border-gray-100 dark:border-white/5 text-zinc-400 hover:text-teal hover:bg-teal/5 transition-all shadow-sm flex items-center justify-center active:scale-90"
            >
              {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (inDrawer) {
    return sidebarContent;
  }

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isSidebarOpen ? 260 : 72
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className={cn(
        "fixed left-0 top-0 h-screen z-50 bg-white hidden md:flex flex-col"
      )}
    >
      {sidebarContent}
    </motion.aside>
  );
}
