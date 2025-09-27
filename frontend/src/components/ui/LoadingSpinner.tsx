import React from 'react';
import BackgroundFX from './BackgroundFX';
import { cn } from '@utils/index';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading agent registry...', 
  size = 'md',
  fullScreen = true 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen text-slate-200 bg-[#0a0a10] flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      {fullScreen && <BackgroundFX />}
      <div className={cn('p-8 rounded-3xl', 'glass')}>
        <div className="flex items-center gap-3">
          <div className={cn(
            'border-2 border-violet-500 border-t-transparent rounded-full animate-spin',
            sizeClasses[size]
          )} />
          <span className="text-white font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
