'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ChevronDown, 
  BrainCircuit, 
  Target, 
  Sparkles, 
  Menu,
  X,
  Star,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

// --- Custom Hooks ---

/**
 * Custom hook to detect when an element enters the viewport.
 */
const useScrollReveal = (threshold = 0.15) => {
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

// --- Components ---

/**
 * Counts up to a target number when visible in viewport.
 */
const Counter = ({ value, duration = 1500 }: { value: string, duration?: number }) => {
  const { ref, visible } = useScrollReveal(0.5);
  const [displayValue, setDisplayValue] = useState(0);
  
  // Extract number and suffix (e.g., "50.000+" -> 50000, "+")
  const numericString = value.replace(/[^0-9]/g, '');
  const target = parseInt(numericString, 10);
  const isPercent = value.includes('%');
  const suffix = value.replace(/[0-9]/g, '').replace('.', '');

  useEffect(() => {
    if (visible) {
      let start = 0;
      const end = target;
      const stepTime = Math.abs(Math.floor(duration / end));
      
      const timer = setInterval(() => {
        start += Math.ceil(end / 40); // Increment chunk
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(start);
        }
      }, 30);
      
      return () => clearInterval(timer);
    }
  }, [visible, target, duration]);

  return (
    <span ref={ref}>
      {displayValue.toLocaleString('id-ID')}{suffix}
    </span>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3" 
        : "bg-white border-b border-gray-100 py-5"
    }`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
            <BrainCircuit className="text-[#1D9E75] w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-black">
            CareerLens <span className="text-[#1D9E75]">AI</span>
          </span>
        </Link>

        {/* Desktop Links (Removed Harga) */}
        <div className="hidden md:flex items-center gap-10">
          {["Fitur", "Cara Kerja", "Testimoni", "FAQ"].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-[14px] font-semibold text-gray-600 hover:text-black transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="text-[14px] font-bold text-black px-6 py-2 hover:opacity-70 transition-opacity">
            Masuk
          </button>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-black text-white text-[13px] font-bold px-7 py-3.5 rounded-full hover:bg-[#1D9E75] transition-all shadow-lg active:scale-95"
          >
            Mulai Gratis
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-black p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white border-b border-gray-100 px-6 py-8 md:hidden flex flex-col gap-6 shadow-2xl overflow-hidden"
          >
            {["Fitur", "Cara Kerja", "Testimoni", "FAQ"].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-lg font-bold text-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-6 border-t border-gray-100">
               <button className="w-full py-4 text-black font-bold border border-gray-200 rounded-2xl">Masuk</button>
               <button className="w-full py-4 bg-black text-white font-bold rounded-2xl shadow-lg">Mulai Gratis</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="bg-white pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-[#1D9E75] text-[12px] font-bold tracking-wider uppercase mb-8">
            <Sparkles size={14} /> Terpercaya oleh 50.000+ Pelajar
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-black tracking-tighter leading-[0.95] mb-8">
            Karier Impianmu. <br />
            <span className="text-[#1D9E75] italic">Dimulai dari Sini.</span>
          </h1>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
        >
          AI yang membantu kamu membangun masa depan terarah dengan presisi tingkat tinggi. Analisis CV, roadmap harian, dan pencocokan pekerjaan otomatis.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="h-16 px-12 bg-black text-white rounded-full font-bold text-[15px] tracking-tight hover:bg-[#1D9E75] transition-all shadow-2xl shadow-black/10 w-full sm:w-auto"
          >
            Analisis CV Sekarang
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="h-16 px-12 bg-white text-black border border-gray-200 rounded-full font-bold text-[15px] tracking-tight hover:bg-gray-50 transition-all w-full sm:w-auto"
          >
            Lihat Demo
          </motion.button>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-20 relative max-w-4xl mx-auto px-4"
        >
          <div className="bg-white border border-gray-200 rounded-3xl shadow-[0_50px_100px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="h-4 w-48 bg-gray-200 rounded-full" />
              <div className="w-8 h-8 rounded-full bg-gray-200" />
            </div>
            
            <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
              <div className="md:border-r border-gray-100 pr-0 md:pr-10 flex flex-col items-center justify-center text-center">
                 <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="46" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                      <circle cx="50%" cy="50%" r="46" fill="none" stroke="#1D9E75" strokeWidth="8" strokeDasharray="289" strokeDashoffset="63" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-black leading-none">78%</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ATS Score</span>
                    </div>
                 </div>
                 <p className="text-gray-500 text-sm font-medium leading-relaxed">Profil profesional kamu sudah memenuhi standar industri modern.</p>
              </div>

              <div className="md:col-span-2 space-y-4">
                <h4 className="text-sm font-bold text-black uppercase tracking-widest mb-6">Pencocokan Karier:</h4>
                {[
                  { role: "Frontend Developer", score: 92, color: "bg-[#1D9E75]" },
                  { role: "UI/UX Designer", score: 85, color: "bg-black" },
                  { role: "Product Manager", score: 64, color: "bg-gray-300" }
                ].map((job, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + (i * 0.1) }}
                    className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between hover:bg-white transition-colors cursor-default"
                  >
                    <div className="flex items-center gap-4">
                       <div className={`w-2.5 h-2.5 rounded-full ${job.color}`} />
                       <span className="text-[15px] font-bold text-black">{job.role}</span>
                    </div>
                    <span className="text-[14px] font-black text-[#1D9E75]">{job.score}% Match</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { value: "50.000+", label: "Pengguna Aktif" },
    { value: "94%", label: "Akurasi AI" },
    { value: "3 Jalur", label: "Opsi Karier" },
    { value: "90 Hari", label: "Rencana Aksi" },
  ];

  return (
    <section className="bg-black py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 relative z-10">
        {stats.map((stat, i) => (
          <div key={i} className="text-center md:text-left">
            <h3 className="text-4xl md:text-6xl font-black mb-3 tracking-tighter text-white">
              <Counter value={stat.value} />
            </h3>
            <p className="text-gray-500 text-xs md:text-[13px] font-bold uppercase tracking-[4px]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1D9E75]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
    </section>
  );
};

const HowItWorks = () => {
  const { ref, visible } = useScrollReveal();
  const steps = [
    {
      id: "01",
      title: "Identifikasi Profil",
      desc: "Unggah CV atau ceritakan pengalamanmu. AI kami menganalisis ribuan titik data untuk menemukan potensi terbaikmu."
    },
    {
      id: "02",
      title: "Analisis Mendalam",
      desc: "Lensa cerdas kami membedah kualifikasimu dan mencocokkannya dengan requirement industri modern terkini."
    },
    {
      id: "03",
      title: "Rencana Sukses",
      desc: "Terima roadmap harian selama 90 hari berisi langkah-langkah konkret untuk mendapatkan pekerjaan impianmu."
    }
  ];

  return (
    <section id="cara-kerja" ref={ref} className="bg-white py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-black tracking-tight mb-6"
          >
            Tiga Langkah Sederhana.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto font-medium"
          >
            Kami memangkas kebingungan dalam mencari karier melalui proses yang transparan dan didukung data.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, y: 50 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-gray-50 border border-gray-100 rounded-[40px] p-12 transition-all shadow-sm hover:shadow-xl hover:bg-white group"
            >
              <span className="text-6xl font-black mb-8 block select-none opacity-20 group-hover:opacity-100 transition-opacity" style={{ WebkitTextStroke: "1.5px #1D9E75", color: "transparent" }}>
                {step.id}
              </span>
              <h3 className="text-2xl font-bold text-black mb-6 leading-tight">{step.title}</h3>
              <p className="text-gray-500 text-[16px] leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({ item, i }: { item: any, i: number }) => {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={`grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center`}>
      <motion.div 
        initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
        animate={visible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7 }}
        className={i % 2 !== 0 ? "lg:order-2" : ""}
      >
        <span className="text-[#1D9E75] text-[13px] font-bold tracking-[5px] uppercase mb-8 block">{item.label}</span>
        <h3 className="text-4xl md:text-6xl font-black text-black leading-[1.05] mb-10">{item.title}</h3>
        <p className="text-gray-500 text-xl leading-relaxed mb-12">{item.desc}</p>
        <div className="space-y-6">
           {item.points.map((p: string, idx: number) => (
             <div key={idx} className="flex items-center gap-4 text-black font-bold text-lg">
                <div className="w-8 h-8 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75]">
                  <Check size={20} strokeWidth={3} />
                </div>
                {p}
             </div>
           ))}
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
        animate={visible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7 }}
        className={`bg-gray-50 border border-gray-100 rounded-[60px] p-12 md:p-20 h-[500px] flex items-center justify-center relative ${i % 2 !== 0 ? "lg:order-1" : ""}`}
      >
         <div className="w-full max-w-[340px] z-10">
            {item.visual}
         </div>
         <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
};

const Features = () => {
  const items = [
    {
      label: "PREDIKSI ATS",
      title: "Optimasi Profil Untuk Rekrutmen AI.",
      desc: "Bot rekrutman tidak lagi menjadi misteri. Kami memberikan skor instan dan saran perbaikan spesifik agar namamu selalu ada di urutan teratas.",
      points: ["Skor ATS industri nyata", "Keyword target otomatis", "Analisis visual profil"],
      visual: (
        <div className="space-y-6 flex flex-col items-center">
           <div className="h-4 w-full bg-white rounded-full overflow-hidden border border-gray-200">
              <motion.div initial={{ width: 0 }} whileInView={{ width: "78%" }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-[#1D9E75]" />
           </div>
           <div className="grid grid-cols-2 gap-4 w-full">
              {[...Array(4)].map((_, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="h-14 bg-white rounded-2xl border border-gray-100 shadow-sm" 
                />
              ))}
           </div>
        </div>
      )
    },
    {
      label: "SMART ROADMAP",
      title: "Tahu Apa yang Harus Dilakukan Esok Hari.",
      desc: "Rencana aksi 90 hari yang mendetail mulai dari skill yang harus kamu pelajari hingga portofolio yang harus kamu bangun.",
      points: ["Checklist mingguan", "Koleksi resource gratis", "Tracking kemajuan"],
      visual: (
        <div className="space-y-4 w-full">
          {[true, true, false, false].map((v, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className={`p-4 rounded-2xl border ${v ? "bg-white border-[#1D9E75]/30 shadow-md" : "bg-gray-100/50 border-gray-200 opacity-60"}`}
            >
               <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${v ? "bg-[#1D9E75] border-[#1D9E75] text-white" : "border-gray-300 text-transparent"}`}>
                    <Check size={14} strokeWidth={4} />
                  </div>
                  <div className={`h-2 rounded-full ${v ? "bg-gray-200 w-44" : "bg-gray-100 w-32"}`} />
               </div>
            </motion.div>
          ))}
        </div>
      )
    }
  ];

  return (
    <section id="fitur" className="bg-white py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-48">
        {items.map((item, i) => (
          <FeatureItem key={i} item={item} i={i} />
        ))}
      </div>
    </section>
  );
};

