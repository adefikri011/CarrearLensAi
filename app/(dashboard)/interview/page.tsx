"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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

  const checkStatus = useCallback(async () => {
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
  }, [toast]);

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
  }, [checkStatus]);

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

  const getIndonesianTimeShift = (): string => {
    const hour = new Date().getHours();
    if (hour >= 3 && hour < 11) return "pagi";
    if (hour >= 11 && hour < 15) return "siang";
    if (hour >= 15 && hour < 18) return "sore";
    return "malam";
  };

  const startInterview = async () => {
    setIsLoading(true);
    try {
      const shift = getIndonesianTimeShift();
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: [], shift }),
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

      const shift = getIndonesianTimeShift();
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          history: state.history, 
          currentAnswer: transcript,
          shift
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
    <div className="min-h-screen py-6 md:py-12 px-4 max-w-6xl mx-auto">
      {/* Header Section - Balanced */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 md:mb-16 text-center"
      >
        <Badge variant="outline" className="mb-4 bg-teal/5 text-teal border-teal/10 px-3 py-1 rounded-full font-bold tracking-wider text-[10px] uppercase">
          Career Performance Lab
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-3">
          Mock <span className="text-teal font-extrabold italic">Interview.</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-lg max-w-xl mx-auto font-medium leading-relaxed">
          Asah kemampuan komunikasimu dengan simulasi wawancara berbasis AI yang dirancang khusus untuk profil profesionalmu.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* LOADING STATE - Elegant minimal loader */}
        {state.step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-teal/10 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-teal rounded-full animate-spin" />
            </div>
          </motion.div>
        )}

        {/* LOCKED STATE - Challenging but clean */}
        {state.step === "locked" && (
          <motion.div
            key="locked"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto"
          >
            <Card className="p-8 md:p-12 border-none bg-white dark:bg-zinc-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] text-center relative overflow-hidden">
               <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center text-zinc-400 mx-auto mb-8">
                  <Lock size={32} />
               </div>
               <h2 className="text-2xl md:text-3xl font-bold mb-3 dark:text-white tracking-tight">Misi Belum Tercapai</h2>
               <p className="text-sm text-zinc-500 mb-10 font-medium px-4">
                  Selesaikan seluruh langkah di Roadmap 90 Hari untuk membuka akses simulasi wawancara ini.
               </p>

               {state.stats && (
                 <div className="mb-10 px-4">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Progress Belajar</span>
                       <span className="text-lg font-black tabular-nums text-teal">{state.stats.percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${state.stats.percentage}%` }}
                         className="h-full bg-teal"
                      />
                    </div>
                 </div>
               )}

               <Button asChild className="h-14 px-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-sm tracking-wide hover:opacity-90 transition-all shadow-xl group">
                  <Link href="/roadmap" className="flex items-center gap-2">
                    Buka Roadmap <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
               </Button>
            </Card>
          </motion.div>
        )}

        {/* READY STATE - Focused and inviting */}
        {state.step === "ready" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="p-8 md:p-16 border-none bg-white dark:bg-zinc-900 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.12)] rounded-[3rem] md:rounded-[4rem] text-center relative overflow-hidden">
               <div className="mb-12">
                 <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center text-teal mx-auto mb-8">
                    <Play size={24} className="ml-1" />
                 </div>
                 <h2 className="text-3xl md:text-5xl font-bold mb-4 dark:text-white tracking-tight">Sudah Siap?</h2>
                 <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-sm mx-auto leading-relaxed italic">
                   Berdasarkan profilmu, AI akan mewawancaraimu sebagai:
                 </p>
                 <div className="mt-6 inline-block px-8 py-3 bg-teal/5 border border-teal/10 rounded-2xl text-teal font-black text-xl md:text-3xl">
                    {state.role}
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-12 text-left max-w-md mx-auto">
                  <div className="flex items-center gap-3 text-zinc-500">
                    <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-teal"><Mic size={14} /></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">Voice Input</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-500">
                    <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-teal"><Volume2 size={14} /></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">AI Voice</span>
                  </div>
               </div>

               <Button 
                onClick={startInterview}
                disabled={isLoading}
                className="w-full md:w-auto h-16 md:h-20 px-12 md:px-20 bg-teal hover:bg-teal-dark text-white rounded-[2rem] font-bold text-lg md:text-xl shadow-2xl shadow-teal/30 transition-all hover:scale-[1.02] active:scale-95 group mb-4"
               >
                  {isLoading ? <Loader2 className="animate-spin size-6" /> : (
                    <span className="flex items-center gap-4">
                      Mulai Simulasi <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </span>
                  )}
               </Button>
            </Card>
          </motion.div>
        )}

        {/* INTERVIEW STATE - Immersive Focus Mode */}
        {state.step === "interview" && (
          <motion.div
            key="interview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto"
          >
            <div className="space-y-8">
              {/* Top Bar Info */}
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-teal animate-pulse" />
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sesi Berlanjut • Q{state.questionCount}</span>
                </div>
                {state.currentScore !== null && (
                  <Badge className="bg-purple text-white px-4 py-1.5 rounded-full font-black text-xs shadow-lg shadow-purple/20">
                    Latest Score: {state.currentScore}
                  </Badge>
                )}
              </div>

              {/* Main Interaction Card */}
              <Card className="p-6 md:p-12 border-none bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.03] overflow-hidden">
                <div className="space-y-10">
                  {/* Interviewer Speech */}
                  <div className="flex gap-4 md:gap-6">
                    <div className="size-10 md:size-12 rounded-xl bg-teal/10 flex items-center justify-center text-teal shrink-0">
                      <MessageSquare size={20} />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-xl md:text-3xl font-bold text-zinc-900 dark:text-white leading-snug tracking-tight">
                        &ldquo;{state.currentQuestion}&rdquo;
                      </h2>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => speak(state.currentQuestion || "")}
                        className="h-9 px-4 rounded-full border border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:text-teal font-bold text-[10px] uppercase tracking-widest"
                      >
                        <Volume2 size={14} className="mr-2" /> Ulangi Pertanyaan
                      </Button>
                    </div>
                  </div>

                  {/* Feedback Overlay if exists */}
                  {state.currentFeedback && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 md:p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex gap-4"
                    >
                      <div className="size-8 rounded-full bg-teal/10 text-teal flex items-center justify-center shrink-0">
                        <Award size={16} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-teal uppercase tracking-widest">HR Feedback</p>
                        <p className="text-xs md:text-md font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed italic">&ldquo;{state.currentFeedback}&rdquo;</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Input Interface */}
                  <div className="space-y-6">
                    <div className="relative">
                      <textarea
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder="Klik mikrofon untuk mulai bicara atau ketik jawabanmu di sini..."
                        className="w-full h-40 md:h-52 p-6 md:p-10 rounded-[2rem] bg-zinc-50/50 dark:bg-zinc-950/30 border-2 border-transparent focus:bg-white dark:focus:bg-zinc-900 focus:border-teal/20 focus:ring-0 text-lg md:text-2xl font-medium dark:text-zinc-200 no-scrollbar resize-none transition-all shadow-inner leading-relaxed"
                      />
                      <AnimatePresence>
                        {isRecording && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute top-4 right-6 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full shadow-xl"
                          >
                            <span className="size-1.5 rounded-full bg-white animate-pulse" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Recording</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={toggleRecording}
                        variant={isRecording ? "destructive" : "outline"}
                        className="flex-1 h-14 md:h-16 rounded-2xl text-md md:text-xl font-bold uppercase tracking-tight gap-3 transition-all shadow-md active:scale-95 border-2 group"
                      >
                        {isRecording ? <Square size={20} className="fill-current" /> : <Mic size={24} className="group-hover:scale-110 transition-transform" />}
                        {isRecording ? "Hentikan" : "Bicara Sekarang"}
                      </Button>
                      <Button
                        onClick={submitAnswer}
                        disabled={isLoading || !transcript.trim()}
                        className="flex-1 h-14 md:h-16 bg-teal hover:bg-teal-dark text-white rounded-2xl text-md md:text-xl font-bold uppercase tracking-tight gap-3 shadow-lg shadow-teal/20 transition-all hover:scale-[1.01] active:scale-95 disabled:scale-100 disabled:opacity-40"
                      >
                        {isLoading ? <Loader2 className="animate-spin size-6" /> : (
                          <span className="flex items-center gap-2">
                            Kirim Jawaban <ChevronRight size={28} />
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* RESULT STATE - Data-rich and sophisticated */}
        {state.step === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto px-4"
          >
            <Card className="p-8 md:p-20 border-none bg-white dark:bg-zinc-900 rounded-[3rem] md:rounded-[5rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.15)] relative overflow-hidden text-center">
               <div className="absolute top-0 left-0 w-full h-3 bg-teal" />
               
               <div className="w-24 h-24 bg-teal/10 rounded-[2rem] flex items-center justify-center text-teal mx-auto mb-10 rotate-12">
                  <Award size={48} />
               </div>

               <p className="text-xs font-bold uppercase tracking-[0.4em] text-teal/60 mb-6">Simulation Complete</p>
               <h2 className="text-4xl md:text-7xl font-bold dark:text-white tracking-tighter mb-8">Performance Report.</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left">
                  <div className="p-10 bg-zinc-50 dark:bg-zinc-800/40 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-inner">
                    <div className="flex flex-col gap-2 mb-6">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Readiness Score</span>
                       <span className="text-7xl md:text-9xl font-black text-teal tracking-tighter tabular-nums">
                        {state.totalScore}<span className="text-2xl md:text-4xl text-zinc-300 ml-2">/100</span>
                      </span>
                    </div>
                    <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${state.totalScore}%` }}
                        className="h-full bg-teal"
                      />
                    </div>
                  </div>

                  <div className="p-10 bg-zinc-900 dark:bg-zinc-800 rounded-[3rem] text-white flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6 text-teal">
                      <AlertCircle size={20} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">HR Final Verdict</span>
                    </div>
                    <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-zinc-300 tracking-tight">
                      &ldquo;{state.currentFeedback}&rdquo;
                    </p>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto">
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="flex-1 h-16 md:h-20 rounded-3xl font-bold gap-3 text-lg uppercase tracking-widest transition-all hover:bg-zinc-50 active:scale-95 border-2"
                  >
                    <RefreshCcw size={20} /> Retake Test
                  </Button>
                  <Button 
                    asChild
                    className="flex-1 h-16 md:h-20 bg-teal hover:bg-teal-dark text-white rounded-3xl font-bold text-lg uppercase tracking-widest shadow-3xl shadow-teal/20 active:scale-95"
                  >
                    <Link href="/dashboard" className="flex items-center gap-3">
                      Dashboard <ChevronRight size={24} />
                    </Link>
                  </Button>
               </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Indicators */}
      <div className="fixed bottom-12 right-12 pointer-events-none z-50 flex flex-col gap-6">
          <AnimatePresence>
            {isRecording && (
               <motion.div
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                className="bg-zinc-900/90 text-white px-10 py-6 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex items-center gap-8 border border-white/10 backdrop-blur-3xl"
               >
                  <div className="relative flex items-center gap-2">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: [12, 36, 12] }} 
                        transition={{ repeat: Infinity, duration: 0.6 + i * 0.1, ease: "easeInOut" }} 
                        className="w-2 bg-teal rounded-full" 
                      />
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black uppercase tracking-[0.3em] text-[10px] text-teal">Interacting</span>
                    <span className="text-xs font-bold text-zinc-400">Listening to you...</span>
                  </div>
               </motion.div>
            )}
            {isSpeaking && (
               <motion.div
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                className="bg-teal text-white px-10 py-6 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(29,158,117,0.4)] flex items-center gap-8 border border-white/20 backdrop-blur-3xl"
               >
                  <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Volume2 size={32} className="animate-pulse" strokeWidth={3} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black uppercase tracking-[0.3em] text-[10px] text-white/60">Audio Output</span>
                    <span className="text-xs font-black">AI is Speaking</span>
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}
