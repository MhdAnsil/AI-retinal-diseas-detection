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

// FIX: The API key must be obtained from `process.env.API_KEY` as per the guidelines.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const prompt = `You are an AI assistant specialized in analyzing retinal images.
First, determine if the provided image is a retinal scan.
Second, assess the quality of the image for analysis (either 'Good' or 'Poor').

If the image is NOT a retinal scan OR the quality is 'Poor', do not proceed with disease analysis.

If and only if the image is a 'Good' quality retinal scan, then analyze it for signs of Diabetic Retinopathy, Glaucoma, and Age-Related Macular Degeneration (AMD). 
Provide the most likely detected condition, its severity stage, and your confidence score (0-100 as a number).
Provide a concise analysis explanation including a summary and a note.
Finally, provide an array of general suggestions for the user.

It is crucial that your response emphasizes this is an initial screening, not a definitive diagnosis.
The note in the analysis explanation must always be: "Note: The highlighted areas on the image indicate regions of interest identified by the AI model."
One of the general suggestions must be to "Schedule a comprehensive eye examination with an ophthalmologist."

Return the entire response in the specified JSON format.`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    isRetinalImage: { type: Type.BOOLEAN, description: "True if the image is a retinal scan, otherwise false." },
    imageQuality: { type: Type.STRING, description: "The quality of the image ('Good', 'Poor', or 'N/A')." },
    detectedCondition: { type: Type.STRING, description: "The most likely detected condition. (Optional)" },
    severityStage: { type: Type.STRING, description: "The severity of the condition, e.g., 'Mild', 'Moderate'. (Optional)" },
    confidence: { type: Type.NUMBER, description: "The confidence score of the detection, 0 to 100. (Optional)" },
    analysisExplanation: {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING, description: "A summary of the analysis findings. (Optional)" },
            note: { type: Type.STRING, description: "A disclaimer note for the user. (Optional)" },
        },
    },
    generalSuggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "An array of suggestions for the user. (Optional)"
    }
  },
  required: ['isRetinalImage', 'imageQuality']
};

export async function analyzeRetinaImage(imageFile: File): Promise<AnalysisResult> {
  try {
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
        temperature: 0.1, // Lower temperature for more deterministic results
      }
    });
    
    // FIX: Per guidelines, access `response.text` directly without optional chaining.
    const jsonStr = response.text.trim();
    if (!jsonStr) {
      throw new Error("The AI model returned an empty response. Please try again.");
    }
    
    const result: AnalysisResult = JSON.parse(jsonStr);
    return result;

  } catch (error: any) {
    console.error("Error in Gemini Service:", error);
    // Re-throw a more user-friendly error message
    if (error.message.includes("JSON")) {
        throw new Error("The AI model returned an invalid response format. Please try again later.");
    }
    throw new Error(error.message || "An unknown error occurred while communicating with the AI model.");
  }
}