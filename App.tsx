
import React, { useState, useCallback, useMemo } from 'react';
import { DriveFile } from './types';
import { queryWithFiles } from './services/geminiService';
import { DriveConnect } from './components/DriveConnect';
import { FileList } from './components/FileList';
import { QueryForm } from './components/QueryForm';
import { ResponseDisplay } from './components/ResponseDisplay';
import { Logo } from './components/icons/Logo';

// This is a mock implementation based on the app's context.
// In a real environment, this would be provided.
if (typeof window.aistudio === 'undefined') {
  // Fix: Add missing properties to the mock aistudio object to conform to the AIStudio interface.
  window.aistudio = {
    getDriveFiles: () => new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', name: 'Project Proposal.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', modifiedTime: '2024-08-15T10:30:00Z', content: 'Project Gemini aims to build a new AI-powered search engine. It will leverage large language models to provide contextual answers. The budget is $5 million.' },
          { id: '2', name: 'Q3 Financials.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', modifiedTime: '2024-08-14T14:00:00Z', content: 'Q3 Revenue: $2.5M, Profit: $800k. Key drivers were new product launches in the enterprise sector.' },
          { id: '3', name: 'Marketing Strategy.pdf', mimeType: 'application/pdf', modifiedTime: '2024-08-12T09:45:00Z', content: 'Our Q4 marketing strategy will focus on digital channels, specifically social media campaigns and influencer partnerships. We will target the 18-35 demographic.' },
          { id: '4', name: 'Meeting Notes - Aug 10.txt', mimeType: 'text/plain', modifiedTime: '2024-08-10T16:20:00Z', content: 'Discussion points: Finalize project proposal by EOW. Marketing to provide new creatives for the upcoming campaign. Financials look strong for Q3.' },
        ]);
      }, 1500);
    }),
    getHostUrl: () => '',
    hasSelectedApiKey: () => Promise.resolve(true),
    openSelectKey: () => Promise.resolve(undefined),
    getModelQuota: () => Promise.resolve({}),
  };
}

const App: React.FC = () => {
  const [isDriveConnected, setIsDriveConnected] = useState<boolean>(false);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState<string>('');
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleConnectDrive = useCallback(async () => {
    setIsLoadingFiles(true);
    setError(null);
    try {
      const files = await window.aistudio.getDriveFiles();
      setDriveFiles(files);
      setIsDriveConnected(true);
    } catch (err) {
      setError('Failed to connect to Google Drive. Please try again.');
      console.error(err);
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  const handleFileSelect = useCallback((fileId: string) => {
    setSelectedFiles(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(fileId)) {
        newSelection.delete(fileId);
      } else {
        newSelection.add(fileId);
      }
      return newSelection;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedFiles(new Set(driveFiles.map(f => f.id)));
  }, [driveFiles]);

  const handleDeselectAll = useCallback(() => {
    setSelectedFiles(new Set());
  }, []);
  
  const filesToQuery = useMemo(() => {
    return driveFiles.filter(file => selectedFiles.has(file.id));
  }, [driveFiles, selectedFiles]);


  const handleGenerate = useCallback(async () => {
    if (selectedFiles.size === 0 || !query.trim()) return;

    setIsGenerating(true);
    setApiResponse('');
    setError(null);

    try {
      const response = await queryWithFiles(filesToQuery, query);
      setApiResponse(response);
    } catch (err: any) {
      setError(`An error occurred: ${err.message}`);
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [filesToQuery, query, selectedFiles.size]);
  
  return (
    <div className="min-h-screen bg-gemini-grey-100 text-gemini-grey-900 font-sans">
      <header className="bg-white border-b border-gemini-grey-300 p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-4">
          <Logo className="h-8 w-auto" />
          <h1 className="text-xl font-medium text-gemini-grey-800">Drive Query</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {!isDriveConnected ? (
          <DriveConnect onConnect={handleConnectDrive} isLoading={isLoadingFiles} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-gemini-grey-800">Select Files</h2>
              <div className="bg-white rounded-lg border border-gemini-grey-300 shadow-sm overflow-hidden flex-grow">
                 <FileList
                  files={driveFiles}
                  selectedFiles={selectedFiles}
                  onFileSelect={handleFileSelect}
                  onSelectAll={handleSelectAll}
                  onDeselectAll={handleDeselectAll}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
               <h2 className="text-2xl font-semibold text-gemini-grey-800">Ask a Question</h2>
              <div className="bg-white p-6 rounded-lg border border-gemini-grey-300 shadow-sm flex-grow flex flex-col gap-4">
                <QueryForm
                  query={query}
                  setQuery={setQuery}
                  onSubmit={handleGenerate}
                  isGenerating={isGenerating}
                  hasSelectedFiles={selectedFiles.size > 0}
                />
                <ResponseDisplay 
                  response={apiResponse}
                  isGenerating={isGenerating}
                  error={error}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
