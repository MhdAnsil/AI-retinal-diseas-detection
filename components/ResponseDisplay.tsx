
import React, { useState, useEffect } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ResponseDisplayProps {
  response: string;
  isGenerating: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 bg-gemini-grey-200 rounded w-3/4"></div>
    <div className="h-4 bg-gemini-grey-200 rounded w-full"></div>
    <div className="h-4 bg-gemini-grey-200 rounded w-5/6"></div>
  </div>
);

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, isGenerating, error }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
    }
  };

  const renderContent = () => {
    if (isGenerating) {
      return (
        <div className="flex items-center gap-4 text-gemini-grey-600">
           <SpinnerIcon className="h-6 w-6"/>
           <p className="font-medium">Gemini is thinking...</p>
        </div>
      );
    }
    if (error) {
      return <div className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>;
    }
    if (response) {
      return (
        <div className="relative group">
          <button 
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 bg-gemini-grey-100 hover:bg-gemini-grey-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Copy response"
          >
            {copied ? <CheckIcon className="w-5 h-5 text-green-600" /> : <CopyIcon className="w-5 h-5 text-gemini-grey-600" />}
          </button>
          <div className="prose prose-sm max-w-none text-gemini-grey-800 whitespace-pre-wrap">
            {response}
          </div>
        </div>
      );
    }
    return (
      <div className="text-center text-gemini-grey-500 py-10">
        <p>Your answer will appear here.</p>
      </div>
    );
  };

  return (
    <div className="mt-4 border-t border-gemini-grey-200 pt-4 flex-grow">
      <h3 className="text-lg font-semibold mb-3 text-gemini-grey-700">Response</h3>
      <div className="bg-gemini-grey-100 p-4 rounded-lg min-h-[150px]">
        {renderContent()}
      </div>
    </div>
  );
};