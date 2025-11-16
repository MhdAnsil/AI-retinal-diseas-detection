
import React from 'react';
import { GoogleDriveIcon } from './GoogleDriveIcon';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <div className="flex items-center gap-2" >
        <svg fill="currentColor" viewBox="0 0 120 120" {...props}>
          <path d="M60 120a60 60 0 1 0-42.4-17.6A60 60 0 0 0 60 120Z" style={{'fill':'#4285f4'}}/>
          <path d="M60 0a60 60 0 1 0 42.4 102.4A60 60 0 0 0 60 0Zm0 108a48 48 0 1 1 0-96 48 48 0 0 1 0 96Z" style={{'fill':'#fff'}}/>
          <path d="M85.4 56.4h-3.4a22.2 22.2 0 0 0-44 0h-3.4a25.6 25.6 0 0 1 50.8 0Z" style={{'fill':'#fff'}}/>
        </svg>
        <span className="text-2xl text-gemini-grey-400 font-light">+</span>
        <GoogleDriveIcon className="h-8 w-8" />
    </div>
);