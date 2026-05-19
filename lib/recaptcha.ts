/**
 * Verifies a reCAPTCHA token using Google's siteverify API
 * @param token The token received from the client
 * @returns boolean indicating if the token is valid
 */
export async function verifyRecaptcha(token: string | null | undefined): Promise<boolean> {
  if (!token) {
    console.error("reCAPTCHA Error: No token provided");
    return false;
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.warn("RECAPTCHA_SECRET_KEY is not defined. Skipping verification (dev mode?).");
      // ONLY for development/initial setup where keys might be missing
      return true; 
    }

    // Google API expects application/x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", token);

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();
    
    if (!data.success) {
      console.error("reCAPTCHA Verification Failed:", data["error-codes"]);
    }

    return data.success === true;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}
