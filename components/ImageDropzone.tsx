import React, { useCallback, useState, useRef } from 'react';
import { UploadCloudIcon } from './icons/UploadCloudIcon';

interface ImageDropzoneProps {
  onImageSelect: (file: File) => void;
  imagePreviewUrl?: string;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageSelect, imagePreviewUrl }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setFileError(null);
      onImageSelect(file);
    } else {
      setFileError("Invalid file type. Please select an image.");
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [onImageSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
       processFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Image dropzone"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`relative w-full h-56 sm:h-64 border-2 border-dashed rounded-lg flex items-center justify-center text-center cursor-pointer transition-colors
          ${isDragging ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-border hover:border-brand-accent/70'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {imagePreviewUrl && !fileError ? (
          <img src={imagePreviewUrl} alt="Retina Scan Preview" className="w-full h-full object-contain rounded-lg p-2" />
        ) : (
          <div className="flex flex-col items-center text-brand-text-light">
            <UploadCloudIcon className="w-12 h-12 mb-4" />
            <p className="font-semibold">Drag & drop an image</p>
            <p className="text-sm">or click to browse</p>
          </div>
        )}
      </div>
      {fileError && <p className="mt-2 text-sm text-red-400">{fileError}</p>}
    </div>
  );
};

export default ImageDropzone;