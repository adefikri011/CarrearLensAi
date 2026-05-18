'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { BrainCircuit, ArrowLeft, Shield } from 'lucide-react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

const PrivacyPolicy = () => {
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
                <Shield className="w-8 h-8" />
             </div>
             <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white tracking-tighter leading-tight uppercase italic transition-colors">
                Privacy <span className="text-teal">Policy</span>
             </h1>
             <p className="text-gray-500 dark:text-zinc-500 text-lg font-bold uppercase tracking-tight transition-colors">
                Terakhir Diperbarui: 18 Mei 2026
             </p>
          </header>

          {/* Content */}
          <div className="prose prose-zinc dark:prose-invert max-w-none">
             <section className="space-y-8 mb-16">
                <div className="space-y-4">
                   <h2 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tight">1. Pendahuluan</h2>
                   <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                      CareerLens AI (&quot;kami&quot;, &quot;milik kami&quot;) sangat menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan platform kami.
                   </p>
                </div>

                <div className="space-y-4">
                   <h2 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tight">2. Informasi yang Kami Kumpulkan</h2>
                   <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                      Kami mengumpulkan informasi yang Anda berikan langsung kepada kami, termasuk namun tidak terbatas pada:
                   </p>
                   <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-zinc-400 font-medium">
                      <li>Informasi Akun (Nama, Email, Kata Sandi)</li>
                      <li>Dokumen Kurikulum Vitae (CV) yang Anda unggah</li>
                      <li>Profil pendidikan dan preferensi karier</li>
                      <li>Data penggunaan teknis melalui sistem AI kami</li>
                   </ul>
                </div>

                <div className="space-y-4">
                   <h2 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tight">3. Penggunaan AI dan Data</h2>
                   <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                      Data Anda diproses menggunakan Google Gemini AI untuk memberikan analisis karier yang dipersonalisasi. Kami tidak menjual data pribadi Anda kepada pihak ketiga. Penggunaan data difokuskan pada:
                   </p>
                   <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-zinc-400 font-medium">
                      <li>Penyusunan Roadmap Karier yang akurat</li>
                      <li>Pemberian rekomendasi skill yang relevan</li>
                      <li>Peningkatan akurasi sistem analisis AI kami</li>
                   </ul>
                </div>

                <div className="space-y-4">
                   <h2 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tight">4. Keamanan Data</h2>
                   <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                      Kami menerapkan langkah-langkah keamanan teknis yang kuat untuk melindungi data Anda dari akses yang tidak sah. Dokumen yang Anda unggah disimpan secara aman dalam infrastruktur cloud terenkripsi.
                   </p>
                </div>

                <div className="space-y-4">
                   <h2 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tight">5. Hak Anda</h2>
                   <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                      Sebagai pengguna, Anda memiliki hak untuk mengakses, memperbarui, atau menghapus data Anda kapan saja melalui pengaturan profil atau dengan menghubungi tim dukungan kami.
                   </p>
                </div>
             </section>
          </div>

          {/* Contact Banner */}
          <div className="bg-gray-50 dark:bg-zinc-900 rounded-[40px] p-10 md:p-16 border border-gray-100 dark:border-zinc-800 transition-colors text-center">
             <h3 className="text-2xl font-black text-black dark:text-white uppercase italic mb-4">Punya Pertanyaan tentang Privasi?</h3>
             <p className="text-gray-500 dark:text-zinc-500 font-bold mb-8 uppercase tracking-tight text-sm">
                Kami siap membantu menjelaskan bagaimana data Anda dikelola.
             </p>
             <Link href="mailto:privacy@careerlens.ai">
                <button className="h-14 px-10 bg-black dark:bg-white text-white dark:text-black rounded-full font-black text-[10px] tracking-[0.2em] uppercase hover:bg-teal dark:hover:bg-teal dark:hover:text-white transition-all shadow-xl active:scale-95">
                   HUBUNGI TIM PRIVASI
                </button>
             </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default PrivacyPolicy
