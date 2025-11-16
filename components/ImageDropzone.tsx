import React, { useCallback, useState, useRef } from 'react';
import { UploadCloudIcon } from './icons/UploadCloudIcon';

interface ImageDropzoneProps {
  onImageSelect: (file: File) => void;
  imagePreviewUrl?: string;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageSelect, imagePreviewUrl }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      } else {
        alert("Please drop an image file.");
      }
    }
  }, [onImageSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
       const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      } else {
        alert("Please select an image file.");
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
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
      {imagePreviewUrl ? (
        <img src={imagePreviewUrl} alt="Retina Scan Preview" className="w-full h-full object-contain rounded-lg p-2" />
      ) : (
        <div className="flex flex-col items-center text-brand-text-light">
          <UploadCloudIcon className="w-12 h-12 mb-4" />
          <p className="font-semibold">Drag & drop an image</p>
          <p className="text-sm">or click to browse</p>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;