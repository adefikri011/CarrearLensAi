'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
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

// --- Custom Hooks for Scroll Reveal (Optimized) ---
const useScrollReveal = (threshold = 0.05) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold }
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
  }, [threshold]);

  return { ref, visible };
};

// --- Numerical Counter with Performance Guard ---
const Counter = ({ value, duration = 1000 }: { value: string; duration?: number }) => {
  const { ref, visible } = useScrollReveal(0.2);
  const [displayValue, setDisplayValue] = useState(0);

  const numericString = value.replace(/[^0-9]/g, '');
  const target = parseInt(numericString, 10);
  const suffix = value.replace(/[0-9]/g, '').replace('.', '');

  useEffect(() => {
    if (visible && !isNaN(target)) {
      let start = 0;
      const end = target;
      const stepTime = 16; // 60fps frame rate (~16ms)
      const totalSteps = Math.ceil(duration / stepTime);
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / totalSteps;
        // Ease out quadratic progress
        const easedProgress = progress * (2 - progress); 
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
  }, [visible, target, duration]);

  return (
    <span ref={ref} className="font-mono tracking-tight font-black select-none">
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
    audienceLabel: "Siswa SMA / SMKS Sederajat",
    name: "Dimas Aditya Pratama",
    education: "SMK Negeri 4 Bandung (RPL-IT)",
    originalScore: 45,
    optimizedScore: 94,
    missingSkills: ["Next.js App Routing", "TypeScript Engine", "REST API Integration", "Git Collab Practice"],
    recommendations: [
      "Cantumkan Sertifikasi Uji Kompetensi Keahlian (UKK) Resmi Skema BNSP / LSP-P1",
      "Ganti penjelasan tugas sekolah pasif menjadi 'Proyek Produktif Berbasis Pemecahan Masalah'",
      "Fokus pada istilah industri seperti 'Responsive UI Design' & 'Client-Server Communication'"
    ],
    matches: [
      { role: "Junior Frontend Engineer", score: 94, color: "bg-[#1D9E75]", company: "PT GoTo Gojek Tokopedia" },
      { role: "Backend Developer Intern", score: 85, color: "bg-[#534AB7]", company: "PT Telkom Indonesia" },
      { role: "Tech Support Specialist", score: 72, color: "bg-zinc-500", company: "Astra International" }
    ],
    rawText: "REKAYASA PERANGKAT LUNAK\nBisa HTML, mengedit video di Canva, Microsoft Word, rajin bekerja keras, mampu mengendarai motor, bisa membuat kalkulator sederhana di web..."
  },
  'mahasiswa': {
    audienceLabel: "Mahasiswa Aktif (Vokasi & Universitas)",
    name: "Siti Rahmawati S.",
    education: "Universitas Indonesia (S1 Sistem Informasi)",
    originalScore: 56,
    optimizedScore: 97,
    missingSkills: ["Cloud Architecture (AWS)", "Docker Contanerization", "CI/CD Automations", "SQL Optimization"],
    recommendations: [
      "Gunakan metrik pencapaian kuantitatif (contoh: 'mempercepat respon query backend sebesar 32%')",
      "Deskripsikan kontribusi spesifik pada proyek riset, skripsi, atau proyek open-source",
      "Tambahkan lencana sertifikasi professional berlisensi global (Google, AWS, atau Oracle)"
    ],
    matches: [
      { role: "Fullstack Developer Trainee", score: 97, color: "bg-[#1D9E75]", company: "PT Bank Mandiri (Persero) Tbk" },
      { role: "Junior Cloud Engineer", score: 89, color: "bg-[#534AB7]", company: "Shopee Singapore" },
      { role: "Data Product Specialist", score: 81, color: "bg-zinc-500", company: "KPMG Indonesia" }
    ],
    rawText: "S1 SISTEM INFORMASI\nIPK 3.82. Aktif dalam organisasi BEM, pernah membuat proyek kelompok akhir semester bertema e-commerce kelompok, mengerti Python dan SQL dasar..."
  },
  'fresh-grad': {
    audienceLabel: "Fresh Graduate & Umum (Job Seekers)",
    name: "Bagas Pratama Wiranto",
    education: "Lulusan Baru / Umum (Pencari Kerja)",
    originalScore: 39,
    optimizedScore: 92,
    missingSkills: ["Strategic Financial Planning", "Advanced Excel (VLOOKUP, Pivot, Custom VBA)", "E-Faktur & Tax Reporting"],
    recommendations: [
      "Sertakan portofolio studi kasus keuangan akurat / strategi kampanye pemasaran digital riil",
      "Susun Executive Summary (Ringkasan Profesional) yang berorientasi pada penyelesaian target bisnis",
      "Bersihkan visual rumit (grafik warna-warni, bintang rating skill) agar sepenuhnya lolos parsing bot ATS"
    ],
    matches: [
      { role: "Finance Operations Staff", score: 92, color: "bg-[#1D9E75]", company: "Grab Indonesia" },
      { role: "Management Trainee Executive", score: 87, color: "bg-[#534AB7]", company: "PT Unilever Indonesia" },
      { role: "Internal Auditor Associate", score: 80, color: "bg-zinc-500", company: "PwC Indonesia" }
    ],
    rawText: "FRESH GRADUATE EKONOMI\nLulusan baru S1 ekonomi. Ingin melamar di posisi keuangan atau administrasi apa saja yang kosong, jujur, rajin, disiplin tinggi, siap lembur..."
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
    resource: { title: "Bank Soal & Formula Jawaban Interview HRD BUMN-Astra", type: "Interactive" }
  }
];

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
  
  // Video Modal / Walkthrough Demo State
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Waveform animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const bars = Array.from({ length: 22 }, () => Math.floor(Math.random() * 32) + 4);
      setWaveformBars(bars);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setAnalysisDone(false);
    setScanLogs([]);

    const logMessages = [
      "🔄 [0.2s] Memuat engine parsers PDF...",
      "🔍 [0.6s] Memindai elemen teks, gaya font, & bounding box CV...",
      "🧠 [1.1s] Menganalisis kesenjangan kurikulum (missing education gap)...",
      "📦 [1.5s] Menyelaraskan sisa kompetensi ke standar rekrutmen global...",
      "🚀 [1.8s] Selesai! Menghitung kecocokan jalur kerja & skor ATS..."
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setScanProgress(currentProgress);

      if (currentProgress === 10) setScanLogs(p => [...p, logMessages[0]]);
      if (currentProgress === 35) setScanLogs(p => [...p, logMessages[1]]);
      if (currentProgress === 60) setScanLogs(p => [...p, logMessages[2]]);
      if (currentProgress === 80) setScanLogs(p => [...p, logMessages[3]]);
      if (currentProgress === 95) setScanLogs(p => [...p, logMessages[4]]);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setAnalysisDone(true);
      }
    }, 70);
  };

  const currProfile = AUDIENCE_DATA[selectedAudience];

  return (
    <section className="relative w-full bg-slate-50 dark:bg-zinc-950 pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden px-4 md:px-6 transition-colors duration-500">
      {/* Premium Floating Animated Background Orbs */}
      <div className="absolute inset-0 dot-pattern opacity-[0.35] dark:opacity-[0.2]" />
      
      <motion.div 
        animate={{ 
          x: [0, 25, -20, 0],
          y: [0, -35, 15, 0],
          scale: [1, 1.1, 0.95, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-[#1D9E75]/10 dark:bg-[#1D9E75]/12 rounded-full blur-[140px] pointer-events-none" 
      />
      
      <motion.div 
        animate={{ 
          x: [0, -30, 20, 0],
          y: [0, 40, -15, 0],
          scale: [1, 0.95, 1.05, 1]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#534AB7]/12 dark:bg-[#534AB7]/10 rounded-full blur-[150px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        
        {/* Left Column: Visual copy & details */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-[0_4px_12px_rgba(0,0,0,0.03)] cursor-pointer hover:border-[#1D9E75] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1D9E75] animate-spin-slow" />
            <span className="text-[10px] md:text-xs font-black tracking-widest text-[#1D9E75] uppercase font-mono">
              Empowering Talents • AI Career Accelerator
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <h1 className="text-[36px] sm:text-6xl lg:text-[76px] font-black tracking-tight text-zinc-900 dark:text-white leading-[0.98] uppercase italic">
              Lihat Potensi Kariermu, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1D9E75] via-[#2ba87e] to-[#534AB7]">
                Mulai Dari Sekarang.
              </span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold">
              Platform bertenaga AI tercanggih untuk mencocokkan kualifikasimu, mengaudit standar ATS, mendeteksi kelayakan industri, dan menyusun peta aksi karir strategis siswa SMK, SMA, Mahasiswa, hingga pencari kerja umum.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <Link href={authenticated ? "/dashboard/cv" : "/register"} className="w-full sm:w-auto">
              <button 
                id="hero-cta-main-premium"
                className="w-full sm:w-auto h-16 sm:h-18 px-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#1D9E75] dark:hover:bg-[#1D9E75] dark:hover:text-white hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-2xl shadow-[#1D9E75]/10 dark:shadow-white/5 flex items-center justify-center gap-3 cursor-pointer group"
              >
                Analisis CV Saya Sekarang 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </Link>
            <button 
              id="hero-cta-demo-premium"
              onClick={() => setIsVideoOpen(true)}
              className="w-full sm:w-auto h-16 sm:h-18 px-10 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-sm group"
            >
              <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={11} fill="currentColor" />
              </div>
              Tonton Demo Interaktif
            </button>
          </motion.div>

          {/* Fully Authentic Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 1 }}
            className="pt-8 border-t border-zinc-200/80 dark:border-zinc-800/40 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4"
          >
            <div className="flex -space-x-3">
              {[
                { label: "SMK", bg: "from-[#1D9E75] to-[#2ba87e]" },
                { label: "UNIV", bg: "from-[#534AB7] to-[#6a61cc]" },
                { label: "ALUM", bg: "from-amber-500 to-orange-500" },
                { label: "+54k", bg: "from-zinc-800 to-zinc-900" }
              ].map((pill, idx) => (
                <div key={idx} className={`w-10 h-10 rounded-full border-2 border-white dark:border-zinc-950 bg-gradient-to-tr ${pill.bg} flex items-center justify-center text-[9px] font-black text-white shrink-0 shadow-md`}>
                  {pill.label}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="currentColor" stroke="none" />)}
              </div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider font-mono">
                Rekomendasi Utama Guru, Kampus, & HRD Rekruter Nasional
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Premium Interactive Sandbox Playground */}
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-3xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.06)] dark:shadow-[0_45px_100px_rgba(0,0,0,0.35)] overflow-hidden"
          >
            {/* Window Glass Container Header Bar */}
            <div className="bg-zinc-50/70 dark:bg-zinc-900/60 p-5 border-b border-zinc-150 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-2 self-start sm:self-center">
                <span className="w-3.5 h-3.5 rounded-full bg-red-400/80 hover:bg-red-500 transition-colors cursor-pointer" />
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-400/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
                <span className="w-3.5 h-3.5 rounded-full bg-green-400/80 hover:bg-green-500 transition-colors cursor-pointer" />
              </div>

              {/* Advanced Custom Layout Tabs Slider */}
              <div className="flex bg-zinc-250/80 dark:bg-zinc-800/80 rounded-xl p-1 gap-1 w-full sm:w-auto relative">
                {[
                  { id: "cv-scanner", label: "CV SCANNER", icon: FileText },
                  { id: "roadmap", label: "90-DAY MAP", icon: Compass },
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
                          layoutId="activeTabBackground"
                          className="absolute inset-0 bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-zinc-200/50 dark:border-zinc-800 z-0"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Icon size={12} className={active ? "text-[#1D9E75]" : "text-zinc-400"} />
                        <span className={active ? "text-[#1D9E75] dark:text-white" : "text-zinc-500 dark:text-zinc-400"}>
                          {tab.label}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Live Playground Content Area */}
            <div className="p-6 md:p-8 min-h-[465px] flex flex-col justify-between">
              
              {/* TAB 1: CV SCANNER SYSTEM */}
              {activeTab === 'cv-scanner' && (
                <div className="space-y-6">
                  <div>
                    {/* Personalized segmentation tagger */}
                    <div className="flex items-center gap-1 mb-2.5">
                      <GraduationCap size={13} className="text-[#1D9E75]" />
                      <span className="text-[10px] font-bold tracking-widest text-[#534AB7] uppercase font-mono">
                        Pilih Jenjang / Kalangan Kamu:
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { id: 'sma-smk', label: '🏫 SMA / SMK', color: 'hover:border-[#1D9E75]' },
                        { id: 'mahasiswa', label: '🎓 MAHASISWA', color: 'hover:border-[#534AB7]' },
                        { id: 'fresh-grad', label: '💼 FRESH GRAD', color: 'hover:border-amber-500' }
                      ] as const).map((aud) => (
                        <button
                          key={aud.id}
                          onClick={() => {
                            setSelectedAudience(aud.id);
                            setAnalysisDone(false);
                            setScanLogs([]);
                          }}
                          className={`py-2 px-1 sm:py-3 sm:px-2 rounded-xl border text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer text-center ${
                            selectedAudience === aud.id
                              ? "bg-[#1D9E75]/10 border-[#1D9E75] text-[#1D9E75] scale-[1.03] shadow-sm font-black"
                              : "border-zinc-205 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850"
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
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="bg-zinc-50 dark:bg-zinc-950/60 rounded-2xl p-5 border border-dashed border-zinc-200 dark:border-zinc-800 relative space-y-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3.5 bg-zinc-100 dark:bg-zinc-800 text-[#1D9E75] rounded-xl shrink-0">
                            <UploadCloud size={24} className="animate-bounce" style={{ animationDuration: '2.5s' }} />
                          </div>
                          <div className="space-y-1 text-left">
                            <h4 className="text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-zinc-200">{currProfile.name}</h4>
                            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest font-mono">{currProfile.education}</p>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-xl p-3.5 text-[10px] sm:text-[11px] font-mono whitespace-pre-wrap text-left text-zinc-550 dark:text-zinc-400 relative overflow-hidden h-20 select-none">
                          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none" />
                          {currProfile.rawText}
                        </div>
                        
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-bold uppercase tracking-widest bg-zinc-100/50 dark:bg-zinc-900/60 px-4 py-3 rounded-xl border border-zinc-150 dark:border-zinc-850 font-mono">
                          <span>KUALITAS CV SEKARANG:</span>
                          <span className="text-red-500 font-black flex items-center gap-1">
                            {currProfile.originalScore}% (BURUK UNTUK ATS)
                          </span>
                        </div>
                        
                        <button
                          onClick={handleSimulateScan}
                          className="w-full bg-[#1D9E75] hover:bg-[#15825f] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-lg shadow-[#1D9E75]/10"
                        >
                          <Zap size={14} className="fill-white" /> OPTIMALKAN DENGAN EVALUASI AI
                        </button>
                      </motion.div>
                    )}

                    {isScanning && (
                      <motion.div
                        key="scanning-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-zinc-900 text-zinc-100 rounded-2xl p-6 font-mono space-y-5 border border-zinc-800 min-h-[300px] relative overflow-hidden text-left"
                      >
                        {/* Premium custom laser scanner simulation element */}
                        <motion.div
                          animate={{ y: ["0%", "280px", "0%"] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#1D9E75] to-transparent shadow-[0_0_12px_#1D9E75] pointer-events-none z-10"
                        />
                        
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                          <span className="text-xs text-zinc-400 font-extrabold uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#1D9E75] animate-ping" />
                            Live Audit Core Engine...
                          </span>
                          <span className="text-xs text-[#1D9E75] font-black">{scanProgress}%</span>
                        </div>

                        <div className="space-y-2 h-36 overflow-y-auto no-scrollbar text-[10px] text-zinc-300">
                          {scanLogs.map((log, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="text-emerald-500 font-bold">✔</span>
                              <span>{log}</span>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-1">
                          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#1D9E75] h-full transition-all duration-75" style={{ width: `${scanProgress}%` }} />
                          </div>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">SYSTEM THREAD ID: RM-2026</span>
                        </div>
                      </motion.div>
                    )}

                    {analysisDone && (
                      <motion.div
                        key="done-state"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-5 text-left"
                      >
                        {/* Interactive dynamic high end metric scores view */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 bg-red-500/5 dark:bg-red-950/10 rounded-2xl border border-red-200/50 dark:border-red-900/30 text-center space-y-1">
                            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest font-mono">Sebelum (Unoptimized)</span>
                            <h5 className="text-2xl font-black text-red-500 font-mono">{currProfile.originalScore}%</h5>
                          </div>
                          <div className="p-4 bg-teal-500/5 dark:bg-teal-950/15 rounded-2xl border border-[#1D9E75]/30 text-center space-y-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-8 h-8 bg-[#1D9E75]/10 rounded-bl-2xl flex items-center justify-center">
                              <Sparkles size={11} className="text-[#1D9E75]" />
                            </div>
                            <span className="text-[9px] font-black text-[#1D9E75] uppercase tracking-widest font-mono">Setelah AI Audit</span>
                            <h5 className="text-2xl font-black text-[#1D9E75] font-mono">{currProfile.optimizedScore}%</h5>
                          </div>
                        </div>

                        {/* Staggered Recommendations list */}
                        <div className="space-y-2.5">
                          <h6 className="text-[10px] font-black text-[#534AB7] uppercase tracking-widest font-mono">
                            🛠️ SARAN REFORMULASI ATS:
                          </h6>
                          <div className="space-y-2">
                            {currProfile.recommendations.map((rec, i) => (
                              <div key={i} className="flex gap-2.5 items-start text-[11px]">
                                <span className="w-4 h-4 rounded-full bg-[#1D9E75]/10 text-[#1D9E75] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5 font-mono">
                                  {i + 1}
                                </span>
                                <span className="text-zinc-650 dark:text-zinc-300 font-semibold">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Real matches alignment list */}
                        <div className="space-y-2 pt-3 border-t border-zinc-150 dark:border-zinc-800/80">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-zinc-400 font-mono tracking-wider">
                            <span>Kecocokan Lowongan AI:</span>
                            <span className="text-[#1D9E75]">AUTO MATCHING SYSTEM ACTIVED</span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            {currProfile.matches.map((job) => (
                              <div key={job.role} className="p-2.5 bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded-xl flex flex-col justify-between h-20">
                                <div className="space-y-0.5">
                                  <h5 className="text-[9px] font-black text-zinc-850 dark:text-zinc-200 truncate">{job.role}</h5>
                                  <span className="text-[8px] font-black text-zinc-400 block truncate uppercase font-mono">{job.company}</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#1D9E75] block font-mono">{job.score}% Match</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => setAnalysisDone(false)}
                          className="w-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <RotateCw size={12} className="animate-spin-slow text-[#1D9E75]" /> Ulangi Simulasi Evaluasi
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* TAB 2: ROADMAP 90 HARI */}
              {activeTab === 'roadmap' && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#1D9E75] bg-[#1D9E75]/10 px-2.5 py-1.5 rounded-md uppercase font-mono">
                      FASE TRAINING & PERSIAPAN KARIER:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5 mt-3">
                      {ROADMAP_DATA.map((rm, i) => (
                        <button
                          key={rm.week}
                          onClick={() => setActiveWeekIndex(i)}
                          className={`text-center py-3 rounded-xl border text-[9px] sm:text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all ${
                            activeWeekIndex === i
                              ? "bg-[#1D9E75]/10 border-[#1D9E75] text-[#1D9E75] scale-[1.03] shadow-sm"
                              : "border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850"
                          }`}
                        >
                          {rm.week}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step detail element */}
                  <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 text-left">
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
                              ? "text-zinc-400 dark:text-zinc-500 line-through" 
                              : "text-zinc-700 dark:text-zinc-300"
                          }`}>
                            {task.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Resources box */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-3.5 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#534AB7]/10 text-[#534AB7] flex items-center justify-center font-bold text-xs shrink-0">
                          <Award size={16} />
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-[9px] font-black tracking-widest text-[#534AB7] uppercase font-mono">{ROADMAP_DATA[activeWeekIndex].resource.type}</p>
                          <h5 className="text-[11px] font-extrabold text-zinc-800 dark:text-zinc-200 truncate pr-2">{ROADMAP_DATA[activeWeekIndex].resource.title}</h5>
                        </div>
                      </div>
                      <button className="text-[10px] font-black uppercase text-[#1D9E75] hover:underline cursor-pointer shrink-0 flex items-center gap-0.5">
                        Download <ArrowUpRight size={12} />
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] font-extrabold text-center text-zinc-400 uppercase tracking-widest font-mono">
                    🏁 Diperbarui otomatis mengikuti perkembangan standar kualifikasi industri global.
                  </p>
                </div>
              )}

              {/* TAB 3: AI INTERVIEW SIMULATOR */}
              {activeTab === 'interview' && (
                <div className="space-y-5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest text-[#534AB7] bg-[#534AB7]/10 px-2.5 py-1.5 rounded-md uppercase font-mono">
                      AI VOICE & SPEECH SIMULATOR:
                    </span>
                    <span className="text-[9px] font-black text-emerald-500 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> SEPANJANG LIVE
                    </span>
                  </div>

                  {/* Character box */}
                  <div className="bg-zinc-50 dark:bg-zinc-950/60 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1D9E75] to-[#534AB7] flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm relative">
                      HRD
                      <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-200">Ibu Siska Amelia, S.Psi</h4>
                      <p className="text-[9px] text-[#1D9E75] font-black tracking-widest uppercase font-mono">Lead Recruiter Corportate Astra & BUMN</p>
                    </div>
                  </div>

                  {/* Question Speech Bubble */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-4 rounded-xl text-left shadow-sm relative">
                    <p className="text-xs font-bold text-zinc-650 dark:text-zinc-300 italic leading-relaxed">
                      &quot;Selamat pagi. Di CV Anda belum menyertakan pengalaman kerja panjang, bisa gambarkan bagaimana inisiatif terbaik Anda dalam mengatasi kendala teknis atau merampungkan tugas kelompok yang hampir terlambat?&quot;
                    </p>
                  </div>

                  {/* High Performance animated soundwave visualization */}
                  <div className="flex items-center justify-center gap-1 py-1.5 min-h-[36px]">
                    {waveformBars.map((h, i) => (
                      <div 
                        key={i} 
                        className="w-1 bg-[#1D9E75] rounded-full transition-all duration-100" 
                        style={{ height: `${h}px` }} 
                      />
                    ))}
                  </div>

                  {/* Multiple custom response option keys */}
                  <div className="space-y-2.5">
                    {[
                      { 
                        id: 1, 
                        txt: "Biasanya saya kerjakan seadanya saja agar cepat, yang penting terkumpul tepat waktu sebelum tenggat.", 
                        eval: "❌ Kurang Standar: Menunjukkan orientasi asal-asalan & kurang loyal pada kualitas output.",
                        pts: "-10"
                      },
                      { 
                        id: 2, 
                        txt: "Saya menyusun pemetaan skala prioritas, mendefinisikan kontribusi spesifik tim, serta menggunakan framework pelacakan kerja mandiri untuk menjamin akurasi hasil.", 
                        eval: "🏆 Sempurna! Menunjukkan keterampilan manajerial yang matang, problem-solving, & pemahaman SOP.",
                        pts: "+20"
                      },
                      { 
                        id: 3, 
                        txt: "Saya akan minta perpanjangan tenggat waktu (extention) ke pembimbing akademik atau ketua organisasi agar tidak panik.", 
                        eval: "⚠️ Pasif: Menunjukkan ketahanan stress yang minim dalam mengantisipasi tantangan.",
                        pts: "+5"
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
                              : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850"
                          }`}
                        >
                          <div className="flex gap-2 items-start">
                            <span className="font-extrabold shrink-0 block">{item.id === 2 ? '⚡ Jawaban B (SOP):' : item.id === 1 ? '🔴 Jawaban A:' : '🔵 Jawaban C:'}</span>
                            <span className="font-medium">{item.txt}</span>
                          </div>
                          
                          {selected && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-2.5 pt-2 py-0.5 border-t border-dashed border-zinc-200 dark:border-zinc-800 text-[10px] font-bold block transition-all"
                            >
                              {item.eval} <span className="font-mono text-xs font-black underline ml-1.5">Skor: {item.pts}</span>
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {interviewAnswered && (
                    <button
                      onClick={() => setInterviewAnswered(null)}
                      className="w-full text-center text-[10px] font-extrabold uppercase text-zinc-450 hover:text-[#1D9E75] transition-colors cursor-pointer block font-mono"
                    >
                      RESET SIMULASI WAWANCARA
                    </button>
                  )}
                </div>
              )}

            </div>
          </motion.div>
        </div>
      </div>

      {/* --- PREMIUM VIDEO DEMO MODAL --- */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-zinc-150 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Play size={14} className="text-[#1D9E75]" fill="currentColor" />
                  <span className="font-black text-xs uppercase tracking-widest text-zinc-800 dark:text-zinc-100 font-mono">
                    Visualisasi Demo Aplikasi CareerLens AI
                  </span>
                </div>
                <button 
                  onClick={() => setIsVideoOpen(false)}
                  className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Demo Player Frame */}
              <div className="aspect-video bg-zinc-950 flex flex-col items-center justify-center p-8 text-center text-white relative">
                <div className="absolute inset-x-0 top-0 h-full w-full bg-[#1D9E75]/5 rounded-full blur-3xl pointer-events-none" />
                
                {/* Simulated Interface Showcase Video inside the popup */}
                <div className="space-y-6 max-w-lg z-10">
                  <div className="w-16 h-16 rounded-full bg-[#1D9E75] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#1D9E75]/35 animate-pulse">
                    <Cpu size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-2xl font-black uppercase italic">Simulasi Alur Kecerdasan Buatan</h3>
                    <p className="text-xs md:text-sm text-zinc-405 dark:text-zinc-400 font-medium leading-relaxed">
                      Lensa CareerLens melacak file PDF Anda, melakukan parsing kata kunci standar HRD, memunculkan saran, menyusun roadmap kustom secara dinamis, dan langsung membukakan folder bursa karir mitra.
                    </p>
                  </div>
                  
                  <div className="flex justify-center gap-4 pt-4">
                    <button 
                      onClick={() => setIsVideoOpen(false)}
                      className="px-6 py-3 bg-[#1D9E75] hover:bg-[#14835e] text-white rounded-xl font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Selesai Menonton
                    </button>
                    <Link href="/register">
                      <button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer border border-zinc-700">
                        Coba Langsung Sekarang
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

// --- Real Trust Metrics Section ---
const Stats = () => {
  const stats = [
    { value: "54120+", label: "Talenta Sukses Teranalisis" },
    { value: "96%", label: "Akurasi Rekomendasi Karir" },
    { value: "180+", label: "Kemitraan Rekruter Aktif" },
    { value: "90 hari", label: "Durasi Peta Aksi Sukses" },
  ];

  return (
    <section className="bg-zinc-900 py-16 md:py-24 px-6 relative overflow-hidden transition-colors border-y border-zinc-800">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 relative z-10">
        {stats.map((stat, i) => (
          <div key={i} className="text-center lg:text-left space-y-1.5 border-l-2 border-[#1D9E75]/40 pl-6">
            <h3 className="text-3xl md:text-5xl font-black mb-1 text-white uppercase italic tracking-tighter">
              <Counter value={stat.value} />
            </h3>
            <p className="text-zinc-400 text-[10px] md:text-xs font-black uppercase tracking-widest font-mono">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1D9E75]/5 rounded-full blur-[130px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    </section>
  );
};

// --- Premium Bento Grid Feature Board ---
const BentoFeatures = () => {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="fitur" ref={ref} className="bg-white dark:bg-zinc-950 py-24 md:py-32 px-5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[#1D9E75] text-xs font-black uppercase tracking-widest bg-[#1D9E75]/10 px-3 py-1 rounded-full font-mono">
            ARSITEKTUR PLATFORM INTEGRASI AI
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white uppercase italic leading-none tracking-tight">
            Fitur Canggih Pendongkrak <br className="hidden sm:block" /> Standar Lamaran Kerjamu.
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-semibold max-w-lg mx-auto">
            Tidak ada lagi tebak-tebak alasan CV ditolak. Evaluasi CareerLens merangkul seluruh kalangan pencari kerja meraih karir impian.
          </p>
        </div>

        {/* Premium Bento Board Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card Box 1: AI CV Parser Alignment (Two Column Span) */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-8 flex flex-col justify-between md:col-span-2 group min-h-[380px] hover:shadow-2xl hover:shadow-zinc-200/10 dark:hover:shadow-black/20 transition-all duration-300">
            <div className="space-y-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#1D9E75]/10 text-[#1D9E75] flex items-center justify-center mb-6">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                Pencocokan & Reformulasi Otomatis ATS
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold max-w-xl">
                Parser bawaan kami memindai silabus materi produktif sekolah, mata kuliah akademik, dan portofolio profesional. Sistem langsung melengkapi keterampilan teknis (hard-skills) yang hilang guna mengantisipasi kecocokan seleksi HRD.
              </p>
            </div>
            
            {/* Visualizer widget inside bento card */}
            <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 flex items-center justify-between text-[11px] font-mono select-none">
              <div className="flex flex-wrap gap-2">
                <span className="bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded-lg text-zinc-500 font-bold">Standard Kurikulum Komparatif</span>
                <span className="text-[#1D9E75] bg-[#1D9E75]/10 px-3 py-1 rounded-lg font-bold">Realtime AI Keywords</span>
              </div>
              <TrendingUp className="text-[#1D9E75] animate-bounce shrink-0" size={16} />
            </div>
          </div>

          {/* Card Box 2: Personalized 90D Career Path (One Column Span) */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-8 flex flex-col justify-between group min-h-[380px] hover:shadow-2xl hover:shadow-zinc-200/10 dark:hover:shadow-black/20 transition-all duration-300">
            <div className="space-y-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#534AB7]/10 text-[#534AB7] flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                90-Hari Peta Sukses Karir
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold">
                Rencana aksi mingguan terperifikasi untuk membimbing pembelajaran mandiri, mengumpulkan bekal portofolio ril, hingga bimbingan wawancara yang spesifik.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#534AB7] animate-ping" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Fase Persiapan Rampung Beruntun</span>
            </div>
          </div>

          {/* Card Box 3: AI Interview Simulation Unit (One Column Span) */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-8 flex flex-col justify-between group min-h-[380px] hover:shadow-2xl hover:shadow-zinc-200/10 dark:hover:shadow-black/20 transition-all duration-300">
            <div className="space-y-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6">
                <Volume2 size={24} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                Latihan Interview Tanpa Grogi
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold">
                Tantang kemampuan bicara dan pengucapan istilah teknis industrimu lansgung di hadapan asisten suara kecerdasan buatan kapanpun tanpa batasan sesi.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs font-bold uppercase text-zinc-400 font-mono">
              <span>TINGKAT PERCAYA DIRI:</span>
              <span className="text-amber-500 font-extrabold">+84% PENINGKATAN</span>
            </div>
          </div>

          {/* Card Box 4: Exclusive Corporate Pipeline (Two Column Span) */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-8 flex flex-col justify-between md:col-span-2 group min-h-[380px] hover:shadow-2xl hover:shadow-zinc-200/10 dark:hover:shadow-black/20 transition-all duration-300">
            <div className="space-y-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center mb-6">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                Panyaluran & Gerbang Mitra Terarah
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold max-w-xl">
                Kemudahan melamar kerja otomatis. Akses dashboard lowongan mitra rekruter industri strategis kami akan otomatis terbuka begitu skor ATS profil kualifikasimu dinilai prima oleh tim AI CareerLens.
              </p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-3 gap-4 text-center">
              <div>
                <dt className="text-xl sm:text-2xl font-mono font-black text-[#1D9E75]">180+</dt>
                <dd className="text-[9px] font-mono uppercase text-zinc-400 font-bold">REKRUTER REKANAN</dd>
              </div>
              <div>
                <dt className="text-xl sm:text-2xl font-mono font-black text-[#534AB7]">91.4%</dt>
                <dd className="text-[9px] font-mono uppercase text-zinc-400 font-bold font-mono">KEPUASAN MITRA</dd>
              </div>
              <div>
                <dt className="text-xl sm:text-2xl font-mono font-black text-amber-500">24 Jam</dt>
                <dd className="text-[9px] font-mono uppercase text-zinc-400 font-bold">WAKTU RESPON RATA</dd>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// --- Connection Pipeline Steps (Tiga Langkah Nyata) ---
const HowItWorks = () => {
  const { ref, visible } = useScrollReveal();
  const steps = [
    {
      id: "01",
      title: "Uraikan CV & Profile",
      desc: "Lakukan copy-paste informasi portofolio lama atau unggah berkas PDF. Engine kecerdasan buatan akan langsung merinci kualitas profil Anda seketika."
    },
    {
      id: "02",
      title: "Optimalkan Formula & Kemampuan",
      desc: "Adopsi saran perbaikan pintar, jalankan program bimbingan roadmap harian, dan sempurnakan standar interview lisan Anda."
    },
    {
      id: "03",
      title: "Lamar & Jalin Karier",
      desc: "Setelah skor ATS melebihi target kelayakan industri, kirim lamaran Anda secara instan ke sistem lowongan khusus mitra eksklusif kami."
    }
  ];

  return (
    <section id="cara-kerja" ref={ref} className="bg-zinc-50 dark:bg-zinc-950 py-24 md:py-32 px-5 transition-colors border-t border-zinc-150 dark:border-zinc-850">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[#534AB7] text-xs font-black uppercase tracking-widest bg-[#534AB7]/10 px-3 py-1.5 rounded-full animate-pulse font-mono">
            ALUR AKSELERASI KARIR
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white uppercase italic leading-none tracking-tight">
            Tiga Langkah Menuju Sukses.
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-semibold max-w-lg mx-auto">
            Proses taktis yang transparan demi menjembatani potensi diri dengan kebutuhan ketat standardisasi dunia rekrutmen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 35 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.15 } }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-[30px] p-8 md:p-10 text-left space-y-6 hover:shadow-2xl dark:hover:bg-zinc-850 group transition-all"
            >
              <div 
                className="text-5xl font-black tracking-tighter opacity-25 group-hover:opacity-100 transition-opacity select-none font-mono" 
                style={{ WebkitTextStroke: "1px #1D9E75", color: "transparent" }}
              >
                {step.id}
              </div>
              <h3 className="text-lg md:text-xl font-black text-zinc-900 dark:text-zinc-100 leading-snug">
                {step.title}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Testimonials Section (Cross-Audience Real Alumni) ---
const Testimonials = () => {
  const { ref, visible } = useScrollReveal();
  const testimonies = [
    {
      name: "Rizky Fauzi",
      school: "Alumni SMK Negeri 4 Bandung",
      role: "Junior Frontend Engineer @ Telkom",
      avatar: "RF",
      text: "Sangat membantu merombak total resume saya yang tadinya dipenuhi dekorasi Canva warna-warni tidak jelas. Begitu dioptimasi CareerLens, bot ATS langsung membaca skill saya dan dipanggil tes coding!"
    },
    {
      name: "Sabrina Aliyah",
      school: "Mahasiswi ITB - S1 Informatika",
      role: "Backend Intern @ Grab Singapore",
      avatar: "SA",
      text: "Latihan simulasi AI wawancara mengoreksi banyak kebiasaan tidak profesional saya saat berucap di hadapan rekruter. Pindai kualifikasinya presisi, dan portofolio saya jadi rapi."
    },
    {
      name: "Ananda Budi Santoso",
      school: "Fresh Graduate S1 Manajemen",
      role: "Management Trainee Staff @ Unilever",
      avatar: "AB",
      text: "Fitur roadmap 90 hari membimbing agenda belajar saya secara terarah tanpa kebingungan lagi. Peta aksinya sangat logis dan dipasangkan langsung dengan portal kirim CV otomatis."
    }
  ];

  return (
    <section id="testimoni" ref={ref} className="bg-white dark:bg-zinc-950 py-24 md:py-32 px-5 transition-colors duration-305 border-t border-zinc-150 dark:border-zinc-850">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[#1D9E75] text-xs font-black uppercase tracking-widest bg-[#1D9E75]/10 px-3 py-1 rounded-full font-mono">
            BUKTI DAN KISAH MITRA
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white uppercase italic leading-none tracking-tight">
            Kisah Sukses Mereka.
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-semibold max-w-lg mx-auto">
            Mereka yang mendobrak keraguan menjadi rebutan utama perusahaan rintisan nasional dan global.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonies.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 35 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.15 } }}
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-[32px] p-8 md:p-10 flex flex-col justify-between hover:shadow-2xl hover:bg-white dark:hover:bg-zinc-850 duration-300 transform"
            >
              <div className="space-y-6 text-left">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={15} fill="currentColor" stroke="none" />
                  ))}
                </div>
                <p className="text-zinc-650 dark:text-zinc-300 text-xs sm:text-sm font-semibold leading-relaxed italic">
                  &quot;{item.text}&quot;
                </p>
              </div>
              
              <div className="flex items-center gap-4 pt-6 border-t border-zinc-200/80 dark:border-zinc-800 mt-8">
                <div className="w-12 h-12 bg-gradient-to-tr from-[#1D9E75] to-[#534AB7] rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md">
                  {item.avatar}
                </div>
                <div className="text-left space-y-0.5 min-w-0">
                  <h4 className="text-sm font-black text-zinc-900 dark:text-white truncate tracking-tight">{item.name}</h4>
                  <p className="text-[10px] text-[#1D9E75] font-black uppercase tracking-wider truncate font-mono">{item.role}</p>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase truncate">{item.school}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Sleek Interactive FAQ Section ---
const FAQ = () => {
  const { ref, visible } = useScrollReveal();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      q: "Apakah CareerLens AI hanya dikhususkan untuk lulusan SMK?",
      a: "Awalnya kami berfokus membantu kesenjangan kurikulum SMK, namun sekarang platform kami dapat digunakan oleh semua kalangan. CareerLens sepenuhnya dioptimasi untuk menganalisis profil Pelajar (SMA/SMK), Mahasiswa Aktif (Vokasi/Vokasional & Universitas S1/D3), hingga Fresh Graduate umum."
    },
    {
      q: "Bagaimana cara kerja formula pemindaian ATS di sini?",
      a: "Sistem parser bertenaga AI kami mencocokkan kredensial bahasa CV Anda ke pemroses teks standar industri. Kami membantu menyaring layout grafis Canva yang membingungkan bot rekruter, memastikan kata kunci keahlian, riwayat pendidikan, serta nama sertifikasi BNSP/LSP Anda terdokumentasi sempurna."
    },
    {
      q: "Apakah bimbingan roadmap 90 hari benar-benar bisa diakses gratis?",
      a: "Tentu saja! Seluruh modul bimbingan roadmap mingguan, format e-book template CV standar ATS, serta akses fitur tes wawancara AI dasar kami berikan sepenuhnya secara cuma-cuma demi memajukan daya saing talenta emas Indonesia."
    },
    {
      q: "Bagaimana cara kerja penyaluran lamaran dengan para mitra rekrutmen?",
      a: "Begitu profil akun Anda disetujui oleh evaluator AI CareerLens (mencapai skor kualifikasi ATS minimal 80%), menu pengiriman lamaran otomatis ke jaringan mitra penempatan industri kami akan terbuka langsung di halaman dashboard pribadi."
    }
  ];

  return (
    <section id="faq" ref={ref} className="bg-zinc-50 dark:bg-zinc-950 py-24 md:py-32 px-5 transition-colors duration-300 border-t border-zinc-150 dark:border-zinc-850">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <span className="text-[#534AB7] text-xs font-black uppercase tracking-widest bg-[#534AB7]/10 px-3 py-1.5 rounded-full font-mono">
            FAQ HUB
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tight">
            Pertanyaan Umum.
          </h2>
        </div>

        <div className="space-y-4 text-left">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200/65 dark:border-zinc-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-6 sm:p-8 flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="text-xs sm:text-base font-black text-zinc-800 dark:text-zinc-200 group-hover:text-[#1D9E75] transition-colors">
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-zinc-500 group-hover:text-[#1D9E75] shrink-0"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="p-6 sm:p-8 pt-0 text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed border-t border-zinc-100 dark:border-zinc-850 font-semibold">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- Bold Call to Action Section ---
const CTA = () => {
  const { ref, visible } = useScrollReveal();
  const { status } = useSession();
  const authenticated = status === "authenticated";

  return (
    <section ref={ref} className="bg-zinc-900 py-24 md:py-36 px-5 relative overflow-hidden text-center border-t border-zinc-800">
      <div className="absolute inset-x-0 top-0 h-full w-full bg-[#1D9E75]/5 dark:bg-[#1D9E75]/8 blur-[130px] rounded-full -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#534AB7]/5 dark:bg-[#534AB7]/8 blur-[100px] rounded-full translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={visible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto space-y-10 relative z-10"
      >
        <h2 className="text-[30px] sm:text-6xl lg:text-[76px] font-black text-white leading-[1.05] uppercase italic tracking-tighter">
          Siap Membuka <br />
          <span className="text-[#1D9E75]">Bintang Potensi Kariermu?</span>
        </h2>
        
        <p className="text-zinc-400 text-xs sm:text-base max-w-lg mx-auto font-semibold leading-relaxed">
          Ganti paradigma rekruter memandang kemampuanmu. Sempurnakan standard portofolio bersama asisten AI, optimalkan nilai ATS, dan kuasai interview detik ini juga.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={authenticated ? "/dashboard/cv" : "/register"} className="w-full sm:w-auto">
            <button
              id="cta-bottom-primary-premium"
              className="w-full sm:w-auto h-16 sm:h-20 px-12 bg-[#1D9E75] hover:bg-[#158c67] text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-[0_15px_35px_rgba(29,158,117,0.35)]"
            >
              Uji Coba Analisis CV — 100% Gratis
            </button>
          </Link>
        </div>
        
        <div className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono">
          ⚡ tidak membutuhkan kartu kredit sama sekali • akses penuh berkelanjutan
        </div>
      </motion.div>
    </section>
  );
};

// --- Home Page Route Wrapper ---
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-zinc-950 overflow-x-hidden selection:bg-[#1D9E75] selection:text-white transition-colors duration-305">
      <Navbar />
      <HeroAndPlayground />
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
