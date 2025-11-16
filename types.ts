
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  content: string; 
}

declare global {
  // Fix: Augment the existing `AIStudio` interface instead of redefining `window.aistudio`'s type.
  // This resolves the conflict with other global type definitions that expect `window.aistudio` to be of type `AIStudio`.
  interface AIStudio {
    getDriveFiles: () => Promise<DriveFile[]>;
  }
}
