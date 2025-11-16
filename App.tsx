import React, { useState, useCallback } from 'react';
import { AnalysisResult } from './types';
import { analyzeRetinaImage } from './services/geminiService';
import UploadScreen from './components/UploadScreen';
import ResultScreen from './components/ResultScreen';
import { SpinnerIcon } from './components/icons/SpinnerIcon';

const App: React.FC = () => {
  const [image, setImage] = useState<{ file: File, previewUrl: string } | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((selectedFile: File) => {
    if (selectedFile) {
      setImage({
        file: selectedFile,
        previewUrl: URL.createObjectURL(selectedFile),
      });
      setError(null);
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeRetinaImage(image.file);
      setResult(analysisResult);
    } catch (err: any) {
      setError(`An error occurred during analysis: ${err.message}`);
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [image]);

  const handleReset = useCallback(() => {
    if (image) {
      URL.revokeObjectURL(image.previewUrl);
    }
    setImage(null);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
  }, [image]);

  const renderContent = () => {
    if (isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <SpinnerIcon className="w-12 h-12 text-brand-accent"/>
                <p className="text-lg text-brand-text-light">Analyzing image, please wait...</p>
            </div>
        );
    }

    if (result && image) {
      return <ResultScreen result={result} imagePreviewUrl={image.previewUrl} onReset={handleReset} />;
    }

    return <UploadScreen onImageSelect={handleImageSelect} onAnalyze={handleAnalyze} image={image} />;
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-text-light font-sans flex flex-col">
      <header className="bg-brand-dark border-b border-brand-border/50 p-4 sticky top-0 z-10 w-full">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-lg font-medium text-brand-text-heading">AI Retinal Disease Screening</h1>
          <div className="flex items-center gap-4 text-sm">
            <span>Device</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.95-1.755l-4.135-4.135a2.25 2.25 0 0 1-3.182-3.182L4.8 16.05A8.949 8.949 0 0 0 12 21Zm0-18a8.949 8.949 0 0 1 4.135 1.282l-4.288 4.288a2.25 2.25 0 0 0-3.182 3.182L3.25 13.05A8.949 8.949 0 0 1 12 3Z" />
            </svg>
            <button onClick={handleReset} aria-label="Refresh application">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.18-3.185m-3.18-3.182-3.182-3.182a8.25 8.25 0 0 0-11.664 0l-3.18 3.185" />
                </svg>
            </button>

          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8 flex-grow">
          {renderContent()}
          {error && <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>}
      </main>
    </div>
  );
};

export default App;
