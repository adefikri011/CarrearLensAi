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
      {/* Simple Professional Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1D9E75]" />
                <h1 className="text-xl font-black text-black italic tracking-tighter uppercase">Roadmap 12 Minggu</h1>
              </div>
              <p className="text-[10px] font-black text-[#1D9E75] uppercase tracking-[0.2em]">
                {analysis.selectedPath} 
                <span className="text-slate-300 mx-2">|</span>
                {stats.completed} dari {stats.total} Selesai
              </p>
            </div>
            
            <div className="flex items-center gap-4 min-w-[200px]">
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Total Progres</span>
                  <span className="text-lg font-black text-black italic tracking-tighter">{stats.percentage}%</span>
                </div>
                <Progress value={stats.percentage} className="h-1.5 bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {/* Intro */}
        <section className="space-y-4 max-w-2xl">
          <h2 className="text-3xl font-black text-black tracking-tight uppercase italic leading-tight">
            Persiapan Menuju <br /> Dunia Industri.
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Ikuti panduan langkah demi langkah ini untuk meningkatkan daya saingmu. 
            Roadmap ini dibagi menjadi 12 minggu fokus untuk hasil yang maksimal.
          </p>
        </section>

        {/* Weekly List */}
        <div className="space-y-4">
          <AnimatePresence>
            {roadmapData.map((week, idx) => {
              const isWeekDone = week.tugas.every(t => completedTasks.includes(t.id))
              
              return (
                <motion.div
                  key={week.minggu}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "group relative bg-white border-2 rounded-2xl p-6 md:p-8 transition-all duration-300",
                    isWeekDone 
                      ? "border-[#1D9E75]/20 bg-[#ECFDF5]/30" 
                      : "border-slate-50 hover:border-slate-100 hover:shadow-sm"
                  )}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Week Indicator */}
                    <div className="flex-shrink-0">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black italic transition-colors",
                        isWeekDone ? "bg-[#1D9E75] text-white" : "bg-slate-50 text-slate-300 group-hover:bg-black group-hover:text-white"
                      )}>
                        <span className="text-[8px] uppercase -mb-1 opacity-60">Wk</span>
                        <span className="text-lg">{week.minggu}</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-6">
                      {/* Title & Phase */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className={cn(
                            "text-xl font-black tracking-tight uppercase italic transition-colors",
                            isWeekDone ? "text-[#1D9E75]" : "text-black"
                          )}>
                            {week.judul}
                          </h3>
                          {isWeekDone && <CheckCircle2 className="w-5 h-5 text-[#1D9E75]" />}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                          <span className={cn(
                            "px-2 py-0.5 rounded border",
                            week.fase === 'fondasi' ? "text-blue-500 border-blue-100 bg-blue-50/50" :
                            week.fase === 'pengembangan' ? "text-purple-500 border-purple-100 bg-purple-50/50" :
                            "text-orange-500 border-orange-100 bg-orange-50/50"
                          )}>
                            Fase: {week.fase}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {week.estimasiJam} Jam
                          </span>
                        </div>
                      </div>

                      {/* Tasks Checkbox List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {week.tugas.map((task) => {
                          const isDone = completedTasks.includes(task.id)
                          return (
                            <button
                              key={task.id}
                              onClick={() => toggleTask(task.id, week.minggu)}
                              className={cn(
                                "flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                                isDone 
                                  ? "bg-white border-[#1D9E75]/30 text-[#1D9E75] shadow-sm" 
                                  : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                              )}
                            >
                              <div className={cn(
                                "flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
                                isDone ? "bg-[#1D9E75] border-[#1D9E75] text-white" : "border-slate-200"
                              )}>
                                {isDone && <Check className="w-4 h-4 stroke-[4px]" />}
                              </div>
                              <span className={cn(
                                "text-xs font-bold uppercase tracking-tight leading-none",
                                isDone && "line-through opacity-60"
                              )}>
                                {task.text}
                              </span>
                            </button>
                          )
                        })}
                      </div>

                      {/* Resource Footer */}
                      {week.resource && (
                        <div className="pt-4 border-t border-slate-100/60 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center">
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {week.resource.platform}: <span className="text-slate-600">{week.resource.judul}</span>
                            </span>
                          </div>
                          <a 
                            href={week.resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#1D9E75] text-[10px] font-black uppercase tracking-widest hover:underline"
                          >
                            Pelajari <ChevronRight className="inline w-3 h-3 ml-0.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Motivational Footer */}
        <section className="pt-12">
          <div className="bg-black rounded-[40px] p-10 md:p-16 relative overflow-hidden text-center md:text-left">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none hidden md:block">
              <Trophy className="w-48 h-48 text-white" />
            </div>
            <div className="max-w-xl space-y-8 relative z-10">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-tight">
                  Konsistensi Adalah <br /> Kunci Kesuksesan.
                </h2>
                <p className="text-slate-400 font-medium">
                  Jangan terburu-buru. Fokus pada kualitas setiap tugas yang kamu kerjakan. 
                  Lulusan SMK yang sukses adalah mereka yang berani belajar setiap hari.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-white text-black hover:bg-[#1D9E75] hover:text-white h-14 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-[#1D9E75]" />
                    <div className="text-left">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest -mb-1">Target Selesai</p>
                      <p className="text-sm font-black text-white italic">90 HARI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
