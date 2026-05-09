"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

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
    { name: "Harga", href: "#harga" },
  ];

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

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
            ? "bg-white/90 backdrop-blur-xl border-b border-[#EFEFEF] py-4" 
            : "bg-transparent py-6"
        )}
      >
        <div className="container max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group relative z-[101]">
            <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center transition-transform group-hover:rotate-[10deg]">
              <BrainCircuit className="text-[#1D9E75] w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-[-1px] text-[#0A0A0A]">
              CareerLens <span className="text-[#1D9E75]">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => scrollToSection(link.href)}
                className="text-[14px] font-medium text-[#888888] hover:text-[#0A0A0A] transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Auth CTA */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/login" 
              className="text-[14px] font-medium text-[#0A0A0A] hover:opacity-70 transition-opacity"
            >
              Masuk
            </Link>
            <Link 
              href="/register" 
              className="bg-[#0A0A0A] text-white px-6 py-2.5 rounded-full text-[14px] font-semibold hover:bg-[#1D9E75] transition-all"
            >
              Mulai Gratis
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-[#0A0A0A] relative z-[101]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <button 
                  key={link.name} 
                  onClick={() => scrollToSection(link.href)}
                  className="text-4xl font-bold tracking-tight text-[#0A0A0A] text-left"
                >
                  {link.name}
                </button>
              ))}
              
              <div className="h-px bg-[#EFEFEF]" />
              
              <div className="flex flex-col gap-4">
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-4 text-center text-lg font-semibold border border-[#EFEFEF] rounded-2xl"
                >
                  Masuk
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-4 text-center text-lg font-semibold bg-[#0A0A0A] text-white rounded-2xl"
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
