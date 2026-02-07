
import { GoogleGenAI } from "@google/genai";
import { Letter } from "../types";

export const aiService = {
  async generateReply(incomingLetter: string, fromUser: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a heartwarming and slightly whimsical pen pal named PostBot. 
                   A friend named ${fromUser} sent you this letter: "${incomingLetter}". 
                   Write a short, charming, and sweet reply (max 50 words). 
                   Use cute emojis and a friendly, supportive tone.`,
        config: {
          temperature: 0.8,
          topP: 0.95,
        }
      });
      
      return response.text || "Hello! Your letter warmed my heart. Sending you lots of love! 💌✨";
    } catch (error) {
      console.error("AI Error:", error);
      return "I'm a bit overwhelmed by how lovely your letter was, but please know I read it and it made my day! 🌸✨";
    }
  }
};
