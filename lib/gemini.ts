import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini AI Client configuration and prompt builder
 * for CareerLens AI.
 * 
 * IMPORTANT: Gemini API is called SERVER-SIDE for security.
 * Using the standard @google/generative-ai SDK.
 */

let aiInstance: GoogleGenerativeAI | null = null;

export const getAI = (): GoogleGenerativeAI => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required. Please set it in AI Studio settings.");
  }

  if (!aiInstance) {
    aiInstance = new GoogleGenerativeAI(apiKey);
  }
  
  const realAI = aiInstance;

  // Create a transparent proxy object that intercepts getGenerativeModel
  const proxyAI = Object.create(realAI);
  
  proxyAI.getGenerativeModel = function (modelParams: any) {
    const requestedModel = modelParams.model || GEMINI_MODEL;
    
    // Fallback list of models to try sequentially if a transient error (e.g., 503 overload) occurs
    const fallbackModels = [
      requestedModel,
      "gemini-2.5-flash",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
    ];
    
    const uniqueModels = Array.from(new Set(fallbackModels));

    return {
      generateContent: async function (generateParams: any) {
        let lastError: any = null;
        
        for (const currentModel of uniqueModels) {
          let retries = 3;
          let delay = 1000;
          
          console.log(`[Gemini Proxy] Attempting generation with model: ${currentModel}`);
          
          while (retries > 0) {
            try {
              const realModel = realAI.getGenerativeModel({
                ...modelParams,
                model: currentModel,
              });
              
              const result = await realModel.generateContent(generateParams);
              
              if (result && result.response) {
                try {
                  const txt = result.response.text();
                  if (txt) {
                    console.log(`[Gemini Proxy] Successfully completed generation using model: ${currentModel}`);
                    return result;
                  }
                } catch (e) {
                  console.warn(`[Gemini Proxy] Response text extraction failed for model ${currentModel}:`, e);
                }
              }
              
              throw new Error("Received empty or corrupt response from Gemini API");
            } catch (error: any) {
              lastError = error;
              const status = error?.status || error?.statusCode || 0;
              const message = error?.message || "";
              
              console.error(
                `[Gemini Proxy] Failed attempt with ${currentModel}. Remaining attempts: ${retries - 1}. ` +
                `Error Status: ${status}, Message: ${message}`
              );
              
              // Immediate fail for client semantic/argument issues
              if (
                status === 400 || 
                message.includes("400") || 
                message.includes("INVALID_ARGUMENT") || 
                message.includes("does not support responseMimeType")
              ) {
                throw error;
              }
              
              retries--;
              if (retries > 0) {
                console.log(`[Gemini Proxy] Waiting ${delay}ms before retrying...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 2;
              }
            }
          }
        }
        
        throw lastError || new Error("Semua model Gemini yang dicoba sedang tidak dapat diakses.");
      }
    };
  };

  return proxyAI as GoogleGenerativeAI;
};

// Recommended model for production tasks
export const GEMINI_MODEL = "gemini-flash-latest";

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
      "minggu": number, (1-12)
      "fase": "fondasi"|"pengembangan"|"persiapan",
      "judul": string, (Singkat & padat)
      "tugas": [
        { "id": string, "text": string, "selesai": false } (Wajib 5-7 tugas per minggu, teks singkat & padat)
      ],
      "resource": { "judul": string, "url": string, "platform": string },
      "estimasiJam": number
    }
  ], (PENTING: Harus berisi tepat 12 elemen, satu untuk tiap minggu)
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
