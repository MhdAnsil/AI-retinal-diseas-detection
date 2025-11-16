
import { GoogleGenAI } from "@google/genai";
import { DriveFile } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock key.");
  process.env.API_KEY = "MOCK_API_KEY";
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function queryWithFiles(files: DriveFile[], userQuery: string): Promise<string> {
  const fileContext = files.map(file => `
---
File Name: ${file.name}
Content:
${file.content}
---
  `).join('\n');

  const prompt = `
You are an expert at analyzing documents. Answer the following question based ONLY on the content of the provided files.
If the answer cannot be found in the files, state that clearly. Do not use any external knowledge.

QUESTION:
"${userQuery}"

FILES:
${fileContext}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get a response from the Gemini API.");
  }
}