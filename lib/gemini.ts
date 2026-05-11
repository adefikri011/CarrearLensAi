import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

/**
 * Gemini AI Client configuration and prompt builder
 * for CareerLens AI.
 */

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

export const getGeminiModel = () => {
  if (!model) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    if (!apiKey) {
      console.warn("NEXT_PUBLIC_GEMINI_API_KEY is missing.");
    }
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json",
        maxOutputTokens: 4096,
      },
    });
  }
  return model;
};

/**
 * Builds the career analysis prompt for Gemini
 * Analisis SINKRONISASI antara profil yang diisi user DAN isi CV mereka.
 */
export function buildAnalysisPrompt(profile: any, cvText: string): string {
  return `
Kamu adalah career counselor AI expert. Analisis SINKRONISASI antara 
profil yang diisi user DAN isi CV mereka.

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
