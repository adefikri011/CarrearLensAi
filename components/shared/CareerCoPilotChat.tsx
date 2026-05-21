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
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import UserAvatar from "./UserAvatar";

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
  },
  {
    icon: "🎯",
    text: "Apa rekomendasi sertifikasi untuk Backend Developer?",
    label: "Sertifikasi Backend",
  },
  {
    icon: "💼",
    text: "Tolong simulasikan pertanyaan interview untuk posisi UI/UX!",
    label: "Simulasi Interview",
  },
];

// ─── Strip Markdown Helper ───────────────────────────────────────────────────────
/**
 * Cleanly strips markdown characters for plain text copy.
 */
function stripMarkdown(markdown: string): string {
  if (!markdown) return "";
  
  let text = markdown;
  
  // 1. Remove HTML tags
  text = text.replace(/<[^>]*>/g, "");
  
  // 2. Headings: Replace #, ##, ### with the heading text on a clean line
  text = text.replace(/^#+\s+(.*)$/gm, "$1");
  
  // 3. Bold/Strong: Replace **word** or __word__ with word
  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");
  
  // 4. Italic/Em: Replace *word* or _word_ with word
  text = text.replace(/(\*|_)(.*?)\1/g, "$2");
  
  // 5. Code blocks: Replace `code` with code
  text = text.replace(/`([^`]+)`/g, "$1");
  
  // 6. Blockquotes: Replace starting > with empty space
  text = text.replace(/^\s*>\s+/gm, "");
  
  // 7. Bullet lists: Replace * or - with • for standard lists
  text = text.replace(/^\s*[-*+]\s+\[\s*[x ]\s*\]\s+/gm, "☐ "); 
  text = text.replace(/^\s*[-*+]\s+/gm, "• "); 
  
  // 8. Horizontal rules: Remove lines filled with hyphens, underscores, or asterisks
  text = text.replace(/^\s*[-*_]{3,}\s*$/gm, "");
  
  // 9. Remove double extra empty lines
  text = text.replace(/\n{3,}/g, "\n\n");
  
  return text.trim();
}

// ─── Copy Button Sub-Component ───────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const cleanText = stripMarkdown(text);
      await navigator.clipboard.writeText(cleanText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin teks:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/90 dark:bg-zinc-850/95 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/80 text-zinc-400 hover:text-[#1D9E75] dark:hover:text-emerald-400 cursor-pointer shadow-sm z-10"
      title="Salin jawaban lengkap"
    >
      {copied ? (
        <Check size={11.5} className="text-[#1D9E75] dark:text-emerald-400" />
      ) : (
        <Copy size={11.5} />
      )}
    </button>
  );
}

export default function CareerCoPilotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 350);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
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
      <div className="text-[13.5px] leading-relaxed">
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="mb-2 last:mb-0 leading-relaxed whitespace-pre-line text-zinc-700 dark:text-zinc-300">
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-[#1D9E75] dark:text-emerald-400">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="not-italic font-semibold text-[#534AB7] dark:text-violet-400">
                {children}
              </em>
            ),
            ul: ({ children }) => (
              <ul className="my-2 space-y-1 list-none pl-0">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="my-2 space-y-1.5 list-decimal pl-5 text-zinc-700 dark:text-zinc-300">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#1D9E75] shrink-0" />
                <span>{children}</span>
              </li>
            ),
            h1: ({ children }) => (
              <h1 className="text-[12px] font-black uppercase tracking-widest mt-4 mb-2 text-zinc-500 dark:text-zinc-400">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-[12px] font-bold mt-3 mb-1.5 text-zinc-700 dark:text-zinc-200">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-[11.5px] font-bold mt-2 mb-1 text-zinc-600 dark:text-zinc-400">
                {children}
              </h3>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-[#1D9E75] pl-3 py-1 my-2 text-[13px] text-zinc-500 dark:text-zinc-400 italic">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-800 text-[#534AB7] dark:text-violet-400 px-1.5 py-0.5 rounded">
                {children}
              </code>
            ),
            hr: () => (
              <hr className="my-3 border-zinc-100 dark:border-zinc-800" />
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
      {/* ── FAB ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 md:bottom-8 right-6 z-[9999] w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer shadow-xl"
            style={{
              background: "linear-gradient(135deg, #1D9E75 0%, #534AB7 100%)",
              boxShadow: "0 8px 28px rgba(29,158,117,0.35)",
            }}
          >
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white/80" />
            </span>
            <BrainCircuit className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[9997] hidden sm:block bg-black/30 backdrop-blur-sm"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className={cn(
                "fixed z-[9998] flex flex-col",
                "inset-x-0 bottom-0 h-[100dvh] bg-white dark:bg-zinc-950",
                "sm:inset-auto sm:bottom-8 sm:right-6 sm:w-[410px] sm:h-[660px]",
                "sm:rounded-[20px] sm:border sm:border-zinc-200 sm:dark:border-zinc-800",
              )}
              style={{
                boxShadow: "0 24px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
              }}
            >
              {/* ── HEADER ── */}
              <div className="shrink-0 flex items-center justify-between px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 sm:rounded-t-[20px]">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className="w-9 h-9 rounded-[12px] flex items-center justify-center text-white"
                      style={{ background: "linear-gradient(135deg, #1D9E75, #534AB7)" }}
                    >
                      <Cpu size={16} />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-950" />
                  </div>

                  {/* Title */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-black tracking-tight text-zinc-800 dark:text-zinc-100">
                        CareerLens Co-Pilot
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#1D9E75]/10 text-[#1D9E75] dark:text-emerald-400 uppercase tracking-wide">
                        AI
                      </span>
                    </div>
                    <p className="text-[10.5px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">
                      Konsultan Karir · Siap membantu
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  {messages.length > 0 && (
                    <button
                      onClick={handleClearChat}
                      disabled={isClearing}
                      title="Hapus riwayat"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      {isClearing
                        ? <Loader2 size={13} className="animate-spin" />
                        : <Trash2 size={13} />}
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    title="Tutup"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* ── BODY ── */}
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">

                {/* Empty / Welcome State */}
                {!hasMessages ? (
                  <div className="h-full flex flex-col justify-center items-center px-6 py-8 gap-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", delay: 0.05 }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, rgba(29,158,117,0.1), rgba(83,74,183,0.1))",
                        border: "1px solid rgba(29,158,117,0.15)",
                      }}
                    >
                      <Sparkles className="w-7 h-7 text-[#1D9E75]" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-center space-y-1.5"
                    >
                      <h4 className="text-[15px] font-bold text-zinc-800 dark:text-zinc-100">
                        Halo! Saya Co-Pilot Karirmu 🚀
                      </h4>
                      <p className="text-[12.5px] text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[260px] mx-auto">
                        Tanyakan soal CV, interview, sertifikasi, atau karir masa depanmu.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.18 }}
                      className="w-full space-y-2"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                        Mulai dengan pertanyaan ini
                      </p>
                      {QUICK_STARTERS.map((s, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.22 + i * 0.07 }}
                          onClick={() => handleSendMessage(s.text)}
                          className="w-full px-3.5 py-3 rounded-[14px] text-left flex items-center gap-3 cursor-pointer transition-all duration-150 border border-zinc-100 dark:border-zinc-800 hover:border-[#1D9E75]/40 dark:hover:border-[#1D9E75]/30 hover:bg-zinc-50 dark:hover:bg-zinc-900 group"
                        >
                          <span className="text-base shrink-0">{s.icon}</span>
                          <div className="flex-1 min-w-0">
                            <span className="block text-[11px] font-bold text-[#1D9E75] dark:text-emerald-400 mb-0.5">
                              {s.label}
                            </span>
                            <span className="block text-[12px] text-zinc-500 dark:text-zinc-400 leading-snug">
                              {s.text}
                            </span>
                          </div>
                          <ArrowRight size={12} className="text-zinc-300 dark:text-zinc-600 group-hover:text-[#1D9E75] transition-colors shrink-0" />
                        </motion.button>
                      ))}
                    </motion.div>
                  </div>
                ) : (
                  /* Messages */
                  <div className="p-4 space-y-3">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className={cn(
                          "flex gap-2 items-end",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        {/* AI avatar */}
                        {msg.role === "assistant" && (
                          <div
                            className="w-7 h-7 rounded-[9px] flex items-center justify-center text-white shrink-0 mb-0.5"
                            style={{ background: "linear-gradient(135deg, #1D9E75, #534AB7)" }}
                          >
                            <Cpu size={13} />
                          </div>
                        )}

                        <div
                          className={cn(
                            "max-w-[82%] rounded-2xl px-3.5 py-2.5 relative group",
                            msg.role === "user"
                              ? "text-white rounded-br-[5px]"
                              : "bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-bl-[5px] pr-9"
                          )}
                          style={msg.role === "user" ? {
                            background: "linear-gradient(135deg, #1D9E75, #19a87a)",
                            boxShadow: "0 2px 12px rgba(29,158,117,0.22)",
                          } : undefined}
                        >
                          {msg.role === "user" ? (
                            <p className="text-[13.5px] font-medium leading-relaxed">{msg.text}</p>
                          ) : (
                            formatMessageText(msg.text)
                          )}
                          {msg.role === "assistant" && (
                            <CopyButton text={msg.text} />
                          )}
                          <span className={cn(
                            "block text-[9px] mt-1.5 text-right font-mono",
                            msg.role === "user" ? "text-white/50" : "text-zinc-400"
                          )}>
                            {new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        {/* User avatar */}
                        {msg.role === "user" && (
                          <UserAvatar 
                            size="sm"
                            fallbackType="icon"
                            className="w-7 h-7 rounded-[9px] shrink-0 mb-0.5 !bg-zinc-100 dark:!bg-zinc-800 border border-zinc-200 dark:border-zinc-700" 
                            fallbackClassName="bg-zinc-100 dark:bg-zinc-800"
                          />
                        )}
                      </motion.div>
                    ))}

                    {/* Streaming */}
                    {isStreaming && streamingText && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 items-end justify-start"
                      >
                        <div
                          className="w-7 h-7 rounded-[9px] flex items-center justify-center text-white shrink-0 mb-0.5"
                          style={{ background: "linear-gradient(135deg, #1D9E75, #534AB7)" }}
                        >
                          <Cpu size={13} />
                        </div>
                        <div className="max-w-[82%] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl rounded-bl-[5px] px-3.5 py-2.5">
                          {formatMessageText(streamingText)}
                          <span className="inline-block w-[3px] h-3 bg-[#1D9E75] ml-0.5 rounded-full animate-pulse" />
                        </div>
                      </motion.div>
                    )}

                    {/* Loading dots */}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 items-end justify-start"
                      >
                        <div
                          className="w-7 h-7 rounded-[9px] flex items-center justify-center text-white shrink-0"
                          style={{ background: "linear-gradient(135deg, #1D9E75, #534AB7)" }}
                        >
                          <Cpu size={13} />
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-4 py-3.5 rounded-2xl rounded-bl-[5px] flex items-center gap-1.5">
                          {[0, 120, 240].map((delay, i) => (
                            <span
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 animate-bounce"
                              style={{ animationDelay: `${delay}ms` }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} className="h-1" />
                  </div>
                )}
              </div>

              {/* ── FOOTER ── */}
              <div className="shrink-0 px-3 pb-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 sm:rounded-b-[20px]">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputVal); }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    disabled={isLoading || isStreaming}
                    placeholder="Tanyakan soal CV, karir, interview..."
                    className={cn(
                      "flex-1 h-10 rounded-[12px] px-3.5 text-[13px] font-medium outline-none transition-all duration-150",
                      "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
                      "text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600",
                      "focus:border-[#1D9E75]/50 focus:ring-2 focus:ring-[#1D9E75]/10",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                    )}
                  />

                  <motion.button
                    type="submit"
                    disabled={!inputVal.trim() || isLoading || isStreaming}
                    whileTap={inputVal.trim() ? { scale: 0.92 } : undefined}
                    className={cn(
                      "w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 transition-all duration-150",
                      inputVal.trim() && !isLoading && !isStreaming
                        ? "text-white cursor-pointer"
                        : "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                    )}
                    style={inputVal.trim() && !isLoading && !isStreaming ? {
                      background: "linear-gradient(135deg, #1D9E75, #534AB7)",
                      boxShadow: "0 2px 12px rgba(29,158,117,0.3)",
                    } : undefined}
                  >
                    <Send size={14} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}