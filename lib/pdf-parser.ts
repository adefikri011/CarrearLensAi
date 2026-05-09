import pdf from 'pdf-parse';

/**
 * Extracts text content from a PDF buffer.
 * Used for CV analysis.
 * 
 * @param buffer - The PDF file buffer
 * @returns extracted text
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}
