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
    <footer className="bg-white pt-20 lg:pt-32 pb-12 px-6 border-t border-[#EFEFEF]">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 lg:gap-24 mb-16 lg:mb-24">
          
          <div className="col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
                <BrainCircuit className="text-[#1D9E75] w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-[-1px] text-[#0A0A0A]">
                CareerLens <span className="text-[#1D9E75]">AI</span>
              </span>
            </Link>
            <p className="text-[#888888] text-[15px] font-medium leading-relaxed max-w-xs">
              Membangun jembatan antara pendidikan dan industri modern melalui kekuatan AI yang presisi.
            </p>
            <div className="flex gap-5 text-[#888888]">
               {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
                 <Link key={i} href="#" className="hover:text-[#0A0A0A] transition-colors">
                    <Icon size={20} />
                 </Link>
               ))}
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title} className="space-y-6 lg:space-y-8">
              <h4 className="text-[12px] font-bold tracking-[2px] uppercase text-[#0A0A0A]">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-[15px] font-medium text-[#888888] hover:text-[#0A0A0A] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-[#EFEFEF] mb-12" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] lg:text-[14px] font-medium text-[#888888]">
           <p>© {currentYear} CareerLens AI. Semua hak cipta dilindungi.</p>
           <p>Dibuat dengan ❤️ untuk Masa Depan Talenta Indonesia.</p>
        </div>
      </div>
    </footer>
  );
};
