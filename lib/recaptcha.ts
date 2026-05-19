/**
 * Verifies a reCAPTCHA token using Google's siteverify API
 * @param token The token received from the client
 * @returns boolean indicating if the token is valid
 */
export async function verifyRecaptcha(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.warn("RECAPTCHA_SECRET_KEY is not defined. Skipping verification (dev mode?).");
      return true; // Allow in dev if key is missing, or change to false if strict
    }

    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
      method: "POST",
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}
