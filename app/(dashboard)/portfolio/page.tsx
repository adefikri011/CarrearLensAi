'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Image as ImageIcon, 
  Rocket, 
  Wand2, 
  ExternalLink, 
  Briefcase, 
  BadgeCheck, 
  Trash2, 
  Loader2,
  Share2,
  AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  refinedDescription: string;
  tools: string[];
  tags: string[];
  metrics: string | null;
  createdAt: string;
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/project');
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      toast.error("Gagal memuat portfolio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus proyek ini dari portfolio?")) return;
    
    try {
      const res = await fetch(`/api/project?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success("Proyek dihapus");
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (error) {
      toast.error("Gagal menghapus proyek");
    }
  };

  const handleShare = (slug: string) => {
    const url = `${window.location.origin}/project/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link portfolio berhasil disalin!");
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Badge variant="outline" className="bg-teal/5 text-teal border-teal/10 px-3 py-1 rounded-full font-bold tracking-wider text-[10px] uppercase">
            Portfolio Showcase
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
            Koleksi <span className="text-teal italic">Karya.</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl font-medium">
            Ubah tugas sekolah dan proyek UKK menjadi bukti kompetensi profesional yang siap dipamerkan ke rekruter.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/portfolio/new">
            <Button className="h-14 px-8 bg-teal hover:bg-teal-dark text-white rounded-2xl font-bold uppercase tracking-tight shadow-lg shadow-teal/20 transition-all hover:scale-[1.02] active:scale-95 gap-2">
              <Plus size={20} /> Tambah Proyek
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-teal transition-colors" size={20} />
          <Input 
            placeholder="Cari proyek berdasarkan judul atau kompetensi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 pl-12 rounded-2xl border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-teal/20 focus:border-teal/30 transition-all text-sm font-medium"
          />
        </div>
        <div className="px-6 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 flex items-center gap-3 shrink-0">
          <div className="size-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal">
            <Briefcase size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Proyek</span>
            <span className="text-sm font-bold text-zinc-900 dark:text-white leading-none">{projects.length} Karya</span>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[400px] rounded-3xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <Card className="overflow-hidden border-none bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl shadow-black/[0.03] ring-1 ring-black/[0.03] flex flex-col h-full group-hover:shadow-2xl group-hover:shadow-teal/5 transition-all duration-500">
                {/* Thumbnail */}
                <div className="relative h-56 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  {project.thumbnailUrl ? (
                    <Image 
                      src={project.thumbnailUrl} 
                      alt={project.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 gap-2">
                      <ImageIcon size={40} />
                      <span className="text-xs font-bold uppercase tracking-widest">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <Link href={`/project/${project.slug}`} className="w-full">
                      <Button className="w-full h-12 bg-white text-black hover:bg-zinc-100 rounded-xl font-black uppercase tracking-tight text-xs gap-2">
                        <ExternalLink size={16} /> Lihat Live Portfolio
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-teal transition-colors">{project.title}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                      {project.refinedDescription.substring(0, 100)}...
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-zinc-50 dark:bg-zinc-800 text-[10px] font-bold py-1">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="secondary" className="bg-zinc-50 dark:bg-zinc-800 text-[10px] font-bold">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-teal/10 text-teal flex items-center justify-center">
                        <BadgeCheck size={12} />
                      </div>
                      <span className="text-[10px] font-bold text-teal uppercase tracking-widest">Verified Work</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link href={`/portfolio/edit/${project.slug}`}>
                        <Button variant="ghost" size="icon" className="size-8 rounded-lg text-zinc-400 hover:text-teal">
                          <Wand2 size={16} />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8 rounded-lg text-zinc-400 hover:text-teal"
                        onClick={() => handleShare(project.slug)}
                      >
                        <Share2 size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8 rounded-lg text-zinc-400 hover:text-red-500"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 flex flex-col items-center justify-center text-center space-y-6"
        >
          <div className="size-24 rounded-full bg-teal/5 flex items-center justify-center text-teal mb-4">
            <Rocket size={48} className="animate-bounce" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Belum ada karya?</h3>
            <p className="text-zinc-500 max-w-sm mx-auto font-medium">
              Ayo buat portfolio pertamamu sekarang! Ubah tugas sekolahmu menjadi sesuatu yang membanggakan.
            </p>
          </div>
          <Link href="/portfolio/new">
            <Button className="h-14 px-10 bg-teal hover:bg-teal-dark text-white rounded-[1.25rem] font-bold uppercase tracking-tight shadow-xl shadow-teal/10 transition-all hover:scale-105 active:scale-95 gap-2">
              <Wand2 size={20} /> Mulai Generate
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
