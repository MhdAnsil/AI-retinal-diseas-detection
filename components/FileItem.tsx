
import React from 'react';
import { DriveFile } from '../types';
import { FileIcon } from './icons/FileIcon';
import { DocIcon } from './icons/DocIcon';
import { SheetIcon } from './icons/SheetIcon';
import { PdfIcon } from './icons/PdfIcon';

interface FileItemProps {
  file: DriveFile;
  isSelected: boolean;
  onSelect: (fileId: string) => void;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes('wordprocessingml')) return <DocIcon className="w-6 h-6 text-blue-500" />;
  if (mimeType.includes('spreadsheetml')) return <SheetIcon className="w-6 h-6 text-green-500" />;
  if (mimeType.includes('pdf')) return <PdfIcon className="w-6 h-6 text-red-500" />;
  return <FileIcon className="w-6 h-6 text-gemini-grey-500" />;
};


export const FileItem: React.FC<FileItemProps> = ({ file, isSelected, onSelect }) => {
  const modifiedDate = new Date(file.modifiedTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <li
      className={`flex items-center gap-4 p-4 border-b border-gemini-grey-200 cursor-pointer transition-colors ${isSelected ? 'bg-gemini-blue/10' : 'hover:bg-gemini-grey-100'}`}
      onClick={() => onSelect(file.id)}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(file.id)}
        className="form-checkbox h-5 w-5 text-gemini-blue rounded border-gemini-grey-300 focus:ring-gemini-blue"
        onClick={(e) => e.stopPropagation()} // prevent li click from firing twice
      />
      <div className="flex-shrink-0">
        {getFileIcon(file.mimeType)}
      </div>
      <div className="flex-grow overflow-hidden">
        <p className="font-medium text-gemini-grey-800 truncate">{file.name}</p>
        <p className="text-sm text-gemini-grey-600">Modified: {modifiedDate}</p>
      </div>
    </li>
  );
};