"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";

const Counter = ({ from, to, duration = 2, suffix = "" }: { from: number, to: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(from);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          setCount(Math.floor(value));
        },
      });
      return () => controls.stop();
    }
  }, [from, to, duration, isInView]);

  return (
    <span ref={nodeRef}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export const NumbersSection = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const stats = [
    { label: "Pengguna Aktif", value: 50000, suffix: "+", color: "text-white" },
    { label: "Akurasi AI", value: 94, suffix: "%", color: "text-[#1D9E75]" },
    { label: "Jalur Karier", value: 3, suffix: " Terpilih", color: "text-white" },
    { label: "Roadmap Personal", value: 90, suffix: " Hari", color: "text-[#1D9E75]" },
  ];

  return (
    <section className="bg-[#0A0A0A] py-24 lg:py-32 px-5">
      <div 
        ref={containerRef}
        className="container max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <h3 className={`text-[clamp(32px,6vw,60px)] font-bold tracking-tighter mb-4 ${stat.color}`}>
                <Counter from={0} to={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-[10px] lg:text-[12px] font-bold tracking-[2px] lg:tracking-[3px] uppercase text-[#888888]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
