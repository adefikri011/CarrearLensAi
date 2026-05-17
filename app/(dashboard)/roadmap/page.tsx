'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  ChevronRight, 
  Clock, 
  ExternalLink, 
  Trophy, 
  AlertCircle, 
  ArrowRight,
  Target,
  CheckCircle2,
  Lock,
  Search,
  Calendar,
  Zap,
  Info,
  ChevronDown,
  LayoutDashboard
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
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null)

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
        // Auto-set active phase based on last incomplete task
        const roadmap = analysisResult.data.result?.roadmap90Hari || []
        if (roadmap.length > 0) {
          // Default to fondasi, but we could find the first week with incomplete tasks
        }
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

  const filteredWeeks = useMemo(() => {
    return roadmapData.filter(w => w.fase === activePhase)
  }, [roadmapData, activePhase])

  // Find "Current Week" (First week that is not fully completed)
  const currentWeekNumber = useMemo(() => {
    for (const week of roadmapData) {
      const isWeekDone = week.tugas.every(t => completedTasks.includes(t.id))
      if (!isWeekDone) return week.minggu
    }
    return roadmapData.length // All done
  }, [roadmapData, completedTasks])

  if (isLoading) return <PageLoader isLoading={true} text="Menyusun Roadmap Strategis-mu..." />

  if (!analysis || !analysis.result?.roadmap90Hari || analysis.result.roadmap90Hari.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md space-y-6"
        >
          <div className="w-24 h-24 bg-[#1D9E75]/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
            <Search className="w-12 h-12 text-[#1D9E75]" />
          </div>
          <h1 className="text-4xl font-black text-black tracking-tight italic uppercase">Data Tidak Ditemukan</h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Sepertinya kamu belum melakukan analisis CV atau data roadmap belum ter-generate. 
            Mulai sekarang untuk mendapatkan panduan karier 90 hari.
          </p>
          <Button 
            onClick={() => router.push('/cv-builder')}
            className="w-full h-16 bg-[#1D9E75] hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-2xl shadow-[#1D9E75]/20 group"
          >
            Selesaikan Analisis CV
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Premium Header Container */}
      <div className="bg-white border-b border-slate-200/60 sticky top-0 z-50 backdrop-blur-md bg-white/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-black rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-black text-black tracking-tighter uppercase italic">Roadmap Karier 90 Hari</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-[#1D9E75] text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  {analysis.selectedPath}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-l border-slate-200 pl-3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1D9E75]" />
                  {stats.completed}/{stats.total} Komplet
                </span>
              </div>
            </div>
            
            <div className="md:w-64 space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery Level</span>
                <span className="text-3xl font-black text-[#1D9E75] tracking-tighter italic">{stats.percentage}%</span>
              </div>
              <Progress value={stats.percentage} className="h-3 bg-slate-100" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Navigation & Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Phase Selector (Sidebar on Desktop, Top Scroll on Mobile) */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Navigation</h2>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
              {(['fondasi', 'pengembangan', 'persiapan'] as const).map((phase, idx) => (
                <button
                  key={phase}
                  onClick={() => setActivePhase(phase)}
                  className={cn(
                    "flex-shrink-0 flex items-center justify-between px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all text-left",
                    activePhase === phase 
                      ? "bg-black text-white shadow-xl shadow-black/20 translate-x-1" 
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-100"
                  )}
                >
                  <span className="flex flex-col">
                    <span className={cn("text-[9px] mb-1 opacity-60", activePhase === phase ? "text-[#1D9E75]" : "text-slate-400")}>Fase 0{idx + 1}</span>
                    {phase}
                  </span>
                  <ChevronRight className={cn("w-4 h-4 ml-2 hidden lg:block", activePhase === phase ? "text-[#1D9E75]" : "text-slate-300")} />
                </button>
              ))}
            </div>

            {/* Quick Stats Mini-Card */}
            <div className="hidden lg:block bg-[#534AB7]/5 border border-[#534AB7]/10 rounded-[32px] p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#534AB7]" />
                <h3 className="text-xs font-black uppercase">Quick Insights</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-500">Estimasi Fokus</span>
                  <span className="text-black">15-20 Jam/Minggu</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-500">Tingkat Kesulitan</span>
                  <span className="text-black uppercase tracking-tighter">Menengah</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Roadmap Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Active Phase Intro */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#1D9E75]">
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Fase {activePhase}</span>
              </div>
              <h2 className="text-4xl font-black text-black tracking-tighter uppercase italic leading-none">
                {activePhase === 'fondasi' ? 'Membangun Akar Kompetensi' : 
                 activePhase === 'pengembangan' ? 'Akselerasi Skill & Portofolio' : 
                 'Strategi Penetrasi Industri'}
              </h2>
              <p className="text-slate-500 font-medium max-w-2xl">
                Langkah-langkah strategis yang disusun AI untuk memastikan transisi kariermu berjalan mulus dalam 90 hari ke depan.
              </p>
            </div>

            {/* Timeline View */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhase}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {filteredWeeks.map((week, weekIdx) => {
                    const isFullyDone = week.tugas.every(t => completedTasks.includes(t.id))
                    const isCurrent = week.minggu === currentWeekNumber
                    const isExpanded = expandedWeek === week.minggu

                    return (
                      <div key={week.minggu} className="relative pl-8 md:pl-12 border-l-2 border-slate-200 pb-4 last:border-0 last:pb-0 group">
                        {/* Timeline Node */}
                        <div className={cn(
                          "absolute -left-[13px] top-0 w-6 h-6 rounded-full border-4 flex items-center justify-center transition-all duration-500 z-10 shadow-sm",
                          isFullyDone ? "bg-[#1D9E75] border-[#F8FAFC]" : 
                          isCurrent ? "bg-black border-white animate-bounce" : 
                          "bg-white border-slate-200"
                        )}>
                          {isFullyDone && <Check className="w-3 h-3 text-white stroke-[4px]" />}
                        </div>

                        {/* Week Card Container */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: weekIdx * 0.1 }}
                          className={cn(
                            "bg-white rounded-[32px] transition-all duration-300 border overflow-hidden",
                            isFullyDone ? "border-[#1D9E75]/30 bg-[#ECFDF5]/20" : 
                            isCurrent ? "border-black shadow-2xl shadow-black/5 ring-1 ring-black/5" : 
                            "border-slate-100 hover:border-slate-200"
                          )}
                        >
                          {/* Card Header (Always Visible) */}
                          <div 
                            onClick={() => setExpandedWeek(isExpanded ? null : week.minggu)}
                            className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black transition-colors",
                                isFullyDone ? "bg-[#1D9E75] text-white" : "bg-slate-100 text-slate-400 group-hover:bg-black group-hover:text-white"
                              )}>
                                <span className="text-[10px] uppercase -mb-1 opacity-60">Minggu</span>
                                <span className="text-xl italic">{week.minggu}</span>
                              </div>
                              <div className="space-y-1">
                                <h3 className="text-xl font-black text-black tracking-tight uppercase italic">{week.judul}</h3>
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Clock className="w-3 h-3" /> ~{week.estimasiJam} Jam
                                  </span>
                                  {isCurrent && (
                                    <span className="px-2 py-0.5 bg-yellow-400 text-black text-[9px] font-black uppercase rounded tracking-widest flex items-center gap-1">
                                      <Zap className="w-3 h-3" /> Focus
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 self-end md:self-center">
                              <div className="hidden sm:block h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#1D9E75]" style={{ 
                                  width: `${(week.tugas.filter(t => completedTasks.includes(t.id)).length / week.tugas.length) * 100}%` 
                                }} />
                              </div>
                              <ChevronDown className={cn("w-5 h-5 text-slate-300 transition-transform duration-300", isExpanded && "rotate-180 text-black")} />
                            </div>
                          </div>

                          {/* Expanded Content (Tasks) */}
                          <AnimatePresence>
                            {(isExpanded || isCurrent) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-slate-50/50"
                              >
                                <div className="p-6 md:p-8 pt-0 space-y-6">
                                  <div className="h-px bg-slate-200/60 w-full" />
                                  
                                  {/* Task List */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {week.tugas.map((task) => {
                                      const isDone = completedTasks.includes(task.id)
                                      return (
                                        <div 
                                          key={task.id}
                                          onClick={() => toggleTask(task.id, week.minggu)}
                                          className={cn(
                                            "flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 group cursor-pointer transition-all hover:border-black/10",
                                            isDone ? "bg-[#ECFDF5]/60 border-[#1D9E75]/20 shadow-sm" : "hover:shadow-lg hover:shadow-black/5"
                                          )}
                                        >
                                          <div className={cn(
                                            "flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                                            isDone 
                                              ? "bg-[#1D9E75] border-[#1D9E75] text-white scale-110" 
                                              : "border-slate-200 group-hover:border-black"
                                          )}>
                                            {isDone && <Check className="w-4 h-4 stroke-[3px]" />}
                                          </div>
                                          <span className={cn(
                                            "text-xs font-black uppercase tracking-tight transition-all duration-300",
                                            isDone ? "text-[#1D9E75]/60 line-through italic" : "text-slate-600"
                                          )}>
                                            {task.text}
                                          </span>
                                        </div>
                                      )
                                    })}
                                  </div>

                                  {/* Resource & Actions */}
                                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 rounded-2xl bg-white/50 border border-dashed border-slate-200 px-6">
                                    <div className="flex items-center gap-3">
                                      <div className="p-1.5 bg-[#534AB7]/10 rounded-lg">
                                        <ExternalLink className="w-4 h-4 text-[#534AB7]" />
                                      </div>
                                      <div className="space-y-0.5">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Recommended Resource</p>
                                        <p className="text-[11px] font-black text-black uppercase tracking-tight truncate max-w-xs">
                                          {week.resource.platform}: {week.resource.judul}
                                        </p>
                                      </div>
                                    </div>
                                    <Button 
                                      asChild
                                      variant="ghost" 
                                      size="sm"
                                      className="text-[#1D9E75] text-[10px] font-black uppercase hover:bg-[#1D9E75] hover:text-white transition-all rounded-xl"
                                    >
                                      <a href={week.resource.url} target="_blank" rel="noopener noreferrer">
                                        Pelajari Materi <ChevronRight className="ml-1 w-3 h-3" />
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    )
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Career Goal Banner */}
        <div className="relative mt-20 group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1D9E75] to-[#534AB7] rounded-[64px] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="relative bg-black rounded-[64px] p-10 md:p-20 overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10 transform translate-x-10 -translate-y-10">
              <Trophy className="w-64 h-64 text-white" />
            </div>
            
            <div className="max-w-2xl relative z-10 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-md">
                  <Zap className="w-4 h-4 text-[#1D9E75]" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">End Game Goal</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-tight">
                  Tinggal {stats.remaining} Langkah Lagi Untuk Menjadi <span className="text-[#1D9E75] underline decoration-wavy underline-offset-8">PRO</span>
                </h2>
                <p className="text-slate-400 text-lg font-medium">
                  Roadmap ini adalah simulasi dunia kerja sebenarnya. Selesaikan 90 hari ini untuk membuktikan kemampuanmu bersaing secara global.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="h-16 px-10 bg-white text-black hover:bg-[#1D9E75] hover:text-white rounded-3xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-white/5"
                >
                  <LayoutDashboard className="mr-2 w-5 h-5" />
                  Dashboard
                </Button>
                <div className="flex items-center gap-4 px-6 rounded-3xl border border-white/20 bg-white/5 backdrop-blur-sm">
                  <div className="text-left">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Mastery Progress</p>
                    <p className="text-xl font-black text-white italic tracking-tighter">{stats.percentage}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back to Top / Quick Nav for Mobile */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 p-2 bg-black/80 backdrop-blur-lg rounded-full border border-white/10 shadow-2xl z-50 md:hidden">
        {(['fondasi', 'pengembangan', 'persiapan'] as const).map((p, i) => (
          <button 
            key={p}
            onClick={() => {
              setActivePhase(p);
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
              activePhase === p ? "bg-[#1D9E75] text-white" : "text-white/40"
            )}
          >
            F{i+1}
          </button>
        ))}
      </div>
    </div>
  )
}
