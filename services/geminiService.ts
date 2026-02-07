
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize the client. 
// NOTE: In a real environment, ensure process.env.API_KEY is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Models
const TEXT_MODEL = 'gemini-3-flash-preview';
const REASONING_MODEL = 'gemini-3-pro-preview'; // For complex analysis
const IMAGE_MODEL = 'gemini-2.5-flash-image';

/**
 * Generates text content based on a prompt and system instruction.
 */
export const generateTextContent = async (
  prompt: string, 
  systemInstruction?: string,
  useReasoningModel: boolean = false
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: useReasoningModel ? REASONING_MODEL : TEXT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error generating content: ${(error as Error).message}`;
  }
};

/**
 * Analyzes sentiment and returns structured JSON for visualization.
 */
export const analyzeSentiment = async (textData: string): Promise<any> => {
  try {
    const prompt = `Analyze the sentiment of the following customer feedback data. 
    1. Classify sentiment counts (Positive, Neutral, Negative).
    2. Identify recurring emotional patterns (e.g., frustration, delight, trust).
    3. Extract specific customer pain points.
    4. Suggest actionable improvements based on the feedback.
    5. Extract key phrases associated with positive and negative sentiment.
    6. Infer the sentiment trend (Improving, Declining, Stable) if detectable, or default to Stable.
    7. Compare the sentiment against typical industry standards for this context (e.g., "Above Average", "Average", "Below Average") and provide a brief context.

    Return a JSON object.
    Text to analyze: "${textData}"`;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  count: { type: Type.NUMBER },
                  summary: { type: Type.STRING }
                }
              }
            },
            overallTone: { type: Type.STRING },
            emotionalPatterns: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            painPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            keyPhrases: {
              type: Type.OBJECT,
              properties: {
                positive: { type: Type.ARRAY, items: { type: Type.STRING } },
                negative: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            sentimentTrend: { type: Type.STRING },
            industryComparison: {
              type: Type.OBJECT,
              properties: {
                rating: { type: Type.STRING },
                context: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Sentiment Analysis Error:", error);
    throw error;
  }
};

/**
 * Generates color palettes based on a brand description.
 */
export const generateColorPalettes = async (input: string): Promise<any> => {
  try {
    const prompt = `Generate 3 distinct, professional color palettes for a brand described as: "${input}".
    Include a rationale for why these colors fit the brand personality.
    Return structured JSON with palettes containing name, rationale, and colors (hex and name).`;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            palettes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  colors: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        hex: { type: Type.STRING },
                        name: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Palette Generation Error:", error);
    throw error;
  }
};

/**
 * Generates an image (base64) for logo concepts or visual identity.
 * Throws specific errors for better UI handling.
 */
export const generateBrandImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: prompt,
      config: {
        // No responseMimeType for image models usually, but we check parts
      }
    });
    
    const candidate = response.candidates?.[0];

    // 1. Check if candidate exists
    if (!candidate) {
       throw new Error("Request blocked: No candidates returned by the model.");
    }

    // 2. Extract image from parts
    for (const part of candidate.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    // 3. Check specific finish reasons if no image part was found
    if (candidate.finishReason) {
        // This gives components/VisualIdentity.tsx specific keywords to look for (SAFETY, RECITATION, etc)
        throw new Error(`Image generation failed. Finish Reason: ${candidate.finishReason}`);
    }
    
    // Fallback error
    throw new Error("The AI model was unable to generate an image for this prompt. No image data received.");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error; // Re-throw to let the component handle the specific error message
  }
};

/**
 * Chat Stream handler
 */
export const createChatSession = (systemInstruction: string) => {
  return ai.chats.create({
    model: TEXT_MODEL,
    config: {
      systemInstruction
    }
  });
};