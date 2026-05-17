"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, GraduationCap, Code, Target, CheckCircle, 
  ChevronRight, ChevronLeft, Camera, Briefcase, 
  Heart, Sparkles, MapPin, Search, Loader2, Plus, X,
  Building2, Calendar, Wallet, Globe, ArrowRight,
  ShieldCheck, Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  name: string;
  province_id: string;
}

const STEPS = [
  { id: 1, title: "Data Diri", icon: User, desc: "Identitas dasar" },
  { id: 2, title: "Pendidikan", icon: GraduationCap, desc: "Latar akademik" },
  { id: 3, title: "Skill & Minat", icon: Code, desc: "Keahlian utama" },
  { id: 4, title: "Target", icon: Target, desc: "Ambisi karier" },
  { id: 5, title: "Final", icon: CheckCircle, desc: "Review data" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  
  // Region Data State
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [selectedProvId, setSelectedProvId] = useState("");
  const [isRegionsLoading, setIsRegionsLoading] = useState(false);
  
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: 20,
    city: "",
    province: "",
    gender: "Laki-laki",
    education: "SMK",
    schoolName: "",
    major: "",
    gradYear: "",
    avgScore: "",
    skills: [] as string[],
    interests: [] as string[],
    salary: 5000000,
    targetPos: "",
    workPref: "Remote"
  });

  const fetchProvinces = useCallback(async () => {
    try {
      setIsRegionsLoading(true);
      const res = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
      const data = await res.json();
      setProvinces(data);
    } catch (error) {
      console.error("Fetch provinces error:", error);
    } finally {
      setIsRegionsLoading(false);
    }
  }, []);

  const fetchRegencies = useCallback(async (provId: string) => {
    if (!provId) return;
    try {
      setIsRegionsLoading(true);
      const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provId}.json`);
      const data = await res.json();
      setRegencies(data);
    } catch (error) {
      console.error("Fetch regencies error:", error);
    } finally {
      setIsRegionsLoading(false);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/profile");
      const result = await res.json();
      if (result.success && result.data) {
        const p = result.data;
        if (p.id) setIsUpdate(true);
        
        setFormData({
          name: p.name || "",
          age: p.usia || 20,
          city: p.kotaTarget?.[0] || "",
          province: "", 
          gender: p.gender || "Laki-laki",
          education: p.sekolah || "SMK",
          schoolName: p.schoolName || "",
          major: p.jurusan || "",
          gradYear: p.lulusan || "",
          avgScore: p.nilaiRata?.toString() || "",
          skills: p.hardSkills || [],
          interests: p.minat || [],
          salary: p.targetGaji || 5000000,
          targetPos: p.targetPosisi || "",
          workPref: p.preferensiKerja || "Remote"
        });
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchProvinces();
  }, [fetchProfile, fetchProvinces]);

  useEffect(() => {
    if (selectedProvId) {
      fetchRegencies(selectedProvId);
    }
  }, [selectedProvId, fetchRegencies]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        toast({
          title: "Profil Diperbarui",
          description: "Data kariermu telah berhasil disimpan dengan aman.",
        });
        router.refresh();
      } else {
        throw new Error(result.error || "Gagal menyimpan profil");
      }
    } catch (error: any) {
      toast({
        title: "Terjadi Kesalahan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-100 rounded-full animate-pulse" />
          <Loader2 className="w-8 h-8 animate-spin text-[#1D9E75] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Menyiapkan Ruang Kariermu...</p>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div variants={fadeUp} className="space-y-8">
            <div className="flex flex-col items-center mb-10">
               <div className="relative group">
                  <div className="w-28 h-28 rounded-[2rem] bg-slate-50 border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                     <User className="w-12 h-12 text-slate-200" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-3 bg-black text-white rounded-2xl shadow-xl hover:bg-[#1D9E75] transition-all group-hover:rotate-12">
                     <Camera className="w-5 h-5" />
                  </button>
               </div>
               <div className="mt-6 text-center">
                 <h2 className="text-xl font-black italic uppercase tracking-tighter">Identitas Dasar</h2>
                 <p className="text-[10px] font-bold text-[#1D9E75] uppercase tracking-[0.2em]">Ceritakan siapa kamu</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] pl-1">Nama Lengkap</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-14 rounded-2xl bg-white border-slate-100 focus:border-[#1D9E75] focus:ring-4 focus:ring-[#1D9E75]/5 text-sm font-bold shadow-sm"
                    placeholder="Contoh: Ahmad Fauzi"
                  />
               </div>
               
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] pl-1">Provinsi</Label>
                  <select 
                    value={selectedProvId}
                    onChange={(e) => {
                      setSelectedProvId(e.target.value);
                      const prov = provinces.find(p => p.id === e.target.value);
                      if (prov) setFormData({...formData, province: prov.name});
                    }}
                    className="w-full h-14 rounded-2xl bg-white border border-slate-100 px-4 text-sm font-bold focus:outline-none focus:border-[#1D9E75] focus:ring-4 focus:ring-[#1D9E75]/5 shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
               </div>

               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] pl-1">Domisili Kabupaten/Kota</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <select 
                      disabled={!selectedProvId || isRegionsLoading}
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full h-14 pl-11 rounded-2xl bg-white border border-slate-100 px-4 text-sm font-bold focus:outline-none focus:border-[#1D9E75] focus:ring-4 focus:ring-[#1D9E75]/5 shadow-sm appearance-none cursor-pointer disabled:opacity-50 disabled:bg-slate-50"
                    >
                      <option value="">Pilih Kabupaten/Kota</option>
                      {regencies.map(r => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                    {isRegionsLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-[#1D9E75]" />}
                  </div>
               </div>

               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] pl-1">Jenis Kelamin</Label>
                  <div className="grid grid-cols-2 gap-3 h-14">
                    {["Laki-laki", "Perempuan"].map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({...formData, gender: g})}
                        className={cn(
                          "rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest",
                          formData.gender === g ? "bg-[#1D9E75] border-[#1D9E75] text-white shadow-xl shadow-[#1D9E75]/20" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 md:p-8 space-y-6">
               <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rentang Usia</Label>
                    <p className="text-xl font-black italic tracking-tighter">{formData.age} <span className="text-sm font-bold text-slate-400 uppercase not-italic">Tahun</span></p>
                  </div>
                  <Calendar className="w-10 h-10 text-[#1D9E75] opacity-10" />
               </div>
               <div className="space-y-4">
                 <input 
                    type="range" 
                    min="16" max="45" 
                    value={formData.age} 
                    onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                    className="w-full h-2 bg-white rounded-full appearance-none cursor-pointer accent-[#1D9E75] shadow-inner"
                 />
                 <div className="flex justify-between text-[9px] text-slate-400 font-black uppercase tracking-widest px-1">
                    <span>16 Thn</span>
                    <span>45 Thn</span>
                 </div>
               </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div variants={fadeUp} className="space-y-8">
            <div className="space-y-3">
               <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Fokus Pendidikan Terakhir</Label>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["SMA", "SMK", "D3", "S1", "S2", "Lainnya"].map(edu => (
                     <button
                        key={edu}
                        type="button"
                        onClick={() => setFormData({...formData, education: edu})}
                        className={cn(
                           "p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 active:scale-95 group",
                           formData.education === edu 
                            ? "bg-black border-black text-white shadow-2xl" 
                            : "bg-white border-slate-100 text-slate-400 hover:border-[#1D9E75]/30 hover:text-black"
                        )}
                     >
                        <GraduationCap className={cn("w-6 h-6 transition-all", formData.education === edu ? "scale-110" : "group-hover:text-[#1D9E75]")} />
                        <span className="font-black text-[11px] uppercase tracking-widest">{edu}</span>
                     </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nama Institusi</Label>
                 <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <Input 
                      value={formData.schoolName} 
                      onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                      className="h-14 pl-11 rounded-2xl bg-white border-slate-100 font-bold text-sm"
                      placeholder="SMK Negeri 1 Bandung"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Jurusan</Label>
                 <Input 
                   value={formData.major} 
                   onChange={(e) => setFormData({...formData, major: e.target.value})}
                   className="h-14 rounded-2xl bg-white border-slate-100 font-bold text-sm"
                   placeholder="Teknik Otomasi Industri"
                 />
              </div>

              <div className="space-y-2">
                 <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tahun Kelulusan</Label>
                 <Input 
                   value={formData.gradYear} 
                   onChange={(e) => setFormData({...formData, gradYear: e.target.value})}
                   className="h-14 rounded-2xl bg-white border-slate-100 font-bold text-sm text-center"
                   placeholder="2025"
                 />
              </div>

              <div className="space-y-2">
                 <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nilai Rata-rata / IPK</Label>
                 <Input 
                   value={formData.avgScore} 
                   onChange={(e) => setFormData({...formData, avgScore: e.target.value})}
                   className="h-14 rounded-2xl bg-white border-slate-100 font-bold text-sm text-center"
                   placeholder="Contoh: 88.5"
                 />
              </div>
            </div>
            
            <div className="p-5 bg-[#1D9E75]/5 border border-[#1D9E75]/10 rounded-2xl flex items-start gap-4">
               <Info className="w-5 h-5 text-[#1D9E75] shrink-0 mt-0.5" />
               <p className="text-[11px] font-bold text-[#1D9E75]/80 leading-relaxed uppercase tracking-tight">
                 Data akademik membantu kami memfilter lowongan entry-level yang paling sesuai dengan kualifikasimu.
               </p>
            </div>
          </motion.div>
        );
      case 3:
        const addSkill = (s: string) => {
          const val = s.trim();
          if (!val) return;
          if (formData.skills.length >= 15) {
            toast({ title: "Limit Maksimal", description: "Fokuslah pada 15 skill terkuatmu.", variant: "destructive" });
            return;
          }
          if (!formData.skills.includes(val)) {
            setFormData({ ...formData, skills: [...formData.skills, val] });
          }
          setSkillInput("");
        };

        const removeSkill = (s: string) => {
          setFormData({ ...formData, skills: formData.skills.filter(item => item !== s) });
        };

        const presetSkills = ["React", "TypeScript", "Node.js", "Figma", "UI/UX", "Python", "AutoCAD", "PLC", "Maintenance", "Office"];

        return (
          <motion.div variants={fadeUp} className="space-y-8">
            <div className="space-y-6">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                 <div className="space-y-1">
                   <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Masukan Keahlian Utama (Max 15)</Label>
                   <p className="text-[9px] font-bold text-[#1D9E75] uppercase tracking-widest">Pisahkan dengan Enter</p>
                 </div>
               </div>
               
               <div className="flex gap-2">
                  <div className="relative flex-1">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                     <Input 
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") {
                              e.preventDefault();
                              addSkill(skillInput);
                           }
                        }}
                        className="h-14 pl-11 rounded-2xl bg-white border-slate-100 font-bold text-sm focus:border-black" 
                        placeholder="Cari atau ketik skill..." 
                     />
                  </div>
                  <Button 
                     type="button"
                     onClick={() => addSkill(skillInput)}
                     className="h-14 w-14 rounded-2xl bg-black text-white hover:bg-[#1D9E75] shrink-0 shadow-lg"
                  >
                     <Plus className="w-6 h-6" />
                  </Button>
               </div>

               <div className="flex flex-wrap gap-2 min-h-[40px]">
                  <AnimatePresence>
                    {formData.skills.map(skill => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                       <Badge 
                          className="bg-black text-white h-10 px-4 rounded-xl flex items-center gap-2 font-black text-[10px] tracking-widest uppercase hover:bg-red-500 transition-colors group cursor-pointer"
                          onClick={() => removeSkill(skill)}
                       >
                          {skill}
                          <X className="w-3 h-3 group-hover:scale-125 transition-transform" />
                       </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {formData.skills.length === 0 && (
                    <div className="w-full flex flex-col items-center justify-center py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                      <Code className="w-10 h-10 text-slate-200 mb-2" />
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Belum ada skill ditambahkan</p>
                    </div>
                  )}
               </div>

               <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Saran untukmu</p>
                 <div className="flex flex-wrap gap-2">
                    {presetSkills.map(skill => (
                       <button
                          key={skill}
                          type="button"
                          disabled={formData.skills.includes(skill)}
                          onClick={() => addSkill(skill)}
                          className={cn(
                             "px-5 py-2.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all",
                             formData.skills.includes(skill) 
                                ? "bg-slate-50 text-slate-200 border-slate-50 cursor-not-allowed" 
                                : "bg-white border-slate-50 text-slate-500 hover:border-[#1D9E75]/20 hover:text-black"
                          )}
                       >
                          {skill}
                       </button>
                    ))}
                 </div>
               </div>
            </div>

            <div className="space-y-6">
               <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Minat Industri Strategis</Label>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                     { t: "Teknologi", icon: <Code /> },
                     { t: "Kesehatan", icon: <Heart /> },
                     { t: "Kreatif", icon: <Sparkles /> },
                     { t: "Produksi", icon: <Briefcase /> },
                     { t: "Pendidikan", icon: <GraduationCap /> },
                     { t: "Energi", icon: <Target /> },
                  ].map(ind => (
                     <button
                        key={ind.t}
                        type="button"
                        onClick={() => {
                           const newInt = formData.interests.includes(ind.t) 
                              ? formData.interests.filter(i => i !== ind.t)
                              : [...formData.interests, ind.t];
                           setFormData({...formData, interests: newInt});
                        }}
                        className={cn(
                           "p-5 rounded-3xl border-2 transition-all flex flex-col gap-4 text-left group relative overflow-hidden",
                           formData.interests.includes(ind.t) 
                            ? "bg-black border-black text-white shadow-2xl scale-[1.02]" 
                            : "bg-white border-slate-50 text-slate-500 hover:border-slate-200"
                        )}
                      >
                        <div className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                           formData.interests.includes(ind.t) ? "bg-white/10 text-[#1D9E75]" : "bg-slate-50 text-slate-300 group-hover:scale-110"
                        )}>
                           {React.cloneElement(ind.icon as React.ReactElement, { className: "w-6 h-6" })}
                        </div>
                        <span className="font-black text-[11px] uppercase tracking-widest">{ind.t}</span>
                        {formData.interests.includes(ind.t) && (
                          <div className="absolute top-2 right-2">
                             <CheckCircle className="w-4 h-4 text-[#1D9E75]" />
                          </div>
                        )}
                     </button>
                  ))}
               </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div variants={fadeUp} className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-[#1D9E75]" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Ambisi Karier</h3>
              </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Posisi Impian</Label>
                  <Input 
                    value={formData.targetPos}
                    onChange={(e) => setFormData({...formData, targetPos: e.target.value})}
                    className="h-14 rounded-2xl bg-white border-slate-100 font-bold text-sm px-6"
                    placeholder="Contoh: Junior Cloud Architect"
                  />
               </div>
            </div>

            <div className="bg-black text-white rounded-[2.5rem] p-8 md:p-10 space-y-8 relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#1D9E75] opacity-20 blur-[80px]" />
               <div className="flex justify-between items-end relative z-10">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black text-[#1D9E75] uppercase tracking-widest">Ekspektasi Gaji Bulanan</Label>
                    <p className="text-3xl font-black italic tracking-tighter">
                      Rp {formData.salary.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <Wallet className="w-12 h-12 text-[#1D9E75] opacity-40 mb-1" />
               </div>
               
               <div className="space-y-6 relative z-10">
                 <input 
                    type="range" 
                    min="2000000" max="50000000" step="500000"
                    value={formData.salary} 
                    onChange={(e) => setFormData({...formData, salary: parseInt(e.target.value)})}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#1D9E75]"
                 />
                 <div className="flex justify-between text-[9px] text-[#1D9E75] font-black uppercase tracking-widest px-1">
                    <span>Rp 2 Juta</span>
                    <span>Rp 50 Juta</span>
                 </div>
               </div>
            </div>

            <div className="space-y-4">
               <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Preferensi Ruang Kerja</Label>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { t: "On-site", icon: <Building2 />, d: "Kantor Fisik" },
                    { t: "Remote", icon: <Globe />, d: "Bekerja di Mana Saja" },
                    { t: "Hybrid", icon: <Sparkles />, d: "Kombinasi Fleksibel" }
                  ].map(pref => (
                     <button
                        key={pref.t}
                        type="button"
                        onClick={() => setFormData({...formData, workPref: pref.t})}
                        className={cn(
                           "p-6 rounded-[2rem] border-2 transition-all flex flex-col gap-3 text-left group",
                           formData.workPref === pref.t 
                            ? "bg-slate-50 border-black text-black shadow-lg" 
                            : "bg-white border-slate-50 text-slate-400 hover:border-slate-200"
                        )}
                     >
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                          formData.workPref === pref.t ? "bg-black text-white" : "bg-slate-50 text-slate-200"
                        )}>
                           {React.cloneElement(pref.icon as React.ReactElement, { className: "w-5 h-5" })}
                        </div>
                        <div>
                          <p className="font-black text-[11px] uppercase tracking-widest">{pref.t}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{pref.d}</p>
                        </div>
                     </button>
                  ))}
               </div>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div variants={fadeUp} className="space-y-8">
            <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <CheckCircle className="w-48 h-48 text-[#1D9E75]" />
               </div>

               <div className="space-y-10 relative z-10">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-[2rem] bg-black shadow-2xl flex items-center justify-center text-white font-black italic text-3xl">
                        {formData.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-black italic uppercase tracking-tighter">{formData.name}</p>
                        <p className="text-[10px] font-black text-[#1D9E75] uppercase tracking-widest flex items-center gap-2">
                          <MapPin className="w-3 h-3" /> {formData.city} • {formData.age} Thn
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-[#1D9E75] text-white px-6 py-2 rounded-full font-black uppercase text-[9px] tracking-widest shadow-xl shadow-[#1D9E75]/20 border-none">
                      Sesuai Proyeksi AI
                    </Badge>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                       <div className="space-y-4">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] font-mono">Spesifikasi Akademik</p>
                          <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-3">
                             <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-black">
                                 <GraduationCap className="w-5 h-5" />
                               </div>
                               <div>
                                 <p className="font-black text-xs uppercase tracking-tight italic">{formData.education} {formData.major}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{formData.schoolName} • Lulus {formData.gradYear}</p>
                               </div>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] font-mono">Orientasi Karier</p>
                          <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-3">
                             <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75]">
                                 <Target className="w-5 h-5" />
                               </div>
                               <div>
                                 <p className="font-black text-xs uppercase tracking-tight italic">{formData.targetPos}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Target Rp {formData.salary.toLocaleString('id-ID')} • {formData.workPref}</p>
                               </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-4">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] font-mono">Portofolio Skill</p>
                          <div className="flex flex-wrap gap-2">
                             {formData.skills.map(s => <Badge key={s} className="rounded-xl border-slate-200 text-black font-black bg-white shadow-sm px-4 py-2 text-[9px] tracking-widest uppercase border">{s}</Badge>)}
                          </div>
                       </div>

                       <div className="space-y-4">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] font-mono">Minat Industri</p>
                          <div className="flex flex-wrap gap-2">
                             {formData.interests.map(i => <Badge key={i} className="rounded-xl bg-black text-white border-none font-black px-4 py-2 text-[9px] tracking-widest uppercase">{i}</Badge>)}
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>

            <div className="bg-black p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 justify-between border-4 border-[#1D9E75]/20">
               <div className="flex items-center gap-6 text-white">
                  <div className="w-14 h-14 rounded-2xl bg-[#1D9E75] flex items-center justify-center shrink-0 shadow-lg shadow-[#1D9E75]/30">
                     <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-sm font-black italic tracking-tight uppercase">AI Optimization Ready</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tekan sinkronisasi untuk memproses profil ke sistem CareerLens.</p>
                  </div>
               </div>
               <Button 
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full md:w-auto h-14 px-10 bg-white text-black hover:bg-[#1D9E75] hover:text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-2xl"
               >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sinkronisasi Profil"}
               </Button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Sidebar: Progress Nav (Desktop) */}
        <aside className="lg:col-span-3 space-y-10 hidden lg:block">
          <div className="space-y-3">
             <h1 className="text-4xl font-black text-black tracking-tighter uppercase italic leading-[0.8] mb-2">
               Profil <br /> <span className="text-[#1D9E75]">Arsitek</span> Karier.
             </h1>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
               Lengkapi setiap dimensi data untuk analisis yang presisi.
             </p>
          </div>

          <nav className="space-y-3">
            {STEPS.map((step) => {
              const isActive = currentStep >= step.id;
              const isCurrent = currentStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-5 rounded-[2.5rem] transition-all text-left group",
                    isCurrent 
                      ? "bg-black text-white shadow-2xl scale-105" 
                      : isActive 
                        ? "bg-slate-50 text-black hover:bg-slate-100" 
                        : "text-slate-300 hover:text-slate-500"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                    isCurrent ? "bg-[#1D9E75] text-white" : isActive ? "bg-black/5 text-black" : "bg-slate-50 text-slate-200"
                  )}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-[10px] uppercase tracking-widest">{step.title}</p>
                    <p className={cn("text-[8px] font-bold uppercase tracking-widest", isCurrent ? "text-[#1D9E75]" : "text-slate-400")}>{step.desc}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="p-6 bg-[#534AB7]/5 rounded-[2rem] border border-[#534AB7]/10">
             <div className="flex items-center gap-3 text-[#534AB7] mb-3">
                <ShieldCheck className="w-5 h-5" />
                <p className="font-black text-[10px] uppercase tracking-widest">Data Aman</p>
             </div>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
               Data kamu dienkripsi dan hanya digunakan untuk analisis rekomendasi karier.
             </p>
          </div>
        </aside>

        {/* Mobile Header Stepper */}
        <div className="lg:hidden space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Profil Karier</h1>
            <p className="text-[10px] font-black text-[#1D9E75] uppercase tracking-[0.2em]">Step {currentStep} dari 5: {STEPS[currentStep-1].title}</p>
          </div>
          <div className="flex justify-between items-center bg-slate-50 p-2 rounded-2xl">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                  currentStep === step.id ? "bg-black text-white shadow-lg" : currentStep > step.id ? "bg-[#1D9E75] text-white" : "bg-white text-slate-300"
                )}
              >
                <step.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Section: Form Content */}
        <section className="lg:col-span-9">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-8 md:p-14 min-h-[600px] relative">
            <AnimatePresence mode="wait">
              <motion.div 
                 key={currentStep}
                 initial={{ opacity: 0, x: 10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -10 }}
                 transition={{ duration: 0.3 }}
              >
                 {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons (Desktop Floating Bottom) */}
            <div className="flex items-center justify-between mt-16 pt-10 border-t border-slate-50">
               <Button 
                  variant="ghost" 
                  onClick={prevStep} 
                  disabled={currentStep === 1}
                  className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-400 hover:bg-slate-50 hover:text-black transition-all"
               >
                  <ChevronLeft className="w-4 h-4 mr-3" /> Kembali
               </Button>
               
               {currentStep < 5 && (
                 <Button 
                    onClick={nextStep}
                    className="h-14 px-10 rounded-2xl bg-black text-white font-black uppercase tracking-widest text-[10px] hover:bg-[#1D9E75] shadow-xl transition-all"
                 >
                    Lanjut Misi <ChevronRight className="w-4 h-4 ml-3" />
                 </Button>
               )}
            </div>
          </div>
          
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#1D9E75] animate-ping" />
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Status: {isUpdate ? "Aktif" : "Mulai Baru"}</p>
             </div>
             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">CareerLens AI – SMK Edition</p>
          </div>
        </section>
      </main>
    </div>
  );
}
