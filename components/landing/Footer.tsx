import React from "react";
import Link from "next/link";
import { BrainCircuit, Instagram, Twitter, Linkedin, Github } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: "Produk",
      links: [
        { name: "Fitur", href: "#fitur" },
        { name: "Analisis CV", href: "#" },
        { name: "Roadmap Karier", href: "#" },
        { name: "Update", href: "#" }
      ]
    },
    {
      title: "Perusahaan",
      links: [
        { name: "Tentang", href: "#" },
        { name: "Kontak", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Privacy Policy", href: "#" }
      ]
    },
    {
      title: "Komunitas",
      links: [
        { name: "Grup Karir", href: "#" },
        { name: "Event", href: "#" },
        { name: "Alumni", href: "#" },
        { name: "Mentor", href: "#" }
      ]
    }
  ];

  return (
    <footer className="bg-white dark:bg-black pt-20 lg:pt-32 pb-12 px-6 border-t border-gray-100 dark:border-zinc-900 transition-colors">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-24 mb-16 lg:mb-24">
          
          <div className="md:col-span-2 space-y-8 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center transition-colors">
                <BrainCircuit className="text-teal w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-[-1px] text-black dark:text-white uppercase italic">
                CareerLens <span className="text-teal">AI</span>
              </span>
            </Link>
            <p className="text-gray-500 dark:text-zinc-500 text-[15px] font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
              Membangun jembatan antara pendidikan dan industri modern melalui kekuatan AI yang presisi. Khusus dikembangkan untuk talenta muda SMK Indonesia.
            </p>
            <div className="flex gap-4 text-gray-400">
               {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
                 <Link key={i} href="#" className="hover:text-teal dark:hover:text-teal transition-all hover:scale-110 active:scale-95 duration-200">
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
                      <Link 
                        href={link.href}
                        className="text-[14px] font-bold text-gray-400 hover:text-teal dark:hover:text-teal transition-colors inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-50 dark:bg-zinc-900 mb-12" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] lg:text-[12px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest text-center">
           <div className="flex flex-col md:flex-row items-center gap-4">
             <p>© {currentYear} CAREERLENS AI — JUARAVIBECODING 2026.</p>
             <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-teal/30" />
             <p>Dibuat Oleh Fikri Ade</p>
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
