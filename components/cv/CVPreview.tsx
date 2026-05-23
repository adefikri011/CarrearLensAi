"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import { 
  FileText, Sparkles, AlertCircle, CheckCircle2, 
  ArrowLeft, Download, RefreshCcw, TrendingUp,
  BrainCircuit, Gauge, Target, Search, ArrowRight
} from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CVPreviewProps {
  data: {
    id: string;
    filename: string;
    extractedText: string;
    createdAt?: string;
  };
  analysisResult?: any;
  onReset?: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
};

export default function CVPreview({ data, analysisResult, onReset }: CVPreviewProps) {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [analyzing, setAnalyzing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState<string | null>(null);

  useEffect(() => {
    if (analysisResult) {
      setAnalyzing(false);
      setScore(analysisResult.cvScore?.total || 0);
    } else {
      // Simulate score animation if no real data yet
      const timer = setTimeout(() => {
        setAnalyzing(false);
        let current = 0;
        const interval = setInterval(() => {
          if (current >= 80) {
            clearInterval(interval);
          } else {
            current += 2;
            setScore(current);
          }
        }, 30);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [analysisResult]);

  const handleDownloadPDF = () => {
    if (!analysisResult) {
      toast.error("Tunggu hasil analisis selesai sebelum mengunduh.");
      return;
    }

    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageHeight = doc.internal.pageSize.getHeight(); // 297
      const pageWidth = doc.internal.pageSize.getWidth(); // 210
      let pageNum = 1;

      // Helper to draw common footer on all pages
      const drawFooter = (d: typeof doc, pNum: number) => {
        d.setFont("helvetica", "normal");
        d.setFontSize(8);
        d.setTextColor(148, 163, 184); // Slate color
        
        // Horizontal footer separator line
        d.setDrawColor(241, 245, 249);
        d.setLineWidth(0.3);
        d.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);
        
        // Footer text
        d.text("Laporan Resmi Hasil Analisis · CareerLens AI", 20, pageHeight - 10);
        d.text(`Halaman ${pNum}`, pageWidth - 20, pageHeight - 10, { align: "right" });
      };

      // Helper to draw standard page header
      const drawRunningHeader = (d: typeof doc, titleText: string) => {
        d.setFont("helvetica", "bold");
        d.setFontSize(8);
        d.setTextColor(83, 74, 183); // Purple branding
        d.text("CAREERLENS AI", 20, 12);
        
        d.setFont("helvetica", "normal");
        d.setTextColor(100, 116, 139);
        d.text(`|  ${titleText}`, 48, 12);

        d.text(new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth - 20, 12, { align: "right" });
        
        d.setDrawColor(226, 232, 240);
        d.setLineWidth(0.3);
        d.line(20, 15, pageWidth - 20, 15);
      };

      // ─── PAGE 1: COVER & DASHBOARD OVERVIEW ───
      // Draw Cover design banner at the top
      doc.setFillColor(15, 23, 42); // slate-900 (matches app dark mode)
      doc.rect(0, 0, pageWidth, 45, "F");

      // Running brand stripes (teal & purple)
      doc.setFillColor(29, 158, 117); // Teal
      doc.rect(0, 0, 4, 45, "F");
      doc.setFillColor(83, 74, 183); // Purple
      doc.rect(4, 0, 2, 45, "F");

      // Typography inside dark banner
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("CAREERLENS AI", 20, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(29, 158, 117); // Green Accent
      doc.text("Laporan Hasil Analisis CV & Rekomendasi Karier", 20, 24);

      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`File: ${data.filename.length > 55 ? data.filename.slice(0, 52) + "..." : data.filename}`, 20, 31);
      doc.text(`Waktu Analisis: ${new Date().toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}, ${new Date().toLocaleDateString('id-ID')}`, 20, 36);

      // Overal Readiness / ATS compatibility big badge at top-right
      doc.setFillColor(29, 158, 117); // Teal background
      doc.roundedRect(pageWidth - 65, 12, 45, 22, 3, 3, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text("ATS COMPATIBILITY", pageWidth - 42.5, 18, { align: "center" });

      doc.setFontSize(14);
      doc.text(`${analysisResult?.cvScore?.atsCompatibility || score}%`, pageWidth - 42.5, 27, { align: "center" });

      let y = 58;

      // Split Section: Score dashboard (left) and Section Checklist (right)
      doc.setDrawColor(241, 245, 249);
      doc.setFillColor(255, 255, 255);
      doc.setLineWidth(0.4);
      doc.roundedRect(20, y, 80, 52, 4, 4, "F"); // Left Card
      doc.roundedRect(110, y, 80, 52, 4, 4, "F"); // Right Card

      // Grid borders
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(20, y, 80, 52, 4, 4, "S");
      doc.roundedRect(110, y, 80, 52, 4, 4, "S");

      // Left Card: Scores Dashboard content
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42); // slate 900
      doc.text("DASHBOARD EVALUASI", 26, y + 8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);

      doc.text("Kelengkapan Struktur", 26, y + 18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text(`${analysisResult?.cvScore?.completeness || 85}%`, 92, y + 18, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Keterbacaan ATS", 26, y + 25);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(29, 158, 117); // Teal
      doc.text(`${analysisResult?.cvScore?.atsCompatibility || score}%`, 92, y + 25, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Skor Evaluasi Akhir", 26, y + 32);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(83, 74, 183); // Purple
      doc.text(`${analysisResult?.cvScore?.total || score}%`, 92, y + 32, { align: "right" });

      // Graphic progress segments
      // Completeness
      doc.setFillColor(226, 232, 240);
      doc.rect(26, y + 20, 66, 1.5, "F");
      doc.setFillColor(100, 116, 139);
      doc.rect(26, y + 20, (66 * (analysisResult?.cvScore?.completeness || 85)) / 100, 1.5, "F");

      // ATS score
      doc.setFillColor(226, 232, 240);
      doc.rect(26, y + 27, 66, 1.5, "F");
      doc.setFillColor(29, 158, 117);
      doc.rect(26, y + 27, (66 * (analysisResult?.cvScore?.atsCompatibility || score)) / 100, 1.5, "F");

      // Total Score
      doc.setFillColor(226, 232, 240);
      doc.rect(26, y + 34, 66, 1.5, "F");
      doc.setFillColor(83, 74, 183);
      doc.rect(26, y + 34, (66 * (analysisResult?.cvScore?.total || score)) / 100, 1.5, "F");

      // Right Card: Section Status list
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42); // slate 900
      doc.text("KELENGKAPAN SEKSI CV", 116, y + 8);

      let secY = y + 16;
      detectedSections.forEach((s: any) => {
        doc.setFont("helvetica", s.detected ? "bold" : "normal");
        doc.setFontSize(8);
        doc.setTextColor(s.detected ? 30 : 160, s.detected ? 41 : 160, s.detected ? 59 : 160);
        doc.text(s.title, 116, secY);

        if (s.detected) {
          doc.setFillColor(235, 247, 243);
          doc.roundedRect(172, secY - 3, 12, 4, 1, 1, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(6.5);
          doc.setTextColor(29, 158, 117);
          doc.text("ADA", 178, secY, { align: "center" });
        } else {
          doc.setFillColor(241, 245, 249);
          doc.roundedRect(164, secY - 3, 20, 4, 1, 1, "F");
          doc.setFont("helvetica", "normal");
          doc.setFontSize(6.5);
          doc.setTextColor(148, 163, 184);
          doc.text("BELUM ADA", 174, secY, { align: "center" });
        }
        secY += 6;
      });

      y += 62;

      // Card 3: Keyword Cloud Analisis Box
      doc.setFillColor(253, 254, 254);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(20, y, 170, 75, 4, 4, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42); // slate 900
      doc.text("OPTIMALISASI KATA KUNCI (KEYWORD CLOUD)", 26, y + 8);

      // Match Keywords (Teal highlight)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(29, 158, 117); // Teal
      doc.text("Kata Kunci yang Dipenuhi CV:", 26, y + 16);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      const matchedStr = analysisResult?.cvScore?.keywords?.matched?.slice(0, 16).join("   ·   ") || "Tidak ada keyword teridentifikasi.";
      const matchedSplit = doc.splitTextToSize(matchedStr, 158);
      doc.text(matchedSplit, 26, y + 21);

      // Missing Keywords (Purple warning)
      const missingY = y + 37;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(83, 74, 183); // Purple
      doc.text("Kata Kunci Penting Industri yang Perlu Ditambahkan (Missing):", 26, missingY);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      const missingStr = analysisResult?.cvScore?.keywords?.missing?.slice(0, 16).join("   ·   ") || "Harap sesuaikan kelengkapan kompetensi.";
      const missingSplit = doc.splitTextToSize(missingStr, 158);
      doc.text(missingSplit, 26, missingY + 5);

      // AI Advice highlighting box
      doc.setFillColor(245, 243, 255); // Purple background pill
      doc.roundedRect(26, y + 54, 158, 15, 2, 2, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(83, 74, 183);
      doc.text("REKOMENDASI KUNCI KATA KUNCI:", 30, y + 60);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const outputSuggestion = aiSuggestion.length > 95 ? aiSuggestion.slice(0, 92) + "..." : aiSuggestion;
      doc.text(outputSuggestion, 30, y + 65);

      y += 85;

      // Card 4: Strategi Rekomendasi Pokok
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(20, y, 170, 48, 4, 4, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42); // slate 900
      doc.text("SARAN DAN EVALUASI STRATEGIS UNTUK KARIER", 26, y + 8);

      let suggestionY = y + 16;
      const suggestions = analysisResult?.rekomendasiUtama || [
        "Tambahkan rincian proyek berbobot tinggi untuk menarik rekruter digital.",
        "Pastikan ringkasan profil mencantumkan spesialisasi spesifik yang dicari industri.",
        "Seimbangkan penyebaran kata kunci di bagian Riwayat Pekerjaan supaya mudah dibaca robot ATS."
      ];

      suggestions.slice(0, 3).forEach((item: string, idx: number) => {
        // Bullet Point
        doc.setFillColor(29, 158, 117);
        doc.circle(28, suggestionY - 1, 1, "F");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(30, 41, 59);
        const splitRec = doc.splitTextToSize(item, 152);
        doc.text(splitRec, 32, suggestionY + 1.5);
        suggestionY += (splitRec.length * 4) + 2;
      });

      // Page 1 Footer
      drawFooter(doc, pageNum);


      // ─── PAGE 2: DETAILED CAREER ROADMAPS ───
      pageNum++;
      doc.addPage();
      drawRunningHeader(doc, "Rekomendasi Jalur Karier Sesuai Kompetensi");

      let y2 = 28;

      // Header Page 2
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("REKOMENDASI ARAH & JALUR KARIER", 20, y2);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text("Saran kecocokan jalur kerja dengan persentase relevansi tertinggi bagi Fresh Graduate & Pelamar:", 20, y2 + 5);

      y2 += 14;

      const pathList = analysisResult?.careerPaths || [];
      if (pathList.length > 0) {
        pathList.forEach((path: any, index: number) => {
          // Break if runs out of height space
          if (y2 + 65 > pageHeight - 20) {
            drawFooter(doc, pageNum);
            pageNum++;
            doc.addPage();
            drawRunningHeader(doc, "Rekomendasi Jalur Karier (Lanjutan)");
            y2 = 28;
          }

          // Card panel
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(241, 245, 249);
          doc.roundedRect(20, y2, 170, 52, 4, 4, "F");
          doc.setDrawColor(226, 232, 240);
          doc.roundedRect(20, y2, 170, 52, 4, 4, "S");

          // Left border accent strip
          const primaryColor = index % 2 === 0 ? [29, 158, 117] : [83, 74, 183]; // Teal or Purple alternate
          doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.rect(20, y2, 2, 52, "F");

          // Career Title
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(15, 23, 42);
          doc.text(`${index + 1}. ${path.nama}`, 25, y2 + 8);

          // Percent Match Badge on the right
          doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.roundedRect(158, y2 + 5, 26, 10, 1.5, 1.5, "F");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(255, 255, 255);
          doc.text(`${path.matchScore}% MATCH`, 171, y2 + 11, { align: "center" });

          // Path description
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105);
          const splitDesc = doc.splitTextToSize(path.deskripsi || "Jalur karier strategis untuk menyalurkan kompetensi teknis dan soft-skills Anda ke lini industri utama.", 156);
          doc.text(splitDesc, 25, y2 + 16);

          // Required Skills block
          const skillsY = y2 + 30;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(30, 41, 59);
          doc.text("Keahlian Utama (Core Skills):", 25, skillsY);

          // Pill list
          let badgeX = 25;
          const reqSkills = path.requiredSkills || [];
          reqSkills.slice(0, 4).forEach((skillObj: any) => {
            const skillName = typeof skillObj === "string" ? skillObj : (skillObj.skill || "");
            if (!skillName) return;
            
            const txtWidth = doc.getTextWidth(skillName.toUpperCase());
            const badgeW = txtWidth + 6;

            doc.setFillColor(241, 245, 249);
            doc.roundedRect(badgeX, skillsY + 2.5, badgeW, 5.5, 1, 1, "F");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(6.5);
            doc.setTextColor(100, 116, 139);
            doc.text(skillName.toUpperCase(), badgeX + (badgeW / 2), skillsY + 6.2, { align: "center" });

            badgeX += badgeW + 3;
          });

          // Footer link advice
          const adviseY = y2 + 45;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(148, 163, 184);
          doc.text("Petunjuk belajar detail dan sertifikasi dapat Anda akses lewat dasbor CareerLens AI.", 25, adviseY);

          y2 += 60;
        });
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("Rekomendasi detail jalur dan keahlian tidak terdeteksi di database.", 20, y2 + 10);
      }

      // Page 2 Footer
      drawFooter(doc, pageNum);

      // Save the generated document
      const sanitizeName = data.filename.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 20);
      doc.save(`Laporan-Analisis-CV-${sanitizeName}-${Date.now()}.pdf`);
      toast.success("Laporan berhasil diunduh sebagai PDF!");
    } catch (err) {
      console.error("Gagal meluncurkan ekspor PDF:", err);
      toast.error("Format atau parser PDF mengalami kendala teknis.");
    }
  };

  const handleSimpanHasil = async () => {
    if (!analysisResult) return
    setIsSaving(true)
    try {
      const res = await fetch('/api/analyze/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvUploadId: data.id,
          result: analysisResult
        })
      })
      if (res.ok) {
        toast.success('Hasil analisis berhasil disimpan!')
      } else {
        toast.error('Gagal menyimpan hasil analisis.')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleViewRoadmap = async (pathName: string) => {
    setIsRedirecting(pathName);
    try {
      // 1. Simpan pilihan path ke latest analysis
      await fetch('/api/roadmap/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathName })
      });
      
      // 2. Redirect ke halaman roadmap
      router.push('/roadmap');
    } catch (error) {
      toast.error("Gagal menyiapkan roadmap.");
    } finally {
      setIsRedirecting(null);
    }
  }

  const detectedSections = analysisResult?.cvScore?.sections || [
    { title: "Data Pribadi", detected: true },
    { title: "Ringkasan Profil", detected: true },
    { title: "Pengalaman Kerja", detected: true },
    { title: "Pendidikan", detected: true },
    { title: "Skill Teknis", detected: true },
    { title: "Proyek & Sertifikat", detected: false },
  ];

  const keywords = analysisResult?.cvScore?.keywords?.matched?.map((k: string) => ({ t: k, m: true })) || [];

  const missingKeywords = analysisResult?.cvScore?.keywords?.missing || [];
  const aiSuggestion = missingKeywords.length > 0 
    ? `Tambahkan keyword "${missingKeywords[0]}" untuk meningkatkan relevansi.`
    : analysisResult?.rekomendasiUtama?.[0] || "CV kamu sudah sangat baik dan relevan.";

  return (
    <div className="space-y-12">
      {/* --- Action Bar --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
         {onReset ? (
           <button 
             onClick={onReset}
             className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors font-bold group"
           >
              <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-black transition-all">
                 <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="text-sm">Kembali & Upload Ulang</span>
           </button>
         ) : (
           <div className="flex items-center gap-2 text-teal font-bold uppercase text-[10px] tracking-widest bg-teal/5 px-4 py-2 rounded-full border border-teal/10">
              <CheckCircle2 className="w-4 h-4" /> CV Siap Digunakan
           </div>
         )}
         
         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button 
              onClick={handleDownloadPDF}
              variant="outline" 
              className="w-full sm:w-auto rounded-full px-6 h-11 sm:h-12 font-bold border-[#F3F4F6] text-xs"
            >
               <Download className="w-4 h-4 mr-2" /> Download Laporan (PDF)
            </Button>
            <Button 
              onClick={handleSimpanHasil}
              disabled={isSaving || !analysisResult}
              className="w-full sm:w-auto rounded-full px-8 h-11 sm:h-12 font-bold bg-teal hover:bg-teal-dark shadow-lg shadow-teal/10 text-xs"
            >
               {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : "Simpan Hasil"}
            </Button>
         </div>
      </div>

      {/* --- Score Overview --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
         <motion.div 
           variants={fadeUp} 
           initial="hidden" 
           animate="visible"
           className="bg-black rounded-[32px] sm:rounded-[48px] p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl shadow-black/10"
         >
            <div className="relative z-10 text-center flex flex-col items-center">
               <span className="text-[10px] font-black tracking-[0.2em] uppercase text-teal mb-6 sm:mb-8">KOMPATIBILITAS ATS</span>
               
               <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center mb-8 sm:mb-10">
                  <svg className="w-full h-full transform -rotate-90">
                     <circle 
                        cx="80" cy="80" r="74" 
                        stroke="currentColor" strokeWidth="10" fill="transparent" 
                        className="text-white/5 sm:hidden"
                     />
                     <circle 
                        cx="96" cy="96" r="88" 
                        stroke="currentColor" strokeWidth="12" fill="transparent" 
                        className="text-white/5 hidden sm:block"
                     />
                     <motion.circle 
                        cx="80" cy="80" r="74" 
                        stroke="currentColor" strokeWidth="10" fill="transparent" 
                        strokeDasharray={465}
                        strokeDashoffset={465 - (465 * score) / 100}
                        strokeLinecap="round"
                        className="text-teal sm:hidden"
                        transition={{ duration: 1.5, ease: "easeOut" }}
                     />
                     <motion.circle 
                        cx="96" cy="96" r="88" 
                        stroke="currentColor" strokeWidth="12" fill="transparent" 
                        strokeDasharray={552}
                        strokeDashoffset={552 - (552 * score) / 100}
                        strokeLinecap="round"
                        className="text-teal hidden sm:block"
                        transition={{ duration: 1.5, ease: "easeOut" }}
                     />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-5xl sm:text-6xl font-black tracking-tighter italic">{score}%</span>
                     <span className="text-[9px] sm:text-[10px] font-black text-white/40 tracking-widest mt-1 uppercase">Skor AI</span>
                  </div>
               </div>

               <p className="text-gray-400 text-sm sm:text-[14px] leading-relaxed">
                  CV kamu memiliki struktur yang sangat baik. <span className="text-white font-bold">{score}% robot rekruter</span> dapat membaca informasi penting dengan akurat.
               </p>
            </div>
            
            <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-teal/10 blur-[60px] sm:blur-[80px] rounded-full" />
         </motion.div>

         <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
               <h3 className="text-[10px] sm:text-[11px] font-black text-gray-400 tracking-widest uppercase flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal" />
                  SEKSI CV TERDETEKSI
               </h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
               {detectedSections.map((s: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                     <span className={cn("text-xs sm:text-sm font-bold", s.detected ? "text-black" : "text-gray-300")}>{s.title}</span>
                     {s.detected ? <CheckCircle2 className="w-5 h-5 text-teal" /> : <AlertCircle className="w-5 h-5 text-amber" />}
                  </div>
               ))}
            </div>
         </motion.div>

         <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-gray-100 shadow-sm md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
               <h3 className="text-[10px] sm:text-[11px] font-black text-gray-400 tracking-widest uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal" />
                  KEYWORD CLOUD
               </h3>
            </div>
            <div className="flex flex-wrap gap-2">
               {keywords.length > 0 ? keywords.map((k: any, i: number) => (
                  <Badge 
                    key={i} 
                    className={cn(
                     "rounded-xl px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] font-black tracking-widest uppercase border-none",
                     k.m ? "bg-teal-light text-teal-dark" : "bg-gray-100 text-gray-400"
                    )}
                  >
                     {k.t}
                  </Badge>
               )) : (
                 <p className="text-xs text-gray-400 italic">Menganalisis keyword...</p>
               )}
            </div>
            <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-100">
               <p className="text-[10px] sm:text-[11px] text-gray-400 leading-relaxed font-bold">
                  <span className="font-black text-black">SARAN AI:</span> {aiSuggestion}
               </p>
            </div>
         </motion.div>
      </div>

      {/* --- Detailed Analysis / Career Paths --- */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-8">
         <div className="flex items-center justify-between">
            <h3 className="text-[10px] sm:text-[11px] font-black text-gray-400 tracking-widest uppercase flex items-center gap-2">
               <Target className="w-4 h-4 text-teal" />
               REKOMENDASI JALUR KARIER (BERDASARKAN CV)
            </h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysisResult?.careerPaths?.length > 0 ? (
              analysisResult.careerPaths.map((path: any, i: number) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group"
                >
                   <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                         <h4 className="text-xl font-black text-black group-hover:text-teal transition-colors tracking-tight">{path.nama}</h4>
                         <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">{path.deskripsi}</p>
                      </div>
                      <div className="bg-teal-light text-teal px-4 py-2 rounded-2xl flex flex-col items-center">
                         <span className="text-lg font-black">{path.matchScore}%</span>
                         <span className="text-[8px] font-black uppercase">MATCH</span>
                      </div>
                   </div>
                   
                   <div className="flex flex-wrap gap-2 mb-8">
                      {path.requiredSkills?.slice(0, 3).map((s: any, j: number) => (
                        <span key={j} className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg uppercase tracking-wider">{s.skill}</span>
                      ))}
                   </div>
                   
                   <Button 
                    variant="link" 
                    onClick={() => handleViewRoadmap(path.nama)}
                    disabled={!!isRedirecting}
                    className="p-0 h-auto text-teal font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group/btn"
                   >
                      {isRedirecting === path.nama ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>Lihat Roadmap Detail <ArrowLeft className="w-4 h-4 rotate-180 group-hover/btn:translate-x-1 transition-transform" /></>
                      )}
                   </Button>
                </motion.div>
              ))
            ) : (
              <div className="md:col-span-2 bg-gray-50 border-2 border-dashed border-gray-100 rounded-[40px] p-12 text-center">
                 <p className="text-gray-400 text-sm italic">Analisis kecocokan karier sedang disiapkan...</p>
              </div>
            )}
         </div>
      </motion.div>
    </div>
  );
}
