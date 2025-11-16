import React from 'react';
import ImageDropzone from './ImageDropzone';
import { EyeIcon } from './icons/EyeIcon';
import { HistoryIcon } from './icons/HistoryIcon';

interface UploadScreenProps {
  onImageSelect: (file: File) => void;
  onAnalyze: () => void;
  image: { file: File, previewUrl: string } | null;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onImageSelect, onAnalyze, image }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
        <div className="relative w-full">
            <button className="absolute top-0 right-0 text-brand-text-light hover:text-brand-text-heading transition-colors" aria-label="Reset history">
                <HistoryIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center justify-center gap-3 mb-4">
                <EyeIcon className="w-8 h-8 text-brand-accent" />
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-text-heading">AI Retinal Disease Screening</h2>
            </div>
        </div>

        <p className="text-brand-text-light mb-8 max-w-xl">
            Analyze these diseases with high accuracy and efficiency: Diabetic Retinopathy, Glaucoma, and AMD. Upload an image to begin the analysis.
        </p>

        <div className="w-full max-w-lg p-4 sm:p-8 bg-brand-surface/50 rounded-2xl shadow-lg border border-brand-border/50 backdrop-blur-sm">
            <ImageDropzone onImageSelect={onImageSelect} imagePreviewUrl={image?.previewUrl} />
            <button
                onClick={onAnalyze}
                disabled={!image}
                className="w-full mt-8 bg-brand-accent hover:bg-brand-accent-hover disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all transform hover:scale-105"
            >
                Analyze Image
            </button>
        </div>
    </div>
  );
};

export default UploadScreen;