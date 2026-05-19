import React from 'react';
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { 
  BadgeCheck, 
  Cpu, 
  Layout, 
  ArrowLeft, 
  ExternalLink, 
  Globe, 
  Calendar,
  Layers,
  Sparkles,
  User,
  Mail,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: { user: true }
  });

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | CareerLens Portfolio`,
    description: project.refinedDescription.substring(0, 160),
    openGraph: {
      title: project.title,
      description: project.refinedDescription.substring(0, 160),
      images: [project.thumbnailUrl || ""],
    },
  };
}

export default async function PublicProjectPage({ params }: ProjectPageProps) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: { 
      user: {
        include: { profile: true }
      }
    }
  });

  if (!project || !project.isPublic) {
    notFound();
  }

  const user = project.user;
  const profile = user.profile;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 selection:bg-teal selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 glass z-50 px-6 border-b border-zinc-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-10 rounded-xl bg-teal flex items-center justify-center shadow-lg shadow-teal/20 transition-transform group-hover:scale-105">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter italic text-zinc-900 dark:text-white">CareerLens</span>
          </Link>

          <Link href="/dashboard">
            <Button variant="outline" className="rounded-full font-bold uppercase tracking-widest text-[10px] h-10 px-6 border-zinc-100 dark:border-zinc-800">
              Dashboard Saya
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-teal/10 text-teal border-none rounded-full px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">
                  Certified Case Study
                </Badge>
                {project.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="rounded-full px-4 py-1.5 font-bold uppercase tracking-widest text-[9px] border-zinc-100 dark:border-zinc-800">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tight leading-[1.1]">
                {project.title}
              </h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-teal">
                  {user.image ? (
                    <Image src={user.image} alt={user.name || ""} width={48} height={48} />
                  ) : (
                    <User className="text-zinc-400" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Creator</p>
                  <p className="font-bold text-zinc-900 dark:text-white">{user.name}</p>
                </div>
              </div>
              <div className="h-10 w-px bg-zinc-100 dark:bg-zinc-800" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Date</p>
                <p className="font-bold text-zinc-900 dark:text-white">
                  {new Date(project.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl shadow-teal/5 ring-1 ring-black/5 animate-in fade-in slide-in-from-right duration-1000">
            {project.thumbnailUrl ? (
              <Image 
                src={project.thumbnailUrl} 
                alt={project.title} 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-300">
                <Sparkles size={80} className="opacity-20" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Narrative */}
          <div className="lg:col-span-8 space-y-12">
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <h2 className="text-3xl font-black tracking-tight mb-8 flex items-center gap-4">
                <span className="size-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">
                  <BadgeCheck size={24} />
                </span>
                Deskripsi Proyek
              </h2>
              <div className="space-y-6 text-lg md:text-xl font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                {project.refinedDescription}
              </div>
            </div>

            {/* Impact/Metrics */}
            {project.metrics && (
              <div className="p-8 md:p-12 rounded-[3rem] bg-teal text-white shadow-2xl shadow-teal/20 relative overflow-hidden group">
                <Zap className="absolute -right-8 -bottom-8 size-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                <div className="relative space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Key Performance Metric</h3>
                  <p className="text-3xl md:text-5xl font-black tracking-tight">{project.metrics}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Sidebar Info */}
          <div className="lg:col-span-4 space-y-8">
            {/* Tools Used */}
            <div className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-xl shadow-black/[0.02] border border-zinc-100 dark:border-white/5 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Cpu size={16} className="text-teal" /> Tools & Technology
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tools.map(tool => (
                  <Badge key={tool} className="bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-none px-4 py-2 rounded-xl text-xs font-bold font-mono">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Profile Contact */}
            <div className="p-8 rounded-[2.5rem] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest opacity-60">Tertarik Bekerja Sama?</h3>
                <p className="text-2xl font-black tracking-tight leading-tight">Hubungi {user.name} untuk kolaborasi lebih lanjut.</p>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button className="w-full h-14 rounded-2xl bg-teal hover:bg-teal-dark text-white font-black uppercase tracking-widest text-xs gap-2 border-none">
                  <Mail size={16} /> Kirim Pesan
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-14 rounded-2xl border-white/10 dark:border-zinc-200">
                    CV Profil
                  </Button>
                  <Button variant="outline" className="flex-1 h-14 rounded-2xl border-white/10 dark:border-zinc-200">
                    LinkedIn
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-zinc-100 dark:border-white/5 text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Zap className="size-6 text-teal" />
          <span className="font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white">CareerLens AI Portfolio</span>
        </div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest uppercase tracking-[0.3em]">
          Powered by Gemini AI for SMK Indonesia
        </p>
      </footer>
    </div>
  );
}
