"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

/**
 * Zod schema for registration with custom validation for password confirmation
 */
const formSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

/**
 * RegisterForm Component
 * Handles user registration with API call to /api/auth/register.
 */
export default function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal melakukan registrasi");
      }

      toast({
        title: "Pendaftaran Berhasil!",
        description: "Silakan masuk menggunakan akun barumu.",
      });
      
      router.push("/login");
    } catch (error) {
      toast({
        title: "Gagal Mendaftar",
        description: error instanceof Error ? error.message : "Terjadi kesalahan sistem.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 w-full max-w-sm mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Buat Akun Baru</h1>
        <p className="text-slate-500 text-sm">
          Mulai langkah pertamamu menuju karier impian
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Nama Lengkap</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Budi Setiawan" 
                    {...field} 
                    className="bg-slate-50 border-slate-200 h-11 rounded-xl focus:ring-[#1D9E75]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="budi@example.com" 
                    {...field} 
                    className="bg-slate-50 border-slate-200 h-11 rounded-xl focus:ring-[#1D9E75]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    className="bg-slate-50 border-slate-200 h-11 rounded-xl focus:ring-[#1D9E75]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Konfirmasi Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    className="bg-slate-50 border-slate-200 h-11 rounded-xl focus:ring-[#1D9E75]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full h-12 bg-[#1D9E75] hover:bg-[#1D9E75]/90 rounded-xl font-bold text-lg"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Daftar Sekarang"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-[#1D9E75] font-bold hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
