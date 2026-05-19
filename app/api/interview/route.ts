import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

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
  "feedback": "Kritik dan saran terhadap jawaban terakhir user (jika ada jawaban sebelumnya). Jika ini pertanyaan pertama, biarkan kosong.",
  "score": "Skor 0-100 untuk jawaban terakhir (null jika ini pertanyaan pembuka)",
  "question": "Pertanyaan wawancara berikutnya",
  "isFinished": "Boolean, apakah wawancara sudah selesai (biasanya setelah 5-7 pertanyaan)"
}

Konteks Wawancara:
- Fokus pada kompetensi teknis (sesuai jurusan/path yang terdeteksi), etos kerja, dan kemampuan komunikasi.
- Jika user menjawab tidak nyambung, berikan teguran halus di bagian feedback.
- Mulai dengan perkenalan singkat lalu langsung ke pertanyaan pertama jika belum ada percakapan.
`;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
    }

    // 1. Ambil data analisis terbaru untuk menentukan Role & ngecek Roadmap
    const analysis = await db.analysis.getLatest(session.user.id);
    if (!analysis) {
      return NextResponse.json({ success: false, error: "Silakan lakukan analisis CV terlebih dahulu." }, { status: 400 });
    }

    // 2. Cek apakah Roadmap sudah selesai
    const progress = await db.roadmap.getProgress(session.user.id);
    const roadmapData = (analysis.result as any)?.roadmap90Hari || [];
    const totalTasks = roadmapData.flatMap((w: any) => w.tugas || []).length;
    const completedTasksCount = progress.filter(p => p.completed).length;

    // Untuk keperluan demo/testing, kita beri toleransi atau jika task masih 0 (belum digenerate dengan benar)
    const isRoadmapCompleted = totalTasks > 0 && completedTasksCount >= totalTasks;

    // User meminta fitur ini terbuka SETELAH menyelesaikan roadmap
    if (!isRoadmapCompleted) {
       // Kita kembalikan error spesifik agar FE bisa handle state locked
       return NextResponse.json({ 
         success: false, 
         error: "Fitur Terkunci", 
         message: "Anda harus menyelesaikan seluruh misi di Roadmap 90 Hari sebelum bisa mengikuti simulasi wawancara.",
         stats: { completedTasksCount, totalTasks }
       }, { status: 403 });
    }

    const { history, currentAnswer } = await req.json();
    const role = analysis.selectedPath || "Lulusan SMK Profesional";

    const modelName = "gemini-1.5-flash";
    const response = await genAI.models.generateContent({
      model: modelName,
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT + `\nPosisi pekerjaan yang dilamar (berdasarkan profil user): ${role}` }] },
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
      role
    });
  } catch (error) {
    console.error("Interview API Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses wawancara" },
      { status: 500 }
    );
  }
}
