"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, GraduationCap, Code, Target, CheckCircle, 
  ChevronRight, ChevronLeft, Camera, Briefcase, 
  Heart, Sparkles, MapPin, Search, Loader2, Plus, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const STEPS = [
  { id: 1, title: "Data Diri", icon: User },
  { id: 2, title: "Pendidikan", icon: GraduationCap },
  { id: 3, title: "Skill & Minat", icon: Code },
  { id: 4, title: "Target Karier", icon: Target },
  { id: 5, title: "Review", icon: CheckCircle },
];

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: 20,
    city: "",
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/profile");
      const result = await res.json();
      if (result.success && result.data) {
        const p = result.data;
        // Only set isUpdate if we actually have fields populated (or if the ID exists)
        if (p.id) setIsUpdate(true);
        
        setFormData({
          name: p.name || "",
          age: p.usia || 20,
          city: p.kotaTarget?.[0] || "",
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
  };

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
          title: "Berhasil",
          description: "Profil berhasil disimpan",
        });
        router.refresh();
      } else {
        throw new Error(result.error || "Gagal menyimpan profil");
      }
    } catch (error: any) {
      toast({
        title: "Gagal",
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
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal" />
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
                  <div className="w-24 h-24 rounded-full bg-gray-50 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                     <User className="w-10 h-10 text-gray-300" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-teal text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all">
                     <Camera className="w-4 h-4" />
                  </button>
               </div>
               <p className="mt-4 text-xs font-bold text-teal uppercase tracking-widest">Foto Profil</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Nama Lengkap</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-12 rounded-xl border-gray-100 focus:border-teal focus:ring-teal/10 text-sm"
                    placeholder="John Doe"
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Kota Domisili</Label>
                  <div className="relative">
                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                     <Input 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="h-12 pl-11 rounded-xl border-gray-100 focus:border-teal text-sm"
                        placeholder="Contoh: Jakarta"
                     />
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex justify-between items-end">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Usia: {formData.age} Tahun</Label>
               </div>
               <input 
                  type="range" 
                  min="16" max="45" 
                  value={formData.age} 
                  onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-teal"
               />
               <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase tracking-widest px-1">
                  <span>16 Tahun</span>
                  <span>45 Tahun</span>
               </div>
            </div>

            <div className="space-y-3">
               <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Jenis Kelamin</Label>
               <div className="grid grid-cols-2 gap-4">
                  {["Laki-laki", "Perempuan"].map(g => (
                     <button
                        key={g}
                        onClick={() => setFormData({...formData, gender: g})}
                        className={cn(
                           "h-12 rounded-xl border transition-all font-bold text-xs",
                           formData.gender === g ? "bg-teal text-white border-teal" : "bg-white border-gray-100 text-gray-500 hover:border-teal/30"
                        )}
                     >
                        {g}
                     </button>
                  ))}
               </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div variants={fadeUp} className="space-y-8">
            <div className="space-y-3">
               <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Jenjang Pendidikan Terakhir</Label>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {["SMA", "SMK", "D3", "S1", "S2", "Lainnya"].map(edu => (
                     <button
                        key={edu}
                        onClick={() => setFormData({...formData, education: edu})}
                        className={cn(
                           "p-4 rounded-xl border transition-all font-bold text-xs flex flex-col items-center gap-3",
                           formData.education === edu ? "bg-gray-50 border-teal text-teal shadow-sm" : "bg-white border-gray-100 text-gray-500 hover:border-teal/30"
                        )}
                     >
                        <GraduationCap className={cn("w-5 h-5", formData.education === edu ? "text-teal" : "text-gray-300")} />
                        {edu}
                     </button>
                  ))}
               </div>
            </div>

            <div className="space-y-2">
               <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Nama Sekolah / Instansi</Label>
               <Input 
                 value={formData.schoolName} 
                 onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                 className="h-12 rounded-xl border-gray-100 text-sm"
                 placeholder="Contoh: SMK Negeri 1 Jakarta"
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-2 md:col-span-1">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Jurusan</Label>
                  <Input 
                    value={formData.major} 
                    onChange={(e) => setFormData({...formData, major: e.target.value})}
                    className="h-12 rounded-xl border-gray-100 text-sm"
                    placeholder="Teknik Informatika"
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Tahun Lulus</Label>
                  <Input 
                    value={formData.gradYear} 
                    onChange={(e) => setFormData({...formData, gradYear: e.target.value})}
                    className="h-12 rounded-xl border-gray-100 text-sm"
                    placeholder="2024"
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Nilai Rata-rata / IPK</Label>
                  <Input 
                    value={formData.avgScore} 
                    onChange={(e) => setFormData({...formData, avgScore: e.target.value})}
                    className="h-12 rounded-xl border-gray-100 text-sm"
                    placeholder="85.5 / 4.0"
                  />
               </div>
            </div>
          </motion.div>
        );
      case 3:
        const addSkill = (s: string) => {
          const val = s.trim();
          if (!val) return;
          if (formData.skills.length >= 15) {
            toast({ title: "Limit Tercapai", description: "Maksimal 15 skill diperbolehkan", variant: "destructive" });
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

        const presetSkills = ["React", "TypeScript", "Node.js", "Figma", "UI Design", "SEO", "Python", "Excel"];

        return (
          <motion.div variants={fadeUp} className="space-y-8">
            <div className="space-y-4">
               <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Skill Kamu (Maks 15)</Label>
               <div className="flex gap-2">
                  <div className="relative flex-1">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                     <Input 
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") {
                              e.preventDefault();
                              addSkill(skillInput);
                           }
                        }}
                        className="h-12 pl-11 rounded-xl bg-gray-50 border-none text-sm" 
                        placeholder="Ketik skill (Enter untuk menambah)" 
                     />
                  </div>
                  <Button 
                     onClick={() => addSkill(skillInput)}
                     className="h-12 w-12 rounded-xl bg-black text-white hover:bg-teal shrink-0"
                  >
                     <Plus className="w-5 h-5" />
                  </Button>
               </div>

               {/* Selected Skills */}
               <div className="flex flex-wrap gap-2 mb-4">
                  {formData.skills.map(skill => (
                     <Badge 
                        key={skill} 
                        className="bg-black text-white px-3 py-1.5 rounded-lg flex items-center gap-2 font-bold text-[11px]"
                     >
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="hover:text-teal">
                           <X className="w-3 h-3" />
                        </button>
                     </Badge>
                  ))}
               </div>

               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 mb-2">Saran Skill</p>
               <div className="flex flex-wrap gap-2">
                  {presetSkills.map(skill => (
                     <button
                        key={skill}
                        disabled={formData.skills.includes(skill)}
                        onClick={() => addSkill(skill)}
                        className={cn(
                           "px-4 py-2 rounded-full border text-[11px] font-bold transition-all",
                           formData.skills.includes(skill) 
                              ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" 
                              : "bg-white border-gray-100 text-gray-500 hover:border-teal/30 hover:text-teal"
                        )}
                     >
                        {skill}
                     </button>
                  ))}
               </div>
            </div>

            <div className="space-y-6">
               <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Minat Industri</Label>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                     { t: "Teknologi", icon: <Code /> },
                     { t: "Kesehatan", icon: <Heart /> },
                     { t: "Kreatif", icon: <Sparkles /> },
                     { t: "Bisnis", icon: <Briefcase /> },
                     { t: "Pendidikan", icon: <GraduationCap /> },
                     { t: "Keuangan", icon: <Target /> },
                  ].map(ind => (
                     <button
                        key={ind.t}
                        onClick={() => {
                           const newInt = formData.interests.includes(ind.t) 
                              ? formData.interests.filter(i => i !== ind.t)
                              : [...formData.interests, ind.t];
                           setFormData({...formData, interests: newInt});
                        }}
                        className={cn(
                           "p-4 rounded-2xl border transition-all flex flex-col gap-3 text-left group",
                           formData.interests.includes(ind.t) ? "bg-teal border-teal text-white shadow-md shadow-teal/10" : "bg-white border-gray-100 text-gray-500"
                        )}
                      >
                        <div className={cn(
                           "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                           formData.interests.includes(ind.t) ? "bg-white/20 text-white" : "bg-gray-50 text-gray-400"
                        )}>
                           {React.cloneElement(ind.icon as React.ReactElement, { className: "w-5 h-5" })}
                        </div>
                        <span className="font-bold text-[11px]">{ind.t}</span>
                     </button>
                  ))}
               </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div variants={fadeUp} className="space-y-8">
            <div className="space-y-2">
               <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Target Posisi Pekerjaan</Label>
               <Input 
                  value={formData.targetPos}
                  onChange={(e) => setFormData({...formData, targetPos: e.target.value})}
                  className="h-12 rounded-xl border-gray-100 text-sm"
                  placeholder="Misal: Frontend Developer"
               />
            </div>

            <div className="space-y-6">
               <div className="flex justify-between items-end">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Ekspektasi Gaji (Rp)</Label>
                  <span className="text-teal font-black text-base">Rp {formData.salary.toLocaleString('id-ID')}</span>
               </div>
               <input 
                  type="range" 
                  min="2000000" max="50000000" step="500000"
                  value={formData.salary} 
                  onChange={(e) => setFormData({...formData, salary: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-teal"
               />
               <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase tracking-widest px-1">
                  <span>2 Jt</span>
                  <span>50 Jt</span>
               </div>
            </div>

            <div className="space-y-3">
               <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Preferensi Kerja</Label>
               <div className="grid grid-cols-3 gap-4">
                  {["On-site", "Remote", "Hybrid"].map(pref => (
                     <button
                        key={pref}
                        onClick={() => setFormData({...formData, workPref: pref})}
                        className={cn(
                           "p-4 rounded-xl border transition-all font-bold text-xs",
                           formData.workPref === pref ? "bg-teal text-white border-teal" : "bg-white border-gray-100 text-gray-500"
                        )}
                     >
                        {pref}
                     </button>
                  ))}
               </div>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div variants={fadeUp} className="space-y-8">
            <div className="p-8 bg-white rounded-3xl border border-gray-100 relative overflow-hidden shadow-sm">
               <div className="absolute top-0 right-0 p-8">
                  <CheckCircle className="w-10 h-10 text-teal opacity-10" />
               </div>
               <h3 className="text-xl font-bold text-black mb-8">Review Profil</h3>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 font-mono">Data Diri</p>
                        <p className="font-bold text-black text-sm">{formData.name} • {formData.age} Thn</p>
                        <p className="text-gray-500 text-xs">{formData.city} • {formData.gender}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 font-mono">Pendidikan</p>
                        <p className="font-bold text-black text-sm">{formData.education} {formData.major}</p>
                        <p className="text-gray-500 text-xs">Lulus {formData.gradYear}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 font-mono">Target Karier</p>
                        <p className="font-bold text-black text-sm">{formData.targetPos}</p>
                        <p className="text-gray-500 text-xs">Rp {formData.salary.toLocaleString('id-ID')} • {formData.workPref}</p>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 font-mono">Skills</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                           {formData.skills.map(s => <Badge key={s} variant="outline" className="rounded-full border-gray-100 text-gray-600 font-bold bg-gray-50">{s}</Badge>)}
                        </div>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 font-mono">Minat Industri</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                           {formData.interests.map(i => <Badge key={i} className="rounded-full bg-teal/10 text-teal border-none font-bold">{i}</Badge>)}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
               </div>
               <p className="text-xs font-medium text-gray-600 leading-relaxed">AI kami akan menyesuaikan rekomendasi berdasarkan profil yang baru saja kamu lengkapi.</p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="text-center mb-12">
         <h1 className="text-2xl font-black text-black mb-2">Profil Karier</h1>
         <p className="text-sm text-gray-500">Lengkapi data untuk mendapatkan analisis yang presisi.</p>
      </div>

      {/* Progress */}
      <div className="relative mb-16 px-4">
         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -translate-y-1/2" />
         <div 
           className="absolute top-1/2 left-0 h-[2px] bg-teal -translate-y-1/2 transition-all duration-500 ease-out" 
           style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
         />
         <div className="relative z-10 flex justify-between items-center">
            {STEPS.map((step) => {
               const isActive = currentStep >= step.id;
               const isCurrent = currentStep === step.id;
               return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                     <button 
                        onClick={() => setCurrentStep(step.id)}
                        className={cn(
                           "w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center",
                           isActive ? "bg-white border-teal text-teal shadow-md" : "bg-white border-gray-100 text-gray-300",
                           isCurrent && "scale-110 border-teal bg-teal text-white"
                        )}
                     >
                        <step.icon className={cn("w-4 h-4", isCurrent ? "text-white" : isActive ? "text-teal" : "text-gray-300")} />
                     </button>
                  </div>
               );
            })}
         </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-12 mb-8 min-h-[480px]">
         <AnimatePresence mode="wait">
            <motion.div 
               key={currentStep}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.2 }}
            >
               {renderStep()}
            </motion.div>
         </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
         <Button 
            variant="ghost" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            className="h-12 px-6 rounded-full font-bold text-gray-500 hover:bg-gray-50"
         >
            <ChevronLeft className="w-4 h-4 mr-2" /> Kembali
         </Button>
         <Button 
            onClick={currentStep === 5 ? handleSave : nextStep}
            disabled={isSaving}
            className="h-12 px-8 rounded-full bg-black text-white font-bold hover:bg-gray-900 shadow-lg shadow-black/10"
         >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : currentStep === 5 ? (
              isUpdate ? "Perbarui Profil" : "Simpan Profil"
            ) : (
              <>Lanjut <ChevronRight className="w-4 h-4 ml-2" /></>
            )}
         </Button>
      </div>
    </div>
  );
}

