"use client";

import React, { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import { 
  BrainCircuit, 
  LayoutDashboard, 
  User, 
  FileText, 
  Map as MapIcon 
} from "lucide-react";
import Link from "next/link";

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
        "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
        isActive ? "text-[#1D9E75]" : "text-[#9CA3AF]"
      )}
    >
      <Icon className={cn("w-5 h-5", isActive ? "text-[#1D9E75]" : "text-[#9CA3AF]")} />
      <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </Link>
  );
}

function BottomNav() {
  const pathname = usePathname();

  const items = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: User, label: "Profil Karier", href: "/profile" },
    { icon: FileText, label: "Analisis CV", href: "/cv-builder" },
    { icon: MapIcon, label: "Roadmap Karier", href: "/roadmap" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 px-2 pb-safe z-50 flex items-center justify-around shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
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
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
             <div className="w-16 h-16 rounded-2xl bg-teal-light flex items-center justify-center">
               <BrainCircuit className="w-8 h-8 text-teal animate-pulse" />
             </div>
             <div className="absolute -inset-2 border-2 border-teal/20 border-t-teal rounded-[20px] animate-spin" />
          </div>
          <p className="text-[13px] font-black text-teal tracking-[0.2em] uppercase">Memuat CareerLens AI...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
      {/* Sidebar - Desktop Only */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-[0.22,1,0.36,1]",
        isSidebarOpen ? "md:pl-[260px]" : "md:pl-[72px]"
      )}>
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
        <SessionProvider>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </SessionProvider>
    )
}
