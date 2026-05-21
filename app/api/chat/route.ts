import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getAI, GEMINI_MODEL } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler to fetch last 50 chat messages for the logged-in user.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const messages = await prisma.chatMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

/**
 * POST handler to send user question to Gemini and store in Postgres database.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { message } = await req.json();
    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // 1. Save user message to database
    await prisma.chatMessage.create({
      data: {
        userId,
        role: "user",
        text: message.trim(),
      },
    });

    // 2. Fetch last 10 messages for conversation context
    const previousMessages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Reverse to chronological order for Gemini context
    previousMessages.reverse();

    // Prepare system instructions
    const systemInstruction = 
      "Kamu adalah Co-Pilot CareerLens AI, asisten dan konsultan karir pintar, suportif, dan ramah untuk pelajar, mahasiswa, dan fresh graduate Indonesia. " +
      "Tugasmu adalah memberikan konsultasi karir, panduan CV, tips interview, strategi portfolio, dan navigasi industri modern yang taktis dan realistis. " +
      "Berikan tanggapan yang menyemangati, solutif, dan mudah dipahami oleh anak muda Indonesia.";

    // Convert to Gemini parts structure
    const contents = previousMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    // If no history yet, ensure we have the current message
    if (contents.length === 0) {
      contents.push({
        role: "user",
        parts: [{ text: message.trim() }],
      });
    }

    // 3. Generate content from Gemini API using the stable library client
    const ai = getAI();
    const model = ai.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent({
      contents: contents,
      generationConfig: {
        temperature: 0.7,
      }
    });

    const replyText = result.response.text() || "Maaf, saya sedang mengalami kendala teknis. Bisakah kamu ulangi pertanyaanmu?";

    // 4. Save model response to database
    const botMessage = await prisma.chatMessage.create({
      data: {
        userId,
        role: "assistant",
        text: replyText,
      },
    });

    return NextResponse.json({ success: true, data: botMessage });
  } catch (error: any) {
    console.error("Error generating or saving chat response:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler to clear chat history for the logged-in user.
 */
export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.chatMessage.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ success: true, data: { message: "Chat history cleared" } });
  } catch (error: any) {
    console.error("Error clearing chat messages:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to clear chat history" },
      { status: 500 }
    );
  }
}
