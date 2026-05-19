'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
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
  CheckCircle2,
  Sparkles,
  Zap,
  BookOpen,
  ArrowUpRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import PageLoader from '@/components/shared/PageLoader'
import { Button } from '@/components/ui/button'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

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

  if (isLoading) return <PageLoader isLoading={true} text="Menyiapkan Strategi Kariermu..." />

  if (!analysis || !analysis.result?.roadmap90Hari || analysis.result.roadmap90Hari.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-zinc-950 transition-colors">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md space-y-8"
        >
          <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2rem] flex items-center justify-center mx-auto mb-4 transition-all">
            <Search className="w-10 h-10 text-slate-300 dark:text-zinc-700" />
          </div>
          <div className="space-y-4">
             <h1 className="text-3xl font-black text-black dark:text-white uppercase italic tracking-tighter transition-colors">Peta Belum Terbuka</h1>
             <p className="text-slate-500 dark:text-zinc-500 font-medium text-sm leading-relaxed px-4 transition-colors">
               Selesaikan analisis CV terlebih dahulu untuk merancang roadmap 90 hari yang disesuaikan dengan profil SMK-mu.
             </p>
          </div>
          <Button 
            onClick={() => router.push('/cv-builder')}
            className="w-full h-14 bg-black dark:bg-white text-white dark:text-black hover:bg-[#1D9E75] dark:hover:bg-[#1D9E75] dark:hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-black/10 dark:shadow-white/5"
          >
            Mulai Analisis Sekarang
            <ArrowRight className="ml-3 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-zinc-950 transition-colors">
      {/* Header Section - Non-Sticky to avoid blocking */}
      <div className="bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-900 transition-colors">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="bg-[#1D9E75]/10 p-2 rounded-xl transition-colors">
                    <Zap className="w-5 h-5 text-[#1D9E75]" />
                  </div>
                  <span className="text-[10px] font-black text-[#1D9E75] uppercase tracking-[0.3em]">90 Hari Misi Transformasi</span>
               </div>
               <div className="space-y-2">
                 <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white tracking-tight uppercase italic leading-[0.85] transition-colors">
                   Roadmap <br /> <span className="text-[#1D9E75]">Arsitek</span> Karier.
                 </h1>
                 <p className="text-slate-500 dark:text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-widest max-w-xl leading-relaxed transition-colors">
                   Setiap langkah dirancang presisi untuk lulusan {analysis.selectedPath}. Selesaikan misi mingguan untuk membuka peluang kerja.
                 </p>
               </div>
            </div>

            {/* Stats Circular Card */}
            <div className="bg-black dark:bg-zinc-900 text-white rounded-[2.5rem] p-8 md:p-10 md:min-w-[340px] shadow-2xl relative overflow-hidden group transition-all">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#1D9E75] opacity-20 blur-[60px] group-hover:opacity-30 transition-opacity" />
               <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-[#1D9E75] uppercase tracking-widest">Total Mastery</p>
                    <p className="text-4xl font-black italic tracking-tighter transition-colors">{stats.percentage}%</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center transition-colors">
                    <Trophy className="w-7 h-7 text-[#1D9E75]" />
                  </div>
               </div>
               <div className="mt-8 space-y-4 relative z-10">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.percentage}%` }}
                      className="h-full bg-[#1D9E75] transition-all duration-1000"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>{stats.completed} Misi Selesai</span>
                    <span className="text-white">{stats.remaining} Tersisa</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Phase Navigation Sidebar (Desktop) */}
        <aside className="lg:col-span-3 space-y-8 hidden lg:block">
           <div className="sticky top-12 space-y-6">
              <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] px-4 transition-colors">Pilih Tahapan</p>
              <nav className="space-y-3">
                {(['fondasi', 'pengembangan', 'persiapan'] as const).map((phase) => {
                  const isActive = activePhase === phase;
                  const phaseWeeks = roadmapData.filter(w => w.fase === phase);
                  const isDone = phaseWeeks.every(w => w.tugas.every(t => completedTasks.includes(t.id)));
                  
                  return (
                    <button
                      key={phase}
                      onClick={() => setActivePhase(phase)}
                      className={cn(
                        "w-full flex items-center justify-between p-5 rounded-[2rem] transition-all text-left group transition-all",
                        isActive 
                          ? "bg-black dark:bg-zinc-800 text-white shadow-2xl scale-105" 
                          : "text-slate-400 dark:text-zinc-600 hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-900"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                          isActive ? "bg-[#1D9E75] text-white" : "bg-slate-100 dark:bg-zinc-800 text-slate-300 dark:text-zinc-700 group-hover:bg-slate-200 dark:group-hover:bg-zinc-700"
                        )}>
                          {isActive ? <Zap className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </div>
                        <span className="font-black text-[11px] uppercase tracking-widest">{phase}</span>
                      </div>
                      {isDone && <CheckCircle2 className="w-4 h-4 text-[#1D9E75]" />}
                    </button>
                  );
                })}
              </nav>

              <div className="bg-[#1D9E75]/5 dark:bg-[#1D9E75]/10 rounded-3xl p-6 border border-[#1D9E75]/10 dark:border-[#1D9E75]/20 space-y-4 transition-all">
                 <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#1D9E75]" />
                    <p className="font-black text-[10px] uppercase tracking-widest text-[#1D9E75]">AI Recommendation</p>
                 </div>
                 <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-tight leading-relaxed transition-colors">
                   Fokus pada fase <b>{activePhase}</b> minggu ini untuk mengoptimalkan persiapan teknismu.
                 </p>
              </div>
           </div>
        </aside>

        {/* Phase Nav (Mobile) */}
        <div className="lg:hidden flex gap-2 bg-slate-50 dark:bg-zinc-900 p-2 rounded-2xl overflow-x-auto no-scrollbar transition-all">
           {(['fondasi', 'pengembangan', 'persiapan'] as const).map((phase) => (
             <button
               key={phase}
               onClick={() => setActivePhase(phase)}
               className={cn(
                 "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                 activePhase === phase ? "bg-black dark:bg-zinc-800 text-white shadow-lg" : "text-slate-400 dark:text-zinc-600"
               )}
             >
               {phase}
             </button>
           ))}
        </div>

        {/* Roadmap Timeline Content */}
        <section className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12 md:space-y-20 relative"
            >
              {/* Vertical Connector Line (Desktop) */}
              <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-gray-50 dark:bg-zinc-900 hidden md:block transition-colors" />

              {roadmapData
                .filter(w => w.fase === activePhase)
                .map((week, idx) => {
                  const isWeekDone = week.tugas.every(t => completedTasks.includes(t.id));
                  
                  return (
                    <div key={week.minggu} className="relative z-10 group">
                      <div className="flex flex-col md:flex-row gap-8">
                        
                        {/* Week Indicator */}
                        <div className="flex-shrink-0 flex md:block items-center gap-4">
                          <div className={cn(
                            "w-20 h-20 rounded-[2.5rem] flex flex-col items-center justify-center border-4 transition-all duration-500",
                            isWeekDone 
                              ? "bg-teal border-teal text-white shadow-2xl shadow-teal/20" 
                              : "bg-white dark:bg-zinc-900 border-gray-50 dark:border-zinc-800 text-black dark:text-white group-hover:border-teal/50 shadow-sm"
                          )}>
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Week</p>
                            <p className="text-3xl font-black italic tracking-tighter transition-colors">{week.minggu}</p>
                          </div>
                        </div>

                        {/* Week Content */}
                        <div className="flex-1 space-y-8">
                           <div className="space-y-2 px-2">
                             <div className="flex items-center gap-3">
                               <Badge className="bg-gray-100 dark:bg-zinc-900 text-gray-500 dark:text-zinc-500 border-none px-3 py-0.5 rounded-full font-black text-[8px] tracking-[0.2em] uppercase transition-colors">
                                 {week.estimasiJam} Jam Belajar
                               </Badge>
                               {isWeekDone && <p className="text-[8px] font-black text-teal uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Selesai</p>}
                             </div>
                             <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white tracking-tight uppercase italic group-hover:text-teal dark:group-hover:text-teal transition-colors leading-tight">
                               {week.judul}
                             </h3>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {week.tugas.map((task) => {
                               const isTaskDone = completedTasks.includes(task.id);
                               return (
                                 <button
                                   key={task.id}
                                   onClick={() => toggleTask(task.id, week.minggu)}
                                   className={cn(
                                     "flex items-start gap-4 p-5 rounded-3xl border transition-all text-left relative overflow-hidden active:scale-[0.98] group/task",
                                     isTaskDone 
                                       ? "bg-gray-50/50 dark:bg-teal/5 border-teal/10 text-teal/80" 
                                       : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-black dark:text-white hover:border-black dark:hover:border-white shadow-sm hover:shadow-teal/5"
                                   )}
                                 >
                                   <div className={cn(
                                     "w-6 h-6 rounded-lg border-2 mt-0.5 flex items-center justify-center shrink-0 transition-all",
                                     isTaskDone 
                                       ? "bg-teal border-teal text-white" 
                                       : "border-gray-200 dark:border-zinc-800 group-hover/task:border-black dark:group-hover/task:border-white"
                                   )}>
                                     {isTaskDone && <Check className="w-4 h-4 stroke-[4px]" />}
                                   </div>
                                   <span className={cn(
                                      "text-[11px] font-black uppercase leading-tight tracking-tight transition-colors",
                                      isTaskDone && "line-through opacity-70"
                                   )}>
                                     {task.text}
                                   </span>
                                 </button>
                               );
                             })}
                           </div>

                           {/* Resources Card */}
                           {week.resource && (
                             <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all"
                             >
                               <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-[#1D9E75] transition-colors">
                                     <BookOpen className="w-7 h-7" />
                                  </div>
                                  <div className="space-y-1">
                                     <p className="text-[9px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest transition-colors">{week.resource.platform}</p>
                                     <p className="font-black text-sm uppercase tracking-tight text-black dark:text-white transition-colors">{week.resource.judul}</p>
                                  </div>
                               </div>
                               <Button 
                                  asChild
                                  variant="ghost"
                                  className="h-12 px-6 rounded-xl hover:bg-[#1D9E75] hover:text-white dark:text-white dark:hover:bg-[#1D9E75] transition-all group/btn"
                               >
                                 <a href={week.resource.url} target="_blank" rel="noopener noreferrer">
                                   <span className="font-black text-[10px] uppercase tracking-widest transition-colors">Buka Materi</span>
                                   <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                                 </a>
                               </Button>
                             </motion.div>
                           )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </motion.div>
          </AnimatePresence>

          {/* Motivational Footer */}
          <div className="mt-24 pt-24 border-t border-slate-100 dark:border-zinc-900 text-center space-y-12 transition-all">
             <div className="max-w-xl mx-auto space-y-6">
                <div className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center mx-auto scale-110 shadow-2xl transition-all">
                   <Target className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors">Tetap Konsisten, <span className="text-[#1D9E75] uppercase">Kemenangan</span> Menantimu.</h3>
                <p className="text-slate-500 dark:text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em] leading-relaxed transition-colors">
                  Lulusan SMK yang sukses adalah mereka yang berani melangkah setiap hari. Jangan menyerah sebelum garis finish.
                </p>
             </div>
             <Button 
                onClick={() => router.push('/dashboard')}
                className="h-14 px-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#1D9E75] dark:hover:bg-[#1D9E75] dark:hover:text-white shadow-2xl transition-all"
             >
                <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard Proyek
             </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
