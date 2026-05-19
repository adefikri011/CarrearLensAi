import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

/**
 * System prompt for HR Interviewer persona
 */
const SYSTEM_PROMPT = `
Anda adalah seorang Manajer HR profesional di Indonesia yang ahli dalam merekrut lulusan SMK dan Fresh Graduate.
Tugas Anda adalah melakukan simulasi wawancara kerja yang realistis, suportif, namun tetap tegas.

Gunakan Bahasa Indonesia yang profesional (formal tapi ramah).

Setiap respon Anda harus selalu dalam format JSON dengan struktur:
{
  "feedback": "Kritik dan saran terhadap jawaban terakhir user (jika ada jawaban sebelumnya)",
  "score": "Skor 0-100 untuk jawaban terakhir (null jika ini pertanyaan pembuka)",
  "question": "Pertanyaan wawancara berikutnya",
  "isFinished": "Boolean, apakah wawancara sudah selesai (biasanya setelah 5-7 pertanyaan)"
}

Konteks Wawancara:
- Fokus pada kompetensi teknis (sesuai jurusan), etos kerja, dan kemampuan komunikasi.
- Jika user menjawab tidak nyambung, berikan teguran halus di bagian feedback.
- Mulai dengan perkenalan singkat lalu langsung ke pertanyaan pertama jika belum ada percakapan.
`;

export async function POST(req: NextRequest) {
  try {
    const { role, history, currentAnswer } = await req.json();

    if (!role) {
      return NextResponse.json({ success: false, error: "Role is required" }, { status: 400 });
    }

    const modelName = "gemini-1.5-flash";
    const response = await genAI.models.generateContent({
      model: modelName,
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT + `\nPosisi pekerjaan yang dilamar: ${role}` }] },
        ...history.map((h: any) => ({
          role: h.role === "assistant" ? "model" : "user",
          parts: h.parts
        })),
        { role: "user", parts: [{ text: currentAnswer || "Mulai wawancara dengan menyapa dan memberikan pertanyaan pertama yang umum namun berbobot." }] }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;
    const responseData = JSON.parse(responseText || "{}");

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Interview API Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses wawancara" },
      { status: 500 }
    );
  }
}
