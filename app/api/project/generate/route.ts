import { getAI, GEMINI_MODEL } from "@/lib/gemini";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { rawDescription, tools, title } = await req.json();

    if (!rawDescription) {
      return NextResponse.json({ success: false, error: "Deskripsi mentah diperlukan" }, { status: 400 });
    }

    const ai = getAI();
    const model = ai.getGenerativeModel({ 
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    });

    const SYSTEM_PROMPT = `
      Anda adalah seorang Senior Career Coach dan Portfolio Expert. 
      Tugas Anda adalah mengubah deskripsi proyek praktik "kasar" dari siswa SMK menjadi narasi profesional yang industrial-ready menggunakan metode STAR (Situation, Task, Action, Result).

      Input:
      - Judul Proyek: ${title || "Proyek Praktik"}
      - Deskripsi Kasar: ${rawDescription}
      - Tools/Alat: ${tools?.join(", ") || "Tidak disebutkan"}

      Output HARUS berupa JSON dengan struktur:
      {
        "refinedTitle": "Judul proyek yang lebih profesional dan deskriptif",
        "refinedDescription": "Deskripsi dalam format STAR (minimal 3 paragraf), menonjolkan problem solving dan hasil",
        "tags": ["Daftar 5 kompetensi/tags yang relevan (misal: Network Security, PLC Programming)"],
        "metrics": "Contoh metrik keberhasilan atau dampak teknis (misal: Efisiensi waktu 30%)",
        "summary": "Ringkasan 2 kalimat untuk rekruter"
      }

      Gunakan Bahasa Indonesia yang profesional namun tetap modern.
    `;

    const result = await model.generateContent(SYSTEM_PROMPT);
    const text = result.response.text();
    const data = JSON.parse(text);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("AI Project Generation Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
