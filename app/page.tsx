'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { 
  Check, 
  ChevronDown, 
  BrainCircuit, 
  Target, 
  Sparkles, 
  Star, 
  ArrowRight, 
  User, 
  LayoutDashboard,
  UploadCloud,
  FileText,
  Briefcase,
  Play,
  RotateCw,
  Award,
  ChevronRight,
  TrendingUp,
  Volume2,
  Lock,
  ArrowUpRight,
  MessageSquare,
  Compass,
  CheckCircle2,
  Cpu,
  Bookmark,
  Users,
  Search,
  ExternalLink,
  Zap,
  GraduationCap,
  Sparkle,
  Fingerprint,
  PieChart,
  X
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

// --- High Performance Scroll Reveal & Stagger Animation Helpers ---
interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  id?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = "",
  id
}) => {
  const directions = {
    up: { y: 25, x: 0 },
    down: { y: -25, x: 0 },
    left: { x: 25, y: 0 },
    right: { x: -25, y: 0 },
    none: { x: 0, y: 0 }
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Robust iframe fallback: Force transition into visible state if window intersection fails
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 150 + delay * 400);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      id={id}
      initial={{ 
        opacity: 0, 
        ...directions[direction]
      }}
      animate={isVisible ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...directions[direction] }}
      onViewportEnter={() => setIsVisible(true)}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ 
        duration: 0.7, 
        delay: delay * 0.35, 
        ease: [0.25, 1, 0.5, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- Numerical Counter with Friction Spring Ease ---
const Counter = ({ value, duration = 1200 }: { value: string; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasRun, setHasRun] = useState(false);

  const numericString = value.replace(/[^0-9]/g, '');
  const target = parseInt(numericString, 10);
  const suffix = value.replace(/[0-9]/g, '').replace('.', '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun && !isNaN(target)) {
          setHasRun(true);
          let start = 0;
          const end = target;
          const stepTime = 16; // 60fps frame budget
          const totalSteps = Math.ceil(duration / stepTime);
          let step = 0;

          const timer = setInterval(() => {
            step++;
            const progress = step / totalSteps;
            // Quintic easing out: slow down at the end beautifully
            const easedProgress = 1 - Math.pow(1 - progress, 4);
            const currentVal = Math.floor(easedProgress * end);

            if (step >= totalSteps) {
              setDisplayValue(end);
              clearInterval(timer);
            } else {
              setDisplayValue(currentVal);
            }
          }, stepTime);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [target, duration, hasRun]);

  return (
    <span ref={ref} className="font-mono tracking-tight font-black tabular-nums transition-all">
      {displayValue.toLocaleString('id-ID')}
      {suffix}
    </span>
  );
};

// --- TS Type Definitions for Personalized Playground ---
type UserAudience = 'sma-smk' | 'mahasiswa' | 'fresh-grad';

interface ProfileData {
  audienceLabel: string;
  name: string;
  education: string;
  originalScore: number;
  optimizedScore: number;
  missingSkills: string[];
  recommendations: string[];
  matches: { role: string; score: number; color: string; company: string }[];
  rawText: string;
}

const AUDIENCE_DATA: Record<UserAudience, ProfileData> = {
  'sma-smk': {
    audienceLabel: "Siswa SMA / SMK Sederajat",
    name: "Dimas Aditya Pratama",
    education: "SMK Negeri 4 Bandung (RPL-IT)",
    originalScore: 45,
    optimizedScore: 94,
    missingSkills: ["Next.js App Routing", "TypeScript Engine", "REST API Development", "Git Collab Methodologies"],
    recommendations: [
      "Cantumkan Sertifikasi Kompetensi Keahlian (UKK) Resmi Skema BNSP / LSP-P1",
      "Format ulang deskripsi pasif sekolah ke 'Proyek Produktif Berbasis Pemecahan Masalah'",
      "Fokus pada kata kunci industri modern seperti: 'Responsive UI Design', 'Client-Server API'"
    ],
    matches: [
      { role: "Junior Frontend Developer", score: 94, color: "from-[#1D9E75] to-teal-400", company: "Perusahaan SaaS & Teknologi Terkemuka" },
      { role: "Backend Developer Intern", score: 85, color: "from-[#534AB7] to-indigo-500", company: "BUMN Telekomunikasi & Digital" },
      { role: "Junior Tech Specialist", score: 72, color: "from-zinc-500 to-zinc-700", company: "Konglomerat Otomotif & Industri Terpadu" }
    ],
    rawText: "REKAYASA PERANGKAT LUNAK\nBisa coding HTML, mengedit video di Canva, Microsoft Word & Excel, rajin bekerja keras, mampu mengendarai motor roda dua, pernah membuat kalkulator matematika sederhana di halaman web sekolah..."
  },
  'mahasiswa': {
    audienceLabel: "Mahasiswa Aktif (Vokasi & Universitas)",
    name: "Siti Rahmawati Siregar",
    education: "S1 Sistem Informasi - Semester 6",
    originalScore: 56,
    optimizedScore: 97,
    missingSkills: ["Docker Containerization", "Enterprise Backend (AWS / Cloud GCP)", "CI/CD Automations", "SQL Optimization Engine"],
    recommendations: [
      "Deklarasikan metrik pencapaian kuantitatif (contoh: 'mempercepat response time query sql sebesar 32%')",
      "Deskripsikan kontribusi spesifik secara mandiri pada proyek riset, skripsi, atau open-source global",
      "Tambahkan lisensi kredensial sertifikasi profesional global (AWS, GCP Cloud Developer, Oracle Java)"
    ],
    matches: [
      { role: "Fullstack Developer Trainee", score: 97, color: "from-[#1D9E75] to-teal-400", company: "BUMN Perbankan & Layanan Keuangan" },
      { role: "Cloud Solution Intern", score: 89, color: "from-[#534AB7] to-indigo-500", company: "E-Commerce Regional Terbesar" },
      { role: "Junior Data Product Scientist", score: 81, color: "from-zinc-500 to-zinc-700", company: "Konsultan Pajak & Manajemen Big 4" }
    ],
    rawText: "S1 SISTEM INFORMASI\nIPK 3.82. Aktif dalam divisi BEM. Pernah membuat proyek kelompok akhir semester bertema e-commerce kelompok menggunakan template dasar PHP dan MySQL. Mengerti sedikit bahasa Python dan dasar SQL query..."
  },
  'fresh-grad': {
    audienceLabel: "Fresh Graduate & Umum (Job Seekers)",
    name: "Bagas Pratama Wiranto",
    education: "Lulusan Baru S1 Ekonomi Pembangunan",
    originalScore: 39,
    optimizedScore: 92,
    missingSkills: ["Strategic Financial Planning", "Advanced Excel (Pivot, VLOOKUP, PowerQuery, VBA)", "E-Faktur & Corporate Tax Audits"],
    recommendations: [
      "Sertakan portofolio studi kasus keuangan akurat / skenario taktis pemasaran digital terukur",
      "Tulis resume ringkasan profesional (Executive Summary) yang fokus pada pencapaian target bisnis perusahaan",
      "Hapus layout grafik berwarna-warni & bintang rating skill yang membingungkan bot parser sistem ATS"
    ],
    matches: [
      { role: "Finance Operations Executive", score: 92, color: "from-[#1D9E75] to-teal-400", company: "Penyedia Ride-Hailing & Logistik" },
      { role: "Management Trainee Officer", score: 87, color: "from-[#534AB7] to-indigo-500", company: "Produsen Barang Konsumsi Multinasional" },
      { role: "Internal Audit Associate", score: 80, color: "from-zinc-500 to-zinc-700", company: "Lembaga Audit & Konsultan Finansial" }
    ],
    rawText: "FRESH GRADUATE EKONOMI\nLulusan baru dengan indeks reputasi memuaskan. Ingin melamar di posisi keuangan, kasir, atau staf administrasi apa saja yang kosong di perusahaan ibu/bapak. Jujur, rajin, siap lembur kerja kapan saja..."
  }
};

interface RoadmapWeek {
  week: string;
  title: string;
  tasks: { name: string; done: boolean }[];
  resource: { title: string; type: string };
}

const ROADMAP_DATA: RoadmapWeek[] = [
  {
    week: "Minggu 1-4",
    title: "Optimasi Profil & Standarisasi CV ATS",
    tasks: [
      { name: "Penyusunan CV format ATS-Friendly Kelas Dunia", done: true },
      { name: "Penyelarasan Kompetensi Keahlian Bersertifikat BNSP / LSP", done: true },
      { name: "Penyematan Bukti Proyek Nyata Menjual di Portofolio", done: false },
    ],
    resource: { title: "E-Book Struktur Panduan CV ATS Standar Global 2026", type: "PDF Guide" }
  },
  {
    week: "Minggu 5-8",
    title: "Penguatan Portofolio & Studi Kasus Riil",
    tasks: [
      { name: "Pembuatan Repositori Git / Dokumen Audit Komprehensif", done: true },
      { name: "Penyusunan Dokumentasi Studi Kasus Magang Industri", done: false },
      { name: "Latihan Penggunaan Perkakas & Tooling Standar Manufaktur", done: false },
    ],
    resource: { title: "Katalog Portofolio Paling Banyak Dilirik Rekruter", type: "Drive & Figma" }
  },
  {
    week: "Minggu 9-12",
    title: "Simulasi Wawancara AI & Penyaluran Kerja",
    tasks: [
      { name: "Uji Coba Latihan Interview dengan Bahasa SOP Resmi", done: false },
      { name: "Pendaftaran Profil di Sistem Penyaluran Rekruter CareerLens", done: false },
      { name: "One-on-One Assessment Review Bersama AI Evaluator", done: false },
    ],
    resource: { title: "Bank Soal & Formula Jawaban Interview HRD BUMN & Korporat", type: "Interactive" }
  }
];

// --- Premium Tech Background SVG Component ---
const TechGridBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
    {/* Grid Overlay Line Pattern */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.07]" width="100%" height="100%">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    
    {/* Concentric Circle Accents */}
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-dashed border-zinc-500/10 dark:border-zinc-500/5 rounded-full pointer-events-none" />
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-dashed border-zinc-500/5 dark:border-zinc-500/2 rounded-full pointer-events-none" />
  </div>
);

