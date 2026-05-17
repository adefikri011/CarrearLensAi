'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  GraduationCap, 
  Code, 
  Target, 
  CheckCircle2, 
  MapPin, 
  Search, 
  Loader2, 
  Plus, 
  X,
  Building2, 
  Calendar, 
  Wallet, 
  Globe, 
  Sparkles, 
  Heart, 
  Save, 
  Camera,
  Briefcase,
  ChevronRight,
  Info,
  Check,
  ChevronsUpDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Progress } from "@/components/ui/progress"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Region {
  id: string
  name: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  
  // Region Data
  const [provinces, setProvinces] = useState<Region[]>([])
  const [regencies, setRegencies] = useState<Region[]>([])
  const [selectedProvId, setSelectedProvId] = useState("")
  const [isRegionsLoading, setIsRegionsLoading] = useState(false)
  
  const [skillInput, setSkillInput] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    image: "",
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
  })

  // Fetch initial data
  useEffect(() => {
    const init = async () => {
      try {
        const [profileRes, provRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
        ])
        
        const provData = await provRes.json()
        setProvinces(provData)

        const profileResult = await profileRes.json()
        if (profileResult.success && profileResult.data) {
          const p = profileResult.data
          if (p.id) setIsUpdate(true)
          
          const provName = p.kotaTarget?.[0] || ""
          const cityName = p.kotaTarget?.[1] || ""

          // Find ProvId to populate regencies
          const foundProv = provData.find((pr: Region) => pr.name === provName)
          if (foundProv) {
            setSelectedProvId(foundProv.id)
            fetchRegencies(foundProv.id)
          }

          const apiImage = p.image || ""
          setFormData({
            name: p.name || "",
            image: apiImage,
            age: p.usia || 20,
            city: cityName,
            province: provName, 
            gender: p.gender || "Laki-laki",
            education: p.jenjang || "SMK",
            schoolName: p.sekolah || "",
            major: p.jurusan || "",
            gradYear: p.lulusan || "",
            avgScore: p.nilaiRata?.toString() || "",
            skills: p.hardSkills || [],
            interests: p.minat || [],
            salary: p.targetGaji || 5000000,
            targetPos: p.targetPosisi || "",
            workPref: p.preferensiKerja || "Remote"
          })
        }
      } catch (error) {
        console.error("Init profile error:", error)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const fetchRegencies = async (provId: string) => {
    if (!provId) return
    setIsRegionsLoading(true)
    try {
      const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provId}.json`)
      const data = await res.json()
      setRegencies(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsRegionsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          kotaTarget: [formData.province, formData.city]
        }),
      })
      const result = await res.json()
      if (result.success) {
        const p = result.data
        setFormData(prev => ({
          ...prev,
          schoolName: p.sekolah || prev.schoolName,
          major: p.jurusan || prev.major,
          education: p.jenjang || prev.education,
          gradYear: p.lulusan || prev.gradYear,
          avgScore: p.nilaiRata?.toString() || prev.avgScore
        }))
        toast({ title: "Profil Tersimpan", description: "Data masa depanmu sudah diamankan." })
        update() // Sync with session if name changed
        setIsUpdate(true)
        router.refresh()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({ title: "Gagal Simpan", description: error.message, variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const addSkill = (s: string) => {
    const val = s.trim()
    if (!val || formData.skills.includes(val)) return
    if (formData.skills.length >= 10) {
      toast({ title: "Limit", description: "Pilih 10 skill paling unggulanmu." })
      return
    }
    setFormData({ ...formData, skills: [...formData.skills, val] })
    setSkillInput("")
  }

  const completionPercent = Math.round(([
    formData.name, 
    formData.city, 
    formData.province,
    formData.gender,
    formData.schoolName,
    formData.education,
    formData.major, 
    formData.skills.length > 0, 
    formData.targetPos,
    formData.gradYear,
    formData.avgScore
  ].filter(Boolean).length / 11) * 100)

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-[#1D9E75]" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Menyusun Identitas...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-16 space-y-12">
        
        {/* Header with Save Button */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-slate-100">
           <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-black shadow-2xl overflow-hidden flex items-center justify-center border-4 border-white group-hover:scale-105 transition-transform duration-500 relative">
                   {formData.image || session?.user?.image ? (
                     <Image 
                        src={formData.image || session?.user?.image || ""}
                        alt="Profile"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                     />
                   ) : formData.name ? (
                     <span className="text-4xl font-black text-[#1D9E75] italic leading-none">{formData.name.charAt(0)}</span>
                   ) : (
                     <User className="w-12 h-12 text-[#1D9E75]/20" />
                   )}
                </div>
              </div>

              <div className="text-center md:text-left space-y-2">
                 <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter uppercase italic leading-[0.85]">
                   {formData.name || "Kandidat SMK"}
                 </h1>
                 <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
                   <MapPin className="w-3.5 h-3.5 text-[#1D9E75]" /> {formData.city || "Lokasi Belum Diatur"}
                 </p>
              </div>
           </div>

           <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full md:w-auto h-12 px-8 bg-black hover:bg-[#1D9E75] text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all group"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />}
              Simpan Profil
            </Button>
        </section>

        {/* Progress Insight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 bg-[#1D9E75]/5 p-6 md:p-8 rounded-[2rem] border border-[#1D9E75]/10 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#1D9E75] flex items-center justify-center text-white shrink-0">
                 <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-4 flex-1">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-[#1D9E75] uppercase tracking-widest">Kecocokan Profil AI</p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Lengkapi profil untuk mendapatkan rekomendasi lowongan kerja 100% akurat.</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <Progress value={completionPercent} className="h-2 bg-[#1D9E75]/10" />
                    <span className="text-xs font-black italic text-[#1D9E75]">{completionPercent}%</span>
                 </div>
              </div>
           </div>

           <div className="bg-black text-white p-6 md:p-8 rounded-[2rem] flex flex-col justify-center items-center text-center space-y-2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Target Gaji</p>
              <p className="text-2xl font-black italic tracking-tighter">Rp {(formData.salary / 1000000).toFixed(1)} Jt</p>
              <div className="w-full pt-2">
                 <input 
                  type="range" min="2000000" max="25000000" step="500000"
                  value={formData.salary} 
                  onChange={(e) => setFormData({...formData, salary: parseInt(e.target.value)})}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none accent-[#1D9E75] cursor-pointer"
                 />
              </div>
           </div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
           
           {/* Main Column */}
           <div className="md:col-span-8 space-y-12">
              <div className="space-y-8">
                 <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-300 pl-1">Informasi Dasar</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</Label>
                      <Input 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="h-14 rounded-2xl bg-white border-slate-100 font-bold text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Usia</Label>
                        <Input 
                          type="number"
                          value={formData.age}
                          className="h-14 rounded-2xl bg-white border-slate-100 font-bold text-sm text-center"
                          onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Gender</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full h-14 rounded-2xl bg-white border-slate-100 font-bold text-sm justify-between hover:bg-slate-50 uppercase italic"
                            >
                              {formData.gender || "Pilih Gender"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 bg-white" align="start">
                            <Command className="border-none">
                              <CommandInput placeholder="Cari gender..." className="font-bold text-xs" />
                              <CommandList>
                                <CommandGroup>
                                  {["Laki-laki", "Perempuan"].map((g) => (
                                    <CommandItem
                                      key={g}
                                      value={g}
                                      onSelect={() => setFormData({ ...formData, gender: g })}
                                      className="font-bold text-xs uppercase cursor-pointer py-3 hover:bg-slate-50 aria-selected:bg-slate-50 transition-colors"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4 text-[#1D9E75]",
                                          formData.gender === g ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {g}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Lokasi Domisili (Kabupaten)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Province Search Select */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full h-14 rounded-2xl bg-white border-slate-100 font-bold text-sm justify-between hover:bg-slate-50 uppercase italic"
                            >
                              {formData.province || "Pilih Provinsi"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden" align="start">
                            <Command className="border-none">
                              <CommandInput placeholder="Cari provinsi..." className="font-bold text-xs py-4" />
                              <CommandList>
                                <CommandEmpty className="py-6 text-center text-[10px] font-black uppercase text-slate-400">Provinsi tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  {provinces.map((prov) => (
                                    <CommandItem
                                      key={prov.id}
                                      value={prov.name}
                                      onSelect={() => {
                                        setSelectedProvId(prov.id)
                                        setFormData({ ...formData, province: prov.name, city: "" })
                                        fetchRegencies(prov.id)
                                      }}
                                      className="font-bold text-xs uppercase cursor-pointer py-3 hover:bg-slate-50 aria-selected:bg-slate-50 transition-colors"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4 text-[#1D9E75]",
                                          formData.province === prov.name ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {prov.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        {/* Regency Search Select */}
                        <div className="relative">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                disabled={!selectedProvId || isRegionsLoading}
                                className="w-full h-14 rounded-2xl bg-white border-slate-100 font-bold text-sm justify-between hover:bg-slate-50 disabled:opacity-50 uppercase italic"
                              >
                                {formData.city || "Pilih Kab/Kota"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                             <PopoverContent className="w-full p-0 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden" align="start">
                              <Command className="border-none">
                                <CommandInput placeholder="Cari kabupaten/kota..." className="font-bold text-xs py-4" />
                                <CommandList>
                                  <CommandEmpty className="py-6 text-center text-[10px] font-black uppercase text-slate-400">Lokasi tidak ditemukan.</CommandEmpty>
                                  <CommandGroup>
                                    {regencies.map((reg) => (
                                      <CommandItem
                                        key={reg.id}
                                        value={reg.name}
                                        onSelect={() => {
                                          setFormData({ ...formData, city: reg.name })
                                        }}
                                        className="font-bold text-xs uppercase cursor-pointer py-3 hover:bg-slate-50 aria-selected:bg-slate-50 transition-colors"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4 text-[#1D9E75]",
                                            formData.city === reg.name ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {reg.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          {isRegionsLoading && <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-[#1D9E75]" />}
                        </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-8">
                 <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-300 pl-1">Pendidikan SMK</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Jenjang Pendidikan</Label>
                       <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full h-14 rounded-2xl bg-white border-slate-100 font-bold text-sm justify-between hover:bg-slate-50 uppercase italic"
                            >
                              {formData.education || "Pilih Jenjang"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden" align="start">
                            <Command className="border-none">
                              <CommandInput placeholder="Cari jenjang..." className="font-bold text-xs py-4" />
                              <CommandList>
                                <CommandGroup>
                                  {["SMK", "SMA", "Diploma", "Sarjana"].map((edu) => (
                                    <CommandItem
                                      key={edu}
                                      value={edu}
                                      onSelect={() => setFormData({ ...formData, education: edu })}
                                      className="font-bold text-xs uppercase cursor-pointer py-3 hover:bg-slate-50 aria-selected:bg-slate-50 transition-colors"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4 text-[#1D9E75]",
                                          formData.education === edu ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {edu}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                       </Popover>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nama Sekolah / Instansi</Label>
                       <Input 
                        value={formData.schoolName}
                        onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                        className="h-14 rounded-2xl bg-white border-slate-100 font-bold text-sm focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] transition-all"
                        placeholder="SMKN 1 Bandung"
                       />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Kompetensi Keahlian (Jurusan)</Label>
                       <Input 
                        value={formData.major}
                        onChange={(e) => setFormData({...formData, major: e.target.value})}
                        className="h-14 rounded-2xl bg-white border-slate-100 font-bold text-sm focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] transition-all"
                        placeholder="Rekayasa Perangkat Lunak"
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun Lulus</Label>
                          <Input 
                            value={formData.gradYear}
                            onChange={(e) => setFormData({...formData, gradYear: e.target.value})}
                            className="h-14 rounded-2xl bg-white border-slate-100 font-bold text-sm text-center"
                            placeholder="2024"
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nilai Rata-rata</Label>
                          <Input 
                            value={formData.avgScore}
                            onChange={(e) => setFormData({...formData, avgScore: e.target.value})}
                            className="h-14 rounded-2xl bg-white border-slate-100 font-bold text-sm text-center"
                            placeholder="85.0"
                          />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Sidebar Column */}
           <div className="md:col-span-4 space-y-12">
              <div className="space-y-8">
                 <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-300 pl-1">Keahlian</h3>
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hard Skills</Label>
                       <div className="flex gap-2">
                          <Input 
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addSkill(skillInput)}
                            className="h-12 rounded-xl bg-white border-slate-100 font-bold text-xs"
                            placeholder="e.g. AutoCAD"
                          />
                          <Button onClick={() => addSkill(skillInput)} className="h-12 w-12 rounded-xl bg-black hover:bg-black/90 active:scale-95 transition-all flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                          </Button>
                       </div>
                       <div className="flex flex-wrap gap-2">
                          {formData.skills.map(s => (
                            <Badge key={s} className="bg-slate-50 text-black border-slate-100 px-3 py-1.5 rounded-lg font-black text-[8px] uppercase tracking-widest flex items-center gap-2" onClick={() => setFormData({...formData, skills: formData.skills.filter(i => i !== s)})}>
                               {s} <X className="w-2.5 h-2.5" />
                            </Badge>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ambisi Karier (Posisi)</Label>
                       <Input 
                        value={formData.targetPos}
                        onChange={(e) => setFormData({...formData, targetPos: e.target.value})}
                        className="h-14 rounded-2xl bg-white border-slate-100 font-bold text-sm"
                        placeholder="e.g. Junior Developer"
                       />
                    </div>

                    <div className="space-y-4">
                       <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Ruang Kerja</Label>
                       <div className="grid grid-cols-3 gap-2">
                          {["Remote", "On-site", "Hybrid"].map(pref => (
                            <button
                              key={pref}
                              onClick={() => setFormData({...formData, workPref: pref})}
                              className={cn(
                                "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                formData.workPref === pref ? "bg-black text-white border-black" : "bg-white text-slate-400 hover:text-black hover:border-slate-200 border-slate-50"
                              )}
                            >
                              {pref}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-3">
                       <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Minat Industri</Label>
                       <div className="flex flex-wrap gap-2">
                          {["Produksi", "Teknologi", "Kreatif", "Jasa"].map(ind => {
                             const active = formData.interests.includes(ind)
                             return (
                                <button
                                  key={ind}
                                  onClick={() => {
                                    const next = active ? formData.interests.filter(i => i !== ind) : [...formData.interests, ind]
                                    setFormData({...formData, interests: next})
                                  }}
                                  className={cn(
                                    "px-4 py-2 rounded-xl border font-black text-[9px] uppercase tracking-widest transition-all",
                                    active ? "bg-black text-white border-black" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                                  )}
                                >
                                  {ind}
                                </button>
                             )
                          })}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-[#534AB7]/5 p-8 rounded-[2.5rem] border border-[#534AB7]/10 space-y-6">
                 <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-[#534AB7]" />
                    <p className="font-black text-[10px] uppercase tracking-widest text-[#534AB7]">Tips Karier</p>
                 </div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
                   Pastikan &quot;Tahun Lulus&quot; akurat agar sistem AI dapat menyarankan program internship atau magang yang sesuai dengan timeline-mu.
                 </p>
              </div>
           </div>
        </div>

        {/* Global Save Button at Bottom */}
        <div className="pt-20">
           <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-16 bg-black hover:bg-[#1D9E75] text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all group"
            >
              {isSaving ? <Loader2 className="w-6 h-6 animate-spin mr-3 text-white" /> : <CheckCircle2 className="w-6 h-6 mr-3 text-white group-hover:scale-110 transition-transform" />}
              Sinkronisasi Seluruh Data Profil
            </Button>
            <p className="mt-6 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">CareerLens AI – Indonesian SMK Edition</p>
        </div>

      </main>
    </div>
  )
}

