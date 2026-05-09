"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from "framer-motion";
import { 
  Menu, X, ArrowRight, Check, Star, 
  BrainCircuit, Sparkles, ChevronDown,
  Twitter, Github, Linkedin
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- ANIMATION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

// --- COMPONENTS ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Fitur", href: "#fitur" },
    { name: "Cara Kerja", href: "#cara-kerja" },
    { name: "Testimoni", href: "#testimoni" },
    { name: "Harga", href: "#harga" },
  ];

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "bg-white/80 backdrop-blur-xl border-b border-surface-2 py-4 shadow-sm" 
            : "bg-transparent py-6"
        )}
      >
        <div className="container max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center transition-transform group-hover:scale-110">
              <BrainCircuit className="text-teal w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              CareerLens <span className="text-teal">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-[15px] font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-6 py-2 text-[15px] font-medium text-text-primary hover:bg-surface rounded-full transition-all"
            >
              Masuk
            </Link>
            <Link 
              href="/register" 
              className="bg-[#030712] text-white px-7 py-2.5 rounded-full text-[15px] font-medium hover:bg-black/90 transition-all shadow-lg shadow-black/5"
            >
              Mulai Gratis
            </Link>
          </div>

          <button 
            className="md:hidden p-2 text-text-primary"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white p-8 flex flex-col"
          >
            <div className="flex justify-end mb-12">
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-8 h-8 text-text-primary" />
              </button>
            </div>
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-bold tracking-tighter text-text-primary"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-4">
              <Link 
                href="/login" 
                className="w-full py-4 text-center text-xl font-semibold border border-border rounded-2xl"
              >
                Masuk
              </Link>
              <Link 
                href="/register" 
                className="w-full py-4 text-center text-xl font-semibold bg-[#030712] text-white rounded-2xl"
              >
                Mulai Gratis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- CHOREOGRAPHED CHILD COMPONENTS ---