const Testimonials = () => {
  const { ref, visible } = useScrollReveal();
  const items = [
    {
      name: "Aulia Putri",
      role: "Graduate 2023",
      text: "Analisisnya sangat mendalam. Saya jadi tahu kalau skill desain saya lebih cocok di UI/UX daripada desain grafis biasa.",
      avatar: "AP"
    },
    {
      name: "Rizky Fauzi",
      role: "Junior Web Dev",
      text: "Platform ini luar biasa! Skor ATS yang diberikan benar-benar akurat. CV saya membaik dan panggilan interview naik pesat.",
      avatar: "RF"
    },
    {
      name: "Budi Santoso",
      role: "Fresh Graduate",
      text: "Bingung mulai karir dari mana, tapi CareerLens kasih arahan yang jelas banget. Rekomended buat siapa saja para pencari kerja!",
      avatar: "BS"
    }
  ];

  return (
    <section id="testimoni" ref={ref} className="bg-gray-50 py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-black tracking-tight mb-6"
          >
            Kisah Sukses.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-500 font-medium text-lg"
          >
            Bergabunglah dengan mereka yang telah menemukan jalannyaaaa.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              whileHover={{ y: -6 }}
              className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex gap-1 text-[#1D9E75] mb-8">
                 {[...Array(5)].map((_, idx) => <Star key={idx} size={18} fill="#1D9E75" />)}
              </div>
              <p className="text-black text-lg font-medium leading-relaxed italic mb-10">
                &quot;{item.text}&quot;
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                 <div className="w-14 h-14 rounded-2xl bg-[#1D9E75] flex items-center justify-center text-white font-bold text-xl">{item.avatar}</div>
                 <div>
                    <h4 className="text-black font-bold text-lg tracking-tight">{item.name}</h4>
                    <p className="text-gray-400 text-[13px] font-bold uppercase tracking-wider">{item.role}</p>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, visible } = useScrollReveal();

  const items = [
    {
      q: "Bagaimana cara kerja CareerLens AI?",
      a: "CareerLens AI menggunakan teknologi GPT dan Claude tercanggih untuk membaca metadata CV-mu, menganalisis bahasa profesionalmu, dan mencocokkannya dengan database requirement industri modern."
    },
    {
      q: "Apakah data saya aman?",
      a: "Keamanan datamu adalah prioritas utama kami. Semua data dienkripsi dan tidak akan pernah dibagikan kepada pihak ketiga manapun tanpa izin eksplisit darimu."
    },
    {
      q: "Apa itu Roadmap 90 Hari?",
      a: "Ini adalah rencana aksi yang kami buat khusus untuk kamu. Berisi langkah harian, mulai dari sertifikasi yang dikejar, project yang harus ada di portfolio, hingga jadwal melamar kerja."
    },
    {
      q: "Apakah ini cocok untuk fresh graduate?",
      a: "Sangat cocok. Bahkan jika kamu belum memiliki pengalaman kerja, AI kami akan menganalisis potensi dari kegiatan organisasi, hobi, dan passionmu untuk merancang jalur karier."
    }
  ];

  return (
    <section id="faq" ref={ref} className="bg-white py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          className="text-4xl md:text-6xl font-black text-black text-center mb-20 tracking-tighter"
        >
          Pertanyaan Umum.
        </motion.h2>
        
        <div className="space-y-5">
          {items.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-50 rounded-[32px] border border-gray-100 overflow-hidden"
            >
              <button 
                className="w-full p-8 flex items-center justify-between text-left group"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-lg md:text-xl font-bold text-black transition-colors group-hover:text-[#1D9E75]">{item.q}</span>
                <motion.div 
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  className="text-black group-hover:text-[#1D9E75] transition-colors"
                >
                  <ChevronDown size={28} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-8 pt-0 text-gray-500 leading-relaxed text-lg border-t border-white/40">
                       {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  const { ref, visible } = useScrollReveal();
  return (
    <section className="bg-black py-40 px-6 relative overflow-hidden" ref={ref}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={visible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-10">
          Siap Membangun <br />
          <span className="text-[#1D9E75]">Masa Depanmu?</span>
        </h2>
        <p className="text-gray-400 text-xl md:text-2xl mb-16 max-w-2xl mx-auto font-medium">
          Mulai sekarang — dalam 5 menit profilmu akan lebih berharga dari sebelumnya.
        </p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-20 px-20 bg-[#1D9E75] text-black font-black text-xl rounded-full hover:bg-white transition-all shadow-[0_30px_70px_rgba(29,158,117,0.4)] active:scale-95 uppercase tracking-widest"
        >
           Analisis CV Sekarang — Gratis
        </motion.button>
      </motion.div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1D9E75]/5 rounded-full blur-[150px] pointer-events-none" />
    </section>
  );
};

const Footer = () => {
  const sections = {
    Produk: ["Fitur", "Analisis CV", "Roadmap", "Update"],
    Perusahaan: ["Tentang", "Kontak", "Blog", "Karir"],
    Legal: ["Privacy Policy", "Terms of Use", "Cookie Policy"]
  };

  return (
    <footer className="bg-black text-gray-400 py-24 px-6 border-t border-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-20 mb-24">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/5">
                <BrainCircuit className="text-[#1D9E75] w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white mb-0.5">CareerLens <span className="text-[#1D9E75]">AI</span></span>
            </Link>
            <p className="text-gray-500 text-lg leading-relaxed max-w-sm font-medium">
              Membangun jembatan antara pendidikan dan industri modern melalui kekuatan AI yang presisi.
            </p>
          </div>
          
          {Object.entries(sections).map(([title, items]) => (
            <div key={title} className="flex flex-col gap-8">
               <h4 className="text-[11px] font-bold uppercase tracking-[5px] text-white/50">{title}</h4>
               <ul className="flex flex-col gap-5">
                  {items.map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-[15px] hover:text-[#1D9E75] transition-colors font-bold tracking-tight">
                        {item}
                      </Link>
                    </li>
                  ))}
               </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-900 pt-16 gap-10">
          <p className="text-sm font-bold tracking-wide">© 2024 CAREERLENS AI. DIBUAT DENGAN SEMANGAT UNTUK TALENTA MUDA.</p>
          <div className="flex gap-10">
             {["Instagram", "Twitter", "LinkedIn", "YouTube"].map((social) => (
               <Link key={social} href="#" className="text-sm font-bold hover:text-white transition-colors">{social}</Link>
             ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main Page ---

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden selection:bg-[#1D9E75] selection:text-white">
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
      
      {/* Scroll Behavior & Antialiasing */}
      <style dangerouslySetInnerHTML={{ __html: `
        html { scroll-behavior: smooth; }
        body { margin: 0; padding: 0; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        * { box-sizing: border-box; }
      `}} />
    </main>
  );
}
