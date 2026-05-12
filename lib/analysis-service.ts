import { getAI, GEMINI_MODEL, buildAnalysisPrompt } from "@/lib/gemini";
import { AnalysisResult } from "@/types/analysis";

/**
 * Service to handle Career Analysis using Gemini AI on the client side.
 * This complies with the strict requirement of calling Gemini from the frontend.
 */
export async function performCareerAnalysis() {
  try {
    // 1. Prepare data (Profile & CV) from backend
    const dataRes = await fetch("/api/analyze/prepare");
    const dataResult = await dataRes.json();
    
    if (!dataResult.success) {
      if (dataResult.error === "PROFILE_MISSING") {
        throw { error: "PROFILE_MISSING", message: "Lengkapi profil karier terlebih dahulu" };
      }
      if (dataResult.error === "CV_MISSING") {
        throw { error: "CV_MISSING", message: "Upload CV terlebih dahulu" };
      }
      throw new Error(dataResult.error || "Gagal menyiapkan data analisis");
    }

    const { profile, cvUpload } = dataResult.data;

    // 2. Call Gemini AI
    const ai = getAI();
    const prompt = buildAnalysisPrompt(profile, cvUpload.extractedText || "");
    
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.3,
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("AI tidak memberikan respon (Empty Response)");

    // Clean and parse JSON
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    let analysisResult: AnalysisResult;
    
    try {
      analysisResult = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse Gemini response:", cleanJson);
      throw new Error("Format respon AI tidak valid. Silakan coba lagi.");
    }

    // 3. Save result back to database
    const saveRes = await fetch("/api/analyze/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        result: analysisResult,
        cvUploadId: cvUpload.id
      })
    });

    const saveResult = await saveRes.json();
    if (!saveResult.success) {
      throw new Error(saveResult.error || "Gagal menyimpan hasil analisis");
    }

    return { 
      success: true, 
      data: saveResult.data, // This is the saved database record
      analysisResult // This is the raw JSON result from Gemini
    };
  } catch (error: any) {
    console.error("Career Analysis Service Error:", error);
    throw error;
  }
}
