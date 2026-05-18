'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { BrainCircuit, ArrowLeft, FileText } from 'lucide-react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

const TermsOfUse = () => {
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
                <FileText className="w-8 h-8" />
             </div>
             <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white tracking-tighter leading-tight uppercase italic transition-colors">
                Terms of <span className="text-teal">Use</span>
             </h1>
             <p className="text-gray-500 dark:text-zinc-500 text-lg font-bold uppercase tracking-tight transition-colors">
                Terakhir Diperbarui: 18 Mei 2026
             </p>
          </header>

          {/* Content */}
          <div className="prose prose-zinc dark:prose-invert max-w-none">
             <section className="space-y-8 mb-16">
                <div className="space-y-4">
                   <h2 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tight">1. Ketentuan Penggunaan</h2>
                   <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                      Dengan mengakses dan menggunakan CareerLens AI, Anda setuju untuk terikat oleh Ketentuan Penggunaan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.
                   </p>
                </div>

                <div className="space-y-4">
                   <h2 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tight">2. Akun Pengguna</h2>
                   <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                      Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi Anda. Anda juga setuju untuk bertanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda.
                   </p>
                </div>

                <div className="space-y-4">
                   <h2 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tight">3. Batasan Layanan AI</h2>
                   <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                      CareerLens AI menggunakan Google Gemini AI untuk memberikan rekomendasi karier. Meskipun kami berusaha memberikan hasil yang paling akurat, hasil analisis AI bersifat indikatif dan tidak boleh dianggap sebagai satu-satunya dasar keputusan profesional Anda.
                   </p>
                </div>

                <div className="space-y-4">
                   <h2 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tight">4. Konten Pengguna</h2>
                   <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                      Anda tetap memiliki hak kepemilikan atas dokumen yang Anda unggah ke platform kami. Namun, Anda memberikan lisensi kepada kami untuk memproses konten tersebut guna memberikan layanan analisis yang diminta.
                   </p>
                </div>

                <div className="space-y-4">
                   <h2 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tight">5. Perubahan Layanan</h2>
                   <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                      Kami berhak untuk mengubah atau menghentikan layanan (atau bagian apa pun darinya) kapan saja dengan atau tanpa pemberitahuan.
                   </p>
                </div>
             </section>
          </div>

          {/* Accept Banner */}
          <div className="bg-black dark:bg-zinc-950 rounded-[40px] p-10 md:p-16 border border-zinc-800 transition-colors text-center text-white relative overflow-hidden group">
             <div className="absolute inset-0 bg-teal/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <h3 className="text-2xl font-black uppercase italic mb-4 relative z-10">Patuhi Aturan Main.</h3>
             <p className="text-zinc-400 font-bold mb-8 uppercase tracking-tight text-sm relative z-10">
                Gunakan platform ini dengan bijak untuk memaksimalkan potensi karier Anda.
             </p>
             <Link href="/">
                <button className="h-14 px-12 bg-white text-black rounded-full font-black text-[10px] tracking-[0.2em] uppercase hover:bg-teal hover:text-white transition-all shadow-xl active:scale-95 relative z-10">
                   SAYA MENGERTI
                </button>
             </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default TermsOfUse
