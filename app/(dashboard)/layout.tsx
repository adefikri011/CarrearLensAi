"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import { BrainCircuit, Bell, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isSidebarOpen, setSidebarOpen } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        setIsMobileMenuOpen(false);
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
      {/* Sidebar - hidden on mobile flow, but shown on desktop */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-[0.22,1,0.36,1]",
        isSidebarOpen ? "md:pl-[260px]" : "md:pl-[72px]"
      )}>
        {/* Mobile Topbar */}
        <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center shadow-lg shadow-teal/10">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-[#030712] tracking-tight">
              CareerLens <span className="text-teal">AI</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-black transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-black bg-gray-50 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 md:p-10">
           <div className="max-w-7xl mx-auto">
            {children}
           </div>
        </main>
      </div>

      {/* Mobile drawer menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            />
            
            {/* Sidebar content in Drawer */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 h-full w-[280px] bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center shadow-lg shadow-teal/10">
                    <BrainCircuit className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-black tracking-tight">CareerLens</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-black">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <Sidebar inDrawer onClose={() => setIsMobileMenuOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
