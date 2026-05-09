"use client";

import React, { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MobileTopbar from "@/components/layout/MobileTopbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import { BrainCircuit } from "lucide-react";

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
      if (window.innerWidth < 1024) {
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
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-[0.22,1,0.36,1]",
        isSidebarOpen ? "lg:pl-[260px]" : "lg:pl-[72px]"
      )}>
        <MobileTopbar />
        <main className="p-6 md:p-10 w-full">
           <div className="max-w-7xl mx-auto">
            {children}
           </div>
        </main>
      </div>
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
