"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, GraduationCap, Code, Target, CheckCircle2, 
  MapPin, Search, Loader2, Plus, X,
  Building2, Calendar, Wallet, Globe, ArrowRight,
  ShieldCheck, Info, Mail, Phone, Briefcase, 
  Sparkles, Heart, Save, AlertCircle, Camera
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

/**
 * Tipe data wilayah Indonesia
 */
interface Region {
  id: string;
  name: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  
  // Region Data
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [regencies, setRegencies] = useState<Region[]>([]);
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
      const res = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
      if (!res.ok) throw new Error("Gagal memuat data provinsi");
      const data = await res.json();
      setProvinces(data);
    } catch (error) {
      console.error("Fetch provinces error:", error);
    }
  }, []);

  const fetchRegencies = useCallback(async (provId: string) => {
    if (!provId) {
      setRegencies([]);
      return;
    }
    try {
      setIsRegionsLoading(true);
      const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provId}.json`);
      if (!res.ok) throw new Error("Gagal memuat data kabupaten");
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
        
        // Handle persistent region data from kotaTarget [Prov, City]
        const provName = p.kotaTarget?.[0] || "";
        const cityName = p.kotaTarget?.[1] || "";

        setFormData({
          name: p.name || "",
          age: p.usia || 20,
          city: cityName,
          province: provName, 
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
    const init = async () => {
      await fetchProvinces();
      await fetchProfile();
    };
    init();
  }, [fetchProfile, fetchProvinces]);

  // Sync regencies if province input changed (even during initialization if we matched name)
  useEffect(() => {
    if (selectedProvId) {
      fetchRegencies(selectedProvId);
    }
  }, [selectedProvId, fetchRegencies]);

  // Try to find ProvId from ProvName after provinces loaded
  useEffect(() => {
    if (provinces.length > 0 && formData.province && !selectedProvId) {
      const found = provinces.find(p => p.name === formData.province);
      if (found) setSelectedProvId(found.id);
    }
  }, [provinces, formData.province, selectedProvId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Package city and province into the array for persistence
      const dataToSave = {
        ...formData,
        kotaTarget: [formData.province, formData.city]
      };

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });
      
      const result = await res.json();
      if (result.success) {
        toast({
          title: "Profil Berhasil Disimpan",
          description: "Data kariermu telah diperbarui di sistem CareerLens.",
        });
        setIsUpdate(true);
        router.refresh();
      } else {
        throw new Error(result.error || "Gagal menyimpan profil");
      }
    } catch (error: any) {
      toast({
        title: "Ups! Gagal Simpan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = (s: string) => {
    const val = s.trim();
    if (!val) return;
    if (formData.skills.length >= 12) {
      toast({ title: "Limit Tercapai", description: "Fokus pada 12 skill utama saja." });
      return;
    }
    if (!formData.skills.includes(val)) {
      setFormData({ ...formData, skills: [...formData.skills, val] });
    }
    setSkillInput("");
  };

  const removeSkill = (s: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(i => i !== s) });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-slate-100 rounded-2xl animate-spin-slow rotate-45" />
          <Loader2 className="w-6 h-6 animate-spin text-[#1D9E75] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Sinkronisasi Data...</p>
      </div>
    );
  }

  // Progress bar calculation
  const filledFields = [
    formData.name, formData.city, formData.education, 
    formData.schoolName, formData.major, formData.targetPos,
    formData.skills.length > 0
  ].filter(Boolean).length;
  const progressPercent = Math.round((filledFields / 7) * 100);

  return (
    <div className="min-h-screen bg-[#F9FAFB] md:pb-20">
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-10">
        
        {/* Profile Hero Header */}
        <section className="relative bg-black text-white rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1D9E75] opacity-20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#534AB7] opacity-10 blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-white/10 backdrop-blur-sm border-4 border-white/20 flex items-center justify-center shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <User className="w-16 h-16 text-white/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                   <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <Badge className="bg-[#1D9E75]/20 text-[#1D9E75] hover:bg-[#1D9E75]/30 border-none px-4 py-1 rounded-full font-black text-[9px] uppercase tracking-widest mb-2">
                  Profil Aktif
                </Badge>
                <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-tight">
                  {formData.name || "Kandidat SMK"}
                </h1>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="w-3.5 h-3.5" /> {formData.city || "Lokasi Belum Diatur"}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Kecocokan AI</p>
                  <p className="text-lg font-black italic text-[#1D9E75]">{progressPercent}%</p>
                </div>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-slate-800" />
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-black bg-[#1D9E75] flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="h-14 px-10 bg-[#1D9E75] hover:bg-[#1D9E75]/90 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-[#1D9E75]/20"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Save className="w-5 h-5 mr-3" />}
              Update Profil
            </Button>
          </div>
        </section>

        {/* Content Tabs / Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Data Utama */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Section 1: Data Diri */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3 border-l-4 border-black pl-4">
                <div className="space-y-0.5">
                  <h3 className="font-black italic uppercase tracking-tighter text-xl">Data Identitas</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Identitas dasar kariermu</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nama Lengkap</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm focus:ring-2 focus:ring-[#1D9E75]/20 px-4"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Gender</Label>
                  <div className="flex bg-slate-50 p-1 rounded-xl">
                    {["Laki-laki", "Perempuan"].map(g => (
                      <button
                        key={g}
                        onClick={() => setFormData({...formData, gender: g})}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                          formData.gender === g ? "bg-white text-black shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Provinsi</Label>
                  <select 
                    value={selectedProvId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedProvId(id);
                      const name = provinces.find(p => p.id === id)?.name || "";
                      setFormData({...formData, province: name, city: ""}); 
                    }}
                    className="w-full h-12 bg-slate-50 rounded-xl px-4 text-sm font-bold border-none focus:ring-2 focus:ring-[#1D9E75]/20 appearance-none outline-none"
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2 relative">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Kota / Kabupaten</Label>
                  <select 
                    disabled={!selectedProvId || isRegionsLoading}
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full h-12 bg-slate-50 rounded-xl px-4 text-sm font-bold border-none focus:ring-2 focus:ring-[#1D9E75]/20 appearance-none outline-none disabled:opacity-50"
                  >
                    <option value="">Pilih Kota/Kab</option>
                    {regencies.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                  </select>
                  {isRegionsLoading && <Loader2 className="absolute right-4 bottom-3 w-4 h-4 animate-spin text-[#1D9E75]" />}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50">
                 <div className="flex justify-between items-end mb-4">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Usia: {formData.age} Tahun</Label>
                 </div>
                 <input 
                    type="range" min="16" max="45" value={formData.age} 
                    onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-black cursor-pointer"
                 />
              </div>
            </div>

            {/* Section 2: Pendidikan */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3 border-l-4 border-[#1D9E75] pl-4">
                <div className="space-y-0.5">
                  <h3 className="font-black italic uppercase tracking-tighter text-xl">Rekam Akademik</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Latar belakang pendidikan</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Pendidikan Terakhir</Label>
                  <div className="grid grid-cols-2 gap-2">
                     {["SMA", "SMK", "D3", "S1"].map(edu => (
                       <button
                          key={edu}
                          onClick={() => setFormData({...formData, education: edu})}
                          className={cn(
                            "py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all",
                            formData.education === edu ? "bg-black text-white border-black" : "bg-white text-slate-400 border-slate-50 hover:border-slate-100"
                          )}
                       >
                         {edu}
                       </button>
                     ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nama Sekolah / Kampus</Label>
                  <Input 
                    value={formData.schoolName}
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                    placeholder="Contoh: SMKN 1 Ciamis"
                    className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Jurusan Spesifik</Label>
                  <Input 
                    value={formData.major}
                    onChange={(e) => setFormData({...formData, major: e.target.value})}
                    placeholder="Contoh: Rekayasa Perangkat Lunak"
                    className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tahun Lulus</Label>
                    <Input 
                      value={formData.gradYear}
                      onChange={(e) => setFormData({...formData, gradYear: e.target.value})}
                      placeholder="2024"
                      className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm text-center"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nilai / IPK</Label>
                    <Input 
                      value={formData.avgScore}
                      onChange={(e) => setFormData({...formData, avgScore: e.target.value})}
                      placeholder="85.5"
                      className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Skill & Minat */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3 border-l-4 border-[#534AB7] pl-4">
                <div className="space-y-0.5">
                  <h3 className="font-black italic uppercase tracking-tighter text-xl">Keahlian & Minat</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Kekuatan utamamu di industri</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                   <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Keahlian Utama (Hard Skills)</Label>
                   <div className="flex gap-2">
                      <Input 
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addSkill(skillInput)}
                        placeholder="Ketik skill lalu Enter..."
                        className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm flex-1"
                      />
                      <Button onClick={() => addSkill(skillInput)} className="bg-black hover:bg-[#1D9E75] h-12 w-12 rounded-xl">
                        <Plus className="w-5 h-5" />
                      </Button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {formData.skills.map(s => (
                        <Badge key={s} className="bg-slate-100 text-black border-none px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest flex items-center gap-2 group hover:bg-red-50 hover:text-red-500 cursor-pointer" onClick={() => removeSkill(s)}>
                          {s} <X className="w-3 h-3 transition-transform group-hover:scale-125" />
                        </Badge>
                      ))}
                      {formData.skills.length === 0 && <p className="text-[10px] font-bold text-slate-300 uppercase italic">Belum ada skill...</p>}
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50">
                   <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Minat Industri</Label>
                   <div className="flex flex-wrap gap-2">
                      {["Teknologi", "Kesehatan", "Kreatif", "Produksi", "Pendidikan", "Keuangan", "Jasa"].map(ind => {
                        const isSelected = formData.interests.includes(ind);
                        return (
                          <button
                            key={ind}
                            onClick={() => {
                              const news = isSelected ? formData.interests.filter(i => i !== ind) : [...formData.interests, ind];
                              setFormData({...formData, interests: news});
                            }}
                            className={cn(
                              "px-5 py-2.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all",
                              isSelected ? "bg-[#534AB7] text-white border-[#534AB7] shadow-lg" : "bg-white text-slate-400 border-slate-50 hover:border-slate-200"
                            )}
                          >
                            {ind}
                          </button>
                        );
                      })}
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Target & Summary */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Target Karier Card */}
            <div className="bg-black text-white rounded-[2rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Target className="w-32 h-32" />
              </div>
              
              <div className="space-y-1 relative z-10">
                 <h4 className="text-sm font-black italic uppercase tracking-widest text-[#1D9E75]">Target Karier</h4>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Aspek Masa Depan</p>
              </div>

              <div className="space-y-6 relative z-10">
                 <div className="space-y-3">
                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Posisi Impian</Label>
                    <Input 
                      value={formData.targetPos}
                      onChange={(e) => setFormData({...formData, targetPos: e.target.value})}
                      placeholder="e.g. Senior Technician"
                      className="bg-white/5 border-white/10 text-white font-bold h-12 rounded-xl focus:ring-[#1D9E75]/20"
                    />
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Gaji</Label>
                      <span className="text-xs font-black text-[#1D9E75]">Rp {(formData.salary / 1000000).toFixed(1)} Juta</span>
                    </div>
                    <input 
                      type="range" min="2000000" max="25000000" step="500000"
                      value={formData.salary} 
                      onChange={(e) => setFormData({...formData, salary: parseInt(e.target.value)})}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-[#1D9E75] cursor-pointer"
                    />
                 </div>

                 <div className="space-y-3 pt-4 border-t border-white/10">
                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Preferensi Kerja</Label>
                    <div className="grid grid-cols-1 gap-2">
                       {["Remote", "On-site", "Hybrid"].map(pref => (
                         <button
                            key={pref}
                            onClick={() => setFormData({...formData, workPref: pref})}
                            className={cn(
                              "w-full py-3 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-between px-4",
                              formData.workPref === pref ? "bg-[#1D9E75] border-[#1D9E75] text-white" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                            )}
                         >
                            {pref}
                            {formData.workPref === pref && <CheckCircle2 className="w-3.5 h-3.5" />}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
            </div>

            {/* AI Insight Card */}
            <div className="bg-[#534AB7] text-white rounded-[2rem] p-8 space-y-6 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-20">
                  <Sparkles className="w-12 h-12" />
               </div>
               <div className="space-y-2">
                  <h4 className="text-xl font-black italic uppercase tracking-tighter italic">AI Insight</h4>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-relaxed">
                    Profilmu saat ini memiliki tingkat kelengkapan {progressPercent}%. Selesaikan semua data untuk rekomendasi yang 100% akurat.
                  </p>
               </div>
               <div className="space-y-2">
                  <Progress value={progressPercent} className="h-2 bg-white/10" />
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-60">
                    <span>Mulai</span>
                    <span>Siap Kerja</span>
                  </div>
               </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-4 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tindakan Cepat</p>
               <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full h-12 bg-black text-white hover:bg-[#1D9E75] rounded-xl font-black uppercase tracking-widest text-[9px]"
               >
                 {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                 Simpan Permanen
               </Button>
               <Button 
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="w-full h-12 border-slate-100 text-slate-600 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-slate-50"
               >
                 Kembali ke Beranda
               </Button>
            </div>

          </aside>
        </div>

      </main>
    </div>
  );
}
