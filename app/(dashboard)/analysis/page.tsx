"use client";

import React, { useState, useEffect } from "react";
import { 
  motion, AnimatePresence 
} from "framer-motion";
import { jsPDF } from "jspdf";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  BrainCircuit, Target, ArrowLeft, Bookmark, Sparkles,
  ChevronRight, RefreshCcw, Loader2, AlertCircle, FileText,
  Share2, Instagram 
} from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import PageLoader from "@/components/shared/PageLoader";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { toast } from "sonner";
import { performCareerAnalysis } from "@/lib/analysis-service";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function AnalysisPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchLatestAnalysis();
  }, []);

  const fetchLatestAnalysis = async () => {
    try {
      const res = await fetch("/api/analyze/latest");
      const result = await res.json();
      if (result.success && result.data) {
        setAnalysis(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch analysis", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await performCareerAnalysis();
      if (result.success) {
        setAnalysis(result.data);
        toast.success("Analisis berhasil diperbarui!");
      }
    } catch (error: any) {
      if (error.error === "PROFILE_MISSING") {
        toast.error(error.message);
        router.push("/profile");
      } else if (error.error === "CV_MISSING") {
        toast.error(error.message);
      } else {
        toast.error(error.message || "Terjadi kesalahan saat analisis");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <PageLoader isLoading={true} text="Memuat Analisis..." />
    );
  }

  const result = analysis?.result as any;

  const radarData = result?.skillRadar ? [
    { subject: 'Teknis', A: result.skillRadar.teknisDigital || 0 },
    { subject: 'Komunikasi', A: result.skillRadar.komunikasi || 0 },
    { subject: 'Leadership', A: result.skillRadar.kepemimpinan || 0 },
    { subject: 'Kreativitas', A: result.skillRadar.kreativitas || 0 },
    { subject: 'Analitik', A: result.skillRadar.analitis || 0 },
    { subject: 'Adaptabilitas', A: result.skillRadar.adaptabilitas || 0 },
  ] : [
    { subject: 'Teknis', A: 0 },
    { subject: 'Komunikasi', A: 0 },
    { subject: 'Leadership', A: 0 },
    { subject: 'Kreativitas', A: 0 },
    { subject: 'Analitik', A: 0 },
    { subject: 'Adaptabilitas', A: 0 },
  ];

  const handleDownloadPDF = () => {
    if (!analysis || !result) {
      toast.error("Tidak ada data analisis untuk diunduh.");
      return;
    }

    try {
      const doc = new jsPDF();
      const timestamp = new Date(analysis.createdAt).toLocaleDateString('id-ID');
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(29, 158, 117); // Teal color
      doc.text("CAREERLENS AI", 105, 20, { align: "center" });
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Laporan Hasil Analisis Karier", 105, 30, { align: "center" });
      
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 35, 190, 35);
      
      // Info Section
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Tanggal Analisis: ${timestamp}`, 20, 45);
      doc.text(`Overall Readiness: ${analysis.overallReadiness}%`, 20, 50);
      doc.text(`CV Score: ${analysis.cvScore}%`, 20, 55);
      doc.text(`Jalur Utama: ${analysis.selectedPath || "Belum dipilih"}`, 20, 60);
      
      // Competencies
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("KOMPETENSI UTAMA", 20, 75);
      
      doc.setFontSize(10);
      doc.text(`- Teknis & Digital: ${result.skillRadar?.teknisDigital || 0}%`, 25, 85);
      doc.text(`- Komunikasi: ${result.skillRadar?.komunikasi || 0}%`, 25, 90);
      doc.text(`- Kepemimpinan: ${result.skillRadar?.kepemimpinan || 0}%`, 25, 95);
      doc.text(`- Kreativitas: ${result.skillRadar?.kreativitas || 0}%`, 25, 100);
      doc.text(`- Analitis: ${result.skillRadar?.analitis || 0}%`, 25, 105);
      doc.text(`- Adaptabilitas: ${result.skillRadar?.adaptabilitas || 0}%`, 25, 110);
      
      // Career Paths
      doc.setFontSize(14);
      doc.text("REKOMENDASI JALUR KARIER", 20, 125);
      
      let yPos = 135;
      (result.careerPaths || []).forEach((path: any, index: number) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(11);
        doc.setTextColor(29, 158, 117);
        doc.text(`${index + 1}. ${path.nama} (${path.matchScore}% Match)`, 25, yPos);
        yPos += 7;
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        const splitDesc = doc.splitTextToSize(path.deskripsi, 160);
        doc.text(splitDesc, 30, yPos);
        yPos += (splitDesc.length * 5) + 5;
      });
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Laporan ini dihasilkan secara otomatis oleh CareerLens AI.", 105, 285, { align: "center" });
      
      doc.save(`careerlens-analisis-${new Date().getTime()}.pdf`);
      toast.success("Hasil analisis berhasil diunduh sebagai PDF!");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Gagal membuat PDF. Silakan coba lagi.");
    }
  };

  const handleShare = (platform: 'whatsapp' | 'copy' | 'instagram') => {
    if (!analysis?.id) {
       toast.error("Data analisis tidak ditemukan untuk dibagikan.");
       return;
    }
    const shareUrl = window.location.origin + "/share/" + analysis.id;
    const shareText = `Halo! Lihat hasil analisis karier saya di CareerLens AI. Saya cocok menjadi ${analysis?.selectedPath || "Profesional"} dengan tingkat kesiapan ${analysis?.overallReadiness}%! Coba juga di: ${shareUrl}`;

    if (platform === 'whatsapp') {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
      toast.success("Membuka WhatsApp...");
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link hasil analisis disalin!");
    } else if (platform === 'instagram') {
      // Instagram doesn't have a direct share via URL for feed/story easily from web
      // But we can copy and tell user
      navigator.clipboard.writeText(shareUrl);
      toast.info("Link disalin! Kamu bisa tempel di bio atau story Instagram kamu.");
    }
  };

  const selectPath = async (pathName: string) => {
    try {
      const res = await fetch("/api/roadmap/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathName })
      });
      const result = await res.json();
      if (result.success) {
        toast.success(`Target ${pathName} dipilih!`);
        // Update local state if needed
        setAnalysis((prev: any) => ({ ...prev, selectedPath: pathName }));
      }
    } catch (error) {
      console.error("Failed to select path", error);
      toast.error("Gagal memilih jalur target.");
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
         <div className="space-y-4">
            <Link href="/cv-builder" className="inline-flex items-center gap-2 text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors font-bold group mb-4">
                <div className="w-8 h-8 rounded-full border border-gray-100 dark:border-zinc-800 flex items-center justify-center group-hover:border-black dark:group-hover:border-white transition-all">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                Kembali ke Analisis CV
            </Link>
            <div className="flex items-center gap-2 text-teal font-bold text-[12px] uppercase tracking-[0.15em]">
               <BrainCircuit className="w-4 h-4" />
               Deep Insight Analysis
            </div>
            <h1 className="text-3xl font-black text-black dark:text-white transition-colors">Hasil Analisis Karier</h1>
            <p className="text-base text-gray-500 dark:text-zinc-500 leading-relaxed max-w-xl transition-colors">
               Berdasarkan kecerdasan buatan, inilah jalur karier paling potensial untuk masa depanmu.
            </p>
         </div>
         <div className="flex gap-4">
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="h-12 rounded-full px-8 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-gray-800 dark:hover:bg-zinc-200 transition-all shadow-xl shadow-black/10 dark:shadow-white/5"
            >
              {isAnalyzing ? <LoadingSpinner size="sm" className="mr-2" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
              {analysis ? "Analisis Ulang" : "Mulai Analisis"}
            </Button>
         </div>
      </div>

      {!analysis && !isAnalyzing ? (
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[40px] p-20 text-center flex flex-col items-center space-y-6 transition-all">
           <div className="w-20 h-20 rounded-[32px] bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-300 dark:text-zinc-700">
              <AlertCircle className="w-10 h-10" />
           </div>
           <div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2 transition-colors">Belum Ada Analisis</h3>
              <p className="text-gray-500 dark:text-zinc-500 max-w-xs mx-auto transition-colors">Upload CV kamu terlebih dahulu untuk mendapatkan analisis jalur karier yang mendalam.</p>
           </div>
           <Link href="/cv-builder">
              <Button className="bg-teal hover:bg-teal-dark rounded-full px-8 h-12 font-bold text-white uppercase text-[10px] tracking-widest">
                 UPLOAD CV SEKARANG
              </Button>
           </Link>
        </div>
      ) : isAnalyzing ? (
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[40px] p-20 text-center flex flex-col items-center space-y-8 transition-all relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-b from-teal/5 to-transparent opacity-0 dark:group-hover:opacity-100 transition-opacity" />
           <div className="relative z-10 space-y-8 flex flex-col items-center">
              <div className="relative">
                 <LoadingSpinner size="lg" />
                 <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-teal animate-pulse" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-black text-black dark:text-white italic tracking-tight transition-colors">Gemini AI sedang berpikir...</h3>
                 <p className="text-gray-400 dark:text-zinc-500 max-w-md mx-auto leading-relaxed font-medium transition-colors">Kami memadukan profil kamu dengan kecocokan industri saat ini untuk hasil yang paling akurat.</p>
              </div>
           </div>
        </div>
      ) : (
        <>
          {/* Sync Warning Banner */}
          {result?.syncScore < 70 && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-amber-800 font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Profil & CV Kurang Sinkron
                </p>
                <p className="text-amber-600 text-sm mt-1 font-medium italic">
                  Skor sinkronisasi: {result.syncScore}% — {result.syncIssues?.[0] || "Beberapa data di profil kamu tidak sesuai dengan isi CV."}
                </p>
              </div>
              <button 
                onClick={() => router.push('/profile')} 
                className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Perbarui Profil →
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1.5 bg-gray-50 dark:bg-zinc-900 w-fit rounded-2xl border border-gray-100 dark:border-zinc-800 transition-all">
             {["overview", "detail", "compare"].map((tab) => (
                <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={cn(
                      "px-8 py-2.5 rounded-xl text-[11px] font-black transition-all uppercase tracking-widest",
                      activeTab === tab 
                        ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm" 
                        : "text-gray-400 dark:text-zinc-600 hover:text-black dark:hover:text-white"
                   )}
                >
                   {tab === "overview" ? "Ringkasan" : tab === "detail" ? "Detail Jalur" : "Perbandingan"}
                </button>
             ))}
          </div>

          <AnimatePresence mode="wait">
             {activeTab === "overview" && (
                <motion.div 
                   key="overview"
                   initial="hidden" animate="visible" variants={fadeUp}
                   className="space-y-12"
                >
                   <div className="flex flex-wrap gap-4 items-center justify-between">
                       <div className="flex gap-3">
                          <Button 
                           onClick={handleDownloadPDF}
                           variant="outline" 
                           className="h-11 px-6 rounded-xl border-gray-100 dark:border-zinc-800 font-bold text-xs dark:text-white dark:hover:bg-zinc-800 transition-all"
                          >
                             Download PDF
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="h-11 px-6 rounded-xl border-gray-100 dark:border-zinc-800 font-bold text-xs hover:border-teal hover:text-teal dark:text-white dark:hover:bg-zinc-800 transition-all flex items-center gap-2"
                              >
                                 <Share2 className="w-4 h-4" />
                                 Bagikan
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-[24px] p-2 min-w-[240px] z-[100] border-gray-100 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900 transition-colors">
                              <div className="px-4 py-3 mb-1 border-b border-gray-50 dark:border-zinc-800">
                                 <p className="text-[10px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest">Pilih Platform</p>
                              </div>
                              <DropdownMenuItem 
                                onClick={() => handleShare('whatsapp')}
                                className="rounded-xl py-3 cursor-pointer flex items-center gap-3 font-bold text-xs hover:bg-green-50 dark:hover:bg-green-500/10 dark:text-white transition-colors group"
                              >
                                <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                  <Share2 className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                  <span>WhatsApp</span>
                                  <span className="text-[9px] font-medium text-gray-400 dark:text-zinc-500">Kirim langsung ke kontak</span>
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleShare('instagram')}
                                className="rounded-xl py-3 cursor-pointer flex items-center gap-3 font-bold text-xs hover:bg-pink-50 dark:hover:bg-pink-500/10 dark:text-white transition-colors group"
                              >
                                <div className="w-9 h-9 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                                  <Instagram className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                  <span>Instagram</span>
                                  <span className="text-[9px] font-medium text-gray-400 dark:text-zinc-500">Salin link untuk bio/story</span>
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleShare('copy')}
                                className="rounded-xl py-3 cursor-pointer flex items-center gap-3 font-bold text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 dark:text-white transition-colors group"
                              >
                                <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-400 group-hover:scale-110 transition-transform">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                  <span>Salin Link</span>
                                  <span className="text-[9px] font-medium text-gray-400 dark:text-zinc-500">Gunakan di platform lain</span>
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                       </div>
                       <div className="hidden sm:block">
                          <p className="text-[10px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest transition-colors">Update Terakhir: {new Date(analysis?.createdAt || Date.now()).toLocaleDateString('id-ID')}</p>
                       </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Career Path Cards */}
                      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {(result?.careerPaths || []).map((path: any, i: number) => (
                             <div key={i} className={cn(
                                "p-8 rounded-[40px] border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all hover:shadow-xl hover:scale-[1.01] group shadow-sm",
                                i === 0 && "md:col-span-2"
                             )}>
                                <div className="flex justify-between items-start mb-10">
                                   <div className="space-y-2">
                                      <h3 className="text-2xl font-extrabold text-black dark:text-white group-hover:text-teal transition-colors tracking-tight transition-colors">{path.nama}</h3>
                                      <p className="text-gray-500 dark:text-zinc-500 text-sm leading-relaxed max-w-xs transition-colors">{path.deskripsi}</p>
                                   </div>
                                   <div className={cn(
                                      "w-20 h-20 rounded-3xl flex flex-col items-center justify-center shrink-0 border-4 transition-all",
                                      i === 0 ? "bg-teal-light dark:bg-teal/10 border-white dark:border-zinc-800 text-teal" : 
                                      i === 1 ? "bg-black/5 dark:bg-white/5 border-white dark:border-zinc-800 text-black dark:text-white" : "bg-gray-50 dark:bg-white/5 border-white dark:border-zinc-800 text-gray-400"
                                   )}>
                                      <span className="text-2xl font-black">{path.matchScore}%</span>
                                      <span className="text-[9px] font-black uppercase tracking-tighter">MATCH</span>
                                   </div>
                                </div>
                                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-zinc-800 transition-all">
                                    <Link href="/roadmap" className="flex-1" onClick={() => selectPath(path.nama)}>
                                       <Button className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl h-11 font-black text-[10px] uppercase tracking-widest hover:bg-teal dark:hover:bg-teal dark:hover:text-white transition-all">
                                          LIHAT ROADMAP
                                       </Button>
                                    </Link>
                                    <Button 
                                     onClick={() => selectPath(path.nama)}
                                     variant="ghost" 
                                     className={cn(
                                       "w-11 h-11 p-0 rounded-xl border border-gray-100 dark:border-zinc-800 hover:bg-teal hover:text-white dark:hover:text-white transition-all",
                                       analysis?.selectedPath === path.nama 
                                         ? "bg-teal text-white border-teal dark:border-teal shadow-lg shadow-teal/20" 
                                         : "dark:text-zinc-400"
                                     )}
                                    >
                                       <Target className="w-5 h-5" />
                                    </Button>
                                </div>
                             </div>
                          ))}
                      </div>

                      {/* Skill Radar Chart */}
                      <div className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center overflow-hidden transition-all">
                         <h4 className="text-[10px] font-black text-gray-400 dark:text-zinc-600 tracking-widest uppercase mb-10 text-center">SKILL LANDSCAPE</h4>
                         <div className="w-full h-64">
                            <ResponsiveContainer width="100%" height="100%">
                               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                  <PolarGrid stroke={process.env.NEXT_PUBLIC_THEME === 'dark' ? "#27272a" : "#F3F4F6"} />
                                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 800 }} />
                                  <Radar
                                     name="Proyeksi Skill"
                                     dataKey="A"
                                     stroke="#1D9E75"
                                     fill="#1D9E75"
                                     fillOpacity={0.15}
                                  />
                               </RadarChart>
                            </ResponsiveContainer>
                         </div>
                         <div className="mt-10 pt-6 border-t border-gray-50 dark:border-zinc-800 w-full text-center transition-all">
                            <p className="text-[11px] text-gray-400 dark:text-zinc-500 leading-relaxed font-bold transition-colors">
                               Proyeksi kekuatan skill berdasarkan analisis AI dari CV dan profil kamu.
                            </p>
                         </div>
                      </div>
                   </div>
                </motion.div>
             )}
          </AnimatePresence>
        </>
      )}

      {/* Final Action */}
      <motion.div variants={fadeUp} className="bg-black dark:bg-zinc-900 rounded-[48px] p-12 text-center text-white relative overflow-hidden transition-all shadow-2xl shadow-black/10">
         <div className="relative z-10">
            <h3 className="text-3xl font-black mb-6 italic transition-colors">Sudah Menentukan Pilihan?</h3>
            <p className="text-gray-400 dark:text-zinc-500 max-w-xl mx-auto mb-10 leading-relaxed text-sm font-medium transition-colors">
               Pilih satu jalur utama untuk mengaktifkan 90 Hari Roadmap Aksi. Kamu bisa mengganti pilihan kapan saja di dashboard.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
               <Link href="/roadmap">
                  <button className="px-10 py-4 bg-teal text-white rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-teal/20">
                     AKTIFKAN ROADMAP SEKARANG
                  </button>
               </Link>
               <button 
                 onClick={() => toast.info("AI Mentor akan segera tersedia untuk kamu!")}
                 className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-white/10 dark:hover:bg-zinc-800 transition-all"
               >
                  KONSULTASI AI MENTOR
               </button>
            </div>
         </div>
         <div className="absolute top-0 left-0 w-80 h-80 bg-teal/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
      </motion.div>
    </div>
  );
}
