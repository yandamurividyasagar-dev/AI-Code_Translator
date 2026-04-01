import { generateContent } from "../config/gemini.config.js";
export const askGemini = async (prompt) => {
  try {
    const response = await generateContent(prompt);

    if (!response) {
      throw new Error("Gemini returned empty response");
    }

    return response;

  } catch (error) {
    console.error("REAL GEMINI ERROR:", error);

   
    throw new Error(error.message || "Gemini failed");
  }
};