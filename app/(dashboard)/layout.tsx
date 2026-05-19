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
  User, 
  FileText, 
  Map as MapIcon,
  Settings as SettingsIcon,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import UserAvatar from "@/components/shared/UserAvatar";
import PageLoader from "@/components/shared/PageLoader";
import { motion, AnimatePresence } from "motion/react";

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
        "flex flex-col items-center justify-center gap-1.5 flex-1 h-full transition-all relative",
        isActive ? "text-teal" : "text-zinc-400 dark:text-zinc-500"
      )}
    >
      {isActive && (
        <motion.div 
          layoutId="bottomNavActive"
          className="absolute -top-1 w-8 h-1 bg-teal rounded-full"
        />
      )}
      <Icon className={cn("w-6 h-6 transition-all", isActive ? "scale-110" : "group-hover:scale-110")} />
      <span className={cn("text-[8px] font-black uppercase tracking-widest transition-opacity", isActive ? "opacity-100" : "opacity-50")}>{label}</span>
    </Link>
  );
}

function BottomNav() {
  const pathname = usePathname();

  const items = [
    { icon: LayoutDashboard, label: "Beranda", href: "/dashboard" },
    { icon: FileText, label: "Analisis", href: "/cv-builder" },
    { icon: Mic, label: "Interview", href: "/interview" },
    { icon: MapIcon, label: "Roadmap", href: "/roadmap" },
    { icon: User, label: "Profil", href: "/profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 glass rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] px-4 pb-safe z-50 flex items-center justify-around transition-all duration-300">
      {items.map((item) => (
        <BottomNavItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
          isActive={pathname === item.href}
        />
      ))}
    </nav>
  );
}

function MobileHeader({ session }: { session: any }) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="md:hidden glass fixed top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-40 border-b border-white/10">
      <Link href="/dashboard" className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-teal flex items-center justify-center shadow-lg shadow-teal/20">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <span className="font-black text-lg tracking-tighter italic text-zinc-900 dark:text-white">CareerLens</span>
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/profile" className="ring-2 ring-teal/10 rounded-full">
          <UserAvatar size="sm" />
        </Link>
        <button 
          onClick={handleLogout}
          className="size-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-all active:scale-90"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
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
    return <PageLoader isLoading={true} text="Mempersiapkan Dashboard..." subtitle="CareerLens AI Indonesian Edition" />;
  }

  if (!session) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB] dark:bg-zinc-950 transition-colors duration-300">
      {/* Sidebar - Desktop Only */}
      <Sidebar />

      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-[0.22,1,0.36,1]",
        isSidebarOpen ? "md:pl-[260px]" : "md:pl-[72px]"
      )}>
        {/* Mobile Topbar */}
        <MobileHeader session={session} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 md:p-10 pb-20 md:pb-10">
           <div className="max-w-7xl mx-auto">
            {children}
           </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />
    </div>
  );
}

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
    )
}
