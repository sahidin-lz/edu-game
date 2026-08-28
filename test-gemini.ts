import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: "hello",
    });
    console.log(response.text);
  } catch (err: any) {
    console.error("ERROR:", err.message, err.status);
  }
}
run();
