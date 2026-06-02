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
    
    // Fallback list of models to try sequentially if a transient error occurs
    const fallbackModels = [
      requestedModel,
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-3.1-pro-preview",
      "gemini-flash-latest"
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
export const GEMINI_MODEL = "gemini-3.5-flash";

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
    "minggu": 1,
    "fase": "fondasi",
    "title": "Dasar-Dasar HTML & CSS",
    "tasks": ["Latihan taji kelas HTML", "Mempelajari box-model CSS", "Media query responsif"],
    "hours": "10 Jam",
    "resource": "MDN Web Docs",
    "resourceLink": "https://developer.mozilla.org"
  }
]
`;
}
export function buildAnalysisPrompt(profile: any, cvText: string): string {
  return `
Kamu adalah career counselor AI expert. Analisis SINKRONISASI antara profil yang diisi user DAN isi CV mereka.

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
2. Jika ada INKONSISTENSI (misal: profil bilang programmer tapi CV berisi pekerjaan admin), TETAP analisis berdasarkan KOMBINASI keduanya
3. Berikan career path yang realistis berdasarkan KEDUANYA
4. Dalam rekomendasiUtama, sebutkan jika ada gap antara profil dan CV
5. cvScore harus mencerminkan kualitas CV yang sebenarnya
6. PENTING: roadmap90Hari HARUS berisi tepat 12 elemen array (untuk Minggu 1 hingga Minggu 12 secara berurutan).
7. Di setiap minggu dalam roadmap90Hari, tugas-tugas (array 'tugas') HARUS berisi antara 5-7 item tugas yang spesifik dan konkret.

Kembalikan HANYA JSON valid dengan struktur persis seperti schema berikut (tanpa ada komentar di dalam JSON):
{
  "overallReadiness": 85,
  "syncScore": 80,
  "syncIssues": ["Inkonsistensi antara skill pemrograman di profil dengan pengalaman admin di CV"],
  "cvScore": {
    "total": 75,
    "atsCompatibility": 80,
    "completeness": 70,
    "actionVerbs": 60,
    "keywords": { "matched": ["Microsoft Office", "Administrasi"], "missing": ["SQL", "React"] },
    "sections": [
      { "title": "Data Pribadi", "detected": true },
      { "title": "Ringkasan Profil", "detected": true },
      { "title": "Pengalaman Kerja", "detected": true },
      { "title": "Pendidikan", "detected": true },
      { "title": "Skill Teknis", "detected": true },
      { "title": "Proyek & Sertifikat", "detected": false }
    ]
  },
  "careerPaths": [
    {
      "id": "path_1",
      "nama": "Frontend Developer",
      "matchScore": 75,
      "deskripsi": "Mengembangkan antarmuka aplikasi web menggunakan teknologi modern.",
      "estimasiGajiMin": 5000000,
      "estimasiGajiMax": 8000000,
      "waktuSiapBulan": 6,
      "requiredSkills": [
        { "skill": "React.js", "userHas": false, "priority": "high" }
      ],
      "sertifikasiRekomendasi": ["Google IT Support", "Dicoding Frontend Developer"],
      "jobDemand": "tinggi",
      "trendArah": "naik",
      "roadmapSummary": "Fokus pada penguasaan fundamental HTML/CSS, JavaScript modern, dan Framework React."
    }
  ],
  "roadmap90Hari": [
    {
      "minggu": 1,
      "fase": "fondasi",
      "judul": "Pengenalan Ekosistem Web",
      "tugas": [
        { "id": "tugas_1", "text": "Mempelajari dasar HTML5 dan struktur dokumen web", "selesai": false },
        { "id": "tugas_2", "text": "Mempelajari CSS3 selectors dan box model", "selesai": false },
        { "id": "tugas_3", "text": "Membangun layout halaman web statis responsif", "selesai": false },
        { "id": "tugas_4", "text": "Melakukan hosting halaman web di GitHub Pages", "selesai": false },
        { "id": "tugas_5", "text": "Membuat ringkasan dokumentasi HTML/CSS", "selesai": false }
      ],
      "resource": { "judul": "MDN Web Docs - HTML & CSS", "url": "https://developer.mozilla.org", "platform": "MDN" },
      "estimasiJam": 10
    }
  ],
  "skillRadar": {
    "teknisDigital": 65,
    "komunikasi": 80,
    "kreativitas": 75,
    "analitis": 60,
    "kepemimpinan": 70,
    "adaptabilitas": 85
  },
  "rekomendasiUtama": [
    "Tambahkan proyek portofolio React yang nyata ke dalam CV.",
    "Selaraskan deskripsi profil di LinkedIn dengan target karir baru."
  ],
  "pesan": "CV kamu sudah cukup baik, namun perlu penyelarasan di bagian keterampilan teknis serta penulisan proyek yang relevan."
}
`;
}
