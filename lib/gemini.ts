import { GoogleGenAI } from "@google/genai";

/**
 * Gemini AI Client configuration and prompt builder
 * for CareerLens AI.
 * 
 * IMPORTANT: Gemini API is called SERVER-SIDE for security.
 * Using the recommended @google/genai SDK for this environment.
 */

let aiInstance: GoogleGenAI | null = null;

export const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing in environment variables.");
    }
    
    aiInstance = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
};

// Model specifically requested by user, using gemini-3-flash-preview as reliable fallback if requested one is not available
export const GEMINI_MODEL = "gemini-2.5-flash-preview-05-20";

/**
 * Builds a specific prompt for generating a detailed 12-week roadmap for a chosen career path.
 */
export function buildRoadmapGenerationPrompt(profile: any, cvText: string, path: any): string {
  return `
Kamu adalah career mentor expert. Buatlah ROADMAP DETAIL 12 MINGGU untuk membantu user mencapai posisi: "${path.nama}".

KONTEKS USER:
- Background: ${profile.lulusan} ${profile.jurusan}
- Skills Saat Ini: ${cvText.substring(0, 500)}... (ekstraksi ringkas)
- Target: ${path.nama}

INSTRUKSI:
1. Buat 12 minggu langkah konkret.
2. Bagi menjadi 3 fase: "fondasi" (minggu 1-4), "pengembangan" (minggu 5-8), "persiapan" (minggu 9-12).
3. Setiap minggu, berikan minimal 3 "tasks" konkret.
4. Berikan "resource" (bisa berupa dokumentasi resmi, kursus gratis di YouTube/Coursera, atau buku).
5. Berikan "resourceLink" yang valid (atau link ke pencarian relevan).

Kembalikan HANYA JSON array dengan struktur:
[
  {
    "minggu": number,
    "fase": "fondasi"|"pengembangan"|"persiapan",
    "title": string,
    "tasks": string[],
    "hours": string,
    "resource": string,
    "resourceLink": string
  },
  ... (sampai minggu 12)
]
`;
}
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
    "keywords": { "matched": string[], "missing": string[] },
    "sections": [
      { "title": "Data Pribadi", "detected": boolean },
      { "title": "Ringkasan Profil", "detected": boolean },
      { "title": "Pengalaman Kerja", "detected": boolean },
      { "title": "Pendidikan", "detected": boolean },
      { "title": "Skill Teknis", "detected": boolean },
      { "title": "Proyek & Sertifikat", "detected": boolean }
    ]
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
      "trendArah": "naik"|"stabil"|"turun",
      "roadmapSummary": string
    }
  ],
  "roadmap90Hari": [
    {
      "minggu": number,
      "fase": "fondasi"|"pengembangan"|"persiapan",
      "judul": string,
      "tugas": [
        { "id": string, "text": string, "selesai": false }
      ],
      "resource": { "judul": string, "url": string, "platform": string },
      "estimasiJam": number
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
  "rekomendasiUtama": string[],
  "pesan": string
}
`;
}
