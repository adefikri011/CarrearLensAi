"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { BrainCircuit, Instagram, MessageCircle, Linkedin, Github } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    if (!id.startsWith("#")) return;
    
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
  };

  const sections = [
    {
      title: "Produk",
      links: [
        { name: "Analisis CV", href: "/cv-builder" },
        { name: "Roadmap Karir", href: "/roadmap" },
        { name: "Fitur AI", href: "#fitur" },
        { name: "Testimoni", href: "#testimoni" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Use", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Hubungi Kami", href: "mailto:support@careerlens.ai" }
      ]
    },
  ];

  return (
    <footer className="bg-white dark:bg-black pt-20 lg:pt-32 pb-12 px-6 border-t border-gray-100 dark:border-zinc-900 transition-colors">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-24 mb-16 lg:mb-24">
          
          <div className="md:col-span-2 space-y-8 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center transition-transform group-hover:rotate-[10deg]">
                <BrainCircuit className="text-[#1D9E75] w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-[-1px] text-black dark:text-white uppercase italic">
                CareerLens <span className="text-[#1D9E75]">AI</span>
              </span>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 text-[15px] font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
              Membangun jembatan antara pendidikan dan industri modern melalui kekuatan AI yang presisi. Dikembangkan untuk membimbing talenta muda Indonesia menuju karir impian.
            </p>
            <div className="flex gap-4 text-gray-400">
               {[
                 { Icon: Instagram, href: "https://www.instagram.com/ficckryy", label: "Kunjungi Instagram Ade Fikri" },
                 { Icon: MessageCircle, href: "https://wa.me/62895329890324", label: "Hubungi WhatsApp Ade Fikri" },
                 { Icon: Linkedin, href: "https://www.linkedin.com/in/adeifikriamsyarr", label: "Kunjungi LinkedIn Ade Fikri" },
                 { Icon: Github, href: "https://github.com/adefikri011", label: "Kunjungi GitHub Ade Fikri" }
               ].map(({ Icon, href, label }, i) => (
                 <Link 
                   key={i} 
                   href={href} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   aria-label={label}
                   className="hover:text-[#1D9E75] dark:hover:text-[#1D9E75] transition-all hover:scale-110 active:scale-95 duration-200"
                 >
                    <Icon size={20} />
                 </Link>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 col-span-1 md:col-span-3 gap-10 md:gap-12">
            {sections.map((section) => (
              <div key={section.title} className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
                <h4 className="text-[10px] font-black tracking-[3px] uppercase text-black dark:text-white">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      {link.href.startsWith("#") ? (
                        <button 
                          onClick={() => scrollToSection(link.href)}
                          className="text-[14px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-[#1D9E75] dark:hover:text-[#1D9E75] transition-colors inline-block"
                        >
                          {link.name}
                        </button>
                      ) : (
                        <Link 
                          href={link.href}
                          className="text-[14px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-[#1D9E75] dark:hover:text-[#1D9E75] transition-colors inline-block"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-50 dark:bg-zinc-900 mb-12" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] lg:text-[12px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-center">
           <div className="flex flex-col md:flex-row items-center gap-4">
             <p>© {currentYear} CAREERLENS AI — JUARAVIBECODING 2026.</p>
             <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#1D9E75]/30" />
             <p>Dibuat Oleh Ade Fikri</p>
           </div>
           <div className="flex items-center gap-2 px-6 py-2 bg-gray-50 dark:bg-zinc-900/50 rounded-full border border-gray-100 dark:border-zinc-800 transition-colors">
              <span className="text-[9px] font-black text-gray-400 dark:text-zinc-700">POWERED BY</span>
              <span className="text-black dark:text-white font-black italic">Google AI Studio</span>
           </div>
        </div>
      </div>
    </footer>
  );
};
