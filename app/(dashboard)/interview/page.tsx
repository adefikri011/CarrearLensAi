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
    <div className="min-h-[calc(100vh-10rem)] py-8">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-black dark:text-white tracking-tighter uppercase italic mb-2 leading-none">
          AI Mock <span className="text-teal">Interview</span>
        </h1>
        <p className="text-gray-500 dark:text-zinc-500 font-medium">Uji kesiapan kerjamu dengan simulasi wawancara berbasis AI.</p>
      </div>

      <AnimatePresence mode="wait">
        {/* LOADING STATE */}
        {state.step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Loader2 className="w-12 h-12 text-teal animate-spin mb-4" />
            <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Mengecek Kelayakan...</p>
          </motion.div>
        )}

        {/* LOCKED STATE */}
        {state.step === "locked" && (
          <motion.div
            key="locked"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-10 md:p-16 border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 border-2 rounded-[50px] text-center shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 dark:bg-zinc-800" />
               <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-8">
                  <Lock size={48} />
               </div>
               <h2 className="text-3xl md:text-4xl font-black mb-4 dark:text-white tracking-tighter uppercase italic">Misi Belum Selesai</h2>
               <p className="text-gray-500 mb-10 font-bold uppercase text-xs tracking-widest leading-relaxed">
                  Fitur simulasi wawancara ini hanya terbuka setelah Anda menyelesaikan seluruh <span className="text-teal">Roadmap 90 Hari</span>.
               </p>

               {state.stats && (
                 <div className="mb-12 bg-gray-50 dark:bg-zinc-800/50 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800">
                    <div className="flex justify-between items-end mb-3">
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Progres Roadmap</span>
                       <span className="text-2xl font-black text-black dark:text-white leading-none">{state.stats.percentage}%</span>
                    </div>
                    <Progress value={state.stats.percentage} className="h-3 bg-gray-200 dark:bg-zinc-800" />
                    <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       {state.stats.completed} dari {state.stats.total} misi telah dikuasai
                    </p>
                 </div>
               )}

               <Button asChild className="h-16 px-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-teal dark:hover:bg-teal dark:hover:text-white transition-all shadow-xl shadow-black/10">
                  <Link href="/roadmap">
                    Lanjutkan Roadmap <ArrowRight className="ml-3 w-4 h-4" />
                  </Link>
               </Button>
            </Card>
          </motion.div>
        )}

        {/* READY STATE */}
        {state.step === "ready" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="p-10 md:p-16 border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 border-2 border-teal/20 rounded-[50px] text-center shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-teal" />
               <div className="w-24 h-24 bg-teal/10 rounded-full flex items-center justify-center text-teal mx-auto mb-8">
                  <Play size={40} className="ml-2" />
               </div>
               <div className="mb-10 space-y-2">
                 <Badge className="bg-teal/10 text-teal border-none mb-4 font-black uppercase tracking-widest text-[10px]">Roadmap Selesai!</Badge>
                 <h2 className="text-3xl md:text-5xl font-black mb-2 dark:text-white tracking-tighter uppercase italic leading-none">Siap Untuk <span className="text-teal">Interview?</span></h2>
                 <p className="text-gray-500 font-medium max-w-md mx-auto">
                    AI kami telah menganalisis CV dan progres belajarmu. Kamu akan diwawancarai untuk posisi: 
                    <br />
                    <span className="text-black dark:text-white font-black uppercase tracking-tight text-lg mt-2 inline-block italic underline decoration-teal decoration-4">
                      {state.role}
                    </span>
                 </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
                  <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-teal shadow-sm"><Mic size={20} /></div>
                    <p className="text-[10px] font-black uppercase tracking-wider leading-tight">Kontrol Suara Penuh</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-teal shadow-sm"><Volume2 size={20} /></div>
                    <p className="text-[10px] font-black uppercase tracking-wider leading-tight">AI Voice Interaction</p>
                  </div>
               </div>

               <Button 
                onClick={startInterview}
                disabled={isLoading}
                className="h-20 px-16 bg-teal hover:bg-teal-dark text-white rounded-3xl font-black uppercase tracking-widest text-lg shadow-2xl shadow-teal/20 transition-all hover:scale-105 active:scale-95 group"
               >
                  {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                    <>
                      Mulai Sekarang <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-1 transition-transform" />
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
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <Badge variant="outline" className="px-4 py-2 border-teal text-teal font-bold rounded-full bg-teal/5">
                Pertanyaan {state.questionCount}
              </Badge>
              {state.currentScore !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black uppercase tracking-widest text-gray-400">Skor Terakhir:</span>
                  <Badge className="bg-purple text-white px-3 py-1 font-black rounded-lg">{state.currentScore}/100</Badge>
                </div>
              )}
            </div>

            <Card className="p-8 md:p-12 border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 rounded-[40px] shadow-2xl shadow-black/5 relative overflow-hidden transition-all">
               <div className="mb-12">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center text-teal shrink-0 shadow-inner">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal mb-2">Interviewer AI</p>
                      <h2 className="text-2xl md:text-4xl font-bold leading-tight dark:text-white italic tracking-tight underline decoration-teal/20 decoration-8 underline-offset-4">
                        &ldquo;{state.currentQuestion}&rdquo;
                      </h2>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => speak(state.currentQuestion || "")}
                    className="text-teal hover:text-teal-dark hover:bg-teal/10 font-black uppercase tracking-widest text-[10px] ml-16"
                  >
                    <Volume2 className="w-4 h-4 mr-2" /> Ulangi Suara
                  </Button>
               </div>

               {state.currentFeedback && (
                 <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-10 p-5 bg-teal/5 border border-teal/10 rounded-3xl flex gap-4"
                 >
                    <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-teal uppercase tracking-widest mb-1">Feedback Analisis:</p>
                      <p className="text-base text-gray-600 dark:text-zinc-400 font-bold leading-relaxed">{state.currentFeedback}</p>
                    </div>
                 </motion.div>
               )}

               <div className="space-y-8">
                  <div className="relative group">
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Gunakan suara atau ketik jawabanmu di sini..."
                      className="w-full h-48 p-8 rounded-[40px] bg-gray-50 dark:bg-zinc-800 border-2 border-transparent focus:border-teal/30 focus:ring-0 text-xl font-bold dark:text-zinc-200 no-scrollbar resize-none transition-all shadow-inner"
                    />
                    <AnimatePresence>
                      {isRecording && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute top-6 right-8 flex items-center gap-3 bg-red-500 text-white px-4 py-2 rounded-full shadow-xl"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Listening</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                    <Button
                      onClick={toggleRecording}
                      variant={isRecording ? "destructive" : "outline"}
                      className="flex-1 h-20 rounded-3xl text-xl font-black uppercase tracking-tight gap-4 transition-all shadow-lg active:scale-95"
                    >
                      {isRecording ? (
                        <> <Square className="w-6 h-6 fill-current" /> Selesai Bicara </>
                      ) : (
                        <> <Mic className="w-7 h-7" /> Bicara Sekarang </>
                      )}
                    </Button>
                    <Button
                      onClick={submitAnswer}
                      disabled={isLoading || !transcript.trim()}
                      className="flex-1 h-20 bg-teal hover:bg-teal-dark text-white rounded-3xl text-xl font-black uppercase tracking-tight gap-4 shadow-2xl shadow-teal/30 transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <> <Loader2 className="animate-spin w-7 h-7" /> Memproses... </>
                      ) : (
                        <> Kirim <ChevronRight className="w-7 h-7" /> </>
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
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="p-10 md:p-16 border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[60px] shadow-2xl relative overflow-hidden border-2 border-teal/10">
               <div className="absolute top-0 left-0 w-full h-3 bg-teal" />
               
               <div className="w-24 h-24 bg-teal/10 rounded-full flex items-center justify-center text-teal mx-auto mb-8 shadow-xl shadow-teal/10">
                  <Award size={48} />
               </div>

               <p className="text-[11px] font-black uppercase tracking-[0.3em] text-teal mb-4">Misi Telah Dituntaskan</p>
               <h2 className="text-4xl md:text-6xl font-black mb-4 dark:text-white tracking-tighter uppercase italic leading-none">Laporan <span className="text-teal">Karier</span></h2>
               <p className="text-gray-500 mb-12 font-bold max-w-md mx-auto leading-relaxed">Hasil simulasi untuk posisi <span className="text-black dark:text-white underline decoration-teal/30 decoration-4">{state.role}</span> telah siap dianalisis.</p>

               <div className="space-y-10 mb-14 text-left">
                  <div className="p-8 bg-gray-50 dark:bg-zinc-800 rounded-[40px] border border-gray-100 dark:border-zinc-800 shadow-inner">
                    <div className="flex justify-between items-end mb-4">
                       <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Skor Kompetensi</span>
                       <span className="text-6xl font-black text-teal leading-none tracking-tighter">{state.totalScore}<span className="text-xl text-gray-400">/100</span></span>
                    </div>
                    <Progress value={state.totalScore} className="h-4 rounded-full bg-gray-200 dark:bg-zinc-900" />
                  </div>

                  <div className="p-8 bg-black dark:bg-white/5 rounded-[40px] text-white">
                    <h4 className="flex items-center gap-3 font-black text-[11px] uppercase tracking-widest text-teal mb-6">
                      <AlertCircle size={18} /> Rangkuman HR AI:
                    </h4>
                    <p className="text-lg text-gray-300 leading-relaxed font-bold italic">
                      &ldquo;{state.currentFeedback}&rdquo;
                    </p>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 px-4">
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="flex-1 h-16 rounded-2xl font-black gap-3 text-lg uppercase tracking-tight shadow-lg"
                  >
                    <RefreshCcw size={24} /> Ulangi Sesi
                  </Button>
                  <Button 
                    asChild
                    className="flex-1 h-16 bg-teal hover:bg-teal-dark text-white rounded-2xl font-black text-lg uppercase tracking-tight shadow-xl shadow-teal/20"
                  >
                    <Link href="/dashboard">
                      Ke Dashboard <ChevronRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
               </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Status UI */}
      <div className="fixed bottom-10 right-10 pointer-events-none z-50 flex flex-col gap-3">
          <AnimatePresence>
            {isRecording && (
               <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                className="bg-red-600 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-5 border-4 border-white/20 backdrop-blur-xl"
               >
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-white opacity-40 animate-ping absolute inset-0" />
                    <div className="w-5 h-5 rounded-full bg-white relative z-10" />
                  </div>
                  <span className="font-black uppercase tracking-[0.2em] text-sm">Sedang Mendengar...</span>
               </motion.div>
            )}
            {isSpeaking && (
               <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                className="bg-teal text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-5 border-4 border-white/20 backdrop-blur-xl"
               >
                  <Volume2 className="animate-bounce" size={24} />
                  <span className="font-black uppercase tracking-[0.2em] text-sm">AI Sedang Berbicara...</span>
               </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}
