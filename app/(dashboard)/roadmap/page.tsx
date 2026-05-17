'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  ExternalLink, 
  Search,
  ArrowRight,
  Clock,
  Target,
  Trophy,
  ChevronRight,
  Calendar,
  LayoutDashboard,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import PageLoader from '@/components/shared/PageLoader'
import { Button } from '@/components/ui/button'
import { Progress } from "@/components/ui/progress"

// Types based on the prompt
interface RoadmapTask {
  id: string
  text: string
  selesai: boolean
}

interface RoadmapWeek {
  minggu: number
  fase: 'fondasi' | 'pengembangan' | 'persiapan'
  judul: string
  tugas: RoadmapTask[]
  resource: {
    judul: string
    url: string
    platform: string
  }
  estimasiJam: number
}

interface AnalysisData {
  id: string
  selectedPath: string
  result: {
    roadmap90Hari: RoadmapWeek[]
  }
}

export default function RoadmapPage() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activePhase, setActivePhase] = useState<'fondasi' | 'pengembangan' | 'persiapan'>('fondasi')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [analysisRes, progressRes] = await Promise.all([
        fetch('/api/analyze/latest'),
        fetch('/api/roadmap/progress')
      ])

      const analysisResult = await analysisRes.json()
      const progressResult = await progressRes.json()

      if (analysisResult.success && analysisResult.data) {
        setAnalysis(analysisResult.data)
      }

      if (progressResult.success && progressResult.data) {
        const completedIds = progressResult.data
          .filter((p: any) => p.completed)
          .map((p: any) => p.taskId)
        setCompletedTasks(completedIds)
      }
    } catch (error) {
      console.error('Error fetching roadmap data:', error)
      toast.error('Gagal memuat data roadmap')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTask = async (taskId: string, weekNumber: number) => {
    const isCurrentlyCompleted = completedTasks.includes(taskId)
    
    // Optimistic update
    setCompletedTasks(prev => 
      isCurrentlyCompleted 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
    
    try {
      const res = await fetch('/api/roadmap/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          taskId,
          weekId: `week-${weekNumber}`,
          completed: !isCurrentlyCompleted
        })
      })
      
      const result = await res.json()
      if (!result.success) {
        setCompletedTasks(prev => 
          isCurrentlyCompleted ? [...prev, taskId] : prev.filter(id => id !== taskId)
        )
        toast.error('Gagal menyimpan progres')
      }
    } catch (error) {
      setCompletedTasks(prev => 
        isCurrentlyCompleted ? [...prev, taskId] : prev.filter(id => id !== taskId)
      )
      toast.error('Kesalahan jaringan')
    }
  }

  const roadmapData = useMemo(() => analysis?.result?.roadmap90Hari || [], [analysis])
  
  const stats = useMemo(() => {
    const allTasks = roadmapData.flatMap(w => w.tugas)
    const total = allTasks.length
    const completed = completedTasks.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, remaining: total - completed, percentage }
  }, [roadmapData, completedTasks])

  if (isLoading) return <PageLoader isLoading={true} text="Menyusun Roadmap Strategis..." />

  if (!analysis || !analysis.result?.roadmap90Hari || analysis.result.roadmap90Hari.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md space-y-8"
        >
          <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-black uppercase italic tracking-tighter">Roadmap Kosong</h1>
            <p className="text-slate-500 font-medium">
              Selesaikan analisis CV terlebih dahulu untuk mendapatkan roadmap 12 minggu yang disesuaikan dengan profil SMK-mu.
            </p>
          </div>
          <Button 
            onClick={() => router.push('/cv-builder')}
            className="w-full h-14 bg-black hover:bg-[#1D9E75] text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg"
          >
            Mulai Analisis Sekarang
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-10 md:space-y-16">
        {/* Intro & Stats Section */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#1D9E75] font-black text-[10px] uppercase tracking-[0.2em]">
                <Calendar className="w-4 h-4" />
                Roadmap 90 Hari
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-black tracking-tight uppercase italic leading-[0.9]">
                Misi Karier <br /> Strategis.
              </h1>
              <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed max-w-md">
                Didesain khusus untuk profil SMK-mu. Selesaikan setiap misi mingguan untuk membangun portofolio yang kompetitif.
              </p>
            </div>
            
            <div className="bg-white border border-slate-100 p-6 rounded-3xl md:min-w-[300px] space-y-4 shadow-sm">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Progres</p>
                  <p className="text-2xl font-black text-black italic tracking-tighter">{stats.percentage}%</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75]">
                   <Trophy className="w-5 h-5" />
                </div>
              </div>
              <Progress value={stats.percentage} className="h-1.5 bg-slate-100" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-[#1D9E75]" />
                {stats.completed} dari {stats.total} misi selesai
              </p>
            </div>
          </div>

          {/* Phase Selector */}
          <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl w-fit">
            {(['fondasi', 'pengembangan', 'persiapan'] as const).map((phase) => (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={cn(
                  "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activePhase === phase 
                    ? "bg-black text-white shadow-lg scale-105" 
                    : "text-slate-400 hover:text-black"
                )}
              >
                {phase}
              </button>
            ))}
          </div>
        </section>

        {/* Weekly List */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 md:space-y-12"
            >
              {roadmapData
                .filter(w => w.fase === activePhase)
                .map((week) => {
                  const isWeekDone = week.tugas.every(t => completedTasks.includes(t.id))
                  return (
                    <div key={week.minggu} className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-black italic shadow-sm",
                          isWeekDone ? "bg-[#1D9E75] text-white" : "bg-black text-white"
                        )}>
                          {week.minggu}
                        </div>
                        <h3 className={cn(
                          "text-xl font-black tracking-tight uppercase italic",
                          isWeekDone ? "text-[#1D9E75]" : "text-black"
                        )}>
                          {week.judul}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {week.tugas.map((task) => (
                          <button
                            key={task.id}
                            onClick={() => toggleTask(task.id, week.minggu)}
                            className={cn(
                              "flex items-start gap-4 p-4 rounded-2xl border text-left transition-all active:scale-95 group",
                              completedTasks.includes(task.id) 
                                ? "bg-slate-50 border-[#1D9E75]/20 text-[#1D9E75]/70" 
                                : "bg-white border-slate-100 hover:border-black"
                            )}
                          >
                            <div className={cn(
                              "w-5 h-5 rounded-md border-2 mt-0.5 flex items-center justify-center shrink-0",
                              completedTasks.includes(task.id) ? "bg-[#1D9E75] border-[#1D9E75] text-white" : "border-slate-200"
                            )}>
                              {completedTasks.includes(task.id) && <Check className="w-3 h-3 stroke-[4px]" />}
                            </div>
                            <span className="text-[11px] font-bold uppercase leading-tight tracking-tight">
                              {task.text}
                            </span>
                          </button>
                        ))}
                      </div>

                      {week.resource && (
                        <a 
                          href={week.resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 hover:border-[#1D9E75] transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#1D9E75]">
                              <ExternalLink className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Materi</p>
                              <p className="text-[10px] font-black truncate max-w-[200px] md:max-w-md">{week.resource.judul}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#1D9E75] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </a>
                      )}
                    </div>
                  )
                })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Motivational Footer */}
        <section className="pt-20">
          <div className="bg-black rounded-[40px] p-8 md:p-16 relative overflow-hidden text-center md:text-left">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none hidden md:block">
              <Trophy className="w-48 h-48 text-white" />
            </div>
            <div className="max-w-xl space-y-8 relative z-10">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-tight">
                  Konsistensi Adalah <br /> Kunci Kesuksesan.
                </h2>
                <p className="text-slate-400 font-medium text-sm">
                  Jangan terburu-buru. Fokus pada kualitas setiap tugas yang kamu kerjakan. 
                  Lulusan SMK yang sukses adalah mereka yang berani belajar setiap hari.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-white text-black hover:bg-[#1D9E75] hover:text-white h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
