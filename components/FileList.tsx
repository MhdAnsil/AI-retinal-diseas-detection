
import React from 'react';
import { DriveFile } from '../types';
import { FileItem } from './FileItem';

interface FileListProps {
  files: DriveFile[];
  selectedFiles: Set<string>;
  onFileSelect: (fileId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export const FileList: React.FC<FileListProps> = ({ files, selectedFiles, onFileSelect, onSelectAll, onDeselectAll }) => {
  const allSelected = files.length > 0 && selectedFiles.size === files.length;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gemini-grey-200 flex justify-between items-center bg-gemini-grey-100">
        <p className="text-sm font-medium text-gemini-grey-700">{selectedFiles.size} of {files.length} selected</p>
        <div className="flex gap-2">
          <button 
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="text-sm font-semibold text-gemini-blue hover:text-gemini-dark-blue"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>
      <div className="overflow-y-auto flex-grow h-[60vh] lg:h-auto">
        {files.length > 0 ? (
          <ul>
            {files.map(file => (
              <FileItem
                key={file.id}
                file={file}
                isSelected={selectedFiles.has(file.id)}
                onSelect={onFileSelect}
              />
            ))}
          </ul>
        ) : (
          <p className="text-center p-8 text-gemini-grey-500">No files found.</p>
        )}
      </div>
    </div>
  );
};