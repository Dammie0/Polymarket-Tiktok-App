import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generates cinematic background visual descriptions
 * Uses Gemini for immersive degen aesthetics
 */
export async function generateMarketVisual(marketTitle: string, marketDescription: string) {
  const prompt = `Generate a high quality, cinematic, neon degen aesthetic image description for a prediction market titled: "${marketTitle}". 
  Context: ${marketDescription}. 
  The image should be immersive, atmospheric, and suitable for a vertical background. 
  Focus on futuristic, cyberpunk, or abstract financial data visualization elements.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16",
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Error generating visual:", error);
    return `https://picsum.photos/seed/${encodeURIComponent(marketTitle)}/1080/1920?blur=2`;
  }
}

