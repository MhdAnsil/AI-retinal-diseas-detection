import React, { useState, useCallback } from 'react';
import { AnalysisResult } from './types';
import { analyzeRetinaImage } from './services/geminiService';
import UploadScreen from './components/UploadScreen';
import ResultScreen from './components/ResultScreen';
import { SpinnerIcon } from './components/icons/SpinnerIcon';
import { RefreshIcon } from './components/icons/RefreshIcon';

const App: React.FC = () => {
  const [image, setImage] = useState<{ file: File, previewUrl: string } | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((selectedFile: File) => {
    if (selectedFile) {
      // Revoke old URL if a new image is selected before analyzing
      if (image) {
        URL.revokeObjectURL(image.previewUrl);
      }
      setImage({
        file: selectedFile,
        previewUrl: URL.createObjectURL(selectedFile),
      });
      setError(null);
      setResult(null);
    }
  }, [image]);

  const handleAnalyze = useCallback(async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeRetinaImage(image.file);
      
      if (!analysisResult.isRetinalImage) {
        setError("The uploaded image does not appear to be a retinal scan. Please upload a valid image.");
      } else if (analysisResult.imageQuality === 'Poor') {
         setError("The image quality is too low for an accurate analysis. Please upload a clearer image.");
      } else {
        setResult(analysisResult);
      }

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
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <SpinnerIcon className="w-12 h-12 text-brand-accent"/>
                <p className="text-lg text-brand-text-light">Analyzing image, please wait...</p>
                <p className="text-sm text-brand-text-light/70">This may take a moment.</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
            <button onClick={handleReset} aria-label="Refresh application" className="text-brand-text-light hover:text-brand-text-heading transition-colors">
                <RefreshIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col">
          <div className="flex-grow flex flex-col justify-center">
            {renderContent()}
          </div>
          {error && (
            <div className="mt-6 max-w-2xl mx-auto w-full text-center text-red-300 bg-red-900/50 p-4 rounded-lg border border-red-500/50">
              <p className="font-semibold">Analysis Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
      </main>
    </div>
  );
};

export default App;