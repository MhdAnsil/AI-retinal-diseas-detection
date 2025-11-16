import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

// Helper to convert a File to a base64 string
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

// FIX: Replaced mock function with a real Gemini API call for image analysis.
// This provides a real-world implementation instead of a hardcoded response.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const prompt = `Analyze this retinal image for signs of Diabetic Retinopathy, Glaucoma, and Age-Related Macular Degeneration (AMD). 
Provide the detected condition, severity stage, confidence score (0-100 as a number), an analysis explanation including a summary and a note, and an array of general suggestions for the user. 
It is crucial to understand this is an initial screening finding, not a definitive diagnosis. The analysis explanation should reflect this.
The note in the analysis explanation should be: "Note: The highlighted areas on the image indicate regions of interest identified by the AI model."
One of the general suggestions must be to schedule a comprehensive eye examination with an ophthalmologist.
Return the response in JSON format.`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    detectedCondition: { type: Type.STRING, description: "The most likely detected condition." },
    severityStage: { type: Type.STRING, description: "The severity of the condition (e.g., Mild, Moderate, Severe)." },
    confidence: { type: Type.NUMBER, description: "The confidence score of the detection, from 0 to 100." },
    analysisExplanation: {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING, description: "A summary of the analysis findings." },
            note: { type: Type.STRING, description: "A disclaimer note for the user." },
        },
        required: ['summary', 'note']
    },
    generalSuggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "An array of suggestions for the user."
    }
  },
  required: ['detectedCondition', 'severityStage', 'confidence', 'analysisExplanation', 'generalSuggestions']
};

export async function analyzeRetinaImage(imageFile: File): Promise<AnalysisResult> {
  const imagePart = await fileToGenerativePart(imageFile);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        { text: prompt },
        imagePart,
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    }
  });
  
  const jsonStr = response.text.trim();
  // In a real application, you'd want to add more robust error handling for JSON.parse
  const result: AnalysisResult = JSON.parse(jsonStr);
  return result;
}
