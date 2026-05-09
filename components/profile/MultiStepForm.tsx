"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2, User, GraduationCap, Briefcase } from "lucide-react";

/**
 * Profile schema for multi-step form validation
 */
const profileSchema = z.object({
  bio: z.string().min(10, "Bio minimal 10 karakter"),
  location: z.string().min(3, "Lokasi minimal 3 karakter"),
  school: z.string().min(5, "Nama sekolah minimal 5 karakter"),
  major: z.string().min(1, "Harap pilih jurusan"),
  graduationYear: z.string().min(4, "Tahun lulus tidak valid"),
  experienceLevel: z.string().min(1, "Harap pilih level pengalaman"),
  skills: z.string().min(3, "Minimal masukkan satu skill"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const steps = [
  { id: 1, title: "Data Diri", icon: User },
  { id: 2, title: "Pendidikan", icon: GraduationCap },
  { id: 3, title: "Pengalaman", icon: Briefcase },
];

/**
 * MultiStepForm Component
 * A 3-step onboarding form to collect user profile data.
 */
export default function MultiStepForm({ initialData }: { initialData?: any }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: initialData?.bio || "",
      location: initialData?.location || "",
      school: initialData?.school || "",
      major: initialData?.major || "",
      graduationYear: initialData?.graduationYear || new Date().getFullYear().toString(),
      experienceLevel: initialData?.experienceLevel || "entry",
      skills: initialData?.skills || "",
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Gagal menyimpan profil");

      toast({
        title: "Profil Diupdate!",
        description: "Datamu telah berhasil disimpan ke sistem kami.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal menyimpan data ke database.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const nextStep = async () => {
    // Validate current step fields before moving
    let fieldsToValidate: (keyof ProfileFormValues)[] = [];
    if (currentStep === 1) fieldsToValidate = ["bio", "location"];
    if (currentStep === 2) fieldsToValidate = ["school", "major", "graduationYear"];
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-12 relative">
         <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 -z-10" />
         {steps.map((step) => {
           const Icon = step.icon;
           const isActive = currentStep === step.id;
           const isCompleted = currentStep > step.id;
           
           return (
             <div key={step.id} className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                  isActive ? "bg-[#1D9E75] border-[#1D9E75] text-white shadow-xl shadow-[#1D9E75]/20 scale-110" : 
                  isCompleted ? "bg-[#1D9E75] border-[#1D9E75] text-white" : 
                  "bg-white border-slate-200 text-slate-400"
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-bold ${isActive ? "text-[#1D9E75]" : "text-slate-400"}`}>
                  {step.title}
                </span>
             </div>
           );
         })}
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900">Biodata Singkat</h2>
                    <p className="text-slate-500">Beri tahu kami sedikit tentang dirimu.</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tentang Saya</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Sebutkan minat, ambisi, atau apa yang sedang kamu pelajari..." 
                            className="min-h-[120px] rounded-2xl bg-slate-50 border-slate-200 focus:ring-[#1D9E75]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>Minimal 10 karakter.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lokasi Saat Ini</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Contoh: Jakarta Selatan, DKI Jakarta" 
                            className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-[#1D9E75]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900">Pendidikan SMK</h2>
                    <p className="text-slate-500">Latar belakang pendidikanmu sangat penting untuk AI kami.</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama SMK</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="SMK Negeri 1 Jakarta" 
                            className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-[#1D9E75]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="major"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jurusan</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Pilih Jurusan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="RPL">Rekayasa Perangkat Lunak</SelectItem>
                              <SelectItem value="TKJ">Teknik Komputer & Jaringan</SelectItem>
                              <SelectItem value="MM">Multimedia / DKV</SelectItem>
                              <SelectItem value="AK">Akuntansi</SelectItem>
                              <SelectItem value="OTKP">Perkantoran</SelectItem>
                              <SelectItem value="TBSM">Teknik Sepeda Motor</SelectItem>
                              <SelectItem value="TKR">Teknik Kendaraan Ringan</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="graduationYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tahun Lulus</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-[#1D9E75]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900">Pengalaman & Skill</h2>
                    <p className="text-slate-500">Terakhir, ceritakan apa yang kamu kuasai.</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Saat Ini</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                              <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="student">Masih Sekolah</SelectItem>
                            <SelectItem value="fresh_graduate">Baru Lulus (Fresh Graduate)</SelectItem>
                            <SelectItem value="experienced">Sudah Bekerja</SelectItem>
                            <SelectItem value="seeking">Sedang Mencari Kerja</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skill Utama</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Contoh: JavaScript, Office, Desain, Bengkel..." 
                            className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-[#1D9E75]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>Pisahkan dengan koma.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-8 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
                className="rounded-xl h-12 px-6 font-bold text-slate-500"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Kembali
              </Button>

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 px-8 font-bold"
                >
                  Lanjut
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#1D9E75] hover:bg-[#1D9E75]/90 text-white rounded-xl h-12 px-10 font-bold shadow-lg shadow-[#1D9E75]/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Simpan Profil"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
