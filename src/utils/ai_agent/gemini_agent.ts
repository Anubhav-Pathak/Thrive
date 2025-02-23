import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

export default class GeminiAgent {
  private static instance: GeminiAgent;
  private model: GenerativeModel;

  constructor(modelName: string | null) {
    try {
      dotenv.config();

      const geminiApiKey = process.env.GEMINI_API_KEY;

      if (!geminiApiKey) {
        throw new Error("Gemini API Key not set");
      }

      const genAI = new GoogleGenerativeAI(geminiApiKey);
      this.model = genAI.getGenerativeModel({ model: modelName || "gemini-1.5-flash" });
    } catch (error) {
      console.error('Error connecting to Gemini:', error);
      throw error;
    }
  }

  static getInstance(modelName: string | null = null): GeminiAgent {
    if (!GeminiAgent.instance) {
      GeminiAgent.instance = new GeminiAgent(modelName);
    }
    return GeminiAgent.instance;
  }

  async generateContent(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  parse(prompt: string): any {
    const jsonStart = prompt.indexOf('{');
    const jsonEnd = prompt.lastIndexOf('}') + 1;
    const jsonString = prompt.substring(jsonStart, jsonEnd);

    return JSON.parse(jsonString);
  }

  async validate(prompt: string): Promise<boolean> {
    // TODO: Implement validation
    return true;
  }
}