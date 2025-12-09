import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysisResult } from "../types";

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    identifiedDistortions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of cognitive distortions identified in the thought (e.g., Catastrophizing, All-or-nothing thinking).",
    },
    suggestion: {
      type: Type.STRING,
      description: "A gentle, objective re-framing of the negative thought based on CBT principles.",
    },
    encouragement: {
      type: Type.STRING,
      description: "A short, empathetic message validating the user's feelings.",
    },
  },
  required: ["identifiedDistortions", "suggestion", "encouragement"],
};

const getApiKey = (): string => {
  const storedKey = localStorage.getItem('gemini_api_key');
  if (storedKey) return storedKey;
  return process.env.API_KEY || '';
};

export const analyzeThoughtWithGemini = async (
  situation: string,
  automaticThought: string
): Promise<AIAnalysisResult> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.warn("No API Key available");
      throw new Error("API Key missing");
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      You are an expert CBT (Cognitive Behavioral Therapy) assistant. 
      Analyze the following user entry.
      
      Situation: ${situation}
      Automatic Negative Thought: ${automaticThought}
      
      Identify any cognitive distortions present.
      Suggest a more balanced perspective (a "Balanced Thought").
      Provide a brief encouraging remark.
      
      Keep the tone empathetic, non-judgmental, and professional.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a supportive mental health aid using CBT techniques. Never diagnose.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    // Robust JSON extraction
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1) {
       throw new Error("Invalid JSON response format");
    }

    const jsonString = text.substring(startIndex, endIndex + 1);
    return JSON.parse(jsonString) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback in case of error to avoid crashing UI
    return {
      identifiedDistortions: ["Could not analyze at this time."],
      suggestion: "Try to look for evidence that contradicts your negative thought.",
      encouragement: "It takes courage to examine your thoughts. Keep going.",
    };
  }
};

export const generateJournalPrompt = async (mood: string): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return "What is on your mind today?";

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a single, short, reflective journal prompt for someone feeling ${mood}. 
      The prompt should be gentle and open-ended. Do not use quotes. Just the question.`,
    });
    return response.text || "What is on your mind today?";
  } catch (e) {
    return "What is one thing you are grateful for today?";
  }
};