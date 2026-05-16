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
  Search
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import PageLoader from '@/components/shared/PageLoader'
import { Button } from '@/components/ui/button'

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
        // If analysis exists, default phase to the first week's phase or current progress phase
        if (analysisResult.data.result?.roadmap90Hari?.length > 0) {
          // Find the first phase that isn't fully completed or just default to fondasi
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
    // Optimistic update
    const isCurrentlyCompleted = completedTasks.includes(taskId)
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
        // Revert on failure
        setCompletedTasks(prev => 
          isCurrentlyCompleted ? [...prev, taskId] : prev.filter(id => id !== taskId)
        )
        toast.error('Gagal menyimpan progres')
      }
    } catch (error) {
      // Revert on error
      setCompletedTasks(prev => 
        isCurrentlyCompleted ? [...prev, taskId] : prev.filter(id => id !== taskId)
      )
      toast.error('Kesalahan jaringan')
    }
  }

  const roadmapData = analysis?.result?.roadmap90Hari || []
  
  const stats = useMemo(() => {
    const allTasks = roadmapData.flatMap(w => w.tugas)
    const total = allTasks.length
    const completed = completedTasks.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, remaining: total - completed, percentage }
  }, [roadmapData, completedTasks])

  const filteredWeeks = roadmapData.filter(w => w.fase === activePhase)

  if (isLoading) return <PageLoader isLoading={true} text="Menyiapkan Roadmap Karier..." />

  if (!analysis || !analysis.result?.roadmap90Hari) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md space-y-6"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Search className="w-12 h-12 text-gray-300" />
          </div>
          <h1 className="text-3xl font-black text-black">Roadmap Belum Tersedia</h1>
          <p className="text-gray-500 font-medium">
            Selesaikan analisis CV terlebih dahulu untuk mendapatkan roadmap personal 90 hari yang disesuaikan dengan profil SMK-mu.
          </p>
          <Button 
            onClick={() => router.push('/cv-builder')}
            className="w-full h-14 bg-black hover:bg-[#1D9E75] text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-black/10"
          >
            Analisis CV Sekarang
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-xl font-black text-black tracking-tight leading-none uppercase italic">Roadmap Karier 90 Hari</h1>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#1D9E75]/10 text-[#1D9E75] text-[10px] font-black uppercase tracking-widest rounded transition-all">
                  {analysis.selectedPath}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {stats.completed} dari {stats.total} tugas selesai
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#1D9E75] tracking-tighter italic">{stats.percentage}%</span>
              <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] -mt-1">Progress</p>
            </div>
          </div>
          
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.percentage}%` }}
              className="h-full bg-gradient-to-r from-[#1D9E75] to-[#534AB7]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-8 pb-24 text-black">
        {/* Phase Tabs */}
        <div className="flex items-center justify-center p-1 bg-gray-100 rounded-full w-fit mx-auto shadow-sm">
          {(['fondasi', 'pengembangan', 'persiapan'] as const).map((phase, idx) => (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                activePhase === phase 
                  ? "bg-black text-white shadow-xl" 
                  : "text-gray-500 hover:text-black"
              )}
            >
              Fase {idx + 1}: {phase}
            </button>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="flex items-center justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1D9E75]" />
            <span className="text-black">{stats.completed} Tugas Selesai</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#534AB7]" />
            <span>{stats.remaining} Tugas Tersisa</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-orange-400" />
            <span>{stats.percentage}% Total Progress</span>
          </div>
        </div>

        {/* Week Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="wait">
            {filteredWeeks.map((week, idx) => {
              const isWeekCompleted = week.tugas.every(t => completedTasks.includes(t.id))
              
              return (
                <motion.div
                  key={week.minggu}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "bg-white border rounded-[32px] p-8 space-y-6 transition-all duration-300",
                    isWeekCompleted 
                      ? "border-[#1D9E75] bg-[#ECFDF5]/50 shadow-lg shadow-[#1D9E75]/5" 
                      : "border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-black/5"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-black text-white text-[9px] font-black rounded italic">
                          MGG {week.minggu}
                        </span>
                        {isWeekCompleted && (
                          <span className="text-[10px] font-black text-[#1D9E75] uppercase tracking-widest flex items-center gap-1">
                            <Check className="w-3 h-3" /> SELESAI
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-black tracking-tight leading-tight uppercase italic">{week.judul}</h3>
                    </div>
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                      isWeekCompleted ? "bg-[#1D9E75] text-white" : "bg-gray-50 text-gray-300"
                    )}>
                      {isWeekCompleted ? <Check className="w-6 h-6 stroke-[3px]" /> : <Clock className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* Task List */}
                  <div className="space-y-3">
                    {week.tugas.map((task) => {
                      const isDone = completedTasks.includes(task.id)
                      return (
                        <div 
                          key={task.id}
                          onClick={() => toggleTask(task.id, week.minggu)}
                          className="flex items-start gap-3 group cursor-pointer"
                        >
                          <div className={cn(
                            "flex-shrink-0 w-6 h-6 rounded-lg border-2 mt-0.5 flex items-center justify-center transition-all duration-300",
                            isDone 
                              ? "bg-[#1D9E75] border-[#1D9E75] text-white scale-110" 
                              : "border-gray-200 bg-white group-hover:border-[#1D9E75]/50"
                          )}>
                            {isDone && <Check className="w-4 h-4 stroke-[3px]" />}
                          </div>
                          <span className={cn(
                            "text-sm font-medium transition-all duration-300 leading-tight",
                            isDone ? "text-gray-400 line-through italic" : "text-gray-700"
                          )}>
                            {task.text}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Footer */}
                  <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                    {week.resource && (
                      <a 
                        href={week.resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[#1D9E75] text-[10px] font-black uppercase tracking-widest hover:underline group"
                      >
                        <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        {week.resource.platform}: {week.resource.judul}
                      </a>
                    )}
                    <div className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-full italic">
                      ~{week.estimasiJam} Jam
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Motivational Banner */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-black rounded-[48px] p-12 text-center space-y-6 relative overflow-hidden mt-12"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Trophy className="w-48 h-48 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Fokus & Konsisten</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto font-medium">
              Roadmap ini dirancang khusus untuk membantu lulusan SMK Indonesia bersaing di industri global. 
              Selesaikan setiap tugas dan bangun masa depanmu.
            </p>
          </div>
          <Button 
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white hover:text-black rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-[10px] transition-all"
          >
            Kembali Ke Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
