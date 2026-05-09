"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface SkillRadarChartProps {
  data: {
    teknisDigital: number;
    komunikasi: number;
    kreativitas: number;
    analitis: number;
    kepemimpinan: number;
    adaptabilitas: number;
  };
}

export default function SkillRadarChart({ data }: SkillRadarChartProps) {
  const chartData = [
    { subject: "Teknis & Digital", A: data.teknisDigital, fullMark: 100 },
    { subject: "Komunikasi", A: data.komunikasi, fullMark: 100 },
    { subject: "Kreativitas", A: data.kreativitas, fullMark: 100 },
    { subject: "Analitis", A: data.analitis, fullMark: 100 },
    { subject: "Kepemimpinan", A: data.kepemimpinan, fullMark: 100 },
    { subject: "Adaptabilitas", A: data.adaptabilitas, fullMark: 100 },
  ];

  return (
    <div className="w-full h-[350px] bg-white rounded-3xl p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Radar Kompetensi</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fontSize: 10 }} 
            stroke="#cbd5e1"
          />
          <Radar
            name="Profil Kamu"
            dataKey="A"
            stroke="#1D9E75"
            fill="#1D9E75"
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
