import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export function getGeminiModel(systemInstruction?: string) {
  return genAI.getGenerativeModel({
    model: "gemini-3.5-flash-lite",
    systemInstruction,
  })
}