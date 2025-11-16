
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface QueryFormProps {
  query: string;
  setQuery: (query: string) => void;
  onSubmit: () => void;
  isGenerating: boolean;
  hasSelectedFiles: boolean;
}

export const QueryForm: React.FC<QueryFormProps> = ({ query, setQuery, onSubmit, isGenerating, hasSelectedFiles }) => {
  const isDisabled = isGenerating || !hasSelectedFiles || !query.trim();
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isDisabled) {
        onSubmit();
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={hasSelectedFiles ? "Ask about the selected files..." : "Please select a file first."}
        rows={4}
        className="w-full p-3 border border-gemini-grey-300 rounded-lg focus:ring-2 focus:ring-gemini-blue focus:border-transparent transition-shadow disabled:bg-gemini-grey-100"
        disabled={!hasSelectedFiles || isGenerating}
      />
      <button
        onClick={onSubmit}
        disabled={isDisabled}
        className="bg-gemini-blue hover:bg-gemini-dark-blue disabled:bg-gemini-grey-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
      >
        <SparklesIcon className="h-5 w-5" />
        <span>Generate</span>
      </button>
    </div>
  );
};