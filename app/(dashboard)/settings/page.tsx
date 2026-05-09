"use client";

import React, { useState } from "react";
import { 
  motion, AnimatePresence 
} from "framer-motion";
import { 
  User, Lock, Bell, ShieldAlert, ChevronRight, 
  Mail, Smartphone, Globe, Github, Linkedin, 
  Twitter, Camera, Save, RefreshCcw, CheckCircle2,
  AlertCircle, Trash2, Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Pengaturan berhasil disimpan.");
    }, 1000);
  };

  const menuItems = [
    { id: "profile", label: "Profil Publik", icon: User },
    { id: "account", label: "Akun & Keamanan", icon: Lock },
    { id: "notifications", label: "Notifikasi", icon: Bell },
    { id: "danger", label: "Zona Bahaya", icon: ShieldAlert, color: "text-red-500" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-72 sticky top-24 shrink-0 space-y-8">
           <div className="bg-white p-4 rounded-[32px] border border-[#F3F4F6] shadow-sm space-y-1">
              <p className="text-[10px] font-black text-text-faint uppercase tracking-[0.2em] px-4 py-4">PENGATURAN</p>
              {menuItems.map((item) => (
                 <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                       "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                       activeSection === item.id 
                        ? "bg-[#030712] text-white shadow-xl shadow-black/5" 
                        : "text-text-secondary hover:bg-surface"
                    )}
                 >
                    <div className="flex items-center gap-3">
                       <item.icon className={cn(
                          "w-5 h-5", 
                          activeSection === item.id ? "text-teal" : item.color || "text-text-faint group-hover:text-text-primary"
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

           <div className="p-8 bg-surface-2 rounded-[32px] border border-[#F3F4F6]">
              <p className="text-xs text-text-faint font-medium leading-relaxed">
                 Butuh bantuan dengan akunmu? Hubungi tim support kami di <span className="text-teal font-bold">support@careerlens.ai</span>
              </p>
           </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
           <AnimatePresence mode="wait">
              {activeSection === "profile" && (
                 <motion.div key="profile" variants={fadeUp} initial="hidden" animate="visible" className="space-y-10">
                    <div className="pb-8 border-b border-[#F3F4F6]">
                       <h1 className="text-h3 text-[#030712] mb-1">Profil Publik</h1>
                       <p className="text-text-secondary">Informasi ini akan muncul di profil publik dan CV yang kamu buat.</p>
                    </div>

                    <div className="space-y-10">
                       {/* Avatar Section */}
                       <div className="flex flex-col sm:flex-row items-center gap-8">
                          <div className="relative group">
                             <div className="w-32 h-32 rounded-full bg-surface border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" alt="Avatar" className="w-full h-full object-cover" />
                             </div>
                             <button className="absolute bottom-0 right-0 p-3 bg-[#030712] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all">
                                <Camera className="w-4 h-4" />
                             </button>
                          </div>
                          <div>
                             <h4 className="font-bold text-lg text-[#030712]">Foto Profil</h4>
                             <p className="text-sm text-text-secondary mb-4">Direkomendasikan 400x400px. Max 2MB.</p>
                             <div className="flex gap-2">
                                <Button variant="outline" className="h-10 rounded-xl px-6 text-xs font-bold border-[#F3F4F6]">Ganti Foto</Button>
                                <Button variant="ghost" className="h-10 rounded-xl px-6 text-xs font-bold text-red-500 hover:bg-red-50">Hapus</Button>
                             </div>
                          </div>
                       </div>

                       {/* Bio Info */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black text-text-faint uppercase tracking-widest pl-2">NAMA DISPLAY</Label>
                             <Input defaultValue="Budi Santoso" className="h-14 rounded-2xl border-[#F3F4F6] focus:border-teal" />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black text-text-faint uppercase tracking-widest pl-2">USERNAME AI</Label>
                             <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-faint font-bold font-mono">@</span>
                                <Input defaultValue="budisantoso" className="h-14 pl-10 rounded-2xl border-[#F3F4F6] focus:border-teal" />
                             </div>
                          </div>
                          <div className="md:col-span-2 space-y-2">
                             <Label className="text-[10px] font-black text-text-faint uppercase tracking-widest pl-2">BIO SINGKAT</Label>
                             <textarea 
                               className="w-full h-32 p-6 rounded-[32px] border border-[#F3F4F6] focus:border-teal focus:ring-0 outline-none text-text-primary font-medium resize-none"
                               placeholder="Tuliskan tentang dirimu..."
                               defaultValue="A passionate Front-end developer based in Jakarta, specializing in building premium user experiences."
                             />
                          </div>
                       </div>

                       {/* Social Links */}
                       <div className="space-y-6">
                          <Label className="text-[10px] font-black text-text-faint uppercase tracking-widest pl-2">SOCIAL LINKS</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                             <div className="relative">
                                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" />
                                <Input className="h-12 pl-12 rounded-xl border-[#F3F4F6]" placeholder="LinkedIn" />
                             </div>
                             <div className="relative">
                                <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" />
                                <Input className="h-12 pl-12 rounded-xl border-[#F3F4F6]" placeholder="GitHub" />
                             </div>
                             <div className="relative">
                                <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" />
                                <Input className="h-12 pl-12 rounded-xl border-[#F3F4F6]" placeholder="Twitter" />
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="pt-8 border-t border-[#F3F4F6] flex justify-end">
                       <Button onClick={handleSave} disabled={isLoading} className="h-14 px-10 rounded-2xl bg-[#030712] text-white font-black uppercase tracking-widest text-xs hover:bg-teal transition-all">
                          {isLoading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <>Simpan Profil <Save className="w-4 h-4 ml-2" /></>}
                       </Button>
                    </div>
                 </motion.div>
              )}

              {activeSection === "account" && (
                 <motion.div key="account" variants={fadeUp} initial="hidden" animate="visible" className="space-y-10">
                    <div className="pb-8 border-b border-[#F3F4F6] flex justify-between items-end">
                       <div>
                          <h1 className="text-h3 text-[#030712] mb-1">Akun & Keamanan</h1>
                          <p className="text-text-secondary">Kelola kredensial login dan pengaturan keamanan akunmu.</p>
                       </div>
                       <Badge className="bg-teal text-white border-none rounded-full px-4 py-1.5 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
                       </Badge>
                    </div>

                    <div className="space-y-10">
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black text-text-faint uppercase tracking-widest pl-2">EMAIL ADDRESS</Label>
                             <div className="flex gap-4">
                                <Input disabled defaultValue="budi.santoso@email.com" className="h-14 flex-1 rounded-2xl border-[#F3F4F6] bg-surface-2 opacity-60" />
                                <Button variant="outline" className="h-14 px-6 rounded-2xl border-[#F3F4F6] font-bold">Ganti</Button>
                             </div>
                          </div>
                          
                          <div className="space-y-6">
                             <Label className="text-[10px] font-black text-text-faint uppercase tracking-widest pl-2">UPDATE PASSWORD</Label>
                             <div className="space-y-4">
                                <Input type="password" placeholder="Password Saat Ini" className="h-14 rounded-2xl border-[#F3F4F6]" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                   <Input type="password" placeholder="Password Baru" className="h-14 rounded-2xl border-[#F3F4F6]" />
                                   <Input type="password" placeholder="Ulangi Password Baru" className="h-14 rounded-2xl border-[#F3F4F6]" />
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="p-8 bg-[#030712] rounded-[40px] text-white relative overflow-hidden group">
                          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
                             <div className="space-y-2">
                                <h4 className="text-xl font-bold flex items-center gap-2">
                                   Two-Factor Authentication <ShieldAlert className="w-5 h-5 text-teal" />
                                </h4>
                                <p className="text-dark-muted text-sm font-medium">Lindungi akunmu dengan kode OTP tambahan setiap kali login.</p>
                             </div>
                             <Button className="h-12 px-8 bg-teal text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 transition-all">
                                AKTIFKAN SEKARANG
                             </Button>
                          </div>
                          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform">
                             <Lock className="w-32 h-32 text-white" />
                          </div>
                       </div>
                    </div>

                    <div className="pt-8 border-t border-[#F3F4F6] flex justify-end">
                       <Button onClick={handleSave} className="h-14 px-10 rounded-2xl bg-[#030712] text-white font-black uppercase tracking-widest text-xs hover:bg-teal transition-all">
                          Update Password
                       </Button>
                    </div>
                 </motion.div>
              )}

              {activeSection === "notifications" && (
                 <motion.div key="notifications" variants={fadeUp} initial="hidden" animate="visible" className="space-y-10">
                    <div className="pb-8 border-b border-[#F3F4F6]">
                       <h1 className="text-h3 text-[#030712] mb-1">Notifikasi</h1>
                       <p className="text-text-secondary">Pilih bagaimana kami memberikan update tentang perjalanan kariermu.</p>
                    </div>

                    <div className="space-y-4">
                       {[
                          { id: "email", label: "Email Notifications", desc: "Dapatkan update mingguan dan laporan lengkap ke emailmu.", icon: Mail },
                          { id: "wa", label: "WhatsApp Alerts", desc: "Notifikasi instan untuk pesan dari rekruter dan jadwal interview.", icon: Smartphone },
                          { id: "push", label: "Browser Push", desc: "Notifikasi real-time saat kamu sedang aktif di platform.", icon: Globe },
                       ].map((item) => (
                          <div key={item.id} className="p-8 bg-white border border-[#F3F4F6] rounded-[32px] flex items-center justify-between group hover:bg-surface transition-all">
                             <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center text-text-faint group-hover:bg-teal group-hover:text-white transition-all">
                                   <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                   <h4 className="font-bold text-[#030712] text-lg">{item.label}</h4>
                                   <p className="text-sm text-text-secondary font-medium">{item.desc}</p>
                                </div>
                             </div>
                             <Switch defaultChecked className="data-[state=checked]:bg-teal" />
                          </div>
                       ))}
                    </div>

                    <div className="p-8 bg-purple-light/30 border border-purple/10 rounded-[32px] flex items-center gap-4">
                       <Info className="w-6 h-6 text-purple" />
                       <p className="text-xs text-purple font-medium italic">&quot;Tenang, kami tidak akan membanjiri inbox kamu. Kami hanya mengirimkan pesan yang benar-benar penting.&quot;</p>
                    </div>

                    <div className="pt-8 border-t border-[#F3F4F6] flex justify-end">
                       <Button onClick={handleSave} className="h-14 px-10 rounded-2xl bg-[#030712] text-white font-black uppercase tracking-widest text-xs">Simpan Preferensi</Button>
                    </div>
                 </motion.div>
              )}

              {activeSection === "danger" && (
                 <motion.div key="danger" variants={fadeUp} initial="hidden" animate="visible" className="space-y-10">
                    <div className="pb-8 border-b border-[#F3F4F6]">
                       <h1 className="text-h3 text-red-600 mb-1">Zona Bahaya</h1>
                       <p className="text-text-secondary">Tindakan di seksi ini tidak dapat dibatalkan. Berhati-hatilah.</p>
                    </div>

                    <div className="space-y-6">
                       <div className="p-10 border-2 border-red-500/20 bg-red-50/30 rounded-[48px] space-y-8">
                          <div className="flex flex-col sm:flex-row items-center gap-8 justify-between">
                             <div className="space-y-2 text-center sm:text-left">
                                <h4 className="text-2xl font-black text-red-600 italic">Hapus Seluruh Akun</h4>
                                <p className="text-red-900/60 max-w-md font-medium text-sm">
                                   Semua data kamu termasuk CV, hasil analisis, dan progres roadmap akan dihapus secara permanen dari database kami.
                                </p>
                             </div>
                             <Button variant="ghost" className="h-16 px-10 rounded-2xl bg-red-600 text-white hover:bg-red-700 font-black uppercase tracking-widest text-xs flex items-center gap-2 group">
                                <Trash2 className="w-5 h-5 group-hover:animate-bounce" /> Hapus Permanen
                             </Button>
                          </div>
                          
                          <div className="flex items-start gap-4 p-6 bg-red-600/5 rounded-3xl">
                             <AlertCircle className="w-5 h-5 text-red-600 mt-1 shrink-0" />
                             <p className="text-xs text-red-900/80 font-bold leading-relaxed">
                                Perhatian: Menghapus akun berarti kamu akan kehilangan akses ke semua fitur Premium yang mungkin pernah kamu beli tanpa refund.
                             </p>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
