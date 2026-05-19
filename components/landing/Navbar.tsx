"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Fitur", href: "#fitur" },
    { name: "Cara Kerja", href: "#cara-kerja" },
    { name: "Testimoni", href: "#testimoni" },
    { name: "FAQ", href: "#faq" },
  ];

  const scrollToSection = (id: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/${id}`;
      return;
    }
    const el = document.querySelector(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
          isScrolled 
            ? "bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-900 py-4" 
            : "bg-transparent py-4 lg:py-6"
        )}
      >
        <div className="container max-w-7xl mx-auto px-5 lg:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group relative z-[101]">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center transition-transform group-hover:rotate-[10deg]">
              <BrainCircuit className="text-[#1D9E75] w-5 h-5" />
            </div>
            <span className="text-xl lg:text-xl font-black tracking-[-1px] text-black dark:text-white uppercase italic">
              CareerLens <span className="text-[#1D9E75]">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => scrollToSection(link.href)}
                className="text-[13px] font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Auth CTA */}
          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle />
            <Link 
              href="/login" 
              className="text-[13px] font-black uppercase tracking-widest text-black dark:text-white hover:text-[#1D9E75] transition-colors"
            >
              Masuk
            </Link>
            <Link 
              href="/register" 
              className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-[#1D9E75] dark:hover:bg-[#1D9E75] dark:hover:text-white transition-all shadow-xl shadow-black/10 transition-all hover:scale-105 active:scale-95"
            >
              Mulai Gratis
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-2 relative z-[101]">
            <ThemeToggle />
            <button 
              className="p-2 text-black dark:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-white dark:bg-black pt-24 px-6 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6 py-10">
              {navLinks.map((link) => (
                <button 
                  key={link.name} 
                  onClick={() => scrollToSection(link.href)}
                  className="text-4xl font-black tracking-tighter text-black dark:text-white text-left uppercase italic"
                >
                  {link.name}
                </button>
              ))}
              
              <div className="h-px bg-gray-100 dark:bg-zinc-900 my-4 transition-colors" />
              
              <div className="flex flex-col gap-4">
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-5 text-center text-lg font-black uppercase tracking-widest border border-gray-100 dark:border-zinc-800 dark:text-white rounded-2xl active:scale-[0.98] transition-all"
                >
                  Masuk
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-5 text-center text-lg font-black uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black rounded-2xl active:scale-[0.98] transition-all"
                >
                  Mulai Sekarang
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
