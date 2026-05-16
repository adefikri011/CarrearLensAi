/**
 * Service to handle Career Analysis calling server-side API.
 * This is now more secure as it doesn't expose API keys or AI logic to the client.
 */
export async function performCareerAnalysis() {
  try {
    const response = await fetch("/api/ai/analyze", {
      method: "POST"
    });
    
    const result = await response.json();
    if (!result.success) {
      if (result.error === "PROFILE_MISSING") {
        throw { error: "PROFILE_MISSING", message: "Lengkapi profil karier terlebih dahulu" };
      }
      if (result.error === "CV_MISSING") {
        throw { error: "CV_MISSING", message: "Upload CV terlebih dahulu" };
      }
      throw new Error(result.error || "Gagal melakukan analisis karier");
    }

    return result;
  } catch (error: any) {
    console.error("Career Analysis Service Error:", error);
    throw error;
  }
}

/**
 * Generates a detailed 12-week roadmap for a specific path via server-side API.
 */
export async function generateRoadmapForPath(pathName: string) {
  try {
    const response = await fetch("/api/ai/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathName })
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Gagal membangun roadmap");
    }

    return result;
  } catch (error) {
    console.error("Roadmap Generation Error:", error);
    throw error;
  }
}
