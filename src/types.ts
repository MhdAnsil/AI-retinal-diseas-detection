export interface AnalysisResult {
  isRetinalImage: boolean;
  imageQuality: 'Good' | 'Poor' | 'N/A';
  detectedCondition?: string;
  severityStage?: string;
  confidence?: number;
  analysisExplanation?: {
    summary: string;
    note: string;
  };
  generalSuggestions?: string[];
}