// --- Hero & Interactive Engine Applet Showcase ---
const HeroAndPlayground = () => {
  const { status } = useSession();
  const authenticated = status === "authenticated";

  // State managers for tabs and simulation
  const [activeTab, setActiveTab] = useState<'cv-scanner' | 'roadmap' | 'interview'>('cv-scanner');
  const [selectedAudience, setSelectedAudience] = useState<UserAudience>('sma-smk');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [analysisDone, setAnalysisDone] = useState(false);

  // Roadmap states
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);

  // Interview states
  const [interviewAnswered, setInterviewAnswered] = useState<number | null>(null);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  
  // Video Modal State
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Waveform animation effect: highly continuous and organic
  useEffect(() => {
    const interval = setInterval(() => {
      const bars = Array.from({ length: 24 }, () => Math.floor(Math.random() * 38) + 3);
      setWaveformBars(bars);
    }, 95);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setAnalysisDone(false);
    setScanLogs([]);

    const logMessages = [
      "🔄 [0.2s] Menginisialisasi modul NLP parser...",
      "🔍 [0.5s] Menganalisis sintaks teks & struktur tata letak CV...",
      "🧠 [1.0s] Membandingkan kualifikasi dengan benchmark standar industri...",
      "📦 [1.4s] Mendeteksi kesenjangan kompetensi (skill-gap index)...",
      "🚀 [1.8s] Menyinkronkan rekomendasi & memicu kecocokan lowongan kerja..."
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 4;
      if (currentProgress > 100) currentProgress = 100;
      setScanProgress(currentProgress);

      if (currentProgress === 8) setScanLogs(p => [...p, logMessages[0]]);
      if (currentProgress === 32) setScanLogs(p => [...p, logMessages[1]]);
      if (currentProgress === 56) setScanLogs(p => [...p, logMessages[2]]);
      if (currentProgress === 76) setScanLogs(p => [...p, logMessages[3]]);
      if (currentProgress === 96) setScanLogs(p => [...p, logMessages[4]]);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setAnalysisDone(true);
      }
    }, 60);
  };

  const currProfile = AUDIENCE_DATA[selectedAudience];

  return (
    <section className="relative w-full bg-slate-50 dark:bg-zinc-950 pt-28 pb-20 md:pt-40 md:pb-36 overflow-hidden px-4 md:px-6 transition-colors duration-500">
      <TechGridBackground />
      
      {/* Dynamic Glow Orbs for elegant visuals */}
      <motion.div 
        animate={{ 
          x: [0, 40, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.15, 0.9, 1],
          opacity: [0.6, 0.75, 0.55, 0.6]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 left-1/4 w-[550px] h-[550px] bg-[#1D9E75]/10 dark:bg-[#1D9E75]/12 rounded-full blur-[120px] pointer-events-none" 
      />
      
      <motion.div 
        animate={{ 
          x: [0, -40, 30, 0],
          y: [0, 50, -20, 0],
          scale: [1, 0.95, 1.1, 1],
          opacity: [0.5, 0.7, 0.45, 0.5]
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-[#534AB7]/12 dark:bg-[#534AB7]/10 rounded-full blur-[140px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        
        {/* Left Column: Visual copy & details */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-[0_4px_18px_rgba(0,0,0,0.02)] cursor-pointer hover:border-[#1D9E75] transition-all group"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="text-[#1D9E75]"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <span className="text-[10px] md:text-xs font-black tracking-widest text-[#1D9E75] uppercase font-mono">
              ELEVATE YOUR CAREER PATHWAY • CO-PILOT AI
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-ping" />
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-[34px] sm:text-6xl lg:text-[72px] font-black tracking-tight text-zinc-900 dark:text-white leading-[0.95] uppercase italic font-sans">
              Potensi Karirmu, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1D9E75] via-[#2ba87e] to-[#534AB7] relative">
                Nyata di Depan Mata.
                <span className="absolute left-0 bottom-1 w-full h-[3px] bg-gradient-to-r from-[#1D9E75] to-[#534AB7] origin-left scale-x-75 block" />
              </span>
            </h1>
            
            <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold">
              Kompilasi engine kualifikasi berbasis AI yang siap mengaudit standar CV ATS Anda, mendeteksi korelasi kurikulum industri, membimbing roadmap pembelajaran taktis, dan membuka akses eksklusif bursa kerja nyata.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link href={authenticated ? "/dashboard/cv" : "/register"} className="w-full sm:w-auto">
              <button 
                id="hero-cta-main-premium"
                className="w-full sm:w-auto h-16 px-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#1D9E75] dark:hover:bg-[#1D9E75] dark:hover:text-white hover:shadow-[0_12px_36px_rgba(29,158,117,0.25)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-350 flex items-center justify-center gap-3 cursor-pointer group"
              >
                Mulai Evaluasi CV Gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </Link>
            
            <button 
              id="hero-cta-demo-premium"
              onClick={() => setIsVideoOpen(true)}
              className="w-full sm:w-auto h-16 px-10 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:scale-[1.03] active:scale-[0.97] transition-all duration-350 flex items-center justify-center gap-3 cursor-pointer shadow-sm group"
            >
              <div className="w-7 h-7 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-115 transition-transform shrink-0">
                <Play size={10} fill="currentColor" className="ml-0.5" />
              </div>
              Simulasi & Demo Video
            </button>
          </div>

          {/* Social Proof Stats Accord */}
          <div className="pt-8 border-t border-zinc-200/80 dark:border-zinc-800/40 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4">
            <div className="flex -space-x-3">
              {[
                { label: "SMK", bg: "from-[#1D9E75] to-[#2ba87e]" },
                { label: "UNIV", bg: "from-[#534AB7] to-[#6a61cc]" },
                { label: "ALUM", bg: "from-amber-500 to-orange-500" },
                { label: "+75k", bg: "from-zinc-800 to-zinc-900" }
              ].map((pill, idx) => (
                <div key={idx} className={`w-11 h-11 rounded-full border-2 border-white dark:border-zinc-950 bg-gradient-to-tr ${pill.bg} flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-lg`}>
                  {pill.label}
                </div>
              ))}
            </div>
            
            <div className="text-left">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="currentColor" stroke="none" />)}
              </div>
              <p className="text-[11px] font-extrabold text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider font-mono">
                RATED 4.9/5 BY HRD REKRUTMENT BUMN & GLOBAL ENTERPRISE
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Interactive Sandbox Playground */}
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/90 rounded-[32px] shadow-[0_24px_50px_-15px_rgba(0,0,0,0.06)] dark:shadow-[0_40px_90px_rgba(0,0,0,0.3)] overflow-hidden relative"
          >
            {/* Embedded Ambient Indicator */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#1D9E75]/50 to-transparent" />

            {/* Window glass controls */}
            <div className="bg-zinc-50/60 dark:bg-zinc-900/40 p-5 border-b border-zinc-150 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-2 self-start sm:self-center">
                <span className="w-3.5 h-3.5 rounded-full bg-red-400/80 hover:bg-red-500 transition-colors cursor-pointer" />
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-400/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
                <span className="w-3.5 h-3.5 rounded-full bg-green-400/80 hover:bg-green-500 transition-colors cursor-pointer" />
              </div>

              {/* Advanced Navigation Slider Tabs */}
              <div className="flex bg-zinc-200/80 dark:bg-zinc-800/80 rounded-xl p-1 gap-1 w-full sm:w-auto relative">
                {[
                  { id: "cv-scanner", label: "CV SCANNER", icon: FileText },
                  { id: "roadmap", label: "90-DAY PATH", icon: Compass },
                  { id: "interview", label: "AI INTERVIEW", icon: MessageSquare }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setInterviewAnswered(null);
                      }}
                      className="relative flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex-1 sm:flex-initial"
                    >
                      {active && (
                        <motion.div 
                          layoutId="playgroundTabBg"
                          className="absolute inset-0 bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-zinc-200/50 dark:border-zinc-800 z-0"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Icon size={12} className={active ? "text-[#1D9E75]" : "text-zinc-500"} />
                        <span className={active ? "text-[#1D9E75] dark:text-white font-extrabold" : "text-zinc-500"}>
                          {tab.label}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sandbox Container */}
            <div className="p-6 md:p-8 min-h-[490px] flex flex-col justify-between">
              
              {/* TAB 1: MODEL ATS SCANNER */}
              {activeTab === 'cv-scanner' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <GraduationCap size={14} className="text-[#1D9E75]" />
                      <span className="text-[10px] font-extrabold tracking-widest text-[#534AB7] uppercase font-mono">
                        Pilih Tingkat / Target Audiens:
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { id: 'sma-smk', label: '🏫 SMA / SMK' },
                        { id: 'mahasiswa', label: '🎓 MAHASISWA' },
                        { id: 'fresh-grad', label: '💼 JOB SEEKER' }
                      ] as const).map((aud) => (
                        <button
                          key={aud.id}
                          onClick={() => {
                            setSelectedAudience(aud.id);
                            setAnalysisDone(false);
                            setScanLogs([]);
                          }}
                          className={`py-3.5 px-2 rounded-xl border text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer text-center ${
                            selectedAudience === aud.id
                              ? "bg-[#1D9E75]/10 border-[#1D9E75] text-[#1D9E75] scale-[1.02] shadow-sm font-black"
                              : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                          }`}
                        >
                          {aud.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {!isScanning && !analysisDone && (
                      <motion.div
                        key="idle-state"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl p-5 border border-dashed border-zinc-200 dark:border-zinc-800 relative space-y-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-[#1D9E75] rounded-xl shrink-0">
                            <UploadCloud size={24} className="animate-pulse" />
                          </div>
                          <div className="space-y-1 text-left min-w-0">
                            <h4 className="text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-zinc-200 truncate">{currProfile.name}</h4>
                            <p className="text-[9px] text-zinc-400 font-black tracking-widest font-mono truncate uppercase">{currProfile.education}</p>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-xl p-3.5 text-[10px] sm:text-[11px] font-mono whitespace-pre-wrap text-left text-zinc-550 dark:text-zinc-400 relative overflow-hidden h-24 select-none leading-relaxed">
                          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none" />
                          {currProfile.rawText}
                        </div>
                        
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-500 font-bold uppercase tracking-widest bg-zinc-100/55 dark:bg-zinc-900/60 px-4 py-3 rounded-xl border border-zinc-150 dark:border-zinc-850 font-mono">
                          <span>SKOR ATS AWAL:</span>
                          <span className="text-red-500 font-black shrink-0">
                            {currProfile.originalScore}% (KURANG LAYAK)
                          </span>
                        </div>
                        
                        <button
                          onClick={handleSimulateScan}
                          className="w-full bg-[#1D9E75] hover:bg-[#15825f] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-lg shadow-[#1D9E75]/10 hover:-translate-y-0.5 active:translate-y-0"
                        >
                          <Zap size={14} className="fill-white" /> OPTIMALKAN DENGAN EVALUASI AI
                        </button>
                      </motion.div>
                    )}

                    {isScanning && (
                      <motion.div
                        key="scanning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-zinc-950 text-zinc-100 rounded-2xl p-6 font-mono space-y-5 border border-zinc-805 min-h-[310px] relative overflow-hidden text-left"
                      >
                        {/* Laser line simulation bar */}
                        <motion.div
                          animate={{ y: ["0%", "280px", "0%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#1D9E75] to-transparent shadow-[0_0_15px_#1D9E75] pointer-events-none z-10"
                        />
                        
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                          <span className="text-xs text-zinc-400 font-extrabold uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#1D9E75] animate-ping" />
                            Analyzing with Gemini Co-Pilot...
                          </span>
                          <span className="text-xs text-[#1D9E75] font-black">{scanProgress}%</span>
                        </div>

                        <div className="space-y-2 h-36 overflow-y-auto no-scrollbar text-[10px] text-zinc-300">
                          {scanLogs.map((log, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-teal-400 font-bold">✔</span>
                              <span>{log}</span>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-1">
                          <div className="w-full bg-zinc-850 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#1D9E75] h-full transition-all duration-100" style={{ width: `${scanProgress}%` }} />
                          </div>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-black block">SYSTEM ENG_ID: PRE-AI_2026</span>
                        </div>
                      </motion.div>
                    )}

                    {analysisDone && (
                      <motion.div
                        key="done-results"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-5 text-left"
                      >
                        {/* Dynamically Comparison scoring metric widgets */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 bg-red-500/5 dark:bg-red-950/10 rounded-2xl border border-red-200/50 dark:border-red-900/30 text-center space-y-1">
                            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest font-mono">Sebelum (Unoptimized)</span>
                            <h5 className="text-2xl font-black text-red-500 font-mono italic">{currProfile.originalScore}%</h5>
                          </div>
                          
                          <div className="p-4 bg-[#1D9E75]/10 rounded-2xl border border-[#1D9E75]/35 text-center space-y-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-8 h-8 bg-[#1D9E75]/10 rounded-bl-2xl flex items-center justify-center">
                              <Sparkles size={11} className="text-[#1D9E75] animate-pulse" />
                            </div>
                            <span className="text-[9px] font-black text-[#1D9E75] uppercase tracking-widest font-mono">Setelah AI Audit</span>
                            <h5 className="text-2xl font-black text-[#1D9E75] font-mono italic">{currProfile.optimizedScore}%</h5>
                          </div>
                        </div>

                        {/* Staggered dynamic recommendations list */}
                        <div className="space-y-2.5">
                          <h6 className="text-[10px] font-black text-[#534AB7] uppercase tracking-widest font-mono flex items-center gap-1.5">
                            <CheckCircle2 size={12} className="text-[#534AB7]" />
                            REKOMENDASI PENGUATAN PROFIL:
                          </h6>
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {currProfile.recommendations.map((rec, i) => (
                              <div key={i} className="flex gap-2.5 items-start text-[11px] bg-zinc-50 dark:bg-zinc-850/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                <span className="w-5 h-5 rounded-full bg-[#1D9E75]/10 text-[#1D9E75] flex items-center justify-center font-black text-[9px] shrink-0 mt-0.5 font-mono">
                                  {i + 1}
                                </span>
                                <span className="text-zinc-650 dark:text-zinc-300 font-semibold">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Interactive dynamic matching section */}
                        <div className="space-y-2 pt-3.5 border-t border-zinc-150 dark:border-zinc-800/80">
                          <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-400 font-mono tracking-wider">
                            <span>Kecocokan Lowongan AI Mitra:</span>
                            <span className="text-[#1D9E75] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-ping" />
                              AUTOPILOT MATCHED
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            {currProfile.matches.map((job) => (
                              <div key={job.role} className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded-xl flex flex-col justify-between h-20 shadow-sm hover:border-teal-500/50 transition-colors">
                                <div className="space-y-0.5">
                                  <h5 className="text-[9px] font-black text-zinc-800 dark:text-zinc-200 truncate">{job.role}</h5>
                                  <span className="text-[8px] font-bold text-zinc-400 block truncate uppercase font-mono">{job.company}</span>
                                </div>
                                <span className="text-[10px] font-black text-[#1D9E75] block font-mono bg-emerald-500/5 px-1 py-0.5 rounded text-center">{job.score}% Match</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => setAnalysisDone(false)}
                          className="w-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700"
                        >
                          <RotateCw size={12} className="text-[#1D9E75] animate-spin-slow" /> ULANGI INTEGRASI SIMULASI
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* TAB 2: ROADMAP PERSISTENCE */}
              {activeTab === 'roadmap' && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#1D9E75] bg-[#1D9E75]/10 px-2.5 py-1.5 rounded-md uppercase font-mono">
                      FASE BELAJAR & SELEKSI KOMPETENSI:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5 mt-3">
                      {ROADMAP_DATA.map((rm, i) => (
                        <button
                          key={rm.week}
                          onClick={() => setActiveWeekIndex(i)}
                          className={`text-center py-3 rounded-xl border text-[9px] sm:text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all ${
                            activeWeekIndex === i
                              ? "bg-[#1D9E75]/10 border-[#1D9E75] text-[#1D9E75] scale-[1.02] shadow-sm font-black"
                              : "border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {rm.week}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Segment Panel Detail */}
                  <div className="bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 text-left">
                    <div className="flex gap-2 items-center">
                      <Compass size={16} className="text-[#1D9E75] animate-spin-slow" />
                      <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
                        {ROADMAP_DATA[activeWeekIndex].title}
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {ROADMAP_DATA[activeWeekIndex].tasks.map((task, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            task.done 
                              ? "bg-[#1D9E75] border-[#1D9E75] text-white" 
                              : "border-zinc-300 dark:border-zinc-700 text-transparent"
                          }`}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span className={`text-[11px] sm:text-xs font-semibold ${
                            task.done 
                              ? "text-zinc-350 dark:text-zinc-500 line-through" 
                              : "text-zinc-700 dark:text-zinc-300 animate-pulse"
                          }`}>
                            {task.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Accompanying Resource Kit */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-3.5 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#534AB7]/10 text-[#534AB7] flex items-center justify-center font-bold text-xs shrink-0">
                          <Award size={16} />
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-[9px] font-black tracking-widest text-[#534AB7] uppercase font-mono">{ROADMAP_DATA[activeWeekIndex].resource.type}</p>
                          <h5 className="text-[11px] font-extrabold text-zinc-800 dark:text-zinc-200 truncate pr-2 leading-none mt-0.5">{ROADMAP_DATA[activeWeekIndex].resource.title}</h5>
                        </div>
                      </div>
                      <button className="text-[10px] font-black uppercase text-[#1D9E75] hover:underline cursor-pointer shrink-0 flex items-center gap-0.5">
                        Ambil <ArrowUpRight size={12} />
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] font-extrabold text-center text-zinc-400 uppercase tracking-widest font-mono">
                    🏁 Diperbarui otomatis mengikuti standar kualifikasi kurikulum industri global.
                  </p>
                </div>
              )}

              {/* TAB 3: AI SPEECH INTERVIEW */}
              {activeTab === 'interview' && (
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest text-[#534AB7] bg-[#534AB7]/10 px-2.5 py-1.5 rounded-md uppercase font-mono">
                      AI VOICE & INTERVIEW SIMULATOR:
                    </span>
                    <span className="text-[9px] font-black text-emerald-500 flex items-center gap-1 font-mono shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> LIVE CONNECTED
                    </span>
                  </div>

                  {/* Interlocutor info */}
                  <div className="bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1D9E75] to-[#534AB7] flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm relative">
                      SISKA
                      <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-200 truncate">Ibu Siska Amelia, S.Psi</h4>
                      <p className="text-[8px] sm:text-[9px] text-[#1D9E75] font-black tracking-widest uppercase font-mono truncate">Lead Recruiter Korporat & Group BUMN</p>
                    </div>
                  </div>

                  {/* Prompt bubble */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-4 rounded-xl text-left shadow-sm relative leading-relaxed">
                    <p className="text-xs font-bold text-zinc-650 dark:text-zinc-200 italic">
                      &quot;Selamat pagi. Di portofolio Anda belum tertera riwayat magang yang panjang. Bisakah Anda uraikan bagaimana cara Anda berinisiatif memetakan tugas kelompok atau mengatasi hambatan teknis yang hampir tenggat waktu?&quot;
                    </p>
                  </div>

                  {/* Micro sound wave visualization bars */}
                  <div className="flex items-center justify-center gap-1 h-9 py-1 text-teal-400">
                    {waveformBars.map((h, i) => (
                      <motion.div 
                        key={i} 
                        className="w-1.5 bg-gradient-to-t from-[#1D9E75] to-teal-300 rounded-full" 
                        style={{ height: `${h}px` }} 
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.04 }}
                      />
                    ))}
                  </div>

                  {/* Multiple Response buttons */}
                  <div className="space-y-2">
                    {[
                      { 
                        id: 1, 
                        label: "A",
                        txt: "Saya kerjakan seadanya saja pak/bu agar cepat selesai, yang terpenting tugas itu terkumpul tepat waktu sebelum ditutup.", 
                        eval: "❌ Kurang Kompeten: Menunjukkan komitmen kerja yang rendah pada mutu resep teknis.",
                        pts: "Minus -10"
                      },
                      { 
                        id: 2, 
                        label: "B",
                        txt: "Saya menyusun matriks prioritas tugas, mengomunikasikan kontribusi objektif tim, serta menggunakan pelacakan berkala untuk menjamin akurasi.", 
                        eval: "🏆 Sempurna! Menunjukkan pola pikir proaktif, analisis SOP, dan kecerdasan koordinasi.",
                        pts: "Plus +20"
                      },
                      { 
                        id: 3, 
                        label: "C",
                        txt: "Saya akan memohon perpanjangan waktu pengumpulan dari guru/pembimbing organisasi agar pikiran tidak panik.", 
                        eval: "⚠️ Kurang Taktis: Menunjukkan hambatan dalam beradaptasi di bawah tekanan waktu kerja.",
                        pts: "Plus +5"
                      }
                    ].map((item) => {
                      const selected = interviewAnswered === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setInterviewAnswered(item.id)}
                          className={`w-full p-3 border rounded-xl text-left transition-all text-[11px] block cursor-pointer ${
                            selected 
                              ? item.id === 2
                                ? "bg-[#1D9E75]/15 border-[#1D9E75] text-[#1D9E75]"
                                : "bg-red-500/10 border-red-300 text-red-500"
                              : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                          }`}
                        >
                          <div className="flex gap-2 items-start">
                            <span className="font-extrabold shrink-0 block">Opsi {item.label}:</span>
                            <span className="font-medium">{item.txt}</span>
                          </div>
                          
                          {selected && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-2.5 pt-2 border-t border-dashed border-zinc-250 dark:border-zinc-800 text-[10px] font-bold block"
                            >
                              <span className="block font-sans">{item.eval}</span>
                              <span className="font-mono text-xs font-black underline mt-1.5 block">Gemini Engine Verdict: {item.pts}</span>
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {interviewAnswered && (
                    <button
                      onClick={() => setInterviewAnswered(null)}
                      className="w-full text-center text-[10px] font-extrabold uppercase text-zinc-400 hover:text-[#1D9E75] transition-colors cursor-pointer block font-mono"
                    >
                      RESET PREVIEW DIALOG
                    </button>
                  )}
                </div>
              )}

            </div>
          </motion.div>
        </div>
      </div>

      {/* --- PRESTIGIOUS VIDEO DEMO POPUP --- */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative"
            >
              <div className="flex items-center justify-between p-5 border-b border-zinc-150 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Play size={14} className="text-[#1D9E75]" fill="currentColor" />
                  <span className="font-black text-xs uppercase tracking-widest text-zinc-800 dark:text-zinc-100 font-mono">
                    DEMO SIMULASI CO-PILOT CAREERLENS AI
                  </span>
                </div>
                <button 
                  onClick={() => setIsVideoOpen(false)}
                  className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Simulated Tech Demo Screen inside popup */}
              <div className="aspect-video bg-zinc-950 flex flex-col items-center justify-center p-6 sm:p-12 text-center text-white relative">
                <div className="absolute inset-x-0 top-0 h-48 w-48 bg-[#1D9E75]/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-6 max-w-xl z-10">
                  <div className="w-14 h-14 rounded-full bg-[#1D9E75]/20 text-[#1D9E75] flex items-center justify-center mx-auto shadow-lg border border-[#1D9E75]/30">
                    <Cpu size={26} className="animate-spin-slow" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-2xl font-black uppercase italic tracking-tight">Kompilasi Struktur Karir Masa Depan</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-semibold">
                      Sistem AI melacak file presentasimu, memindai parameter rekruter nasional, melengkapi portofolio, membekalimu dengan video evaluasi interview, dan otomatis merekomendasikanmu ke mitra lowongan kerja.
                    </p>
                  </div>
                  
                  <div className="flex justify-center gap-4 pt-2">
                    <button 
                      onClick={() => setIsVideoOpen(false)}
                      className="px-6 py-3 bg-[#1D9E75] hover:bg-[#15835e] text-white rounded-xl font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      Selesai Menonton
                    </button>
                    <Link href="/register">
                      <button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer border border-zinc-700">
                        Buat Akun Sekarang
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// --- Continuous Sliding Partner Marquee ---
const PremiumPartners = () => {
  const partners = [
    "Asri Motorindo Group", "Telekomunikasi Seluler BUMN", "TeknoRaya Nusantara", "MobiRaya Trans", "PACO Global Advisory", "Unilivera Pratama",
    "Perbankan Finansial BUMN", "Retail Digicorpora", "Mega Distribusi Logistik", "Sinergi Energi Nasional"
  ];

  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-950 py-10 overflow-hidden border-b border-zinc-150 dark:border-zinc-900 relative">
      <div className="absolute left-0 inset-y-0 w-32 bg-gradient-to-r from-slate-50 dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-32 bg-gradient-to-l from-slate-50 dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-5 mb-5 text-center">
        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 font-mono">
          Jaringan Integrasi Kemitraan Penyaluran & Evaluator Alumni Sektor Strategis
        </p>
      </div>

      <div className="relative flex overflow-x-hidden">
        <motion.div 
          className="flex gap-12 text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-black text-xs sm:text-sm font-mono whitespace-nowrap select-none pr-12"
          animate={{ x: [0, "-50%"] }}
          transition={{
            ease: "linear",
            duration: 25,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          {partners.concat(partners).map((partner, index) => (
            <div key={index} className="flex items-center gap-3 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75]" />
              <span className="hover:text-zinc-900 dark:hover:text-white transition-colors">{partner}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// --- Trust Metrics Section with Glowing Container ---
const Stats = () => {
  const stats = [
    { value: "54120+", label: "Talenta Sukses Teranalisis" },
    { value: "96%", label: "Akurasi Rekomendasi Karir" },
    { value: "180+", label: "Kemitraan Rekruter Aktif" },
    { value: "90 hari", label: "Durasi Peta Aksi Sukses" },
  ];

  return (
    <section className="bg-zinc-900 py-20 md:py-28 px-6 relative overflow-hidden transition-colors border-y border-zinc-800">
      {/* Background neon grid visual inside stats */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 relative z-10">
        {stats.map((stat, i) => (
          <ScrollReveal 
            key={i} 
            delay={i * 0.1}
            className="text-center lg:text-left space-y-1.5 border-l-2 border-[#1D9E75]/35 pl-6 relative group"
          >
            {/* Corner hover glow trigger */}
            <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-[#1D9E75] to-[#534AB7] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <h3 className="text-4xl md:text-5xl font-black mb-1 text-white uppercase italic tracking-tighter">
              <Counter value={stat.value} />
            </h3>
            <p className="text-zinc-400 text-[10px] md:text-xs font-black uppercase tracking-widest font-mono">
              {stat.label}
            </p>
          </ScrollReveal>
        ))}
      </div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1D9E75]/5 rounded-full blur-[130px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    </section>
  );
};

// --- Premium Bento Grid Feature Board ---
const BentoFeatures = () => {
  return (
    <section id="fitur" className="bg-white dark:bg-zinc-950 py-28 md:py-36 px-5 transition-colors duration-500 relative">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[#1D9E75] text-xs font-black uppercase tracking-[0.2em] bg-[#1D9E75]/10 px-4.5 py-2 rounded-full font-mono">
            ARSITEKTUR PLATFORM CO-PILOT AI
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white uppercase italic leading-[0.95] tracking-tight">
            Fitur Canggih Peningkat <br /> Kredibilitas Karir.
          </h2>
          <p className="text-sm sm:text-base text-zinc-550 dark:text-zinc-400 font-semibold max-w-lg mx-auto leading-relaxed">
            Hentikan berspekulasi atas kegagalan rekrutmen. CareerLens AI terstandar mengoreksi tatanan resume dari bot ATS hingga jalinan interview lisan.
          </p>
        </ScrollReveal>

        {/* Premium Bento Board Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card Box 1: AI Parser (Two Column Span) */}
          <ScrollReveal 
            direction="up" 
            className="md:col-span-2 group relative overflow-hidden"
          >
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[32px] p-8 md:p-10 flex flex-col justify-between min-h-[390px] hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-black/20 hover:-translate-y-1.5 transition-all duration-300 relative z-10">
              
              {/* Card Aura Backglow effect */}
              <div className="absolute -right-16 -top-16 w-36 h-36 bg-[#1D9E75]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
              
              <div className="space-y-4 text-left relative z-20">
                <div className="w-12 h-12 rounded-2xl bg-[#1D9E75]/10 text-[#1D9E75] flex items-center justify-center mb-6 border border-[#1D9E75]/20">
                  <BrainCircuit size={22} className="animate-pulse" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                  Pencocokan & Reformulasi Otomatis ATS
                </h3>
                <p className="text-zinc-550 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold max-w-xl">
                  Parser kecerdasan buatan menyaring kurikulum portofoliomu, melacak hilangnya terminologi penting (hard-skills), mengoreksi kesalahan istilah pasif universitas / vokasi, sehingga menjamin kelulusan seleksi bot rekrutmen di tahap awal dengan target skor minimum 80%.
                </p>
              </div>
              
              {/* Bottom widget detailing status */}
              <div className="mt-8 border-t border-zinc-200 dark:border-zinc-805 pt-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-[10px] sm:text-[11px] font-mono relative z-20">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-zinc-200 dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-zinc-550 dark:text-zinc-300 font-bold">Standard Kurikulum Komparatif</span>
                  <span className="text-[#1D9E75] bg-[#1D9E75]/10 px-3 py-1.5 rounded-lg font-bold">Realtime AI Feedback</span>
                </div>
                <div className="flex items-center gap-1 text-[#1D9E75] font-black">
                  <span>ACTIVE CO-PILOT TUNING</span>
                  <TrendingUp size={14} className="animate-bounce" />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card Box 2: Personalized 90D Career Path (One Column Span) */}
          <ScrollReveal direction="up" delay={0.1} className="group relative overflow-hidden">
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[32px] p-8 md:p-10 flex flex-col justify-between min-h-[390px] hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-black/20 hover:-translate-y-1.5 transition-all duration-300 relative z-10">
              
              <div className="absolute -right-16 -top-16 w-36 h-36 bg-[#534AB7]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

              <div className="space-y-4 text-left relative z-20">
                <div className="w-12 h-12 rounded-2xl bg-[#534AB7]/10 text-[#534AB7] flex items-center justify-center mb-6 border border-[#534AB7]/20">
                  <Target size={22} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                  Peta Aksi 90-Hari Terstruktur
                </h3>
                <p className="text-zinc-550 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold">
                  Saran pembelajaran mingguan berurutan terverifikasi AI. Dilengkapi e-book penyusunan bekal portofolio berkualitas, dokumentasi industri strategis, dan agenda pendaftaran yang terintegrasi.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 relative z-20 pt-4 border-t border-zinc-200 dark:border-zinc-805">
                <span className="w-2.5 h-2.5 rounded-full bg-[#534AB7] animate-ping" />
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest font-mono">STANDARISASI KHUSUS LOKAL & GLOBAL</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card Box 3: AI Voice Speech Simulator (One Column Span) */}
          <ScrollReveal direction="up" className="group relative overflow-hidden">
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[32px] p-8 md:p-10 flex flex-col justify-between min-h-[390px] hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-black/20 hover:-translate-y-1.5 transition-all duration-300 relative z-10">
              
              <div className="absolute -right-16 -top-16 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

              <div className="space-y-4 text-left relative z-20">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 border border-amber-500/20">
                  <Volume2 size={22} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                  Interview Lisan Voice Simulator
                </h3>
                <p className="text-zinc-550 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold">
                  Enyahkan kegugupan berucap. Tantang refleks menjawab wawancara dari ribuan bank soal HRD global. Suaramu direkam, dievaluasi pelafalannya, dan dideteksi kesolidan gestur bahasa kuncimu seketika.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between text-[10px] font-black uppercase text-zinc-400 font-mono relative z-20 pt-4 border-t border-zinc-200 dark:border-zinc-805">
                <span>GESTUR BAHASA SOP:</span>
                <span className="text-amber-500 font-black">+88% RATA SCORE PENINGKATAN</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card Box 4: Exclusive Corporate Pipeline (Two Column Span) */}
          <ScrollReveal 
            direction="up" 
            delay={0.1}
            className="md:col-span-2 group relative overflow-hidden"
          >
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[32px] p-8 md:p-10 flex flex-col justify-between min-h-[390px] hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-black/20 hover:-translate-y-1.5 transition-all duration-300 relative z-10">
              
              <div className="absolute -right-16 -top-16 w-36 h-36 bg-teal-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
              
              <div className="space-y-4 text-left relative z-20">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-650 flex items-center justify-center mb-6 border border-teal-500/20">
                  <CheckCircle2 size={22} className="text-teal-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                  Penyaluran & Gerbang Karir Rekanan
                </h3>
                <p className="text-zinc-550 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold max-w-xl">
                  Sistem CareerLens AI menautkan portofoliomu secara otomatis ke portal rekruitmen digital mitra industri nasional begitu skor ATS evaluasi CV-mu di atas kelayakan minimal. Lamaran terkirim otomatis, memotong birokrasi penyerahan berkas yang berbelit-belit.
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-805 grid grid-cols-3 gap-4 text-center relative z-20">
                <div>
                  <dt className="text-2xl sm:text-3xl font-mono font-black text-[#1D9E75]">180+</dt>
                  <dd className="text-[9px] font-mono uppercase text-zinc-450 dark:text-zinc-400 font-extrabold mt-1">Sektor Perusahaan</dd>
                </div>
                <div>
                  <dt className="text-2xl sm:text-3xl font-mono font-black text-[#534AB7]">94.2%</dt>
                  <dd className="text-[9px] font-mono uppercase text-zinc-450 dark:text-zinc-400 font-extrabold mt-1">Alumni Terserap</dd>
                </div>
                <div>
                  <dt className="text-2xl sm:text-3xl font-mono font-black text-amber-500">22 Jam</dt>
                  <dd className="text-[9px] font-mono uppercase text-zinc-450 dark:text-zinc-400 font-extrabold mt-1">Umpan Balik HRD</dd>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

// --- Connection Pipeline Steps (Tiga Langkah Nyata) ---
const HowItWorks = () => {
  const steps = [
    {
      id: "01",
      title: "Uraikan CV & Profile",
      desc: "Lakukan copy-paste cepat data profil presentasi akademik lama Anda atau seret file dokumen berformat PDF ke dalam portal scanner."
    },
    {
      id: "02",
      title: "Adaptasi & Rampungkan Roadmap",
      desc: "Terapkan penyusunan kata kunci terstandardisasi, pelajari roadmap bimbingan modul, dan kuasai respon simulasi interview lisan secara berkelanjutan."
    },
    {
      id: "03",
      title: "Lamar & Jalin Pekerjaan Nyata",
      desc: "Sistem AI CareerLens mendeteksi kelayakan kualifikasimu, lalu secara instan membuka folder lamaran otomatis ke jajaran rekruter mitra kami."
    }
  ];

  return (
    <section id="cara-kerja" className="bg-zinc-50 dark:bg-zinc-950 py-28 md:py-36 px-5 transition-colors border-t border-zinc-150 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[#534AB7] text-xs font-black uppercase tracking-[0.25em] bg-[#534AB7]/10 px-4.5 py-1.5 rounded-full font-mono">
            ALUR EVALUASI TAKTIS
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white uppercase italic leading-[0.95] tracking-tight">
            Tiga Langkah Menuju <br /> Penempatan Karir Terarah.
          </h2>
          <p className="text-sm sm:text-base text-zinc-550 dark:text-zinc-400 font-semibold max-w-lg mx-auto leading-relaxed">
            Sistem pengkondisian karir paling transparan tanpa bias penafsiran, menautkan talenta muda langsung ke kualifikasi asli HRD.
          </p>
        </ScrollReveal>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Subtle line background indicator */}
          <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 hidden md:block z-0" />
          
          {steps.map((step, i) => (
            <ScrollReveal
              key={step.id}
              delay={i * 0.15}
              className="relative z-10"
            >
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-[30px] p-8 md:p-10 text-left space-y-6 hover:shadow-2xl dark:hover:bg-zinc-850 group transition-all duration-300"
              >
                <div 
                  className="text-6xl font-black tracking-tighter opacity-20 group-hover:opacity-100 transition-opacity select-none font-mono" 
                  style={{ WebkitTextStroke: "1px #1D9E75", color: "transparent" }}
                >
                  {step.id}
                </div>
                <h3 className="text-lg md:text-xl font-black text-zinc-900 dark:text-zinc-100 leading-snug">
                  {step.title}
                </h3>
                <p className="text-zinc-550 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold">
                  {step.desc}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Testimonials Section (Multi-Segment Real Student Alumni) ---
const Testimonials = () => {
  const testimonies = [
    {
      name: "Rizky Fauzi Firmansyah",
      school: "Alumni SMK Negeri 4 Bandung",
      role: "Junior Frontend Engineer @ Korporat Telekomunikasi BUMN",
      avatar: "RF",
      text: "Sangat membantu merombak total dokumen saya yang tadinya dipenuhi dekorasi Canva warna-warni yang mengacaukan parsing bot. Setelah dioptimasi CareerLens AI, CV saya dibaca dengan akurasi tinggi dan berujung panggilan magang resmi!"
    },
    {
      name: "Sabrina Aliyah Hakim",
      school: "Mahasiswi ITB - S1 Informatika",
      role: "Backend Intern @ Perusahaan Tekno Regional",
      avatar: "SA",
      text: "Simulasi rekam wawancara AI di sini mengoreksi kebiasaan berbicara tidak profesional saya sewaktu presentasi atau diskusi kelompok. Skor ATS dari CareerLens sangat presisi mengacu pada standar riil rekruter nasional."
    },
    {
      name: "Ananda Budi Susilo",
      school: "Fresh Graduate S1 Manajemen UI",
      role: "Management Trainee @ Consumer Goods Multinasional Tbk",
      avatar: "AB",
      text: "Peta aksi roadmap 90 hari membimbing agenda harian portofolio saya dengan sistematis, tanpa membingungkan lagi mana subyek material yang harus dikuasai terlebih dahulu. Sangat teratur dan langsung terintegrasi dengan daftar lamaran."
    }
  ];

  return (
    <section id="testimoni" className="bg-white dark:bg-zinc-950 py-28 md:py-36 px-5 transition-colors duration-500 border-t border-zinc-150 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[#1D9E75] text-xs font-black uppercase tracking-[0.2em] bg-[#1D9E75]/10 px-4.5 py-1.5 rounded-full font-mono">
            TESTIMONIAL ALUMNI SUCCESS
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white uppercase italic leading-[0.95] tracking-tight">
            Kisah Sukses Nyata <br /> Rekan Seperjuanganmu.
          </h2>
          <p className="text-sm sm:text-base text-zinc-550 dark:text-zinc-400 font-semibold max-w-lg mx-auto">
            Mereka yang mendobrak keraguan dan mereformulasi portofolio hingga berhasil terserap di institusi papan atas Indonesia.
          </p>
        </ScrollReveal>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonies.map((item, i) => (
            <ScrollReveal
              key={i}
              delay={i * 0.12}
            >
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-[32px] p-8 md:p-10 flex flex-col justify-between hover:shadow-2xl hover:bg-white dark:hover:bg-zinc-850 duration-300 min-h-[350px] relative transition-all"
              >
                <div className="space-y-6 text-left relative z-10">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={14} fill="currentColor" stroke="none" />
                    ))}
                  </div>
                  <p className="text-zinc-650 dark:text-zinc-300 text-xs sm:text-sm font-semibold leading-relaxed italic">
                    &quot;{item.text}&quot;
                  </p>
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800 mt-8 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-tr from-[#1D9E75] to-[#534AB7] rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md">
                    {item.avatar}
                  </div>
                  <div className="text-left space-y-0.5 min-w-0">
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white truncate tracking-tight">{item.name}</h4>
                    <p className="text-[9px] text-[#1D9E75] font-black uppercase tracking-wider truncate font-mono">{item.role}</p>
                    <p className="text-[8px] text-zinc-400 font-bold uppercase truncate">{item.school}</p>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Sleek Interactive Accordion FAQ Section ---
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      q: "Apakah CareerLens AI hanya bisa dipakai oleh lulusan SMK saja?",
      a: "Sekarang CareerLens sudah merangkul seluruh segmen pendidikan. Mulai dari Pelajar aktif (SMA/SMK/MA sederajat), Mahasiswa Aktif bidang vokasi atau universitas akademik (D3/D4/S1), hingga para pencari kerja (fresh-graduates dan umum) yang sedang mengoptimasi portofolio mereka ke standar modern."
    },
    {
      q: "Bagaimana cara kerja penghitungan akurasi skor ATS di sini?",
      a: "Sistem NLP parser kami disesuaikan dengan skenario bot rekrutmen global kelas kerja. Mesin kami memindai terminologi teknis, tatanan sintaks kalimat, serta menyortir kesalahan tatanan warna mencolok dari Canva yang sering kali menyumbat kinerja alat penapis robot rekruter."
    },
    {
      q: "Apakah seluruh fitur peta aksi belajar 90 hari benar gratis?",
      a: "Ya, 100% gratis! Akses format template CVATS standar global, pengerjaan simulasi audit, serta pemetaan bimbingan mingguan kami sediakan mendasar guna mempercepat daya saing talenta Indonesia."
    },
    {
      q: "Bagaimana kredibilitas tautan dengan para perusahaan mitra?",
      a: "Begitu penilaian kurikulum di dashboard-mu dinyatakan memenuhi target industri (meraih skor minimal kualifikasi ATS 80%), data kompilasi portofolio-mu akan otomatis terkirim langsung ke layar dashboard para penyeleksi rekruter mitra penempatan di sistem kami."
    }
  ];

  return (
    <section id="faq" className="bg-zinc-50 dark:bg-zinc-950 py-28 md:py-36 px-5 transition-colors border-t border-zinc-150 dark:border-zinc-900">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Section Header */}
        <ScrollReveal className="text-center space-y-4">
          <span className="text-[#534AB7] text-xs font-black uppercase tracking-[0.25em] bg-[#534AB7]/10 px-4.5 py-1.5 rounded-full font-mono">
            FAQ PORTAL HUB
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tight">
            Jawaban Pertanyaan Umum.
          </h2>
        </ScrollReveal>

        {/* Accordions */}
        <div className="space-y-4 text-left">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <ScrollReveal
                key={i}
                delay={i * 0.08}
                className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200/60 dark:border-zinc-800 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-6 sm:p-8 flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="text-xs sm:text-md font-black text-zinc-850 dark:text-zinc-200 group-hover:text-[#1D9E75] transition-colors pr-3 leading-snug">
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="text-zinc-500 group-hover:text-[#1D9E75] shrink-0"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                    >
                      <div className="p-6 sm:p-8 pt-0 text-zinc-550 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed border-t border-zinc-100 dark:border-zinc-850 font-semibold font-sans">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- Majestic Premium Closing Call to Action Section ---
const CTA = () => {
  const { status } = useSession();
  const authenticated = status === "authenticated";

  return (
    <section className="bg-zinc-900 py-28 md:py-36 px-5 relative overflow-hidden text-center border-t border-zinc-800">
      
      {/* Heavy Glowing Background Accent Aura */}
      <div className="absolute inset-x-0 top-0 h-full w-full bg-[#1D9E75]/10 dark:bg-[#1D9E75]/12 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-[#534AB7]/8 dark:bg-[#534AB7]/10 blur-[100px] rounded-full translate-y-1/2 pointer-events-none" />

      <ScrollReveal className="max-w-4xl mx-auto space-y-10 relative z-10">
        <h2 className="text-[32px] sm:text-6xl lg:text-[76px] font-black text-white leading-[1.0] uppercase italic tracking-tighter">
          Tunjukkan Potensi <br />
          <span className="text-[#1D9E75] bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-[#1D9E75] to-indigo-400">Terbaik Kualifikasi Karirmu.</span>
        </h2>
        
        <p className="text-zinc-400 text-xs sm:text-base max-w-xl mx-auto font-semibold leading-relaxed px-2">
          Ambil kendali kualifikasi kelulusan lamaranmu hari ini. Integrasikan CV lamaran lamamu ke dalam engine AI, sesuaikan terminologi teknis, dan sambut lamaran otomatis para rekruter strategis.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
          <Link href={authenticated ? "/dashboard/cv" : "/register"} className="w-full sm:w-auto">
            <button
              id="cta-bottom-primary-premium"
              className="w-full sm:w-auto h-18 sm:h-20 px-12 bg-gradient-to-r from-[#1D9E75] to-teal-500 hover:from-[#158c67] hover:to-[#1D9E75] text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_15px_35px_rgba(29,158,117,0.4)] cursor-pointer shadow-lg"
            >
              OPTIMALKAN CV SAYA SEKARANG — GRATIS
            </button>
          </Link>
        </div>
        
        <div className="text-[10px] sm:text-xs font-black text-zinc-500 uppercase tracking-widest font-mono">
          ⚡ TANPA BUTUH KARTU KREDIT • AKSES PENYERAPAN INDUSTRI PENUH
        </div>
      </ScrollReveal>
    </section>
  );
};

// --- Main App Root Wrapper Component ---
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-zinc-950 overflow-x-hidden selection:bg-[#1D9E75] selection:text-white transition-colors duration-500 font-sans">
      <Navbar />
      <HeroAndPlayground />
      <PremiumPartners />
      <Stats />
      <BentoFeatures />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
