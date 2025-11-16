export interface AnalysisResult {
  detectedCondition: string;
  severityStage: string;
  confidence: number;
  analysisExplanation: {
    summary: string;
    note: string;
  };
  generalSuggestions: string[];
}

// FIX: Add DriveFile interface to resolve compilation errors in FileList.tsx and FileItem.tsx.
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
}
