
import React from 'react';
import { GoogleDriveIcon } from './icons/GoogleDriveIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface DriveConnectProps {
  onConnect: () => void;
  isLoading: boolean;
}

export const DriveConnect: React.FC<DriveConnectProps> = ({ onConnect, isLoading }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="max-w-md">
        <GoogleDriveIcon className="h-24 w-24 mx-auto text-gemini-grey-500 mb-6" />
        <h2 className="text-3xl font-bold text-gemini-grey-800 mb-2">Query your Drive files</h2>
        <p className="text-gemini-grey-600 mb-8">
          Connect your Google Drive account to select files and ask questions about their content using the power of Gemini.
        </p>
        <button
          onClick={onConnect}
          disabled={isLoading}
          className="bg-gemini-blue hover:bg-gemini-dark-blue disabled:bg-gemini-grey-400 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center justify-center gap-3 w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="h-5 w-5" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <GoogleDriveIcon className="h-5 w-5" />
              <span>Connect to Google Drive</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};