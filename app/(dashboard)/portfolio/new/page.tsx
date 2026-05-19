'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Wand2, 
  Save, 
  Plus, 
  X, 
  ImageIcon, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layout,
  Type
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    rawDescription: "",
    tools: [] as string[],
    thumbnailUrl: "",
    newTool: ""
  });

  const [aiResult, setAiResult] = useState<{
    refinedTitle: string;
    refinedDescription: string;
    tags: string[];
    metrics: string;
    summary: string;
  } | null>(null);

  const handleAddTool = () => {
    if (formData.newTool.trim() && !formData.tools.includes(formData.newTool.trim())) {
      setFormData({
        ...formData,
        tools: [...formData.tools, formData.newTool.trim()],
        newTool: ""
      });
    }
  };

  const removeTool = (tool: string) => {
    setFormData({
      ...formData,
      tools: formData.tools.filter(t => t !== tool)
    });
  };

  const generateAIContent = async () => {
    if (!formData.title || !formData.rawDescription) {
      toast.error("Mohon lengkapi judul dan deskripsi proyek");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/project/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          rawDescription: formData.rawDescription,
          tools: formData.tools
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiResult(data.data);
        setStep(2);
        toast.success("AI berhasil memoles proyekmu!");
      } else {
        toast.error(data.error || "Gagal membuat konten AI");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveProject = async () => {
    if (!aiResult) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: aiResult.refinedTitle,
          rawDescription: formData.rawDescription,
          refinedDescription: aiResult.refinedDescription,
          thumbnailUrl: formData.thumbnailUrl || "https://picsum.photos/seed/project/1920/1080",
          tools: formData.tools,
          tags: aiResult.tags,
          metrics: aiResult.metrics
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Portfolio berhasil disimpan!");
        router.push('/portfolio');
      } else {
        toast.error("Gagal menyimpan proyek");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => step === 1 ? router.back() : setStep(1)}
          className="rounded-xl group hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          {step === 1 ? "Kembali" : "Edit Input"}
        </Button>
        <div className="flex gap-2">
          {[1, 2].map(i => (
            <div key={i} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= i ? "bg-teal" : "bg-zinc-100 dark:bg-zinc-800"}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
                Buat <span className="text-teal">Karya Baru.</span>
              </h1>
              <p className="text-sm font-medium text-zinc-500 max-w-lg">
                Masukkan detail proyek praktikummu. AI akan menjahit metadata ini menjadi case study profesional.
              </p>
            </div>

            <Card className="p-8 border-none bg-white dark:bg-zinc-900 shadow-2xl shadow-black/[0.03] ring-1 ring-black/[0.03] rounded-[2.5rem] space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Type size={14} className="text-teal" /> Judul Proyek (Singkat)
                  </label>
                  <Input 
                    placeholder="Contoh: Rancang Bangun Website E-Commerce"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-transparent focus:bg-white dark:focus:bg-zinc-900 focus:border-teal/20 transition-all font-bold text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Layout size={14} className="text-teal" /> Deskripsi Apa Adanya (Ceritakan Prosesmu)
                  </label>
                  <Textarea 
                    placeholder="Ceritakan apa yang kamu buat, kenapa kamu buat itu, dan apa hasilnya meski pakai bahasa santai..."
                    className="min-h-[200px] rounded-3xl bg-zinc-50 dark:bg-zinc-950 border-transparent focus:bg-white dark:focus:bg-zinc-900 focus:border-teal/20 transition-all text-normal leading-relaxed resize-none p-6"
                    value={formData.rawDescription}
                    onChange={e => setFormData({...formData, rawDescription: e.target.value})}
                  />
                  <div className="flex items-center gap-2 text-amber-500 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl">
                    <AlertCircle size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Jangan khawatir typo, AI akan merapikannya</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Cpu size={14} className="text-teal" /> Tools / Alat yang Digunakan
                  </label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Contoh: Cisco Packet Tracer, VS Code, Figma..."
                      value={formData.newTool}
                      onChange={e => setFormData({...formData, newTool: e.target.value})}
                      onKeyPress={e => e.key === 'Enter' && handleAddTool()}
                      className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950"
                    />
                    <Button onClick={handleAddTool} variant="outline" className="h-12 w-12 p-0 rounded-xl">
                      <Plus size={20} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tools.map(tool => (
                      <Badge key={tool} className="py-2 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full flex items-center gap-2 border-none">
                        {tool}
                        <button onClick={() => removeTool(tool)} className="hover:text-red-500">
                          <X size={14} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon size={14} className="text-teal" /> Link Foto Proyek (Opsional)
                  </label>
                  <Input 
                    placeholder="Link gambar hasil karyamu..."
                    value={formData.thumbnailUrl}
                    onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
                    className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950"
                  />
                </div>
              </div>

              <Button 
                onClick={generateAIContent}
                disabled={isGenerating || !formData.title || !formData.rawDescription}
                className="w-full h-16 bg-teal hover:bg-teal-dark text-white rounded-3xl font-black uppercase tracking-widest gap-3 shadow-xl shadow-teal/20 transition-all hover:scale-[1.02] active:scale-95 disabled:scale-100 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
                {isGenerating ? "Menganalisis Proyek..." : "Poles dengan CareerLens AI"}
              </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 pb-20"
          >
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
                Review <span className="text-teal italic">Hasil AI.</span>
              </h1>
              <p className="text-sm font-medium text-zinc-500">
                Berikut adalah versi profesional dari karyamu. Kamu bisa mengeditnya secara manual jika perlu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Refined Card */}
                <Card className="p-8 md:p-10 border-none bg-white dark:bg-zinc-900 shadow-2xl shadow-black/[0.03] ring-1 ring-black/[0.03] rounded-[3rem] space-y-8">
                  <div className="space-y-4">
                    <Badge className="bg-teal/10 text-teal border-none px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">Title Optimized</Badge>
                    <Input 
                      value={aiResult?.refinedTitle} 
                      onChange={e => setAiResult(prev => prev ? {...prev, refinedTitle: e.target.value} : null)}
                      className="text-2xl md:text-4xl font-black text-zinc-900 dark:text-white bg-transparent border-none p-0 focus-visible:ring-0 h-auto"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-teal" /> Professional Narrative (STAR Method)
                      </label>
                      <Badge variant="outline" className="text-[9px] font-bold">Autogenerated</Badge>
                    </div>
                    <Textarea 
                      value={aiResult?.refinedDescription} 
                      onChange={e => setAiResult(prev => prev ? {...prev, refinedDescription: e.target.value} : null)}
                      className="min-h-[400px] text-lg font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50/50 dark:bg-zinc-950/20 border-none rounded-3xl p-8 focus-visible:ring-1 focus-visible:ring-teal/20"
                    />
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Metadata & Actions */}
                <Card className="p-6 border-none bg-zinc-50 dark:bg-zinc-900 shadow-xl rounded-[2rem] space-y-6 sticky top-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Industry Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {aiResult?.tags.map(tag => (
                        <Badge key={tag} className="bg-white dark:bg-zinc-800 text-teal border-none text-[10px] font-bold py-1.5 px-3">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Performance Metrics</label>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 p-3 rounded-xl border border-teal/10">{aiResult?.metrics}</p>
                  </div>

                  <div className="pt-6 space-y-4">
                    <Button 
                      onClick={saveProject}
                      disabled={isSaving}
                      className="w-full h-16 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-black dark:hover:bg-zinc-100 rounded-2xl font-black uppercase tracking-widest gap-3 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                      Simpan Portfolio
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="w-full h-14 border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold uppercase tracking-widest text-xs"
                    >
                      Edit Input Kembali
                    </Button>
                  </div>
                </Card>

                <div className="p-6 bg-teal/5 rounded-[2rem] border border-teal/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-teal text-white flex items-center justify-center">
                      <Wand2 size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-teal">Recruiter Summary</span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                    &ldquo;{aiResult?.summary}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
