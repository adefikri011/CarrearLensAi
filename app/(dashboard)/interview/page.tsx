"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mic, 
  MicOff, 
  Play, 
  Square, 
  ChevronRight, 
  Award, 
  MessageSquare, 
  RefreshCcw, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Lock,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface InterviewState {
  step: "loading" | "locked" | "ready" | "interview" | "result";
  role: string | null;
  history: any[];
  currentQuestion: string | null;
  currentFeedback: string | null;
  currentScore: number | null;
  isFinished: boolean;
  totalScore: number;
  questionCount: number;
  stats?: { completed: number; total: number; percentage: number };
  lockReason?: string;
}

export default function InterviewPage() {
  const { toast } = useToast();
  const [state, setState] = useState<InterviewState>({
    step: "loading",
    role: null,
    history: [],
    currentQuestion: null,
    currentFeedback: null,
    currentScore: null,
    isFinished: false,
    totalScore: 0,
    questionCount: 0,
  });

  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Refs for Speech APIs
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    checkStatus();
    
    if (typeof window !== "undefined") {
      // Initialize Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.lang = "id-ID";
        
        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const result = event.results[current][0].transcript;
          setTranscript((prev) => prev + " " + result);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech Recognition Error:", event.error);
          setIsRecording(false);
        };
      }

      // Initialize Synthesis
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const checkStatus = async () => {
    try {
      const res = await fetch("/api/interview/status");
      const result = await res.json();
      
      if (result.success) {
        if (result.isAvailable) {
          setState(prev => ({ ...prev, step: "ready", role: result.role, stats: result.stats }));
        } else {
          setState(prev => ({ 
            ...prev, 
            step: "locked", 
            lockReason: result.reason || "Selesaikan Roadmap 90 Hari terlebih dahulu.",
            stats: result.stats 
          }));
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Gagal mengecek status interview." });
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const startInterview = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: [] }),
      });
      const result = await res.json();
      
      if (result.success) {
        setState({
          ...state,
          step: "interview",
          currentQuestion: result.data.question,
          questionCount: 1,
        });
        speak(result.data.question);
      } else {
        toast({ title: "Gagal", description: result.error || "Gagal memulai wawancara." });
      }
    } catch (error) {
      toast({ title: "Gagal", description: "Tidak dapat memulai wawancara.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript("");
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const submitAnswer = async () => {
    if (!transcript.trim()) {
      toast({ title: "Jawaban kosong", description: "Silakan berikan jawaban Anda terlebih dahulu." });
      return;
    }

    setIsLoading(true);
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    try {
      const newHistory = [
        ...state.history,
        { role: "assistant", parts: [{ text: state.currentQuestion }] },
        { role: "user", parts: [{ text: transcript }] }
      ];

      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          history: state.history, 
          currentAnswer: transcript 
        }),
      });
      const result = await res.json();

      if (result.success) {
        const data = result.data;
        const updatedTotalScore = state.totalScore + (data.score || 0);

        if (data.isFinished) {
          setState({
            ...state,
            step: "result",
            isFinished: true,
            totalScore: Math.round(updatedTotalScore / state.questionCount),
            currentFeedback: data.feedback,
            history: newHistory,
          });
        } else {
          setState({
            ...state,
            currentQuestion: data.question,
            currentFeedback: data.feedback,
            currentScore: data.score,
            history: newHistory,
            questionCount: state.questionCount + 1,
            totalScore: updatedTotalScore
          });
          setTranscript("");
          speak(data.question);
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Gagal memproses jawaban.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] py-6 md:py-10">
      {/* Header Section */}
      <div className="mb-8 md:mb-12 px-2">
        <h1 className="text-3xl md:text-6xl font-black text-black dark:text-white tracking-tighter uppercase italic mb-3 leading-none">
          AI Mock <span className="text-teal">Interview</span>
        </h1>
        <p className="text-sm md:text-lg text-gray-500 dark:text-zinc-500 font-medium max-w-2xl leading-relaxed">
          Platform simulasi wawancara kerja cerdas. AI akan mengujimu sesuai dengan profil dan progres belajarmu.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* LOADING STATE */}
        {state.step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <div className="relative">
              <Loader2 className="w-16 h-16 text-teal animate-spin mb-6" />
              <div className="absolute inset-0 blur-xl bg-teal/20 animate-pulse" />
            </div>
            <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Sinkronisasi AI...</p>
          </motion.div>
        )}

        {/* LOCKED STATE */}
        {state.step === "locked" && (
          <motion.div
            key="locked"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto px-2"
          >
            <Card className="p-8 md:p-16 border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 border-2 rounded-[32px] md:rounded-[56px] text-center shadow-3xl shadow-black/5 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 dark:bg-zinc-800" />
               <div className="w-20 h-20 md:w-28 md:h-28 bg-gray-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-8 shadow-inner">
                  <Lock size={40} className="md:size-56" />
               </div>
               <h2 className="text-2xl md:text-4xl font-black mb-4 dark:text-white tracking-tighter uppercase italic leading-tight">Akses Terbatas</h2>
               <p className="text-xs md:text-sm text-gray-500 mb-10 font-bold uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
                  Selesaikan seluruh misi di <span className="text-teal">Roadmap 90 Hari</span> untuk membuka fitur simulasi wawancara ini.
               </p>

               {state.stats && (
                 <div className="mb-10 bg-gray-50 dark:bg-white/5 p-6 md:p-10 rounded-3xl border border-gray-100 dark:border-zinc-800">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Progres Penguasaan</span>
                       <span className="text-xl md:text-3xl font-black text-black dark:text-white leading-none tabular-nums">{state.stats.percentage}%</span>
                    </div>
                    <div className="h-3 md:h-4 w-full bg-gray-200 dark:bg-zinc-900 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${state.stats.percentage}%` }}
                        className="h-full bg-teal shadow-lg shadow-teal/50"
                      />
                    </div>
                    <p className="mt-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                       <CheckCircle2 size={12} className="text-teal" /> {state.stats.completed} dari {state.stats.total} Misi Telah Divalidasi
                    </p>
                 </div>
               )}

               <Button asChild className="w-full md:w-auto h-16 md:h-20 px-12 md:px-20 bg-black dark:bg-white text-white dark:text-black rounded-2xl md:rounded-3xl font-black uppercase tracking-[0.15em] text-xs md:text-sm hover:bg-teal dark:hover:bg-teal dark:hover:text-white transition-all shadow-2xl active:scale-95 group">
                  <Link href="/roadmap">
                    Kembali ke Roadmap <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </Button>
            </Card>
          </motion.div>
        )}

        {/* READY STATE */}
        {state.step === "ready" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto px-2"
          >
            <Card className="p-8 md:p-20 border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 border-2 border-teal/10 rounded-[32px] md:rounded-[64px] text-center shadow-3xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-teal" />
               <div className="w-20 h-20 md:w-28 md:h-28 bg-teal/10 rounded-[2rem] flex items-center justify-center text-teal mx-auto mb-10 shadow-2xl shadow-teal/20 rotate-3">
                  <Play size={40} className="ml-1.5 md:size-12" />
               </div>
               
               <div className="mb-12 space-y-4">
                 <Badge className="bg-teal/10 text-teal border-none mb-2 font-black uppercase tracking-[0.2em] text-[10px] md:text-sm px-4 py-1.5">Misi Selesai!</Badge>
                 <h2 className="text-3xl md:text-6xl font-black mb-3 dark:text-white tracking-tighter uppercase italic leading-[0.9]">Siap Untuk <span className="text-teal">Interview?</span></h2>
                 <p className="text-sm md:text-lg text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                    AI siap mengujimu sebagai: 
                    <br />
                    <span className="text-black dark:text-white font-black uppercase tracking-tight text-xl md:text-2xl mt-4 block italic bg-teal/10 px-4 py-2 rounded-xl border border-teal/20">
                      {state.role}
                    </span>
                 </p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5 mb-12 text-left">
                  <div className="p-5 md:p-7 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-zinc-800 flex items-center gap-5 group hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center text-teal shadow-xl group-hover:scale-110 transition-transform"><Mic size={24} /></div>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-tight text-gray-600 dark:text-gray-300">Kontrol Suara Responsif</p>
                  </div>
                  <div className="p-5 md:p-7 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-zinc-800 flex items-center gap-5 group hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center text-teal shadow-xl group-hover:scale-110 transition-transform"><Volume2 size={24} /></div>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-tight text-gray-600 dark:text-gray-300">Interaksi AI Real-time</p>
                  </div>
               </div>

               <Button 
                onClick={startInterview}
                disabled={isLoading}
                className="w-full md:w-auto h-20 md:h-24 px-12 md:px-20 bg-teal hover:bg-teal-dark text-white rounded-[2rem] md:rounded-[2.5rem] font-black uppercase tracking-widest text-lg md:text-2xl shadow-3xl shadow-teal/30 transition-all hover:scale-105 active:scale-95 group mb-4"
               >
                  {isLoading ? <Loader2 className="animate-spin w-8 h-8" /> : (
                    <>
                      Masuk Ruangan <ArrowRight className="ml-5 w-8 h-8 md:size-10 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
               </Button>
            </Card>
          </motion.div>
        )}

        {/* INTERVIEW STEP */}
        {state.step === "interview" && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto px-2"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <Badge variant="outline" className="px-6 py-2.5 border-teal/20 text-teal font-black uppercase tracking-widest text-[10px] rounded-full bg-teal/5 shadow-sm">
                Pertanyaan ke-{state.questionCount}
              </Badge>
              {state.currentScore !== null && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Skor Terakhir:</span>
                  <Badge className="bg-purple text-white px-5 py-2 font-black rounded-xl text-sm md:text-lg tabular-nums shadow-lg shadow-purple/20">
                    {state.currentScore}/100
                  </Badge>
                </motion.div>
              )}
            </div>

            <Card className="p-6 md:p-14 border-gray-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-[40px] md:rounded-[60px] shadow-3xl relative overflow-hidden ring-1 ring-black/[0.03]">
               <div className="mb-10 md:mb-14">
                  <div className="flex items-start gap-4 md:gap-8 mb-8">
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-teal/10 flex items-center justify-center text-teal shrink-0 shadow-inner rotate-[-2deg]">
                      <MessageSquare size={28} className="md:size-40" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-teal/60">Interviewer AI (HR Manager)</p>
                      <h2 className="text-xl md:text-4xl font-bold leading-tight dark:text-white italic tracking-tight underline decoration-teal/20 decoration-wavy decoration-2 underline-offset-8">
                        &ldquo;{state.currentQuestion}&rdquo;
                      </h2>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => speak(state.currentQuestion || "")}
                    className="text-teal hover:text-teal-dark hover:bg-teal/5 font-black uppercase tracking-widest text-[9px] md:text-[11px] ml-18 md:ml-28 h-10 px-6 rounded-full border border-teal/10"
                  >
                    <Volume2 className="w-3 h-3 md:size-4 mr-2" /> Putar Ulang Suara
                  </Button>
               </div>

               {state.currentFeedback && (
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 md:mb-14 p-6 md:p-10 bg-teal/5 border border-teal/10 rounded-3xl md:rounded-[2.5rem] flex gap-5 md:gap-8 ring-4 ring-teal/[0.02]"
                 >
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-teal text-white flex items-center justify-center shrink-0 shadow-xl shadow-teal/20">
                      <CheckCircle2 size={24} className="md:size-32" />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs font-black text-teal uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Award size={14} /> Analisis Jawaban Terakhir:
                      </p>
                      <p className="text-sm md:text-xl text-gray-600 dark:text-zinc-300 font-bold leading-relaxed">{state.currentFeedback}</p>
                    </div>
                 </motion.div>
               )}

               <div className="space-y-8 md:space-y-12">
                  <div className="relative group">
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Tekan tombol mikrofon atau ketik jawabanmu di sini..."
                      className="w-full h-48 md:h-64 p-8 md:p-12 rounded-[32px] md:rounded-[48px] bg-gray-50/50 dark:bg-zinc-800/50 border-2 border-gray-100 dark:border-zinc-800 focus:border-teal/30 focus:bg-white dark:focus:bg-zinc-800 focus:ring-0 text-lg md:text-2xl font-bold dark:text-zinc-200 no-scrollbar resize-none transition-all shadow-inner leading-relaxed"
                    />
                    <AnimatePresence>
                      {isRecording && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 10 }}
                          className="absolute -top-4 right-8 flex items-center gap-4 bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl shadow-red-600/40 border-4 border-white dark:border-zinc-900"
                        >
                          <div className="flex gap-1">
                            <span className="w-1.5 h-6 bg-white/40 animate-[bounce_0.8s_infinite] rounded-full" />
                            <span className="w-1.5 h-8 bg-white animate-[bounce_1s_infinite] rounded-full" />
                            <span className="w-1.5 h-6 bg-white/40 animate-[bounce_1.2s_infinite] rounded-full" />
                          </div>
                          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] pt-0.5">Listening</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex flex-col md:flex-row gap-5 md:gap-8">
                    <Button
                      onClick={toggleRecording}
                      variant={isRecording ? "destructive" : "outline"}
                      className="flex-1 h-20 md:h-28 rounded-[2rem] md:rounded-[2.5rem] text-lg md:text-2xl font-black uppercase tracking-tight gap-5 transition-all shadow-xl active:scale-95 group border-2"
                    >
                      {isRecording ? (
                        <> <Square className="w-8 h-8 md:size-10 fill-current" /> Selesai Bicara </>
                      ) : (
                        <> <Mic className="w-8 h-8 md:size-10 group-hover:scale-110 transition-transform" /> Jawab Suara </>
                      )}
                    </Button>
                    <Button
                      onClick={submitAnswer}
                      disabled={isLoading || !transcript.trim()}
                      className="flex-1 h-20 md:h-28 bg-teal hover:bg-teal-dark text-white rounded-[2rem] md:rounded-[2.5rem] text-lg md:text-2xl font-black uppercase tracking-tight gap-5 shadow-3xl shadow-teal/30 transition-all hover:scale-[1.02] active:scale-95 disabled:scale-100 disabled:opacity-40"
                    >
                      {isLoading ? (
                        <> <Loader2 className="animate-spin w-8 h-8 md:size-10" /> Analisis... </>
                      ) : (
                        <> Kirim <ChevronRight className="w-8 h-8 md:size-10" /> </>
                      )}
                    </Button>
                  </div>
               </div>
            </Card>
          </motion.div>
        )}

        {/* RESULT STEP */}
        {state.step === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto text-center px-2"
          >
            <Card className="p-8 md:p-20 border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[40px] md:rounded-[80px] shadow-3xl relative overflow-hidden border-2">
               <div className="absolute top-0 left-0 w-full h-4 bg-teal shadow-lg shadow-teal/20" />
               
               <div className="w-24 h-24 md:w-32 md:h-32 bg-teal/10 rounded-[2.5rem] flex items-center justify-center text-teal mx-auto mb-10 shadow-3xl shadow-teal/10 rotate-12">
                  <Award size={64} className="md:size-80" />
               </div>

               <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-teal/60 mb-4">Wawancara Selesai</p>
               <h2 className="text-4xl md:text-7xl font-black mb-6 dark:text-white tracking-tighter uppercase italic leading-[0.8]">Skor <span className="text-teal">Karier</span></h2>
               <p className="text-sm md:text-xl text-gray-500 mb-14 font-bold max-w-sm mx-auto leading-relaxed">
                  Bagus! Kamu telah mensimulasikan diri sebagai <span className="text-black dark:text-white underline decoration-teal/40 decoration-4 underline-offset-2">{state.role}</span>.
               </p>

               <div className="space-y-10 md:space-y-14 mb-16 text-left">
                  <div className="p-8 md:p-14 bg-gray-50/50 dark:bg-zinc-800/30 rounded-[40px] md:rounded-[56px] border border-gray-100 dark:border-zinc-800 shadow-inner ring-1 ring-black/[0.02]">
                    <div className="flex justify-between items-end mb-6">
                       <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-400">Indeks Kesiapan Kerja</span>
                       <span className="text-5xl md:text-8xl font-black text-teal leading-none tracking-tighter tabular-nums">
                        {state.totalScore}<span className="text-xl md:text-3xl text-gray-300 ml-1">/100</span>
                      </span>
                    </div>
                    <div className="h-4 md:h-6 w-full bg-gray-200 dark:bg-zinc-900 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${state.totalScore}%` }}
                        className="h-full bg-teal shadow-xl shadow-teal/50"
                      />
                    </div>
                  </div>

                  <div className="p-8 md:p-12 bg-black dark:bg-zinc-800/80 rounded-[40px] md:rounded-[56px] text-white shadow-2xl shadow-black/20 ring-4 ring-black/5">
                    <h4 className="flex items-center gap-3 font-black text-[10px] md:text-xs uppercase tracking-widest text-teal mb-8">
                      <AlertCircle size={20} /> Kesimpulan HR AI:
                    </h4>
                    <p className="text-lg md:text-3xl text-gray-200 leading-relaxed font-bold italic tracking-tight">
                      &ldquo;{state.currentFeedback}&rdquo;
                    </p>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-5">
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="flex-1 h-20 md:h-24 rounded-3xl font-black gap-4 text-lg md:text-xl uppercase tracking-tight shadow-xl active:scale-95 border-2 group"
                  >
                    <RefreshCcw size={28} className="group-hover:rotate-180 transition-transform duration-500" /> Ulangi Sesi
                  </Button>
                  <Button 
                    asChild
                    className="flex-1 h-20 md:h-24 bg-teal hover:bg-teal-dark text-white rounded-3xl font-black text-lg md:text-xl uppercase tracking-tight shadow-3xl shadow-teal/20 active:scale-95"
                  >
                    <Link href="/dashboard">
                      Selesai & Dashboard <ChevronRight className="ml-3 w-6 h-6 md:size-8" />
                    </Link>
                  </Button>
               </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIXED FLOATING STATUS UI - Mobile Optimized */}
      <div className="fixed bottom-6 md:bottom-12 right-6 md:right-12 pointer-events-none z-50 flex flex-col gap-4">
          <AnimatePresence>
            {isRecording && (
               <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                className="bg-red-600 text-white px-8 py-5 md:px-10 md:py-6 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(220,38,38,0.3)] flex items-center gap-5 border-4 border-white/20 backdrop-blur-2xl ring-1 ring-red-500/50"
               >
                  <div className="relative">
                    <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-white opacity-40 animate-ping absolute inset-0" />
                    <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-white relative z-10" />
                  </div>
                  <span className="font-black uppercase tracking-[0.25em] text-[10px] md:text-sm">Listening</span>
               </motion.div>
            )}
            {isSpeaking && (
               <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                className="bg-teal text-white px-8 py-5 md:px-10 md:py-6 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(29,158,117,0.3)] flex items-center gap-5 border-4 border-white/20 backdrop-blur-2xl ring-1 ring-teal-500/50"
               >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Volume2 size={24} className="md:size-32" />
                  </motion.div>
                  <span className="font-black uppercase tracking-[0.25em] text-[10px] md:text-sm">AI Speaking</span>
               </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}
