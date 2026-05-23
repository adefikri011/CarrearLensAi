"use client";

import React, { useState, useEffect } from "react";
import { 
  motion, AnimatePresence 
} from "motion/react";
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
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
      const doc = new jsPDF("p", "mm", "a4");
      const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
      const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
      let pageNum = 1;

      // ─── FOOTER HELPER ───
      const drawFooter = (d: typeof doc, pNum: number) => {
        d.setFont("helvetica", "normal");
        d.setFontSize(8);
        d.setTextColor(148, 163, 184); // slate-400
        
        // Horizontal separator rules
        d.setDrawColor(241, 245, 249);
        d.setLineWidth(0.3);
        d.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);
        
        d.text("Laporan Resmi Hasil Analisis Karir · CareerLens AI", 20, pageHeight - 10);
        d.text(`Halaman ${pNum}`, pageWidth - 20, pageHeight - 10, { align: "right" });
      };

      // ─── RUNNING HEADER HELPER ───
      const drawRunningHeader = (d: typeof doc, subtitle: string) => {
        d.setFont("helvetica", "bold");
        d.setFontSize(8);
        d.setTextColor(83, 74, 183); // Purple
        d.text("CAREERLENS AI", 20, 12);
        
        d.setFont("helvetica", "normal");
        d.setTextColor(100, 116, 139);
        d.text(`|  ${subtitle}`, 48, 12);

        const currentFormattedDate = new Date(analysis.createdAt || Date.now()).toLocaleDateString('id-ID', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        d.text(currentFormattedDate, pageWidth - 20, 12, { align: "right" });
        
        d.setDrawColor(226, 232, 240);
        d.setLineWidth(0.3);
        d.line(20, 15, pageWidth - 20, 15);
      };

      // ─── PAGE 1: HERO & DASHBOARDS ───
      // Draw background header banner
      doc.setFillColor(15, 23, 42); // slate-900 (matches CareerLens AI dark accent)
      doc.rect(0, 0, pageWidth, 45, "F");

      // Draw brand highlights
      doc.setFillColor(29, 158, 117); // Teal
      doc.rect(0, 0, 4, 45, "F");
      doc.setFillColor(83, 74, 183); // Purple
      doc.rect(4, 0, 2, 45, "F");

      // Left-aligned brand typography
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text("CAREERLENS AI", 20, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(29, 158, 117); // Teal accent text
      doc.text("Laporan Komprehensif Analisis Karier & Peta Kekuatan Profil", 20, 24);

      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`ID Analisis: ${analysis.id || 'N/A'}`, 20, 31);
      const timestamp = new Date(analysis.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Waktu Analisis: ${timestamp}`, 20, 36);

      // Top-right Score pill: OVERALL READINESS
      doc.setFillColor(29, 158, 117); // Teal background for main score badge
      doc.roundedRect(pageWidth - 65, 12, 45, 22, 3, 3, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text("OVERALL READINESS", pageWidth - 42.5, 18, { align: "center" });

      doc.setFontSize(14);
      doc.text(`${analysis.overallReadiness || 0}%`, pageWidth - 42.5, 27, { align: "center" });

      let y = 58;

      // Card structure for METRICS (Left) vs TARGET INFORMATION (Right)
      doc.setDrawColor(241, 245, 249);
      doc.setFillColor(255, 255, 255);
      doc.setLineWidth(0.4);
      doc.roundedRect(20, y, 80, 52, 4, 4, "F");
      doc.roundedRect(110, y, 80, 52, 4, 4, "F");

      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(20, y, 80, 52, 4, 4, "S");
      doc.roundedRect(110, y, 80, 52, 4, 4, "S");

      // Card-1 Content: Metrics Summary
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("DASHBOARD SKOR KESIAPAN", 26, y + 8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);

      doc.text("Skor Evaluasi CV", 26, y + 18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text(`${analysis.cvScore || 0}%`, 92, y + 18, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Kesiapan Keseluruhan", 26, y + 27);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(29, 158, 117);
      doc.text(`${analysis.overallReadiness || 0}%`, 92, y + 27, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Status Karir Utama", 26, y + 36);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(83, 74, 183);
      doc.text(analysis.selectedPath ? "AKTIF" : "DRAFT", 92, y + 36, { align: "right" });

      // Progress bars
      // CV Score bar
      doc.setFillColor(226, 232, 240);
      doc.rect(26, y + 20, 66, 1.5, "F");
      doc.setFillColor(100, 116, 139);
      doc.rect(26, y + 20, (66 * (analysis.cvScore || 0)) / 100, 1.5, "F");

      // Overall Readiness bar
      doc.setFillColor(226, 232, 240);
      doc.rect(26, y + 29, 66, 1.5, "F");
      doc.setFillColor(29, 158, 117);
      doc.rect(26, y + 29, (66 * (analysis.overallReadiness || 0)) / 100, 1.5, "F");

      // Card-2 Content: Target & Sync status
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("DETAIL JALUR PILIHAN", 116, y + 8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Target Utama Saat Ini:", 116, y + 18);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      const selectedPathShort = analysis.selectedPath 
        ? (analysis.selectedPath.length > 30 ? analysis.selectedPath.slice(0, 27) + "..." : analysis.selectedPath) 
        : "Belum Ditentukan";
      doc.text(selectedPathShort, 116, y + 23);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Skor Sinkronisasi Profil & CV:", 116, y + 32);

      const syncVal = result.syncScore !== undefined ? result.syncScore : 100;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(syncVal >= 70 ? 29 : 220, syncVal >= 70 ? 158 : 38, syncVal >= 70 ? 117 : 38);
      doc.text(`${syncVal}% Relevan`, 116, y + 37);

      // Warning label if syncScore is low
      if (syncVal < 70) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(220, 38, 38);
        doc.text("*Rekomendasi: Perbarui profil agar sesuai CV", 116, y + 43);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text("Profil & CV sinkron dengan baik.", 116, y + 43);
      }

      y += 62;

      // Competencies Section with visual colored bar charts
      doc.setFillColor(253, 254, 254);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(20, y, 170, 78, 4, 4, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("PETUNJUK KENDALI KOMPETENSI (CORE SKILLS LANDSCAPE)", 26, y + 8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(115, 115, 115);
      doc.text("Evaluasi visual parameter kecakapan kognitif, interpersonal & teknikal di dalam industri modern:", 26, y + 13);

      const competencies = [
        { label: "Keahlian Teknis & Digital", val: result.skillRadar?.teknisDigital || 0, color: [29, 158, 117] },
        { label: "Kecakapan Komunikasi & Interpersonal", val: result.skillRadar?.komunikasi || 0, color: [29, 158, 117] },
        { label: "Bakat Kepemimpinan (Leadership)", val: result.skillRadar?.kepemimpinan || 0, color: [83, 74, 183] },
        { label: "Kreativitas & Pemecahan Masalah", val: result.skillRadar?.kreativitas || 0, color: [83, 74, 183] },
        { label: "Daya Analitis & Analitis Data", val: result.skillRadar?.analitis || 0, color: [30, 41, 59] },
        { label: "Fleksibilitas & Adaptabilitas Kerja", val: result.skillRadar?.adaptabilitas || 0, color: [30, 41, 59] }
      ];

      let barY = y + 22;
      competencies.forEach((comp) => {
        // Label
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85); // Slate 700
        doc.text(comp.label, 26, barY);

        // Percentage Text
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(comp.color[0], comp.color[1], comp.color[2]);
        doc.text(`${comp.val}%`, 182, barY, { align: "right" });

        // Bar Track
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(26, barY + 2, 156, 2.5, 1, 1, "F");

        // Bar Fill
        doc.setFillColor(comp.color[0], comp.color[1], comp.color[2]);
        doc.roundedRect(26, barY + 2, (156 * comp.val) / 100, 2.5, 1, 1, "F");

        barY += 8.5;
      });

      // Page 1 Footer
      drawFooter(doc, pageNum);


      // ─── PAGE 2: DETAILED RECOMMENDATIONS & PATHWAY MAP ───
      pageNum++;
      doc.addPage();
      drawRunningHeader(doc, "Identifikasi Jalur Karier & Peta Kekuatan Relevansi");

      let y2 = 28;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42); // slate 900
      doc.text("DAFTAR REKOMENDASI JALUR KARIER UTAMA", 20, y2);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text("Peluang industri yang diselaraskan dengan portfolio akademis, prestasi, pengalaman dan minat:", 20, y2 + 5);

      y2 += 14;

      const pathList = result.careerPaths || [];
      if (pathList.length > 0) {
        pathList.forEach((path: any, index: number) => {
          // If the card doesn't fit on page, add page break
          if (y2 + 60 > pageHeight - 20) {
            drawFooter(doc, pageNum);
            pageNum++;
            doc.addPage();
            drawRunningHeader(doc, "Hasil Rekomendasi Jalur Karier (Lanjutan)");
            y2 = 28;
          }

          // Card Background panel
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(241, 245, 249);
          doc.roundedRect(20, y2, 170, 48, 4, 4, "F");
          doc.setDrawColor(226, 232, 240);
          doc.roundedRect(20, y2, 170, 48, 4, 4, "S");

          // Left border accent strip
          const currentAccentColor = index % 2 === 0 ? [29, 158, 117] : [83, 74, 183]; // alternating teal and purple
          doc.setFillColor(currentAccentColor[0], currentAccentColor[1], currentAccentColor[2]);
          doc.rect(20, y2, 2.5, 48, "F");

          // Title
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(15, 23, 42);
          doc.text(`${index + 1}. ${path.nama}`, 25, y2 + 8);

          // Percent Match Badge
          doc.setFillColor(currentAccentColor[0], currentAccentColor[1], currentAccentColor[2]);
          doc.roundedRect(158, y2 + 5, 26, 10, 1.5, 1.5, "F");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(255, 255, 255);
          doc.text(`${path.matchScore}% MATCH`, 171, y2 + 11.5, { align: "center" });

          // Description
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105);
          const splitDesc = doc.splitTextToSize(path.deskripsi || "Jalur karier terarah untuk menyalurkan segenap kompetensi teknis, kecerdasan digital, dan kepemimpinan tim Anda.", 158);
          doc.text(splitDesc, 26, y2 + 16);

          // Meta / Action advice block
          const lineLength = splitDesc.length;
          const adviceY = y2 + 17 + (lineLength * 4);
          
          doc.setFillColor(248, 250, 252); // light slate pill background
          doc.roundedRect(26, adviceY, 158, 12, 1.5, 1.5, "F");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.5);
          doc.setTextColor(currentAccentColor[0], currentAccentColor[1], currentAccentColor[2]);
          doc.text("AKSI REKOMENDASI AI:", 30, adviceY + 5);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(71, 85, 105);
          const activeAksi = index === 0 
            ? "Fokus maksimalkan kecakapan berbasis proyek nyata, lampirkan link portofolio (GitHub/Figma)."
            : "Lakukan review mandiri dengan modul Roadmap 90 Hari yang tersedia gratis di CareerLens AI.";
          doc.text(activeAksi, 30, adviceY + 9);

          y2 += 55;
        });
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text("Tidak ditemukan daftar rekomendasi jalur untuk ditampilkan.", 20, y2 + 10);
      }

      // Page 2 Footer
      drawFooter(doc, pageNum);

      // Save document
      const docName = `Laporan-Karir-${analysis.selectedPath ? analysis.selectedPath.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 18) : "CareerLens"}-${Date.now()}.pdf`;
      doc.save(docName);
      toast.success("Hasil analisis berhasil diunduh sebagai PDF!");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Format atau parser PDF mengalami kendala teknis.");
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
        <div className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-[40px] p-20 text-center flex flex-col items-center space-y-8 transition-all shadow-sm group relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(29,158,117,0.03),transparent_70%)]" />
           <div className="w-24 h-24 rounded-[32px] bg-gray-50 dark:bg-zinc-900 flex items-center justify-center text-gray-300 dark:text-zinc-700 relative z-10 group-hover:text-teal group-hover:bg-teal/5 transition-all">
              <AlertCircle className="w-12 h-12" />
           </div>
           <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white mb-3 italic tracking-tight transition-colors uppercase">Belum Ada Analisis</h3>
              <p className="text-gray-400 dark:text-zinc-500 max-w-sm mx-auto font-bold uppercase tracking-tighter text-xs md:text-sm transition-colors">
                Upload CV kamu hari ini untuk mendapatkan peta jalan karier masa depan yang presisi.
              </p>
           </div>
           <Link href="/cv-builder" className="relative z-10">
              <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-teal dark:hover:bg-teal dark:hover:text-white rounded-full px-12 h-16 font-black text-[12px] tracking-[0.2em] uppercase shadow-2xl shadow-black/10 transition-all hover:scale-105 active:scale-95">
                 UPLOAD CV SEKARANG
              </Button>
           </Link>
        </div>
      ) : isAnalyzing ? (
        <div className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-[40px] p-24 text-center flex flex-col items-center space-y-10 transition-all relative overflow-hidden shadow-2xl shadow-black/5">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1D9E7510,transparent_70%)]" />
           <div className="relative z-10 space-y-10 flex flex-col items-center">
              <div className="relative mb-4">
                 <div className="absolute inset-0 bg-teal/20 blur-[60px] rounded-full animate-pulse" />
                 <div className="w-24 h-24 relative z-10 bg-white dark:bg-zinc-900 rounded-[32px] border border-teal/20 flex items-center justify-center shadow-2xl shadow-teal/20">
                    <LoadingSpinner size="lg" className="w-12 h-12" />
                 </div>
                 <div className="absolute -top-4 -right-4 w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl border border-teal/20 flex items-center justify-center shadow-lg animate-bounce">
                    <Sparkles className="w-6 h-6 text-teal" />
                 </div>
              </div>
              <div className="space-y-4">
                 <h3 className="text-3xl md:text-5xl font-black text-black dark:text-white italic tracking-tighter uppercase transition-colors">Gemini AI <br/> Sedang Berpikir...</h3>
                 <p className="text-gray-400 dark:text-zinc-500 max-w-md mx-auto leading-relaxed font-bold tracking-tight transition-colors uppercase text-[10px] md:text-xs">
                   Kami sedang meracik strategi terbaik untuk masa depanmu. <br/>
                   <span className="text-teal">Duduk tenang sejenak, ini akan luar biasa.</span>
                 </p>
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
                      <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-sm p-10 rounded-[40px] border border-gray-100 dark:border-zinc-800/50 shadow-sm flex flex-col items-center justify-center overflow-hidden transition-all group hover:border-teal/20">
                         <h4 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 tracking-widest uppercase mb-10 text-center group-hover:text-teal transition-colors">SKILL LANDSCAPE</h4>
                         <div className="w-full h-72">
                            <ResponsiveContainer width="100%" height="100%">
                               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                  <PolarGrid stroke="currentColor" className="text-gray-100 dark:text-zinc-800" />
                                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 900, className: 'text-gray-400 dark:text-zinc-600' }} />
                                  <Radar
                                     name="Proyeksi Skill"
                                     dataKey="A"
                                     stroke="#1D9E75"
                                     fill="#1D9E75"
                                     fillOpacity={0.2}
                                     strokeWidth={3}
                                  />
                               </RadarChart>
                            </ResponsiveContainer>
                         </div>
                         <div className="mt-10 pt-6 border-t border-gray-50 dark:border-zinc-800/50 w-full text-center transition-all">
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
