"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BrainCircuit, 
  Send, 
  X, 
  MessageSquare, 
  Sparkles, 
  Trash2, 
  ChevronDown,
  Loader2,
  Cpu,
  Bookmark,
  Check,
  User,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  createdAt: string;
}

const QUICK_STARTERS = [
  {
    icon: "📝",
    text: "Gimana cara optimasi CV biar keterima magang?",
    label: "Optimasi CV"
  },
  {
    icon: "🎯",
    text: "Apa rekomendasi sertifikasi untuk Backend Developer?",
    label: "Sertifikasi Backend"
  },
  {
    icon: "💼",
    text: "Tolong simulasikan pertanyaan interview untuk posisi UI/UX!",
    label: "Simulasi Interview"
  }
];

export default function CareerCoPilotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Lock / Unlock page body scroll when chat slider is open (essential for mobile scroll ergonomics)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle Escape keypress to close the chat natively
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Fetch chat history on load
  useEffect(() => {
    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, isLoading]);

  const fetchChatHistory = async () => {
    try {
      const res = await fetch("/api/chat");
      const json = await res.json();
      if (json.success) {
        setMessages(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading || isStreaming) return;

    // Construct local user message
    const tempUserId = Math.random().toString();
    const newUserMessage: ChatMessage = {
      id: tempUserId,
      role: "user",
      text: textToSend.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputVal("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: textToSend.trim() }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const fullResponseText = json.data.text;
        
        // Start streaming effect inside UI for model response
        setIsLoading(false);
        setIsStreaming(true);
        let currentIndex = 0;
        const words = fullResponseText.split(" ");
        setStreamingText("");

        const streamInterval = setInterval(() => {
          if (currentIndex < words.length) {
            setStreamingText((prev) => prev + (prev ? " " : "") + words[currentIndex]);
            currentIndex++;
          } else {
            clearInterval(streamInterval);
            setIsStreaming(false);
            setStreamingText("");
            // Append final assistant message to chat list
            setMessages((prev) => [
              ...prev,
              {
                id: json.data.id || Math.random().toString(),
                role: "assistant",
                text: fullResponseText,
                createdAt: json.data.createdAt || new Date().toISOString(),
              },
            ]);
          }
        }, 45); // Adjust word streaming rate
      } else {
        throw new Error(json.error || "Gagal mendapatkan respon AI");
      }
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      setIsStreaming(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          text: `⚠️ Maaf, terjadi kesalahan: ${err.message || "Gagal menghubungkan ke AI Mentor. Silakan coba sesaat lagi."}`,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleClearChat = async () => {
    if (isClearing) return;
    setIsClearing(true);
    try {
      const res = await fetch("/api/chat", { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to clear chat:", err);
    } finally {
      setIsClearing(false);
    }
  };

  // Beautiful interactive ReactMarkdown formatter with custom components
  const formatMessageText = (text: string) => {
    if (!text) return null;
    return (
      <div className="space-y-1.5 text-sm sm:text-[14px] leading-relaxed select-text dark:text-zinc-200">
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="mb-2 last:mb-0 leading-relaxed text-[13px] sm:text-[14px] text-zinc-800 dark:text-zinc-200 font-medium whitespace-pre-line">
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong className="font-extrabold text-[#1D9E75] dark:text-emerald-400">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-zinc-700 dark:text-zinc-300 font-semibold bg-zinc-100/50 dark:bg-zinc-800/50 px-1 py-0.5 rounded leading-none">
                {children}
              </em>
            ),
            ul: ({ children }) => (
              <ul className="my-2 space-y-1 list-none pl-0">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="my-2 space-y-1 list-decimal pl-5 text-zinc-800 dark:text-zinc-200">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="relative pl-5 py-0.5 text-zinc-700 dark:text-zinc-300 font-semibold text-[13px] sm:text-[14px] leading-relaxed flex items-start">
                <span className="absolute left-1.5 top-2.5 w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-[#1D9E75] to-[#534AB7] shrink-0" />
                <span className="flex-1">{children}</span>
              </li>
            ),
            h1: ({ children }) => (
              <h1 className="font-black text-sm uppercase tracking-wide text-zinc-800 dark:text-zinc-100 mt-4 mb-2 font-mono flex items-center gap-1.5 border-b border-zinc-150 dark:border-zinc-800 pb-1">
                <span className="w-1.5 h-3 bg-gradient-to-b from-[#1D9E75] to-[#534AB7] rounded-full inline-block" />
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="font-bold text-[13px] uppercase tracking-wide text-zinc-800 dark:text-zinc-100 mt-3 mb-1.5 font-mono flex items-center gap-1.5">
                <span className="w-1 h-2.5 bg-[#1D9E75] rounded-full inline-block" />
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-bold text-[12px] uppercase text-zinc-700 dark:text-zinc-300 mt-3 mb-1 font-mono flex items-center gap-1">
                <span className="text-[#534AB7] font-mono select-none">#</span>
                {children}
              </h3>
            ),
            hr: () => (
              <hr className="my-4 border-t border-dashed border-zinc-200 dark:border-zinc-800" />
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gradient bg-gradient-to-r from-[#1D9E75]/5 to-[#534AB7]/5 border-l-[#1D9E75] pl-4 italic my-3 py-2 rounded-r-2xl text-zinc-700 dark:text-zinc-300 font-semibold text-[12px] sm:text-[13px]">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-950 text-[#534AB7] dark:text-purple-300 px-1.5 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-805/50 font-bold">
                {children}
              </code>
            ),
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <>
      {/* 1. Floating Action Button (FAB) */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "fixed bottom-20 md:bottom-6 right-6 z-55 w-14 h-14 rounded-full flex items-center justify-center shadow-xl cursor-pointer bg-gradient-to-tr from-[#1D9E75] to-[#534AB7] text-white overflow-hidden group border-2 border-white dark:border-zinc-850",
          isOpen ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
        )}
        style={{ zIndex: 9999 }}
      >
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Subtle Breathing Pulse Loop */}
        <span className="absolute inset-0 rounded-full bg-[#1D9E75]/30 animate-pulse-slow -z-10" />

        <div className="relative flex items-center justify-center">
          <BrainCircuit className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 flex h-3. w-3.">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
      </motion.button>

      {/* 2. Chat Slider Panel & Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click-outside backdrop layer to close seamlessly */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-[2px] z-[9998] cursor-pointer hidden sm:block"
            />

            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 z-[9999] w-full sm:w-[440px] h-[100dvh] sm:h-[600px] max-h-[100dvh] sm:max-h-[85vh] bg-white dark:bg-zinc-950 border-none sm:border border-zinc-200/50 dark:border-zinc-800/60 rounded-none sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-colors duration-300"
              style={{ zIndex: 9999 }}
            >
              {/* Soft Glowing Gradient Circle Background */}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#1D9E75]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#534AB7]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Solid Top Header Container (Fixed via flex vertical flow, zero overlap) */}
              <div className="relative z-20 shrink-0 bg-white dark:bg-zinc-950 border-b border-zinc-150 dark:border-zinc-850/60">
                {/* Header Row */}
                <div className="p-4 flex items-center justify-between bg-gradient-to-r from-[#1D9E75]/5 to-[#534AB7]/5 dark:from-zinc-900/30 dark:to-zinc-950/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1D9E75] to-[#534AB7] flex items-center justify-center text-white shadow-md relative overflow-hidden shrink-0">
                      <Cpu size={18} className="animate-spin-slow text-white" />
                      <div className="absolute inset-0 bg-white/5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 align-middle">
                        <h3 className="font-extrabold text-[#1D9E75] dark:text-emerald-400 font-mono tracking-tight text-xs uppercase pt-0.5">CareerLens Co-Pilot</h3>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-[#1D9E75]/10 text-[#1D9E75] dark:text-emerald-400 uppercase tracking-wide">AI</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-semibold font-mono tracking-tight">Konsultan Karir Pintar Mandiri</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {messages.length > 0 && (
                      <button
                        onClick={handleClearChat}
                        disabled={isClearing}
                        className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 text-zinc-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-500/10 hover:border-red-100 dark:hover:border-red-500/20 border border-zinc-150 dark:border-zinc-800 flex items-center justify-center transition-all cursor-pointer"
                        title="Hapus riwayat chat"
                      >
                        {isClearing ? (
                          <Loader2 size={13} className="animate-spin text-zinc-500" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                      </button>
                    )}
                    
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900 border border-zinc-150 dark:border-zinc-800 flex items-center justify-center transition-all cursor-pointer relative"
                      title="Tutup Chat"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Body Container */}
              <div 
                ref={chatContainerRef}
                className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 font-sans select-text scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
              >
                {/* If no messages, display custom welcome layout */}
                {messages.length === 0 && !isLoading && !isStreaming ? (
                  <div className="h-full flex flex-col justify-center items-center text-center p-5 space-y-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring" }}
                      className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#1D9E75]/10 to-[#534AB7]/10 flex items-center justify-center text-zinc-700 dark:text-zinc-300 relative border border-zinc-150 dark:border-zinc-800"
                    >
                      <Sparkles className="w-8 h-8 text-[#1D9E75]" />
                      <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D9E75] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1D9E75]"></span>
                      </span>
                    </motion.div>

                    <div className="space-y-2">
                      <h4 className="text-base font-black text-zinc-800 dark:text-zinc-100 leading-snug">
                        Halo! Saya Co-Pilot Karirmu 🚀
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed max-w-[280px]">
                        Punya pertanyaan seputar CV, peluang industri, interview, atau karir masa depanmu? Yuk, konsultasikan semuanya di sini!
                      </p>
                    </div>

                    {/* List of Quick Starters */}
                    <div className="w-full space-y-2.5 pt-3">
                      <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-600 font-mono text-left pl-1">
                        PILIH PERTANYAAN CEPAT:
                      </p>
                      {QUICK_STARTERS.map((s, idx) => (
                        <motion.button
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          onClick={() => handleSendMessage(s.text)}
                          className="w-full p-3 text-left rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-[#1D9E75]/55 hover:bg-[#1D9E75]/5 dark:hover:bg-[#1D9E75]/5 transition-all text-zinc-700 dark:text-zinc-300 hover:scale-[1.01] active:scale-[0.99] flex items-start gap-2.5 cursor-pointer shadow-sm group"
                        >
                          <span className="text-lg shrink-0">{s.icon}</span>
                          <div className="flex-1 flex flex-col text-left">
                            <span className="text-[12px] font-bold text-[#1D9E75] group-hover:underline">{s.label}</span>
                            <span className="text-[11px] text-zinc-500 leading-relaxed font-semibold mt-0.5">{s.text}</span>
                          </div>
                          <ArrowRight size={12} className="text-zinc-300 group-hover:text-[#1D9E75] group-hover:translate-x-0.5 transition-all mt-1.5 shrink-0" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Chat Messages Rendering */
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex w-full gap-2.5 items-end",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        {/* Brand Icon for assistant only */}
                        {msg.role === "assistant" && (
                          <div className="w-7 h-7 rounded-lg bg-[#1D9E75]/10 border border-[#1D9E75]/30 flex items-center justify-center text-[#1D9E75] shrink-0 mb-1">
                            <Cpu size={14} />
                          </div>
                        )}

                        <div
                          className={cn(
                            "max-w-[82%] p-3.5 rounded-2xl shadow-sm border text-sm leading-relaxed",
                            msg.role === "user"
                              ? "bg-gradient-to-tr from-[#1D9E75] to-[#1bb583] text-white border-[#1d9e75]/50 rounded-br-none"
                              : "bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none"
                          )}
                        >
                          {formatMessageText(msg.text)}
                          <span 
                            className={cn(
                              "block text-[8px] mt-1.5 text-right font-semibold font-mono tracking-tight",
                              msg.role === "user" ? "text-white/60" : "text-zinc-400"
                            )}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Streaming Assistant Response effect */}
                    {isStreaming && streamingText && (
                      <div className="flex w-full gap-2.5 items-end justify-start">
                        <div className="w-7 h-7 rounded-lg bg-[#1D9E75]/10 border border-[#1D9E75]/30 flex items-center justify-center text-[#1D9E75] shrink-0 mb-1">
                          <Cpu size={14} />
                        </div>

                        <div className="max-w-[82%] p-3.5 rounded-2xl shadow-sm border text-sm leading-relaxed bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none">
                          {formatMessageText(streamingText)}
                          <span className="inline-block w-1.5 h-3 bg-[#1D9E75] ml-0.5 animate-pulse" />
                        </div>
                      </div>
                    )}

                    {/* Bouncing Dots Typing Indicator */}
                    {isLoading && (
                      <div className="flex gap-2.5 items-end justify-start">
                        <div className="w-7 h-7 rounded-lg bg-[#1D9E75]/10 border border-[#1D9E75]/30 flex items-center justify-center text-[#1D9E75] shrink-0 mb-1">
                          <Cpu size={14} />
                        </div>

                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 p-3.5 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-bounce" style={{ animationDelay: "0ms" }}></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-bounce" style={{ animationDelay: "150ms" }}></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Solid Chat Input Footer (Fixed via flex vertical flow, zero overlap) */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputVal);
                }}
                className="relative z-20 shrink-0 p-3 border-t border-zinc-150 dark:border-zinc-850/60 bg-white dark:bg-zinc-950 flex gap-2 items-center"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Tanyakan peluang, CV, atau karir..."
                  disabled={isLoading || isStreaming}
                  className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#1D9E75] transition-all disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={!inputVal.trim() || isLoading || isStreaming}
                  className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer transition-all border shrink-0",
                    inputVal.trim() && !isLoading && !isStreaming
                      ? "bg-[#1D9E75] hover:bg-[#168560] hover:scale-105 active:scale-95 text-white border-transparent shadow-md"
                      : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-300 pointer-events-none"
                  )}
                >
                  <Send size={14} className={cn(inputVal.trim() && "translate-x-0.5 -translate-y-0.5")} />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
