import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini SDK
// IMPORTANT: In production, ensure GEMINI_API_KEY is set in the environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key_for_now');

// Standard model for general text tasks
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Helper to generate JSON from a prompt using Gemini
 */
export async function generateJSON(prompt) {
  try {
    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini generation error:', error);
    throw new Error('AI generation failed');
  }
}

export default genAI;
