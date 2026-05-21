"use client";

import React, { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { 
  BrainCircuit, 
  Mic,
  LayoutDashboard, 
  FileText, 
  Map as MapIcon,
  Settings as SettingsIcon,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import UserAvatar from "@/components/shared/UserAvatar";
import PageLoader from "@/components/shared/PageLoader";
import { motion } from "motion/react";
import CareerCoPilotChat from "@/components/shared/CareerCoPilotChat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Bottom Nav Item ───────────────────────────────────────────────────────────
interface BottomNavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

function BottomNavItem({ href, icon: Icon, label, isActive }: BottomNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all active:scale-90",
        isActive
          ? "text-[#1D9E75] dark:text-emerald-400"
          : "text-zinc-400 dark:text-zinc-500"
      )}
    >
      <Icon
        className={cn("w-5 h-5 transition-all duration-200", isActive && "scale-110")}
        strokeWidth={isActive ? 2.5 : 1.8}
      />
      <span className={cn(
        "text-[9px] tracking-tight transition-all",
        isActive ? "font-extrabold" : "font-medium"
      )}>
        {label}
      </span>
    </Link>
  );
}

// ─── Bottom Navigation ─────────────────────────────────────────────────────────
function BottomNav() {
  const pathname = usePathname();

  const leftItems = [
    { icon: LayoutDashboard, label: "Beranda",     href: "/dashboard" },
    { icon: FileText,        label: "Analisis CV", href: "/cv-builder" },
  ];

  const rightItems = [
    { icon: MapIcon,      label: "Roadmap",    href: "/roadmap" },
    { icon: SettingsIcon, label: "Pengaturan", href: "/settings" },
  ];

  const isInterviewActive = pathname === "/interview";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-[62px] bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.07)] dark:shadow-none transition-colors duration-300">
      <div className="flex items-center h-full px-3 gap-1">
        {leftItems.map((item) => (
          <BottomNavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
          />
        ))}

        {/* Center — Interview */}
        <Link href="/interview" className="flex-1 flex justify-center">
          <motion.div
            whileTap={{ scale: 0.93 }}
            className="flex flex-col items-center justify-center gap-1"
          >
            <div
              className="flex flex-col items-center justify-center gap-1 px-5 py-2 rounded-2xl transition-all duration-200"
              style={isInterviewActive ? {
                background: "linear-gradient(135deg, #1D9E75 0%, #534AB7 100%)",
                boxShadow: "0 4px 14px rgba(29,158,117,0.28)",
              } : undefined}
            >
              <Mic
                className={cn(
                  "w-[19px] h-[19px] transition-all duration-200",
                  isInterviewActive ? "text-white scale-110" : "text-zinc-400 dark:text-zinc-500"
                )}
                strokeWidth={isInterviewActive ? 2.5 : 1.8}
              />
              <span className={cn(
                "text-[9px] tracking-tight transition-all",
                isInterviewActive
                  ? "font-extrabold text-white"
                  : "font-medium text-zinc-400 dark:text-zinc-500"
              )}>
                Interview
              </span>
            </div>
          </motion.div>
        </Link>

        {rightItems.map((item) => (
          <BottomNavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
          />
        ))}
      </div>
    </nav>
  );
}

// ─── Mobile Header ─────────────────────────────────────────────────────────────
function MobileHeader({ session }: { session: any }) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="md:hidden relative h-14 bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800/80 px-4 flex items-center justify-between z-40 transition-colors duration-300">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center shadow-sm"
          style={{ background: "linear-gradient(135deg, #1D9E75 0%, #534AB7 100%)" }}
        >
          <BrainCircuit className="w-[17px] h-[17px] text-white" />
        </div>
        <div className="flex flex-col leading-none gap-[3px]">
          <span className="font-black text-[12.5px] tracking-tighter text-zinc-900 dark:text-white uppercase leading-none">
            CareerLens
          </span>
          <span className="text-[7.5px] font-bold tracking-[0.2em] uppercase text-[#1D9E75] leading-none">
            AI Assistant
          </span>
        </div>
      </Link>

      {/* Right — Avatar Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1.5 outline-none focus:outline-none group">
            <div className="relative">
              <div className="rounded-full ring-2 ring-transparent group-hover:ring-[#1D9E75]/25 transition-all duration-200">
                <UserAvatar size="sm" />
              </div>
              {/* Online dot */}
              <span className="absolute bottom-0 right-0 w-[9px] h-[9px] bg-emerald-500 rounded-full border-[1.5px] border-white dark:border-zinc-950" />
            </div>
            <ChevronDown className="w-3 h-3 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={10}
          className="w-52 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl p-1.5"
        >
          {/* User info label */}
          <DropdownMenuLabel className="px-2.5 py-2 flex items-center gap-2.5">
            <div className="relative shrink-0">
              <UserAvatar size="sm" />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-zinc-950" />
            </div>
            <div className="flex flex-col leading-none gap-0.5 min-w-0">
              <span className="text-[12px] font-black text-zinc-900 dark:text-zinc-100 truncate">
                {session?.user?.name || "User"}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium truncate">
                {session?.user?.email || ""}
              </span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1 bg-zinc-100 dark:bg-zinc-800" />

          {/* Profile */}
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl cursor-pointer text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              </div>
              <div className="flex flex-col leading-none gap-0.5">
                <span className="text-[12px] font-bold">Profil Saya</span>
                <span className="text-[10px] text-zinc-400">Lihat & edit profil</span>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 bg-zinc-100 dark:bg-zinc-800" />

          {/* Logout */}
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
          >
            <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
              <LogOut className="w-3.5 h-3.5 text-red-500" />
            </div>
            <div className="flex flex-col leading-none gap-0.5">
              <span className="text-[12px] font-bold">Keluar</span>
              <span className="text-[10px] text-red-400">Logout dari akun</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

// ─── Layout Content ────────────────────────────────────────────────────────────
function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isSidebarOpen, setSidebarOpen } = useAppStore();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  if (status === "loading") {
    return (
      <PageLoader
        isLoading={true}
        text="Mempersiapkan Dashboard..."
        subtitle="CareerLens AI Indonesian Edition"
      />
    );
  }

  if (!session) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB] dark:bg-zinc-950 transition-colors duration-300">
      <Sidebar />

      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isSidebarOpen ? "md:pl-[260px]" : "md:pl-[72px]"
        )}
      >
        <MobileHeader session={session} />

        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 md:p-10 pb-24 md:pb-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      <BottomNav />
      <CareerCoPilotChat />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}