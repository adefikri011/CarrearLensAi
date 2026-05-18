import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Rocket } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 text-center transition-colors duration-300">
      <div className="w-20 h-20 bg-[#1D9E75] rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-xl shadow-[#1D9E75]/20">
        <Rocket className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4 italic">404</h1>
      <h2 className="text-2xl font-bold text-slate-700 dark:text-zinc-300 mb-8">Oops! Halaman Tidak Ditemukan.</h2>
      <p className="text-slate-500 dark:text-zinc-500 max-w-md mb-12 font-medium">
        Sepertinya kamu tersesat di peta karier. Ayo kembali ke jalan yang benar!
      </p>
      <Button asChild size="lg" className="bg-[#1D9E75] hover:bg-[#1D9E75]/90 text-white rounded-2xl h-14 px-8 font-bold shadow-lg shadow-[#1D9E75]/10 active:scale-95 transition-all">
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  )
}
