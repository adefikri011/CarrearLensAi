import { GoogleGenAI } from "@google/genai";

/**
 * Gemini AI Client configuration and prompt builder
 * for CareerLens AI.
 * 
 * NOTE: As per system instructions, Gemini API MUST be called 
 * from the client-side. This library provides helpers for that.
 */

let aiInstance: GoogleGenAI | null = null;

export const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    if (!apiKey) {
      console.warn("NEXT_PUBLIC_GEMINI_API_KEY is missing.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

// Recommended model for text tasks
export const GEMINI_MODEL = "gemini-1.5-flash-latest";

/**
 * Builds the career analysis prompt for Gemini
 * Analisis SINKRONISASI antara profil yang diisi user DAN isi CV mereka.
 */
export function buildAnalysisPrompt(profile: any, cvText: string): string {
  return `
Kamu adalah career counselor AI expert. Analisis SINKRONISASI antara 
profil yang diisi user DAN isi CV mereka.

PRIORITAS ANALISIS:
1. ISI CV = sumber utama (primary source). Jika ada perbedaan antara profil dan CV, prioritaskan bukti dari CV.
2. Profil = konteks tambahan untuk memahami minat dan target pengguna.
3. Career path HARUS berakar pada pengalaman atau potensi yang terlihat di CV.
4. Keywords diambil dari isi CV, bukan sekadar dari input profil.
5. Jika CV dan profil tidak sinkron (misal: pengalaman admin tapi ingin jadi programmer), rekomendasikan langkah konkret untuk menyelaraskannya.

PROFIL YANG DIISI USER:
- Nama: ${profile.nama || 'Tidak diisi'}
- Pendidikan: ${profile.lulusan || '-'} - ${profile.jurusan || '-'}
- Hard Skills: ${profile.hardSkills?.join(', ') || 'Tidak ada'}
- Soft Skills: ${profile.softSkills?.join(', ') || 'Tidak ada'}
- Minat Industri: ${profile.minat?.join(', ') || 'Tidak ada'}
- Target Gaji: Rp${profile.targetGaji?.toLocaleString('id-ID') || '0'}
- Preferensi Kerja: ${profile.preferensiKerja || '-'}

ISI CV USER:
${cvText}

INSTRUKSI ANALISIS:
1. Bandingkan skills di profil vs skills yang terdeteksi di CV
2. Jika ada INKONSISTENSI (misal: profil bilang programmer tapi CV berisi 
   pekerjaan admin), TETAP analisis berdasarkan KOMBINASI keduanya
3. Berikan career path yang realistis berdasarkan KEDUANYA
4. Dalam rekomendasiUtama, sebutkan jika ada gap antara profil dan CV
5. cvScore harus mencerminkan kualitas CV yang sebenarnya

PENTING: Jangan asal-asalan. Berikan analisis yang jujur dan akurat.
Jika profil dan CV tidak sinkron, rekomendasikan cara menyeleraskannya.

Kembalikan HANYA JSON valid dengan struktur ini:
{
  "overallReadiness": number (0-100),
  "syncScore": number (0-100, seberapa sinkron profil vs CV),
  "syncIssues": string[] (list masalah sinkronisasi jika ada),
  "cvScore": {
    "total": number,
    "atsCompatibility": number,
    "completeness": number,
    "actionVerbs": number,
    "keywords": { "matched": string[], "missing": string[] }
  },
  "careerPaths": [
    {
      "id": string,
      "nama": string,
      "matchScore": number,
      "deskripsi": string,
      "estimasiGajiMin": number,
      "estimasiGajiMax": number,
      "waktuSiapBulan": number,
      "requiredSkills": [
        { "skill": string, "userHas": boolean, "priority": "high"|"medium"|"low" }
      ],
      "sertifikasiRekomendasi": string[],
      "jobDemand": "tinggi"|"sedang"|"rendah",
      "trendArah": "naik"|"stabil"|"turun"
    }
  ],
  "skillRadar": {
    "teknisDigital": number,
    "komunikasi": number,
    "kreativitas": number,
    "analitis": number,
    "kepemimpinan": number,
    "adaptabilitas": number
  },
  "roadmap90Hari": [
    {
      "minggu": number,
      "fase": "fondasi"|"pengembangan"|"persiapan",
      "tugas": string,
      "kategori": "belajar"|"praktek"|"networking"|"portofolio",
      "estimasiJam": number,
      "resource": { "judul": string, "url": string, "platform": string }
    }
  ],
  "rekomendasiUtama": string[],
  "pesan": string
}
`;
}
