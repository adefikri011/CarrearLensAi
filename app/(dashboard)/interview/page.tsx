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
  Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Roles suitable for SMK students
const ROLES = [
  { id: "it_programmer", title: "Web Developer (Laravel/React)", icon: "💻" },
  { id: "admin_perkantoran", title: "Administrasi Perkantoran", icon: "📄" },
  { id: "teknisi_mesin", title: "Teknisi Mesin/Otomotif", icon: "⚙️" },
  { id: "akuntansi", title: "Staff Akuntansi", icon: "📊" },
  { id: "perhotelan", title: "Staff Perhotelan/Front Office", icon: "🏨" },
  { id: "jasa_boga", title: "Chef / Kitchen Staff", icon: "🍳" },
];

interface InterviewState {
  step: "setup" | "interview" | "result";
  role: string | null;
  history: any[];
  currentQuestion: string | null;
  currentFeedback: string | null;
  currentScore: number | null;
  isFinished: boolean;
  totalScore: number;
  questionCount: number;
}

export default function InterviewPage() {
  const { toast } = useToast();
  const [state, setState] = useState<InterviewState>({
    step: "setup",
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

  const startInterview = async (role: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, history: [] }),
      });
      const result = await res.json();
      
      if (result.success) {
        setState({
          ...state,
          step: "interview",
          role,
          currentQuestion: result.data.question,
          questionCount: 1,
        });
        speak(result.data.question);
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
          role: state.role, 
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
        <h1 className="text-3xl md:text-5xl font-black text-black dark:text-white tracking-tighter uppercase italic mb-2">
          AI Mock <span className="text-teal">Interview</span>
        </h1>
        <p className="text-gray-500 dark:text-zinc-500 font-medium">Latih kemampuan bicaramu dan dapatkan feedback langsung dari HR AI.</p>
      </div>

      <AnimatePresence mode="wait">
        {/* SETUP STEP */}
        {state.step === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {ROLES.map((role) => (
              <Card 
                key={role.id}
                className="p-6 cursor-pointer hover:border-teal transition-all group border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-2xl"
                onClick={() => startInterview(role.title)}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{role.icon}</div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">{role.title}</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-500 mb-6">Mulai simulasi wawancara untuk posisi ini dengan pertanyaan yang relevan.</p>
                <Button className="w-full bg-teal hover:bg-teal-dark text-white font-bold rounded-xl h-12">
                  Pilih Posisi <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            ))}
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
              <Badge variant="outline" className="px-4 py-2 border-teal text-teal font-bold rounded-full">
                Pertanyaan {state.questionCount}
              </Badge>
              {state.currentScore !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-500">Skor Terakhir:</span>
                  <Badge className="bg-purple text-white px-3 py-1 font-black">{state.currentScore}/100</Badge>
                </div>
              )}
            </div>

            <Card className="p-8 md:p-12 border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 rounded-[40px] shadow-2xl shadow-black/5 relative overflow-hidden">
               {/* Question Section */}
               <div className="mb-12">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center text-teal shrink-0">
                      <MessageSquare size={20} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold leading-tight dark:text-white italic">
                      &ldquo;{state.currentQuestion}&rdquo;
                    </h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => speak(state.currentQuestion || "")}
                    className="text-teal hover:text-teal-dark hover:bg-teal/10 font-bold ml-14"
                  >
                    <Volume2 className="w-4 h-4 mr-2" /> Dengarkan Lagi
                  </Button>
               </div>

               {/* Feedback Section (Previous Answer) */}
               {state.currentFeedback && (
                 <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-8 p-4 bg-teal/5 border border-teal/10 rounded-2xl flex gap-3"
                 >
                    <CheckCircle2 className="text-teal w-5 h-5 shrink-0 mt-1" />
                    <div>
                      <p className="text-[13px] font-bold text-teal uppercase tracking-wider mb-1">HR Feedback:</p>
                      <p className="text-sm text-gray-600 dark:text-zinc-400 font-medium">{state.currentFeedback}</p>
                    </div>
                 </motion.div>
               )}

               {/* Interaction Section */}
               <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Gunakan suara atau ketik jawabanmu di sini..."
                      className="w-full h-40 p-6 rounded-3xl bg-gray-50 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-teal text-lg font-medium dark:text-zinc-200 no-scrollbar resize-none transition-all"
                    />
                    {isRecording && (
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="text-[10px] font-bold text-red-500 uppercase">Recording...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={toggleRecording}
                      variant={isRecording ? "destructive" : "outline"}
                      className="flex-1 h-16 rounded-2xl text-lg font-black uppercase tracking-tight gap-3 transition-all"
                    >
                      {isRecording ? (
                        <> <Square className="w-6 h-6 fill-current" /> Berhenti Voice </>
                      ) : (
                        <> <Mic className="w-6 h-6" /> Jawab dengan Suara </>
                      )}
                    </Button>
                    <Button
                      onClick={submitAnswer}
                      disabled={isLoading || !transcript.trim()}
                      className="flex-1 h-16 bg-teal hover:bg-teal-dark text-white rounded-2xl text-lg font-black uppercase tracking-tight gap-3 shadow-xl shadow-teal/20 transition-all"
                    >
                      {isLoading ? (
                        <> <Loader2 className="animate-spin w-6 h-6" /> Memproses... </>
                      ) : (
                        <> Kirim Jawaban <ChevronRight className="w-6 h-6" /> </>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="p-10 md:p-16 border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[50px] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-teal" />
               
               <div className="w-24 h-24 bg-teal/10 rounded-full flex items-center justify-center text-teal mx-auto mb-8">
                  <Award size={48} />
               </div>

               <h2 className="text-4xl md:text-5xl font-black mb-4 dark:text-white tracking-tighter uppercase italic">Wawancara Selesai!</h2>
               <p className="text-gray-500 mb-10 font-medium">Bagus sekali! Kamu telah menyelesaikan simulasi wawancara untuk posisi <span className="text-teal font-bold">{state.role}</span>.</p>

               <div className="space-y-8 mb-12">
                  <div>
                    <div className="flex justify-between items-end mb-3 px-2">
                       <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Skor Keseluruhan</span>
                       <span className="text-4xl font-black text-teal">{state.totalScore}<span className="text-lg text-gray-400">/100</span></span>
                    </div>
                    <Progress value={state.totalScore} className="h-4 rounded-full bg-gray-100 dark:bg-zinc-800" />
                  </div>

                  <div className="text-left p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-3xl border border-gray-100 dark:border-zinc-800">
                    <h4 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-[#1D9E75] mb-4">
                      <AlertCircle size={14} /> Kesimpulan Akhir:
                    </h4>
                    <p className="text-gray-600 dark:text-zinc-300 leading-relaxed font-medium">
                      {state.currentFeedback}
                    </p>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="flex-1 h-14 rounded-xl font-bold gap-2 text-lg uppercase"
                  >
                    <RefreshCcw size={20} /> Coba Lagi
                  </Button>
                  <Button 
                    asChild
                    className="flex-1 h-14 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black text-lg uppercase tracking-tight shadow-xl"
                  >
                    <a href="/dashboard">
                      Selesai
                    </a>
                  </Button>
               </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mic Status Toast Support */}
      <div className="fixed bottom-10 right-10 pointer-events-none z-50">
          <AnimatePresence>
            {isRecording && (
               <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
               >
                  <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                  <span className="font-black uppercase tracking-widest text-sm">Sedang Mendengar...</span>
               </motion.div>
            )}
            {isSpeaking && (
               <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-teal text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
               >
                  <Volume2 className="animate-bounce" size={20} />
                  <span className="font-black uppercase tracking-widest text-sm">AI Sedang Berbicara...</span>
               </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}
