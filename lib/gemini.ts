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
 */
export function buildCareerAnalysisPrompt(profile: any, cvText: string) {
  return `
Kamu adalah career counselor AI ahli untuk pelajar SMK Indonesia.
Analisis profil berikut dan kembalikan response dalam JSON valid.

PROFIL PENGGUNA:
${JSON.stringify(profile, null, 2)}

ISI CV:
${cvText}

Kembalikan HANYA JSON dengan struktur berikut (tanpa teks lain):
{
  "overallReadiness": number (0-100),
  "cvScore": {
    "total": number (0-100),
    "atsCompatibility": number,
    "completeness": number,
    "actionVerbs": number,
    "keywords": { "matched": string[], "missing": string[] }
  },
  "careerPaths": [
    {
      "id": string,
      "nama": string,
      "matchScore": number (0-100),
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
      "minggu": number (1-12),
      "fase": "fondasi"|"pengembangan"|"persiapan",
      "tugas": string,
      "kategori": "belajar"|"praktek"|"networking"|"portofolio",
      "estimasiJam": number,
      "resource": { "judul": string, "url": string, "platform": string }
    }
  ],
  "rekomendasiUtama": string[],  // 3 poin paling penting
  "pesan": string  // pesan motivasi personal dari AI
}
`;
}
