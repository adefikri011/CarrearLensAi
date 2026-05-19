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
    <div className="min-h-screen py-8 md:py-20 px-6 max-w-7xl mx-auto selection:bg-teal/10">
      {/* Header Section - Modern Display Typography */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 md:mb-24 text-center space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-teal/10 text-teal font-extrabold text-[10px] uppercase tracking-[0.2em]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal"></span>
          </span>
          AI Simulation Lab
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-zinc-900 dark:text-white tracking-tighter leading-[0.85]">
          Master Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-teal via-teal to-purple">Interview.</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed px-4">
          Latih kemampuan berkomunikasi dan bangun rasa percaya diri melalui simulasi wawancara adaptif yang dirancang oleh para ahli HR.
        </p>
      </motion.div>

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
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-8 border-teal/5 rounded-full" />
              <div className="absolute inset-0 border-8 border-t-teal rounded-full animate-spin shadow-[0_0_20px_rgba(29,158,117,0.3)]" />
            </div>
          </motion.div>
        )}

        {/* LOCKED STATE */}
        {state.step === "locked" && (
          <motion.div
            key="locked"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-10 md:p-16 border-none glass shadow-2xl rounded-[3.5rem] text-center relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 opacity-20" />
               <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-[2rem] flex items-center justify-center text-zinc-400 mx-auto mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Lock size={40} strokeWidth={1.5} />
               </div>
               <h2 className="text-3xl md:text-5xl font-black mb-4 dark:text-white tracking-tighter">Akses Terkunci.</h2>
               <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-12 text-sm md:text-base leading-relaxed px-8">
                  Misi belum tuntas! Selesaikan seluruh tahapan <span className="text-zinc-900 dark:text-white font-bold">Roadmap 90 Hari</span> untuk mengaktifkan modul simulasi wawancara ini.
               </p>

               {state.stats && (
                 <div className="mb-12 px-8">
                    <div className="flex justify-between items-end mb-4">
                       <div className="text-left">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Misi Selesai</p>
                          <p className="text-3xl font-black tabular-nums text-teal">{state.stats.completed}/{state.stats.total}</p>
                       </div>
                       <span className="text-lg font-black tabular-nums text-teal">{state.stats.percentage}%</span>
                    </div>
                    <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-full overflow-hidden p-1">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${state.stats.percentage}%` }}
                        className="h-full bg-gradient-to-r from-teal to-teal-dark rounded-full shadow-[0_0_10px_rgba(29,158,117,0.4)]"
                      />
                    </div>
                 </div>
               )}

               <Button asChild className="h-20 px-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[2rem] font-black text-lg tracking-tight hover:scale-[1.03] transition-all shadow-2xl group active:scale-95">
                  <Link href="/roadmap" className="flex items-center gap-3">
                    Lanjutkan Roadmap <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
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
            className="max-w-4xl mx-auto"
          >
            <Card className="p-12 md:p-24 border-none glass shadow-[0_80px_120px_-40px_rgba(0,0,0,0.15)] rounded-[4rem] text-center relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal/10 rounded-full blur-3xl" />
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple/10 rounded-full blur-3xl" />
               
               <div className="mb-16">
                 <div className="w-20 h-20 bg-teal/10 rounded-[2rem] flex items-center justify-center text-teal mx-auto mb-10 shadow-inner">
                    <Play size={32} className="ml-1 fill-current" />
                 </div>
                 <h2 className="text-4xl md:text-7xl font-black mb-6 dark:text-white tracking-tighter leading-tight">Siap Untuk <br />Wawancara?</h2>
                 <p className="text-zinc-400 dark:text-zinc-500 font-bold max-w-sm mx-auto leading-relaxed text-sm uppercase tracking-widest mb-4">
                   Posisi Target Anda:
                 </p>
                 <div className="inline-block px-10 py-5 glass border-teal/10 rounded-[2rem] text-teal font-black text-2xl md:text-4xl shadow-xl">
                    {state.role}
                 </div>
               </div>

               <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16 text-left">
                  <div className="flex items-center gap-4 group">
                    <div className="size-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-teal group-hover:scale-110 transition-transform shadow-sm"><Mic size={20} strokeWidth={2.5} /></div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Interaction</span>
                       <span className="text-sm font-bold dark:text-white">Voice & Text</span>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-zinc-100 dark:bg-zinc-800 hidden md:block" />
                  <div className="flex items-center gap-4 group">
                    <div className="size-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-teal group-hover:scale-110 transition-transform shadow-sm"><Volume2 size={20} strokeWidth={2.5} /></div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Audio Response</span>
                       <span className="text-sm font-bold dark:text-white">Natural Speech AI</span>
                    </div>
                  </div>
               </div>

               <Button 
                onClick={startInterview}
                disabled={isLoading}
                className="w-full md:w-auto h-24 px-16 bg-teal hover:bg-teal-dark text-white rounded-[2.5rem] font-black text-2xl shadow-[0_32px_64px_-16px_rgba(29,158,117,0.4)] transition-all hover:scale-[1.05] active:scale-95 group"
               >
                  {isLoading ? <Loader2 className="animate-spin size-8" /> : (
                    <span className="flex items-center gap-4">
                      Mulai Sekarang <ArrowRight size={32} strokeWidth={3} className="group-hover:translate-x-3 transition-transform" />
                    </span>
                  )}
               </Button>
            </Card>
          </motion.div>
        )}

        {/* INTERVIEW STATE */}
        {state.step === "interview" && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto px-4 md:px-0"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Progress Sidebar - Desktop Only */}
              <div className="hidden lg:block lg:col-span-3 space-y-6">
                <Card className="p-8 border-none glass rounded-[2.5rem] space-y-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Pertanyaan Ke</p>
                    <p className="text-5xl font-black text-teal tabular-nums">{state.questionCount}</p>
                  </div>
                  {state.currentScore !== null && (
                    <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Skor Terakhir</p>
                      <div className="flex items-center gap-3">
                         <div className="size-12 rounded-2xl bg-purple/10 text-purple flex items-center justify-center font-black text-xl">
                            {state.currentScore}
                         </div>
                         <Progress value={state.currentScore} className="h-2 flex-1" />
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Main Interaction Area */}
              <div className="lg:col-span-9 space-y-8">
                <Card className="p-10 md:p-20 border-none glass rounded-[3.5rem] md:rounded-[5rem] shadow-2xl relative overflow-hidden">
                  <div className="space-y-16">
                    {/* Interviewer Question */}
                    <div className="space-y-10 group">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-teal flex items-center justify-center text-white font-black text-xs">AI</div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-teal">Senior HR Manager</span>
                      </div>
                      <h2 className="text-3xl md:text-6xl font-black text-zinc-900 dark:text-white leading-[1.1] tracking-tighter transition-modern group-hover:translate-x-2">
                        &ldquo;{state.currentQuestion}&rdquo;
                      </h2>
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => speak(state.currentQuestion || "")}
                          className="h-12 px-8 rounded-2xl glass border-zinc-100 dark:border-white/5 text-zinc-500 hover:text-teal font-black text-[11px] uppercase tracking-widest shadow-sm active:scale-95"
                        >
                          <Volume2 size={16} className="mr-2" /> Play Audio
                        </Button>
                      </div>
                    </div>

                    {/* Feedback Pill if exists */}
                    {state.currentFeedback && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 bg-zinc-50 dark:bg-zinc-800/80 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 flex gap-6 items-start"
                      >
                        <div className="size-12 rounded-2xl bg-teal text-white flex items-center justify-center shrink-0 shadow-lg shadow-teal/20">
                          <Award size={20} strokeWidth={3} />
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-teal uppercase tracking-[0.2em] mb-1">Expert Insight</p>
                          <p className="text-lg md:text-xl font-bold text-zinc-700 dark:text-zinc-200 leading-relaxed italic">&ldquo;{state.currentFeedback}&rdquo;</p>
                        </div>
                      </motion.div>
                    )}

                    {/* Input Container */}
                    <div className="space-y-10">
                      <div className="relative group">
                        <textarea
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                          placeholder="Mulai bicara atau ketik jawabanmu di sini..."
                          className="w-full h-56 md:h-80 p-10 md:p-16 rounded-[3rem] bg-zinc-50/50 dark:bg-zinc-950/50 border-4 border-transparent focus:bg-white dark:focus:bg-zinc-900 focus:border-teal/20 focus:ring-0 text-xl md:text-4xl font-bold dark:text-zinc-100 no-scrollbar resize-none transition-all shadow-inner leading-relaxed"
                        />
                        <AnimatePresence>
                          {isRecording && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="absolute top-8 right-10 flex items-center gap-4 bg-red-600 text-white px-6 py-3 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                            >
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                              </span>
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Recording</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="flex flex-col xl:flex-row gap-6">
                        <Button
                          onClick={toggleRecording}
                          variant={isRecording ? "destructive" : "outline"}
                          className="flex-1 h-24 md:h-28 rounded-[2.5rem] text-xl md:text-3xl font-black uppercase tracking-tighter gap-6 transition-all shadow-xl active:scale-95 border-4 group"
                        >
                          {isRecording ? <Square size={32} className="fill-current" /> : <Mic size={36} strokeWidth={3} className="group-hover:scale-110 transition-transform" />}
                          {isRecording ? "Stop Recording" : "Voice Input"}
                        </Button>
                        <Button
                          onClick={submitAnswer}
                          disabled={isLoading || !transcript.trim()}
                          className="flex-1 h-24 md:h-28 bg-teal hover:bg-teal-dark text-white rounded-[2.5rem] text-xl md:text-3xl font-black uppercase tracking-tighter gap-6 shadow-[0_32px_64px_-16px_rgba(29,158,117,0.4)] transition-all hover:scale-[1.02] active:scale-95 disabled:scale-100 disabled:opacity-30 group"
                        >
                          {isLoading ? <Loader2 className="animate-spin size-12" /> : (
                            <span className="flex items-center gap-4">
                              Send Answer <ChevronRight size={44} strokeWidth={3} className="group-hover:translate-x-3 transition-transform" />
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {/* RESULT STATE */}
        {state.step === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto"
          >
            <Card className="p-12 md:p-24 border-none glass shadow-[0_100px_150px_-50px_rgba(0,0,0,0.2)] rounded-[4rem] md:rounded-[6rem] relative overflow-hidden text-center">
               <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-teal via-purple to-teal" />
               
               <motion.div 
                 initial={{ rotate: 0 }}
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute -top-20 -right-20 w-80 h-80 bg-teal/5 rounded-full border border-teal/10 pointer-events-none" 
               />

               <div className="w-32 h-32 bg-teal rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-12 shadow-2xl shadow-teal/40 -rotate-12 hover:rotate-0 transition-transform duration-500">
                  <Award size={64} strokeWidth={2.5} />
               </div>

               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-teal mb-8">Performance Scorecard</p>
               <h2 className="text-5xl md:text-9xl font-black dark:text-white tracking-[ -0.05em] mb-12 leading-[0.9]">Session <br />Report.</h2>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20 text-left">
                  <div className="p-12 bg-white dark:bg-zinc-950/80 rounded-[4rem] border border-zinc-100 dark:border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col gap-2 mb-10 relative z-10">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Final Readiness Index</span>
                       <span className="text-8xl md:text-[10rem] font-black text-teal tracking-tighter tabular-nums leading-none">
                        {state.totalScore}<span className="text-3xl md:text-5xl text-zinc-300 ml-2 font-black">/100</span>
                      </span>
                    </div>
                    <div className="h-6 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-1.5 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${state.totalScore}%` }}
                        className="h-full bg-gradient-to-r from-teal to-teal-dark rounded-full shadow-[0_0_20px_rgba(29,158,117,0.4)]"
                      />
                    </div>
                  </div>

                  <div className="p-12 bg-zinc-900 dark:bg-zinc-800/80 rounded-[4rem] text-white flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                       <MessageSquare size={120} />
                    </div>
                    <div className="flex items-center gap-4 mb-8 text-teal">
                      <div className="size-3 rounded-full bg-teal animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">HR Executive Summary</span>
                    </div>
                    <p className="text-2xl md:text-4xl font-bold leading-[1.2] italic text-zinc-200 tracking-tight relative z-10">
                      &ldquo;{state.currentFeedback}&rdquo;
                    </p>
                  </div>
               </div>

               <div className="flex flex-col md:flex-row gap-6 max-w-2xl mx-auto">
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="flex-1 h-20 md:h-24 rounded-[2rem] font-black gap-4 text-xl uppercase tracking-tighter transition-all hover:bg-zinc-50 active:scale-95 border-4"
                  >
                    <RefreshCcw size={24} strokeWidth={3} /> Retake Test
                  </Button>
                  <Button 
                    asChild
                    className="flex-1 h-20 md:h-24 bg-teal hover:bg-teal-dark text-white rounded-[2.5rem] font-black text-xl uppercase tracking-tighter shadow-3xl shadow-teal/30 active:scale-95"
                  >
                    <Link href="/dashboard" className="flex items-center gap-4">
                      Dashboard <ChevronRight size={32} strokeWidth={3} />
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
