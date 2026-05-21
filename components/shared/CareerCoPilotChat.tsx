"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BrainCircuit,
  Send,
  X,
  Sparkles,
  Trash2,
  Loader2,
  Cpu,
  ArrowRight,
  Zap,
  MessageCircle,
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
    label: "Optimasi CV",
    color: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-200/60 dark:border-emerald-800/40",
    labelColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: "🎯",
    text: "Apa rekomendasi sertifikasi untuk Backend Developer?",
    label: "Sertifikasi Backend",
    color: "from-violet-500/10 to-violet-500/5",
    border: "border-violet-200/60 dark:border-violet-800/40",
    labelColor: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: "💼",
    text: "Tolong simulasikan pertanyaan interview untuk posisi UI/UX!",
    label: "Simulasi Interview",
    color: "from-blue-500/10 to-blue-500/5",
    border: "border-blue-200/60 dark:border-blue-800/40",
    labelColor: "text-blue-600 dark:text-blue-400",
  },
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
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 400);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) fetchChatHistory();
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, isLoading]);

  const fetchChatHistory = async () => {
    try {
      const res = await fetch("/api/chat");
      const json = await res.json();
      if (json.success) setMessages(json.data);
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading || isStreaming) return;

    const newUserMessage: ChatMessage = {
      id: Math.random().toString(),
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend.trim() }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const fullResponseText = json.data.text;
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
        }, 40);
      } else {
        throw new Error(json.error || "Gagal mendapatkan respon AI");
      }
    } catch (err: any) {
      setIsLoading(false);
      setIsStreaming(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          text: `⚠️ Maaf, terjadi kesalahan: ${err.message || "Gagal menghubungkan ke AI Mentor."}`,
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
      if (json.success) setMessages([]);
    } catch (err) {
      console.error("Failed to clear chat:", err);
    } finally {
      setIsClearing(false);
    }
  };

  const formatMessageText = (text: string) => {
    if (!text) return null;
    return (
      <div className="prose-chat text-sm leading-relaxed">
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="mb-2 last:mb-0 leading-relaxed text-[13.5px] whitespace-pre-line">
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-[#1D9E75] dark:text-emerald-400">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="not-italic font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-1 rounded text-[12px]">
                {children}
              </em>
            ),
            ul: ({ children }) => (
              <ul className="my-2 space-y-1.5 list-none pl-0">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="my-2 space-y-1.5 list-decimal pl-5">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="relative pl-4 flex items-start gap-2 text-[13px]">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#534AB7] shrink-0" />
                <span className="flex-1">{children}</span>
              </li>
            ),
            h1: ({ children }) => (
              <h1 className="text-[13px] font-black uppercase tracking-wider mt-4 mb-2 pb-1.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#1D9E75] to-[#534AB7]" />
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-[12px] font-bold uppercase tracking-wide mt-3 mb-1.5 flex items-center gap-1.5 text-zinc-700 dark:text-zinc-200">
                <span className="w-1 h-3 rounded-full bg-[#1D9E75]" />
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-[11px] font-bold uppercase mt-2 mb-1 text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <span className="text-[#534AB7]">#</span>
                {children}
              </h3>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-[3px] border-[#1D9E75] bg-emerald-50/60 dark:bg-emerald-950/20 pl-3 py-1.5 my-2 rounded-r-xl text-[12.5px] italic text-zinc-600 dark:text-zinc-400">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-900 text-violet-600 dark:text-violet-400 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                {children}
              </code>
            ),
            hr: () => (
              <hr className="my-3 border-dashed border-zinc-200 dark:border-zinc-800" />
            ),
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    );
  };

  const hasMessages = messages.length > 0 || isLoading || isStreaming;

  return (
    <>
      {/* ── FAB Button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 md:bottom-8 right-6 z-[9999] w-[58px] h-[58px] rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #1D9E75 0%, #2d7de0 50%, #534AB7 100%)",
              boxShadow: "0 8px 32px rgba(29,158,117,0.4), 0 2px 8px rgba(83,74,183,0.3)",
            }}
          >
            {/* Shimmer sweep */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)" }} />

            {/* Ping indicator */}
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white/90" />
            </span>

            <BrainCircuit className="w-6 h-6 text-white drop-shadow-sm" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[9997] hidden sm:block"
              style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className={cn(
                "fixed z-[9998] flex flex-col overflow-hidden",
                // Mobile: full screen
                "inset-x-0 bottom-0 h-[100dvh]",
                // Desktop: floating panel
                "sm:inset-auto sm:bottom-8 sm:right-6 sm:w-[420px] sm:h-[680px] sm:rounded-[28px]",
                "bg-white dark:bg-[#0f0f12]",
                "border-0 sm:border sm:border-zinc-200/60 sm:dark:border-zinc-800/50",
              )}
              style={{
                boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(29,158,117,0.08)",
              }}
            >
              {/* ── Decorative ambient blobs (pointer-events-none) ── */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
                <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full opacity-[0.07] blur-3xl"
                  style={{ background: "radial-gradient(circle, #1D9E75, transparent)" }} />
                <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full opacity-[0.07] blur-3xl"
                  style={{ background: "radial-gradient(circle, #534AB7, transparent)" }} />
              </div>

              {/* ════════════════════════════════
                  HEADER — always fully visible
              ════════════════════════════════ */}
              <div className="relative z-10 shrink-0 flex flex-col">
                {/* Gradient accent bar at top */}
                <div className="h-[3px] w-full rounded-t-[inherit]"
                  style={{ background: "linear-gradient(90deg, #1D9E75, #2d7de0, #534AB7)" }} />

                <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800/70"
                  style={{ background: "linear-gradient(135deg, rgba(29,158,117,0.04) 0%, rgba(83,74,183,0.04) 100%)" }}>

                  {/* Left: Avatar + Title */}
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-[14px] flex items-center justify-center text-white shadow-md"
                        style={{ background: "linear-gradient(135deg, #1D9E75 0%, #534AB7 100%)" }}>
                        <Cpu size={18} />
                      </div>
                      {/* Online dot */}
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-[#0f0f12]" />
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black tracking-tight text-[#1D9E75] dark:text-emerald-400 font-mono uppercase">
                          CareerLens Co-Pilot
                        </span>
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#1D9E75]/15 to-[#534AB7]/15 border border-[#1D9E75]/25 dark:border-[#1D9E75]/30">
                          <Zap size={7} className="text-[#1D9E75]" />
                          <span className="text-[8px] font-extrabold text-[#1D9E75] dark:text-emerald-400 uppercase tracking-wide">AI</span>
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold font-mono tracking-tight">
                        Konsultan Karir Pintar · Siap Membantu
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5">
                    {messages.length > 0 && (
                      <button
                        onClick={handleClearChat}
                        disabled={isClearing}
                        title="Hapus riwayat"
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border border-zinc-200 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-200 cursor-pointer"
                      >
                        {isClearing
                          ? <Loader2 size={13} className="animate-spin" />
                          : <Trash2 size={13} />}
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      title="Tutup"
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all duration-200 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* ════════════════════════════════
                  BODY — scrollable messages
              ════════════════════════════════ */}
              <div
                ref={chatBodyRef}
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent"
              >
                {!hasMessages ? (
                  /* ── Welcome / Empty State ── */
                  <div className="h-full flex flex-col justify-center items-center px-5 py-8 space-y-6">
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="relative"
                    >
                      <div className="w-20 h-20 rounded-[24px] flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, rgba(29,158,117,0.12), rgba(83,74,183,0.12))", border: "1.5px solid rgba(29,158,117,0.2)" }}>
                        <Sparkles className="w-9 h-9 text-[#1D9E75]" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-[#0f0f12]" />
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center space-y-2"
                    >
                      <h4 className="text-[17px] font-black text-zinc-800 dark:text-zinc-100 tracking-tight">
                        Halo! Saya Co-Pilot Karirmu 🚀
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-[270px] mx-auto">
                        Punya pertanyaan soal CV, interview, atau karir? Tanyakan langsung di sini — saya siap bantu!
                      </p>
                    </motion.div>

                    {/* Quick starters */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="w-full space-y-2"
                    >
                      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-600 pl-1">
                        Mulai dengan:
                      </p>
                      {QUICK_STARTERS.map((s, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.35 + i * 0.08 }}
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSendMessage(s.text)}
                          className={cn(
                            "w-full p-3 rounded-2xl text-left flex items-center gap-3 cursor-pointer transition-all duration-200 border",
                            "bg-gradient-to-r hover:shadow-sm",
                            s.color,
                            s.border,
                          )}
                        >
                          <span className="text-[18px] shrink-0 leading-none">{s.icon}</span>
                          <div className="flex-1 min-w-0">
                            <span className={cn("block text-[11px] font-black uppercase tracking-wide", s.labelColor)}>
                              {s.label}
                            </span>
                            <span className="block text-[11.5px] text-zinc-600 dark:text-zinc-400 font-medium mt-0.5 leading-tight">
                              {s.text}
                            </span>
                          </div>
                          <ArrowRight size={12} className="text-zinc-300 dark:text-zinc-600 shrink-0" />
                        </motion.button>
                      ))}
                    </motion.div>
                  </div>
                ) : (
                  /* ── Messages ── */
                  <div className="p-4 space-y-4">
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "flex gap-2.5 items-end",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        {/* Assistant avatar */}
                        {msg.role === "assistant" && (
                          <div className="w-7 h-7 rounded-[10px] flex items-center justify-center text-white shrink-0 mb-0.5"
                            style={{ background: "linear-gradient(135deg, #1D9E75, #534AB7)" }}>
                            <Cpu size={13} />
                          </div>
                        )}

                        <div
                          className={cn(
                            "max-w-[83%] rounded-2xl px-3.5 py-3 shadow-sm",
                            msg.role === "user"
                              ? "text-white rounded-br-[4px]"
                              : "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-[4px]"
                          )}
                          style={msg.role === "user" ? {
                            background: "linear-gradient(135deg, #1D9E75 0%, #168f68 100%)",
                            boxShadow: "0 4px 16px rgba(29,158,117,0.28)",
                          } : undefined}
                        >
                          {msg.role === "user" ? (
                            <p className="text-[13.5px] font-semibold leading-relaxed">{msg.text}</p>
                          ) : (
                            formatMessageText(msg.text)
                          )}
                          <span className={cn(
                            "block text-[9px] mt-1.5 text-right font-mono tracking-tight",
                            msg.role === "user" ? "text-white/55" : "text-zinc-400"
                          )}>
                            {new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        {/* User avatar */}
                        {msg.role === "user" && (
                          <div className="w-7 h-7 rounded-[10px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0 mb-0.5">
                            <span className="text-sm font-black text-zinc-400">U</span>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Streaming message */}
                    {isStreaming && streamingText && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2.5 items-end justify-start"
                      >
                        <div className="w-7 h-7 rounded-[10px] flex items-center justify-center text-white shrink-0 mb-0.5"
                          style={{ background: "linear-gradient(135deg, #1D9E75, #534AB7)" }}>
                          <Cpu size={13} />
                        </div>
                        <div className="max-w-[83%] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl rounded-bl-[4px] px-3.5 py-3 shadow-sm">
                          {formatMessageText(streamingText)}
                          <span className="inline-block w-[3px] h-3.5 bg-[#1D9E75] ml-0.5 rounded-full animate-pulse" />
                        </div>
                      </motion.div>
                    )}

                    {/* Loading dots */}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2.5 items-end justify-start"
                      >
                        <div className="w-7 h-7 rounded-[10px] flex items-center justify-center text-white shrink-0"
                          style={{ background: "linear-gradient(135deg, #1D9E75, #534AB7)" }}>
                          <Cpu size={13} />
                        </div>
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-4 py-3.5 rounded-2xl rounded-bl-[4px] shadow-sm flex items-center gap-1.5">
                          {[0, 150, 300].map((delay, i) => (
                            <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-bounce"
                              style={{ animationDelay: `${delay}ms` }} />
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} className="h-2" />
                  </div>
                )}
              </div>

              {/* ════════════════════════════════
                  FOOTER — input bar
              ════════════════════════════════ */}
              <div className="relative z-10 shrink-0 px-3 py-3 border-t border-zinc-100 dark:border-zinc-800/70 bg-white dark:bg-[#0f0f12]">
                {/* Subtle top gradient line */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.3), rgba(83,74,183,0.3), transparent)" }} />

                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputVal); }}
                  className="flex items-center gap-2"
                >
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      disabled={isLoading || isStreaming}
                      placeholder="Tanyakan soal CV, karir, interview..."
                      className={cn(
                        "w-full h-10 rounded-[14px] px-4 text-[12.5px] font-semibold outline-none transition-all duration-200 border",
                        "bg-zinc-50 dark:bg-zinc-900",
                        "text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600",
                        "border-zinc-200 dark:border-zinc-800",
                        "focus:border-[#1D9E75] dark:focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/15",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                      )}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={!inputVal.trim() || isLoading || isStreaming}
                    whileHover={inputVal.trim() && !isLoading ? { scale: 1.05 } : undefined}
                    whileTap={inputVal.trim() && !isLoading ? { scale: 0.93 } : undefined}
                    className={cn(
                      "w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 transition-all duration-200",
                      inputVal.trim() && !isLoading && !isStreaming
                        ? "text-white cursor-pointer shadow-lg"
                        : "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                    )}
                    style={inputVal.trim() && !isLoading && !isStreaming ? {
                      background: "linear-gradient(135deg, #1D9E75 0%, #534AB7 100%)",
                      boxShadow: "0 4px 14px rgba(29,158,117,0.4)",
                    } : undefined}
                  >
                    <Send size={14} className={cn(inputVal.trim() && "translate-x-px -translate-y-px")} />
                  </motion.button>
                </form>

                {/* Powered by caption */}
                <p className="text-center text-[9px] text-zinc-300 dark:text-zinc-700 font-mono mt-2 tracking-wide">
                  Powered by CareerLens AI · Selalu siap 24/7
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}