const ScannerSection = ({ progress }: { progress: MotionValue<number> }) => {
  const scannerTop = useTransform(progress, [0.15, 0.35], ["0%", "100%"]);
  const scannerOpacity = useTransform(progress, [0.1, 0.15, 0.35, 0.4], [0, 1, 1, 0]);
  const contentOpacity = useTransform(progress, [0.1, 0.2, 0.35, 0.4], [0, 1, 1, 0]);

  return (
    <section className="relative h-[200vh] bg-[#030712] text-white overflow-hidden py-40">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="container max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div style={{ opacity: contentOpacity }}>
            <span className="text-teal font-black tracking-widest uppercase text-xs mb-6 block">01 / ANALISIS PINTAR</span>
            <h2 className="text-6xl lg:text-8xl font-bold mb-8 leading-none tracking-tighter">
              Lensa yang<br />Memandu.
            </h2>
            <p className="text-xl text-dark-muted leading-relaxed max-w-md">
              AI kami bukan sekadar membaca, tapi memahami intisari pengalaman dan ambisimu.
            </p>
          </motion.div>

          <div className="relative">
            <motion.div 
               className="relative bg-white/5 rounded-[48px] border border-white/10 p-4 backdrop-blur-sm overflow-hidden aspect-[4/5]"
            >
               <div className="p-10 space-y-10 opacity-30 h-full">
                  <div className="flex items-center gap-6">
                     <div className="w-20 h-20 rounded-full bg-white/10" />
                     <div className="space-y-3 flex-1">
                        <div className="h-6 w-3/4 bg-white/10 rounded-full" />
                        <div className="h-3 w-1/4 bg-white/10 rounded-full" />
                     </div>
                  </div>
                  <div className="space-y-6">
                     {[...Array(8)].map((_, i) => (
                       <div key={i} className="h-4 w-full bg-white/10 rounded-full" />
                     ))}
                  </div>
               </div>

               <motion.div 
                  style={{ top: scannerTop, opacity: scannerOpacity }}
                  className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-teal to-transparent z-10 shadow-[0_0_30px_#1D9E75]"
               />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

const MatchmakingSection = ({ progress }: { progress: MotionValue<number> }) => {
  const headerOpacity = useTransform(progress, [0.4, 0.45, 0.55, 0.6], [0, 1, 1, 0]);
  const headerScale = useTransform(progress, [0.4, 0.5, 0.55, 0.6], [0.95, 1, 1, 0.95]);

  return (
    <section className="relative h-[200vh] bg-white text-text-primary overflow-hidden">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="container max-w-7xl mx-auto px-6 text-center">
           <motion.div
             style={{ opacity: headerOpacity, scale: headerScale }}
             className="mb-24"
           >
              <span className="text-purple font-black tracking-widest uppercase text-xs mb-6 block">02 / MATCHMAKING</span>
              <h2 className="text-6xl lg:text-8xl font-bold leading-none tracking-tighter">
                Presisi yang<br />Tak Terbantahkan.
              </h2>
           </motion.div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { t: "UI Designer", s: "96%", c: "teal", p: 0.45 },
                { t: "DevOps", s: "84%", c: "purple", p: 0.49 },
                { t: "Data Scientist", s: "72%", c: "amber", p: 0.53 }
              ].map((path, i) => (
                <CareerCard key={i} path={path} progress={progress} />
              ))}
           </div>
        </div>
      </div>
    </section>
  )
}

const CareerCard = ({ path, progress }: { path: any, progress: MotionValue<number> }) => {
  const y = useTransform(progress, [path.p, path.p + 0.15], [150, 0]);
  const opacity = useTransform(progress, [path.p, path.p + 0.07], [0, 1]);

  return (
    <motion.div
      style={{ y, opacity }}
      className="p-12 rounded-[56px] border border-surface-2 bg-surface/50 hover:bg-white hover:shadow-2xl transition-all duration-700 group text-left"
    >
       <div className="text-5xl font-black mb-8 tracking-tighter flex items-center gap-4">
          {path.s}
          <span className={cn("text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest", 
             path.c === "teal" ? "bg-teal/10 text-teal" : path.c === "purple" ? "bg-purple/10 text-purple" : "bg-amber/10 text-amber"
          )}>Match</span>
       </div>
       <h4 className="text-3xl font-bold mb-4">{path.t}</h4>
       <p className="text-text-secondary font-medium text-sm leading-relaxed mb-10">Berdasarkan data profil dan tren pasar kerja.</p>
       <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-text-primary group-hover:text-white transition-all">
          <ArrowRight className="w-4 h-4" />
       </div>
    </motion.div>
  )
}

const RoadmapSection = ({ progress }: { progress: MotionValue<number> }) => {
  const contentOpacity = useTransform(progress, [0.65, 0.75, 0.85, 0.9], [0, 1, 1, 0]);
  const contentX = useTransform(progress, [0.65, 0.75, 0.85, 0.9], [-60, 0, 0, -60]);

  return (
    <section className="relative h-[200vh] bg-surface overflow-hidden">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="container max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
           <motion.div style={{ opacity: contentOpacity, x: contentX }}>
              <span className="text-teal font-black tracking-widest uppercase text-xs mb-6 block">03 / NAVIGASI</span>
              <h2 className="text-6xl lg:text-8xl font-bold leading-none tracking-tighter">
                Navigasi Berbasis<br />Rencana.
              </h2>
              <p className="text-xl text-text-secondary leading-relaxed mt-8 max-w-sm font-medium"> Kami menemani langkahmu dari awal belajar hingga hari pertama bekerja.</p>
           </motion.div>

           <div className="space-y-8">
              {[
                { label: "Phase 1: Skill", desc: "Menutup gap kompetensi.", p: 0.7 },
                { label: "Phase 2: Project", desc: "Membangun portofolio.", p: 0.75 },
                { label: "Phase 3: Launch", desc: "Optimalisasi lamaran.", p: 0.8 }
              ].map((phase, i) => (
                <RoadmapNode key={i} phase={phase} progress={progress} idx={i} />
              ))}
           </div>
        </div>
      </div>
    </section>
  )
}

const RoadmapNode = ({ phase, progress, idx }: { phase: any, progress: MotionValue<number>, idx: number }) => {
  const opacity = useTransform(progress, [phase.p, phase.p + 0.1], [0, 1]);
  const x = useTransform(progress, [phase.p, phase.p + 0.1], [100, 0]);

  return (
    <motion.div
      style={{ opacity, x }}
      className="bg-white p-10 rounded-[40px] border border-border shadow-lg flex items-center gap-8 group hover:translate-x-4 transition-transform duration-500"
    >
       <div className="w-14 h-14 rounded-2xl bg-teal/5 flex items-center justify-center shrink-0 group-hover:bg-teal group-hover:text-white transition-all text-teal font-black text-xl">
          0{idx + 1}
       </div>
       <div>
          <p className="font-black text-sm tracking-tight text-text-primary uppercase mb-1">{phase.label}</p>
          <p className="text-sm text-text-secondary font-medium">{phase.desc}</p>
       </div>
    </motion.div>
  )
}

const LandingPage = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const lensScale = useTransform(scrollYProgress, [0, 0.15, 0.35, 0.55, 0.75, 0.95], [0.8, 1.3, 0.6, 1.8, 0.9, 1.2]);
  const lensY = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.85], ["0%", "28%", "-18%", "18%", "0%"]);
  const lensX = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.85], ["0%", "-48%", "48%", "-28%", "0%"]);
  const lensOpacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [0, 1, 1, 0]);
  const lensRotate = useTransform(scrollYProgress, [0, 1], [0, 720]);

  return (
    <div ref={containerRef} className="relative bg-white selection:bg-teal selection:text-white">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center overflow-hidden">
        <motion.div
           style={{ scale: lensScale, y: lensY, x: lensX, rotate: lensRotate, opacity: lensOpacity }}
           className="relative w-[45vmax] h-[45vmax]"
        >
           <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal via-teal/40 to-purple blur-[120px] opacity-25 animate-pulse" />
           <div className="absolute inset-0 rounded-full border-[2px] border-teal/10 scale-110" />
           <div className="absolute inset-0 rounded-full border-[1px] border-purple/5 scale-125 opacity-20" />
           {[...Array(4)].map((_, i) => (
             <motion.div
               key={i}
               animate={{ rotate: 360 }}
               transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border border-dashed border-text-faint/5 rounded-full"
               style={{ scale: 1.4 + i * 0.4 }}
             />
           ))}
        </motion.div>
      </div>

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="container max-w-7xl mx-auto px-6 text-center relative z-10"
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border-subtle bg-white/50 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-teal" />
              <span className="text-[10px] font-black tracking-[0.3em] text-text-muted uppercase">Global Career Accelerator</span>
            </div>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-[14vw] lg:text-[9vw] font-black leading-[0.8] tracking-tighter text-text-primary mb-12">
            Masa Depan.<br />
            <span className="text-teal italic">Terfokus.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xl text-text-secondary max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
            CareerLens AI: Platform scrollytelling yang membedah CV kamu dan membangun roadmap karier otomatis dengan presisi AI.
          </motion.p>

          <motion.div variants={fadeUp}>
            <Link href="/register" className="h-24 px-16 bg-[#030712] text-white rounded-[40px] inline-flex items-center gap-6 group hover:scale-105 transition-all shadow-2xl">
              <span className="font-black text-sm tracking-[0.25em] uppercase">Mulai Analisis</span>
              <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30"
        >
           <div className="w-[1px] h-20 bg-gradient-to-b from-teal to-transparent" />
           <span className="text-[9px] font-black tracking-widest">SCROLL</span>
        </motion.div>
      </section>

      <ScannerSection progress={scrollYProgress} />
      <MatchmakingSection progress={scrollYProgress} />
      <RoadmapSection progress={scrollYProgress} />

      <section className="bg-[#030712] py-60 text-center relative overflow-hidden">
         <div className="container max-w-5xl mx-auto px-6 relative z-10">
            <h2 className="text-[14vw] lg:text-[10vw] font-black text-white leading-none tracking-tighter mb-20">
               TAK PERLU<br />
               <span className="text-teal italic">BINGUNG.</span>
            </h2>
            <Link href="/register" className="h-24 px-24 bg-white text-[#030712] rounded-[48px] inline-flex items-center gap-8 group hover:scale-110 transition-all shadow-2xl">
              <span className="font-black text-lg tracking-[0.3em] uppercase">Daftar Sekarang</span>
              <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform text-teal" />
            </Link>
         </div>
      </section>

      <footer className="bg-white py-16 border-t border-border-subtle">
         <div className="container max-w-7xl mx-auto px-6 flex flex-col md:row items-center justify-between gap-10">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-2xl font-black tracking-tighter">CareerLens <span className="text-teal">AI</span></span>
            </Link>
            <p className="text-[10px] font-black text-text-faint tracking-widest uppercase">© 2026 CAREERLENS AI. SEIZE THE MOMENT.</p>
            <div className="flex gap-10 opacity-30">
               {[Twitter, Github, Linkedin].map((Icon, i) => (
                 <Icon key={i} className="w-5 h-5 cursor-pointer hover:text-teal transition-colors" />
               ))}
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
