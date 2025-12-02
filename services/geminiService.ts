import { GoogleGenAI } from "@google/genai";
import { GenerationSettings, ImageResolution } from "../types";
import { MODEL_NAME, STYLE_PRESETS } from "../constants";

export const generateImageContent = async (
  prompt: string,
  settings: GenerationSettings,
  attachment?: { data: string; mimeType: string }
): Promise<{ imageUrl: string | null; text: string | null }> => {
  try {
    // Need to initialize here to ensure we get the latest process.env.API_KEY
    // after the user has selected it via the UI.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const selectedStyle = STYLE_PRESETS.find(s => s.id === settings.style);
    
    // 8K Logic: The API supports up to 4K natively. 
    // We request 4K but add prompt modifiers to achieve the "8K look" (hyper-detail).
    const is8K = settings.resolution === ImageResolution.RES_8K;
    const apiResolution = is8K ? ImageResolution.RES_4K : settings.resolution;
    
    const detailBoost = is8K 
      ? ", 8k resolution, highly detailed, photorealistic texture, unreal engine 5 render, sharp focus, ray tracing" 
      : "";

    const styleModifier = selectedStyle ? `, ${selectedStyle.promptModifier}` : "";
    
    const modifiedPrompt = `${prompt}${styleModifier}${detailBoost}`;

    console.log("Generating with prompt:", modifiedPrompt);

    const parts: any[] = [];
    
    // Add attachment if present (Reference Image)
    if (attachment) {
        // Extract base64 data, removing the header if present (e.g., "data:image/png;base64,")
        const base64Data = attachment.data.includes('base64,') 
            ? attachment.data.split('base64,')[1] 
            : attachment.data;
            
        parts.push({
            inlineData: {
                data: base64Data,
                mimeType: attachment.mimeType
            }
        });
    }

    parts.push({ text: modifiedPrompt });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: settings.aspectRatio,
          imageSize: apiResolution, // Cast as specific string if needed by strict typing, but API expects these strings
        },
      },
    });

    let imageUrl: string | null = null;
    let text: string | null = null;

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          // IMPORTANT: Check the mimeType from the API response, usually image/jpeg or image/png
          const mimeType = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
        } else if (part.text) {
          text = part.text;
        }
      }
    }

    return { imageUrl, text };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
