
import { GoogleGenAI } from "@google/genai";
import { GenerationSettings } from "../types";

export const generateImage = async (settings: GenerationSettings): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const config: any = {
      imageConfig: {
        aspectRatio: settings.aspectRatio,
      }
    };

    if (settings.model === 'gemini-3-pro-image-preview' && settings.imageSize) {
      config.imageConfig.imageSize = settings.imageSize;
    }

    const parts: any[] = [];
    
    // Construct instructions from prompt and negative prompt
    let finalPrompt = settings.prompt;
    if (settings.negativePrompt) {
      finalPrompt += `\n\nEXCLUSION CRITERIA (Do not include these elements): ${settings.negativePrompt}`;
    }
    
    parts.push({ text: finalPrompt });

    const response = await ai.models.generateContent({
      model: settings.model,
      contents: { parts },
      config
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("Generation produced no results.");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Image data missing from response.");
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_RESET_REQUIRED");
    }
    throw error;
  }
};

export const checkAndRequestApiKey = async (): Promise<boolean> => {
  // @ts-ignore
  if (typeof window.aistudio === 'undefined') return true;
  // @ts-ignore
  const hasKey = await window.aistudio.hasSelectedApiKey();
  if (!hasKey) {
    // @ts-ignore
    await window.aistudio.openSelectKey();
  }
  return true;
};
