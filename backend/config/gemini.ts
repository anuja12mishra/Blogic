import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API! });

async function main(prompt: any): Promise<string> {
  const response: any = await ai.models.generateContent({
    model: "gemini-flash-latest" as any,
    contents: prompt,
  });
  return response.text;
}

export default main;
