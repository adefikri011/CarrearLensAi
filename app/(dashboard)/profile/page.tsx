"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, GraduationCap, Code, Target, CheckCircle, 
  ChevronRight, ChevronLeft, Camera, Briefcase, 
  Heart, Sparkles, MapPin, Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "Budi Santoso",
    age: 22,
    city: "Jakarta",
    gender: "Laki-laki",
    education: "S1",
    major: "Teknik Informatika",
    gradYear: "2024",
    skills: ["React", "TypeScript", "UI Design"],
    interests: ["Teknologi", "Desain", "Startups"],
    salary: 8000000,
    targetPos: "Front-end Developer",
    workPref: "Remote"
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div variants={fadeUp} className="space-y-8">
            <div className="flex flex-col items-center mb-10">
               <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-surface-2 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                     <User className="w-16 h-16 text-text-faint" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2.5 bg-teal text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all">
                     <Camera className="w-5 h-5" />
                  </button>
               </div>
               <p className="mt-4 text-sm font-bold text-teal">Ganti Foto Profil</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <Label className="text-xs font-black text-text-faint uppercase tracking-widest pl-2">Nama Lengkap</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-14 rounded-2xl border-[#F3F4F6] focus:border-teal focus:ring-teal/10"
                    placeholder="Contoh: John Doe"
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-xs font-black text-text-faint uppercase tracking-widest pl-2">Kota Domisili</Label>
                  <div className="relative">
                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
                     <Input 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="h-14 pl-12 rounded-2xl border-[#F3F4F6] focus:border-teal"
                        placeholder="Contoh: Jakarta"
                     />
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex justify-between items-end">
                  <Label className="text-xs font-black text-text-faint uppercase tracking-widest pl-2">Usia: {formData.age} Tahun</Label>
               </div>
               <input 
                  type="range" 
                  min="16" max="45" 
                  value={formData.age} 
                  onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                  className="w-full h-2 bg-surface-2 rounded-full appearance-none cursor-pointer accent-teal"
               />
               <div className="flex justify-between text-[10px] text-text-faint font-bold uppercase tracking-widest px-1">
                  <span>16 Tahun</span>
                  <span>45 Tahun</span>
               </div>
            </div>

            <div className="space-y-3">
               <Label className="text-xs font-black text-text-faint uppercase tracking-widest pl-2">Jenis Kelamin</Label>
               <div className="grid grid-cols-2 gap-4">
                  {["Laki-laki", "Perempuan"].map(g => (
                     <button
                        key={g}
                        onClick={() => setFormData({...formData, gender: g})}
                        className={cn(
                           "h-14 rounded-2xl border-2 transition-all font-bold text-sm",
                           formData.gender === g ? "bg-teal-light border-teal text-teal" : "bg-white border-[#F3F4F6] text-text-secondary hover:border-teal/30"
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
               <Label className="text-xs font-black text-text-faint uppercase tracking-widest pl-2">Jenjang Pendidikan Terakhir</Label>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {["SMA", "SMK", "D3", "S1", "S2", "Profesional"].map(edu => (
                     <button
                        key={edu}
                        onClick={() => setFormData({...formData, education: edu})}
                        className={cn(
                           "p-4 rounded-2xl border-2 transition-all font-bold text-sm flex flex-col items-center gap-3",
                           formData.education === edu ? "bg-teal-light border-teal text-teal shadow-lg shadow-teal/10" : "bg-white border-[#F3F4F6] text-text-secondary hover:border-teal/30"
                        )}
                     >
                        <GraduationCap className={cn("w-6 h-6", formData.education === edu ? "text-teal" : "text-text-faint")} />
                        {edu}
                     </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <Label className="text-xs font-black text-text-faint uppercase tracking-widest pl-2">Jurusan / Konsentrasi</Label>
                  <Input 
                    value={formData.major} 
                    onChange={(e) => setFormData({...formData, major: e.target.value})}
                    className="h-14 rounded-2xl border-[#F3F4F6]"
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-xs font-black text-text-faint uppercase tracking-widest pl-2">Tahun Lulus</Label>
                  <Input 
                    value={formData.gradYear} 
                    onChange={(e) => setFormData({...formData, gradYear: e.target.value})}
                    className="h-14 rounded-2xl border-[#F3F4F6]"
                  />
               </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div variants={fadeUp} className="space-y-8">
            <div className="space-y-4">
               <Label className="text-xs font-black text-text-faint uppercase tracking-widest pl-2">Pilih Skill Kamu (Multi-select)</Label>
               <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
                  <Input className="h-12 pl-12 rounded-xl bg-surface border-none" placeholder="Cari skill (misal: React, Python, Sales...)" />
               </div>
               <div className="flex flex-wrap gap-3">
                  {["React", "TypeScript", "Node.js", "Figma", "UI Design", "SEO", "Copywriting", "Python", "Excel"].map(skill => (
                     <button
                        key={skill}
                        onClick={() => {
                           const newSkills = formData.skills.includes(skill) 
                              ? formData.skills.filter(s => s !== skill)
                              : [...formData.skills, skill];
                           setFormData({...formData, skills: newSkills});
                        }}
                        className={cn(
                           "px-5 py-2.5 rounded-full border-2 text-sm font-bold transition-all",
                           formData.skills.includes(skill) ? "bg-teal text-white border-teal shadow-lg shadow-teal/20" : "bg-white border-[#F3F4F6] text-text-secondary hover:border-teal/30"
                        )}
                     >
                        {skill}
                     </button>
                  ))}
               </div>
            </div>

            <div className="space-y-6">
               <Label className="text-xs font-black text-text-faint uppercase tracking-widest pl-2">Minat Industri</Label>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                           "p-6 rounded-3xl border-2 transition-all flex flex-col gap-4 text-left group",
                           formData.interests.includes(ind.t) ? "bg-purple-light border-purple text-purple shadow-lg shadow-purple/10" : "bg-white border-[#F3F4F6] text-text-secondary hover:border-purple/30"
                        )}
                     >
                        <div className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                           formData.interests.includes(ind.t) ? "bg-white text-purple" : "bg-surface-2 text-text-faint"
                        )}>
                           {React.cloneElement(ind.icon as React.ReactElement, { className: "w-6 h-6" })}
                        </div>
                        <span className="font-bold text-sm">{ind.t}</span>
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
               <Label className="text-xs font-black text-text-faint uppercase tracking-widest pl-2">Target Posisi Pekerjaan</Label>
               <Input 
                  value={formData.targetPos}
                  onChange={(e) => setFormData({...formData, targetPos: e.target.value})}
                  className="h-14 rounded-2xl border-[#F3F4F6]"
                  placeholder="Misal: Senior Product Manager"
               />
            </div>

            <div className="space-y-6">
               <div className="flex justify-between items-end">
                  <Label className="text-xs font-black text-text-faint uppercase tracking-widest pl-2">Ekspektasi Gaji (Rp)</Label>
                  <span className="text-teal font-black text-lg">Rp {formData.salary.toLocaleString('id-ID')}</span>
               </div>
               <input 
                  type="range" 
                  min="2000000" max="50000000" step="500000"
                  value={formData.salary} 
                  onChange={(e) => setFormData({...formData, salary: parseInt(e.target.value)})}
                  className="w-full h-2 bg-surface-2 rounded-full appearance-none cursor-pointer accent-teal"
               />
               <div className="flex justify-between text-[10px] text-text-faint font-bold uppercase tracking-widest px-1">
                  <span>Rp 2 Juta</span>
                  <span>Rp 50 Juta</span>
               </div>
            </div>

            <div className="space-y-3">
               <Label className="text-xs font-black text-text-faint uppercase tracking-widest pl-2">Preferensi Kerja</Label>
               <div className="grid grid-cols-3 gap-4">
                  {["On-site", "Remote", "Hybrid"].map(pref => (
                     <button
                        key={pref}
                        onClick={() => setFormData({...formData, workPref: pref})}
                        className={cn(
                           "p-4 rounded-2xl border-2 transition-all font-bold text-sm",
                           formData.workPref === pref ? "bg-teal-light border-teal text-teal" : "bg-white border-[#F3F4F6] text-text-secondary hover:border-teal/30"
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
            <div className="p-8 bg-surface rounded-[40px] border border-[#F3F4F6] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8">
                  <CheckCircle className="w-12 h-12 text-teal opacity-20" />
               </div>
               <h3 className="text-2xl font-black text-[#030712] mb-8">Review Profil Kamu</h3>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <div>
                        <p className="text-[10px] font-black text-text-faint uppercase tracking-widest mb-1">DATA DIRI</p>
                        <p className="font-bold text-[#030712]">{formData.name} • {formData.age} Thn</p>
                        <p className="text-text-secondary text-sm">{formData.city} • {formData.gender}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-text-faint uppercase tracking-widest mb-1">PENDIDIKAN</p>
                        <p className="font-bold text-[#030712]">{formData.education} {formData.major}</p>
                        <p className="text-text-secondary text-sm">Lulus Tahun {formData.gradYear}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-text-faint uppercase tracking-widest mb-1">TARGET KARIER</p>
                        <p className="font-bold text-[#030712]">{formData.targetPos}</p>
                        <p className="text-text-secondary text-sm">Gaji: Rp {formData.salary.toLocaleString('id-ID')} • {formData.workPref}</p>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div>
                        <p className="text-[10px] font-black text-text-faint uppercase tracking-widest mb-1">SKILLS</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                           {formData.skills.map(s => <Badge key={s} variant="outline" className="rounded-full border-teal/20 text-teal">{s}</Badge>)}
                        </div>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-text-faint uppercase tracking-widest mb-1">MINAT INDUSTRI</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                           {formData.interests.map(i => <Badge key={i} className="rounded-full bg-purple-light text-purple border-none">{i}</Badge>)}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-teal-light rounded-2xl border border-teal/10 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
               </div>
               <p className="text-sm font-medium text-teal-dark">AI kami akan menganalisis profilmu segera setelah kamu menekan tombol simpan.</p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      {/* Header */}
      <div className="text-center mb-16">
         <h1 className="text-h2 text-[#030712] mb-3">Lengkapi Profilmu</h1>
         <p className="text-text-secondary">Informasi ini membantu AI kami memberikan rekomendasi karier yang lebih akurat.</p>
      </div>

      {/* Progress Indicator */}
      <div className="relative mb-20 px-4">
         <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-2 -translate-y-1/2 z-0" />
         <div 
           className="absolute top-1/2 left-0 h-[2px] bg-teal -translate-y-1/2 z-0 transition-all duration-500 ease-out" 
           style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
         />
         <div className="relative z-10 flex justify-between items-center">
            {STEPS.map((step) => {
               const isActive = currentStep >= step.id;
               const isCurrent = currentStep === step.id;
               return (
                  <div key={step.id} className="flex flex-col items-center gap-3">
                     <button 
                        onClick={() => setCurrentStep(step.id)}
                        className={cn(
                           "w-12 h-12 rounded-full border-4 transition-all duration-300 flex items-center justify-center",
                           isActive ? "bg-white border-teal text-teal shadow-xl shadow-teal/20" : "bg-white border-surface-2 text-text-faint",
                           isCurrent && "scale-125 border-teal bg-teal text-white"
                        )}
                     >
                        <step.icon className={cn("w-5 h-5", isCurrent ? "text-white" : isActive ? "text-teal" : "text-text-faint")} />
                     </button>
                     <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest hidden sm:block",
                        isActive ? "text-teal" : "text-text-faint"
                     )}>
                        {step.title}
                     </span>
                  </div>
               );
            })}
         </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-[48px] border border-[#F3F4F6] shadow-2xl p-8 md:p-14 mb-10 overflow-hidden min-h-[500px]">
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
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
         <Button 
            variant="ghost" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            className="h-14 px-8 rounded-2xl font-bold text-text-secondary disabled:opacity-20 translate-all"
         >
            <ChevronLeft className="w-5 h-5 mr-2" /> Kembali
         </Button>
         <Button 
            onClick={currentStep === 5 ? () => alert('Profil Disimpan!') : nextStep}
            className="h-14 px-10 rounded-2xl bg-[#030712] text-white font-bold hover:bg-black group transition-all"
         >
            {currentStep === 5 ? "Simpan Profil" : "Lanjut"} 
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-all" />
         </Button>
      </div>
    </div>
  );
}
