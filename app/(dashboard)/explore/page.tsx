"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Briefcase, Building2, 
  Linkedin, Star, Filter, ArrowUpRight, 
  Clock, Bookmark, CheckCircle2, Sparkles,
  Globe, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.05 } }
};

const jobPostings = [
  {
    id: "1",
    title: "Senior Front-end Developer",
    company: "Vercel",
    location: "Remote, Worldwide",
    type: "Remote",
    category: "Full-time",
    salary: "$120k - $160k",
    posted: "2h ago",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=V",
    urgent: true,
  },
  {
    id: "2",
    title: "Product Designer",
    company: "Linear",
    location: "New York, US",
    type: "Hybrid",
    category: "Full-time",
    salary: "$110k - $140k",
    posted: "5h ago",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=L",
    urgent: false,
  },
  {
    id: "3",
    title: "Backend Engineer (Go)",
    company: "Stripe",
    location: "Dublin, Ireland",
    type: "On-site",
    category: "Full-time",
    salary: "€100k - €130k",
    posted: "1d ago",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=S",
    urgent: true,
  },
  {
    id: "4",
    title: "Junior QA Engineer",
    company: "Gojek",
    location: "Jakarta, ID",
    type: "Remote",
    category: "Entry Level",
    salary: "Rp 12jt - 18jt",
    posted: "3d ago",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=G",
    urgent: false,
  },
  {
    id: "5",
    title: "Data Analyst Intern",
    company: "Traveloka",
    location: "Jakarta, ID",
    type: "Hybrid",
    category: "Internship",
    salary: "Rp 5jt - 8jt",
    posted: "4d ago",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=T",
    urgent: false,
  },
];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Remote", "Hybrid", "Entry Level", "Internship"];

  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                          job.company.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "All" || job.type === activeFilter || job.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-12">
      {/* Floating Glassmorphism Search Section */}
      <section className="relative h-[300px] rounded-[60px] overflow-hidden flex flex-col items-center justify-center p-10 bg-[#030712]">
         <div className="relative z-10 text-center space-y-6 max-w-2xl w-full">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col items-center">
               <Badge className="bg-teal text-white border-none rounded-full px-6 py-1.5 font-black text-[10px] tracking-widest mb-6">
                  25,482 LOWONGAN AKTIF
               </Badge>
               <h1 className="text-3xl lg:text-5xl font-black text-white italic tracking-tight">Eksplor Masa Depanmu.</h1>
            </motion.div>

            <motion.div 
               variants={fadeUp} initial="hidden" animate="visible"
               className="relative group pt-4"
            >
               <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-[32px] border border-white/10 group-hover:bg-white/10 transition-all shadow-2xl" />
               <div className="relative flex items-center px-6 h-18">
                  <Search className="w-6 h-6 text-dark-muted group-hover:text-teal transition-colors" />
                  <Input 
                    placeholder="Search by title, company, or keywords..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-white placeholder:text-dark-muted text-lg font-medium w-full h-full ml-4"
                  />
                  <button className="bg-teal text-white p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-teal/20">
                     <Zap className="w-5 h-5 fill-current" />
                  </button>
               </div>
            </motion.div>
         </div>

         {/* Animated Background Gradients */}
         <div className="absolute top-0 right-0 w-80 h-80 bg-teal/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Filter Pills */}
      <div className="sticky top-24 z-30 flex flex-nowrap items-center gap-3 overflow-x-auto no-scrollbar py-4 bg-white/80 backdrop-blur-md -mx-4 px-4">
         <div className="flex items-center gap-2 pr-4 border-r border-[#F3F4F6]">
            <Filter className="w-4 h-4 text-text-faint" />
            <span className="text-[10px] font-black text-text-faint uppercase tracking-widest uppercase">FILTER</span>
         </div>
         {filters.map((f) => (
            <button
               key={f}
               onClick={() => setActiveFilter(f)}
               className={cn(
                  "px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all",
                  activeFilter === f 
                    ? "bg-[#030712] text-white shadow-xl" 
                    : "bg-surface-2 text-text-secondary hover:bg-white border border-transparent hover:border-[#F3F4F6]"
               )}
            >
               {f}
            </button>
         ))}
      </div>

      {/* Jobs Grid */}
      <motion.div 
         variants={stagger} initial="hidden" animate="visible"
         className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
         <AnimatePresence mode="popLayout">
            {filteredJobs.length > 0 ? (
               filteredJobs.map((job) => (
                  <motion.div 
                    layout
                    key={job.id} 
                    variants={fadeUp}
                    className="bg-white p-8 lg:p-10 rounded-[48px] border border-[#F3F4F6] hover:shadow-2xl hover:border-teal/20 transition-all duration-500 group relative overflow-hidden"
                  >
                     <div className="flex items-start justify-between mb-10">
                        <div className="flex items-center gap-6">
                           <div className="w-20 h-20 rounded-full border-4 border-surface shadow-inner overflow-hidden flex items-center justify-center bg-surface relative grayscale group-hover:grayscale-0 transition-all">
                              <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                              {job.urgent && (
                                <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-4 border-white animate-pulse" />
                              )}
                           </div>
                           <div>
                              <p className="text-xs font-black text-teal uppercase tracking-widest mb-1">{job.company}</p>
                              <h3 className="text-2xl font-black text-[#030712] group-hover:text-teal transition-colors line-clamp-1">{job.title}</h3>
                           </div>
                        </div>
                        <button className="w-12 h-12 rounded-2xl border border-[#F3F4F6] flex items-center justify-center text-text-faint hover:text-text-primary transition-colors">
                           <Bookmark className="w-5 h-5" />
                        </button>
                     </div>

                     <div className="flex flex-wrap items-center gap-4 mb-10 font-bold">
                        <Badge className="rounded-full bg-surface-2 text-[#030712] border-none px-4 py-1 flex items-center gap-2">
                           <MapPin className="w-3.5 h-3.5 text-text-faint" /> {job.location}
                        </Badge>
                        <Badge className="rounded-full bg-teal-light text-teal border-none px-4 py-1 flex items-center gap-2">
                           <Globe className="w-3.5 h-3.5" /> {job.type}
                        </Badge>
                        <Badge className="rounded-full bg-purple-light text-purple border-none px-4 py-1 flex items-center gap-2 font-bold">
                           <Star className="w-3.5 h-3.5 text-purple fill-current" /> {job.salary}
                        </Badge>
                     </div>

                     <div className="flex items-center justify-between pt-8 border-t border-[#F3F4F6]">
                        <div className="flex items-center gap-2 text-[10px] font-black text-text-faint uppercase tracking-widest">
                           <Clock className="w-4 h-4" /> {job.posted}
                        </div>
                        <div className="flex items-center gap-3">
                           <Button variant="ghost" className="rounded-2xl h-14 px-6 text-blue-600 hover:bg-blue-50 font-black text-xs uppercase tracking-widest">
                              <Linkedin className="w-4 h-4 mr-2" /> LinkedIn Apply
                           </Button>
                           <Button className="rounded-2xl h-14 px-8 bg-[#030712] text-white hover:bg-teal font-black text-xs uppercase tracking-widest group/btn">
                              Quick Apply <ArrowUpRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                           </Button>
                        </div>
                     </div>
                  </motion.div>
               ))
            ) : (
               <div className="col-span-full py-32 text-center flex flex-col items-center">
                  <div className="w-32 h-32 bg-surface-2 rounded-full flex items-center justify-center mb-8">
                     <Search className="w-12 h-12 text-text-faint" />
                  </div>
                  <h3 className="text-2xl font-black text-[#030712] mb-2 font-mono uppercase tracking-tighter">No Matches Found</h3>
                  <p className="text-text-secondary max-w-sm font-medium">Try broadening your search or adjusting the filters.</p>
                  <button onClick={() => { setSearch(""); setActiveFilter("All"); }} className="mt-8 text-teal font-black underline uppercase tracking-widest text-xs">Clear All Filters</button>
               </div>
            )}
         </AnimatePresence>
      </motion.div>

      {/* Recommendation Banner */}
      <section className="bg-amber p-12 rounded-[60px] relative overflow-hidden group">
         <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center lg:text-left">
               <h3 className="text-3xl font-black text-amber-dark italic mb-4">Butuh Bantuan Memilih Lowongan?</h3>
               <p className="text-amber-dark/70 font-medium leading-relaxed">
                  Gunakan AI Matchmaker kami untuk mendapatkan rekomendasi lowongan yang 99% cocok dengan CV dan aspirasi kariermu.
               </p>
            </div>
            <Button className="h-16 px-12 bg-white text-amber-dark rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
               SCAN CV DENGAN AI <Sparkles className="w-5 h-5 ml-2" />
            </Button>
         </div>
         <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:rotate-45 transition-transform">
            <Zap className="w-32 h-32 text-white fill-current" />
         </div>
      </section>
    </div>
  );
}
