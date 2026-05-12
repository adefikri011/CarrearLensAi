export interface AnalysisResult {
  overallReadiness: number;
  cvScore: {
    total: number;
    atsCompatibility: number;
    completeness: number;
    actionVerbs: number;
    keywords: {
      matched: string[];
      missing: string[];
    };
    sections: {
      title: string;
      detected: boolean;
    }[];
  };
  careerPaths: CareerPath[];
  skillRadar: {
    teknisDigital: number;
    komunikasi: number;
    kreativitas: number;
    analitis: number;
    kepemimpinan: number;
    adaptabilitas: number;
  };
  roadmap90Hari: RoadmapItem[];
  rekomendasiUtama: string[];
  pesan: string;
}

export interface CareerPath {
  id: string;
  nama: string;
  matchScore: number;
  deskripsi: string;
  estimasiGajiMin: number;
  estimasiGajiMax: number;
  waktuSiapBulan: number;
  requiredSkills: {
    skill: string;
    userHas: boolean;
    priority: "high" | "medium" | "low";
  }[];
  sertifikasiRekomendasi: string[];
  jobDemand: "tinggi" | "sedang" | "rendah";
  trendArah: "naik" | "stabil" | "turun";
}

export interface RoadmapItem {
  minggu: number;
  fase: "fondasi" | "pengembangan" | "persiapan";
  tugas: string;
  kategori: "belajar" | "praktek" | "networking" | "portofolio";
  estimasiJam: number;
  resource: {
    judul: string;
    url: string;
    platform: string;
  };
}
