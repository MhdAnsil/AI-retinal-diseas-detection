import React from 'react';
import { AnalysisResult } from '../types';
import ConfidenceGauge from './ConfidenceGauge';
import MarkdownRenderer from './MarkdownRenderer';
import { ReportIcon } from './icons/ReportIcon';
import { AlertIcon } from './icons/AlertIcon';
import { SeverityIcon } from './icons/SeverityIcon';
import { RefreshIcon } from './icons/RefreshIcon';

interface ResultScreenProps {
  result: AnalysisResult;
  imagePreviewUrl: string;
  onReset: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, imagePreviewUrl, onReset }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        {/* Left Column - Image */}
        <div className="lg:col-span-1 bg-brand-surface rounded-lg p-4 border border-brand-border">
            <img src={imagePreviewUrl} alt="Analyzed retina scan" className="rounded-md w-full object-contain" />
        </div>

        {/* Right Column - Report */}
        <div className="lg:col-span-2 flex flex-col gap-6">
             <div className="bg-brand-surface rounded-lg p-4 sm:p-6 border border-brand-border">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <ReportIcon className="w-7 h-7 text-brand-accent" />
                        <h2 className="text-xl sm:text-2xl font-bold text-brand-text-heading">Screening Report</h2>
                    </div>
                     <button onClick={onReset} className="text-brand-text-light hover:text-brand-text-heading transition-colors" aria-label="Start new analysis">
                        <RefreshIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
                    <div className="flex-grow space-y-4">
                        <div className="flex items-start gap-3">
                            <AlertIcon className="w-6 h-6 text-brand-orange mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-brand-text-light">Detected Condition</p>
                                <p className="text-lg sm:text-xl font-semibold text-brand-text-heading">{result.detectedCondition || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                             <SeverityIcon className="w-6 h-6 text-brand-yellow mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-brand-text-light">Severity Stage</p>
                                <p className="text-lg sm:text-xl font-semibold text-brand-text-heading">{result.severityStage || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0 mx-auto md:mx-0">
                         <ConfidenceGauge value={result.confidence || 0} />
                    </div>
                </div>
            </div>

            <div className="bg-brand-surface rounded-lg p-4 sm:p-6 border border-brand-border">
                <h3 className="text-lg sm:text-xl font-bold text-brand-text-heading mb-3">Analysis Explanation (XAI)</h3>
                <p className="text-brand-text-light mb-4">{result.analysisExplanation?.summary || 'No analysis summary available.'}</p>
                <p className="text-sm text-slate-400 italic">{result.analysisExplanation?.note || ''}</p>
            </div>

            <div className="bg-brand-surface rounded-lg p-4 sm:p-6 border border-brand-border">
                 <h3 className="text-lg sm:text-xl font-bold text-brand-text-heading mb-3">General Suggestions</h3>
                 <div className="space-y-4 text-brand-text-light">
                    {result.generalSuggestions && result.generalSuggestions.length > 0 ? (
                        result.generalSuggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <span className="mt-1 text-brand-accent">•</span>
                                <MarkdownRenderer content={suggestion} />
                            </div>
                        ))
                    ) : (
                        <p>No suggestions available.</p>
                    )}
                 </div>
            </div>
        </div>
    </div>
  );
};

export default ResultScreen;