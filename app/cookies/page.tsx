'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { BrainCircuit, ArrowLeft, Cookie } from 'lucide-react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black selection:bg-teal selection:text-white transition-colors">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-teal uppercase tracking-[0.3em] mb-12 transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            Kembali ke Beranda
          </Link>

          <header className="space-y-6 mb-16">
             <div className="w-16 h-16 rounded-[24px] bg-teal/10 flex items-center justify-center text-teal mb-8">
                <Cookie className="w-8 h-8" />
             </div>
             <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white tracking-tighter leading-tight uppercase italic transition-colors">
                Cookie <span className="text-teal">Policy</span>
             </h1>
             <p className="text-gray-500 dark:text-zinc-500 text-lg font-bold uppercase tracking-tight transition-colors">
                Terakhir Diperbarui: 18 Mei 2026
             </p>
          </header>

          {/* Content */}
          <div className="prose prose-zinc dark:prose-invert max-w-none">
             <section className="space-y-8 mb-16">
                <div className="space-y-4">
                   <h2 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tight">1. Apa itu Cookie?</h2>
                   <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                      Cookie adalah file teks kecil yang disimpan di perangkat Anda saat Anda mengunjungi situs web. Cookie membantu kami mengenali perangkat Anda dan mengingat preferensi Anda.
                   </p>
                </div>

                <div className="space-y-4">
                   <h2 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tight">2. Bagaimana Kami Menggunakan Cookie?</h2>
                   <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                      Kami menggunakan cookie untuk beberapa tujuan:
                   </p>
                   <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-zinc-400 font-medium">
                      <li><strong>Esensial:</strong> Diperlukan untuk fungsi log-in akun Anda.</li>
                      <li><strong>Analitik:</strong> Untuk memahami bagaimana pengguna berinteraksi dengan platform kami.</li>
                      <li><strong>Preferensi:</strong> Untuk mengingat pengaturan tema (Light/Dark mode) Anda.</li>
                   </ul>
                </div>

                <div className="space-y-4">
                   <h2 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tight">3. Cookie Pihak Ketiga</h2>
                   <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                      Kami mungkin menggunakan layanan pihak ketiga seperti Google Analytics yang juga dapat menyimpan cookie di perangkat Anda untuk tujuan analisis statistik penggunaan situs.
                   </p>
                </div>

                <div className="space-y-4">
                   <h2 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tight">4. Mengelola Cookie</h2>
                   <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                      Anda dapat mengatur browser Anda untuk menolak semua atau sebagian cookie, atau untuk memberi tahu Anda saat situs web menyetel atau mengakses cookie. Jika Anda menonaktifkan cookie, beberapa bagian dari platform mungkin tidak berfungsi dengan baik.
                   </p>
                </div>
             </section>
          </div>

          {/* Cookie Banner */}
          <div className="bg-gray-50 dark:bg-zinc-900 rounded-[40px] p-10 md:p-16 border border-gray-100 dark:border-zinc-800 transition-colors text-center relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal/5 rounded-full" />
             <h3 className="text-2xl font-black text-black dark:text-white uppercase italic mb-4">Pengalaman Anda, Pilihan Anda.</h3>
             <p className="text-gray-500 dark:text-zinc-500 font-bold mb-8 uppercase tracking-tight text-sm">
                Kami menggunakan data minimal untuk memberikan hasil maksimal.
             </p>
             <Link href="/">
                <button className="h-14 px-12 bg-black dark:bg-white text-white dark:text-black rounded-full font-black text-[10px] tracking-[0.2em] uppercase hover:bg-teal dark:hover:bg-teal dark:hover:text-white transition-all shadow-xl active:scale-95">
                   KEMBALI BERJELAJAH
                </button>
             </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CookiePolicy
