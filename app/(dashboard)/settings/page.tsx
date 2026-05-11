"use client";

import React, { useState } from "react";
import { 
  motion, AnimatePresence 
} from "framer-motion";
import { 
  User, Lock, ShieldAlert, ChevronRight, 
  Linkedin, Github, Twitter, Camera, Save, 
  CheckCircle2, AlertCircle, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useSession, signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeSection, setActiveSection] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Pengaturan berhasil disimpan.");
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    // Simulating delete
    setTimeout(() => {
      signOut({ callbackUrl: "/" });
      toast.success("Akun kamu telah dihapus.");
    }, 2000);
  };

  const menuItems = [
    { id: "profile", label: "Profil Publik", icon: User },
    { id: "account", label: "Akun & Keamanan", icon: Lock },
    { id: "danger", label: "Zona Bahaya", icon: ShieldAlert, color: "text-red-500" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-12">
      {/* Mobile Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 mb-6 md:hidden no-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm whitespace-nowrap font-bold transition-all",
              activeSection === item.id
                ? "bg-black text-white shadow-lg shadow-black/10"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        
        {/* Navigation Sidebar (Desktop) */}
        <aside className="hidden md:block w-72 sticky top-24 shrink-0 space-y-8">
           <div className="bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 py-4">PENGATURAN</p>
              {menuItems.map((item) => (
                 <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                       "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                       activeSection === item.id 
                        ? "bg-black text-white shadow-xl shadow-black/5" 
                        : "text-gray-500 hover:bg-gray-50"
                    )}
                 >
                    <div className="flex items-center gap-3">
                       <item.icon className={cn(
                          "w-5 h-5", 
                          activeSection === item.id ? "text-teal" : item.color || "text-gray-300 group-hover:text-black"
                        )} />
                       <span className="font-bold text-sm">{item.label}</span>
                    </div>
                    <ChevronRight className={cn(
                       "w-4 h-4 transition-all",
                       activeSection === item.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                    )} />
                 </button>
              ))}
           </div>

           <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100">
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                 Butuh bantuan dengan akunmu? Hubungi tim support kami di <span className="text-teal font-bold">support@careerlens.ai</span>
              </p>
           </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 w-full px-1">
           <AnimatePresence mode="wait">
              {activeSection === "profile" && (
                 <motion.div key="profile" variants={fadeUp} initial="hidden" animate="visible" className="space-y-8 sm:space-y-10">
                    <div className="pb-6 sm:pb-8 border-b border-gray-100">
                       <h1 className="text-xl sm:text-2xl font-black text-black mb-1">Profil Publik</h1>
                       <p className="text-gray-500 text-xs sm:text-sm">Informasi ini akan muncul di profil publik dan CV yang kamu buat.</p>
                    </div>

                    <div className="space-y-8 sm:space-y-10">
                       {/* Avatar Section */}
                       <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                          <div className="relative group shrink-0">
                             <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-50 border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center">
                                <img 
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.id || 'Budi'}`} 
                                  alt="Avatar" 
                                  className="w-full h-full object-cover" 
                                />
                             </div>
                             <button 
                               onClick={() => toast.info("Fitur upload foto segera hadir!")}
                               className="absolute bottom-0 right-0 p-2 sm:p-3 bg-black text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
                             >
                                <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                             </button>
                          </div>
                          <div className="text-center sm:text-left">
                             <h4 className="font-bold text-lg text-black">Foto Profil</h4>
                             <p className="text-sm text-gray-500 mb-4">Direkomendasikan 400x400px. Max 2MB.</p>
                             <div className="flex justify-center sm:justify-start gap-2">
                                <Button 
                                  onClick={() => toast.info("Fitur upload foto segera hadir!")}
                                  variant="outline" 
                                  className="h-9 sm:h-10 rounded-xl px-4 sm:px-6 text-xs font-bold border-gray-100"
                                >
                                  Ganti Foto
                                </Button>
                                <Button 
                                  onClick={() => toast.error("Tidak bisa menghapus foto Utama.")}
                                  variant="ghost" 
                                  className="h-9 sm:h-10 rounded-xl px-4 sm:px-6 text-xs font-bold text-red-500 hover:bg-red-50"
                                >
                                  Hapus
                                </Button>
                             </div>
                          </div>
                       </div>

                       {/* Bio Info */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">NAMA DISPLAY</Label>
                             <Input defaultValue="Budi Santoso" className="h-12 sm:h-14 rounded-2xl border-gray-100 focus:border-teal" />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">USERNAME AI</Label>
                             <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold font-mono">@</span>
                                <Input defaultValue="budisantoso" className="h-12 sm:h-14 pl-10 rounded-2xl border-gray-100 focus:border-teal" />
                             </div>
                          </div>
                          <div className="md:col-span-2 space-y-2">
                             <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">BIO SINGKAT</Label>
                             <textarea 
                               className="w-full h-28 sm:h-32 p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-gray-100 focus:border-teal focus:ring-0 outline-none text-black font-medium resize-none text-sm"
                               placeholder="Tuliskan tentang dirimu..."
                               defaultValue="A passionate Front-end developer based in Jakarta, specializing in building modern user experiences."
                             />
                          </div>
                       </div>

                       {/* Social Links */}
                       <div className="space-y-5 sm:space-y-6">
                          <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">SOCIAL LINKS</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                             <div className="relative">
                                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <Input className="h-11 sm:h-12 pl-12 rounded-xl border-gray-100 text-sm" placeholder="LinkedIn" />
                             </div>
                             <div className="relative">
                                <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <Input className="h-11 sm:h-12 pl-12 rounded-xl border-gray-100 text-sm" placeholder="GitHub" />
                             </div>
                             <div className="relative">
                                <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <Input className="h-11 sm:h-12 pl-12 rounded-xl border-gray-100 text-sm" placeholder="Twitter" />
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="pt-6 sm:pt-8 border-t border-gray-100 flex justify-end">
                       <Button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 rounded-2xl bg-black text-white font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-teal transition-all">
                          {isLoading ? <LoadingSpinner size="sm" /> : <>Simpan Profil <Save className="w-4 h-4 ml-2" /></>}
                       </Button>
                    </div>
                 </motion.div>
              )}

              {activeSection === "account" && (
                 <motion.div key="account" variants={fadeUp} initial="hidden" animate="visible" className="space-y-8 sm:space-y-10">
                    <div className="pb-6 sm:pb-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                       <div>
                          <h1 className="text-xl sm:text-2xl font-black text-black mb-1">Akun & Keamanan</h1>
                          <p className="text-gray-500 text-xs sm:text-sm">Kelola kredensial login dan pengaturan keamanan akunmu.</p>
                       </div>
                       <Badge className="w-fit bg-teal text-white border-none rounded-full px-4 py-1.5 font-bold flex items-center gap-1.5 text-[10px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
                       </Badge>
                    </div>

                    <div className="space-y-8 sm:space-y-10">
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">EMAIL ADDRESS</Label>
                             <div className="flex flex-col sm:flex-row gap-3">
                                <Input disabled defaultValue="budi.santoso@email.com" className="h-12 sm:h-14 flex-1 rounded-2xl border-gray-100 bg-gray-50 opacity-60 text-sm" />
                                <Button variant="outline" className="h-12 sm:h-14 px-6 rounded-2xl border-gray-100 font-bold text-xs">Ganti Email</Button>
                             </div>
                          </div>
                          
                          <div className="space-y-5 sm:space-y-6 pt-4">
                             <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">UPDATE PASSWORD</Label>
                             <div className="space-y-3 sm:space-y-4">
                                <Input type="password" placeholder="Password Saat Ini" className="h-12 sm:h-14 rounded-2xl border-gray-100 text-sm" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                   <Input type="password" placeholder="Password Baru" className="h-12 sm:h-14 rounded-2xl border-gray-100 text-sm" />
                                   <Input type="password" placeholder="Ulangi Password Baru" className="h-12 sm:h-14 rounded-2xl border-gray-100 text-sm" />
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="p-6 sm:p-8 bg-black rounded-[24px] sm:rounded-[40px] text-white relative overflow-hidden group">
                          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
                             <div className="space-y-2 text-center lg:text-left">
                                <h4 className="text-lg sm:text-xl font-bold flex items-center justify-center lg:justify-start gap-2">
                                   Two-Factor Authentication <ShieldAlert className="w-5 h-5 text-teal" />
                                </h4>
                                <p className="text-gray-400 text-xs sm:text-sm font-medium">Lindungi akunmu dengan kode OTP tambahan setiap kali login.</p>
                             </div>
                             <Button className="w-full sm:w-auto h-11 sm:h-12 px-8 bg-teal text-white font-black uppercase tracking-widest text-[9px] sm:text-[10px] rounded-xl hover:scale-105 transition-all">
                                AKTIFKAN SEKARANG
                             </Button>
                          </div>
                          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform hidden sm:block">
                             <Lock className="w-24 sm:w-32 h-24 sm:h-32 text-white" />
                          </div>
                       </div>
                    </div>

                    <div className="pt-6 sm:pt-8 border-t border-gray-100 flex justify-end">
                       <Button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 rounded-2xl bg-black text-white font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-teal transition-all">
                          {isLoading ? <LoadingSpinner size="sm" /> : "Update Password"}
                       </Button>
                    </div>
                 </motion.div>
              )}

              {activeSection === "danger" && (
                 <motion.div key="danger" variants={fadeUp} initial="hidden" animate="visible" className="space-y-8 sm:space-y-10">
                    <div className="pb-6 sm:pb-8 border-b border-gray-100">
                       <h1 className="text-xl sm:text-2xl font-black text-red-600 mb-1">Zona Bahaya</h1>
                       <p className="text-gray-500 text-xs sm:text-sm">Tindakan di seksi ini tidak dapat dibatalkan. Berhati-hatilah.</p>
                    </div>

                    <div className="space-y-6">
                       <div className="p-6 sm:p-10 border-2 border-red-500/20 bg-red-50/30 rounded-[24px] sm:rounded-[48px] space-y-6 sm:space-y-8">
                          <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 justify-between">
                             <div className="space-y-2 text-center lg:text-left">
                                <h4 className="text-xl sm:text-2xl font-black text-red-600 italic">Hapus Seluruh Akun</h4>
                                <p className="text-red-900/60 max-w-md font-medium text-xs sm:text-sm leading-relaxed">
                                   Semua data kamu termasuk CV, hasil analisis, dan progres roadmap akan dihapus secara permanen dari database kami.
                                </p>
                             </div>
                             <Button 
                               onClick={() => setShowDeleteConfirm(true)}
                               variant="ghost" 
                               className="w-full lg:w-auto h-14 sm:h-16 px-8 sm:px-10 rounded-2xl bg-red-600 text-white hover:bg-red-700 font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-2 group"
                             >
                                <Trash2 className="w-4 h-4 sm:w-5 h-5 group-hover:animate-bounce" /> Hapus Permanen
                             </Button>
                          </div>
                          
                          <div className="flex items-start gap-4 p-4 sm:p-6 bg-red-600/5 rounded-2xl sm:rounded-3xl">
                             <AlertCircle className="w-4 h-4 sm:w-5 h-5 text-red-600 mt-1 shrink-0" />
                             <p className="text-[10px] sm:text-xs text-red-900/80 font-bold leading-relaxed">
                                Perhatian: Menghapus akun berarti kamu akan kehilangan akses ke semua data dan riwayat analisis kamu secara permanen.
                             </p>
                          </div>
                       </div>
                    </div>

                    <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                       <DialogContent className="rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 max-w-md w-[90%] sm:w-full">
                          <DialogHeader>
                             <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-50 rounded-[18px] sm:rounded-[24px] flex items-center justify-center text-red-600 mb-4 sm:mb-6 mx-auto">
                                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                             </div>
                             <DialogTitle className="text-xl sm:text-2xl font-black text-center text-black">Hapus Akun Anda?</DialogTitle>
                             <DialogDescription className="text-center text-gray-500 pt-3 sm:pt-4 text-xs sm:text-sm leading-relaxed">
                                Apa kamu yakin ingin menghapus akun? Semua data profil, CV, dan pencapaian roadmap kamu akan hilang selamanya.
                             </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                             <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="w-full sm:flex-1 h-11 sm:h-12 rounded-xl font-bold border-gray-100 text-sm">Batal</Button>
                             <Button onClick={handleDeleteAccount} className="w-full sm:flex-1 h-11 sm:h-12 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 text-sm">
                                {isLoading ? <LoadingSpinner size="sm" /> : "Ya, Hapus"}
                             </Button>
                          </DialogFooter>
                       </DialogContent>
                    </Dialog>
                 </motion.div>
              )}
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
