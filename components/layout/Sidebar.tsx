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
      "h-full bg-white flex flex-col",
      !inDrawer && "border-r border-gray-100",
      inDrawer && "w-full"
    )}>
      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-gray-50">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-black flex items-center justify-center shadow-sm">
            <BrainCircuit className="w-6 h-6 text-teal" />
          </div>
          {(isSidebarOpen || inDrawer) && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex flex-col"
            >
              <span className="font-bold text-black tracking-tight whitespace-nowrap">CareerLens AI</span>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1 no-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <div key={item.href} className="relative">
              <Link 
                href={item.href}
                onClick={onClose}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  "flex items-center gap-4 px-3 py-3.5 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-teal-light/30 text-teal" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-black"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-teal" : "text-gray-400 group-hover:text-black")} />
                {(isSidebarOpen || inDrawer) && (
                  <span className="font-bold text-[14px] whitespace-nowrap overflow-hidden">
                      {item.label}
                  </span>
                )}
                {/* Tooltip for collapsed state */}
                {!isSidebarOpen && !inDrawer && hoveredItem === item.label && (
                  <div className="absolute left-16 bg-black text-white text-[10px] font-bold py-2 px-3 rounded-lg whitespace-nowrap z-50 shadow-xl">
                    {item.label}
                  </div>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Footer / User Section */}
      <div className="p-4 space-y-3 border-t border-gray-50">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/50",
          !isSidebarOpen && !inDrawer && "justify-center"
        )}>
          <div className="w-8 h-8 shrink-0 rounded-full bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
            {session?.user?.id ? (
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-gray-400" />
            )}
          </div>
          {(isSidebarOpen || inDrawer) && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-black truncate leading-none">{session?.user?.name || "User"}</p>
            </div>
          )}
          {(isSidebarOpen || inDrawer) && (
            <button 
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {!inDrawer && (
          <button 
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center h-10 rounded-xl border border-gray-100 text-gray-400 hover:text-teal hover:bg-gray-50 transition-all font-bold text-[10px] uppercase tracking-widest gap-2"
          >
             {isSidebarOpen ? (
               <>
                 <ChevronLeft className="w-4 h-4" />
                 <span>Sembunyikan</span>
               </>
             ) : (
               <ChevronRight className="w-4 h-4" />
             )}
          </button>
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
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed left-0 top-0 h-screen z-50 bg-white hidden md:flex flex-col"
      )}
    >
      {sidebarContent}
    </motion.aside>
  );
}
