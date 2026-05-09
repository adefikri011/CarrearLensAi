import React from "react";
import { Rocket } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side: Illustration & Branding */}
      <div className="hidden lg:flex flex-col bg-[#1D9E75] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col h-full">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">CareerLens AI</span>
          </Link>
          
          <div className="mt-auto max-w-md">
            <h2 className="text-4xl font-black leading-tight mb-6">
              &quot;Karier bukan tentang di mana kamu mulai, tapi ke mana kamu ingin pergi.&quot;
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10" />
              <div>
                <p className="font-bold">Aulia Putri</p>
                <p className="text-sm text-white/70">UI Designers, SMK Graduate 2023</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      </div>

      {/* Right Side: Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1D9E75] flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">CareerLens AI</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
